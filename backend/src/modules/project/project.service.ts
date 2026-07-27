import { prisma } from '../../config/database';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';
import type {
  CreateProjectInput, UpdateProjectInput,
  AssignDevelopersInput, ProgressUpdateInput, ProjectPaginationInput,
} from './project.validation';

// ─── Include shape ────────────────────────────────────────────────────────────
const projectInclude = {
  client:  { select: { id: true, companyName: true, contactPerson: true } },
  manager: { select: { id: true, email: true, managerProfile: { select: { firstName: true, lastName: true } } } },
  developers: {
    include: {
      developer: { select: { id: true, email: true, developerProfile: { select: { firstName: true, lastName: true, title: true } } } },
    },
  },
  milestones:     { orderBy: { order: 'asc' as const } },
  timelineStages: { orderBy: { order: 'asc' as const } },
  gallery:        { orderBy: { order: 'asc' as const } },
  _count: { select: { progressUpdates: true, files: true, payments: true } },
} as const;

// ─── Create project ───────────────────────────────────────────────────────────
export async function createProject(currentUserId: string, input: CreateProjectInput) {
  // 1. Resolve client Profile
  let clientId = input.clientId;
  if (!clientId) {
    const firstClient = await prisma.clientProfile.findFirst();
    if (!firstClient) throw new NotFoundError('No client profiles found. Please register a client first.');
    clientId = firstClient.id;
  } else {
    const client = await prisma.clientProfile.findUnique({ where: { id: clientId } });
    if (!client) {
      const fallbackClient = await prisma.clientProfile.findFirst();
      if (!fallbackClient) throw new NotFoundError('Selected client not found.');
      clientId = fallbackClient.id;
    }
  }

  // 2. Resolve managerId (allow passing managerId or default to user)
  const managerId = input.managerId ?? currentUserId;

  const parseDate = (d?: string) => {
    if (!d) return undefined;
    const date = new Date(d);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const project = await prisma.project.create({
    data: {
      name:              input.name,
      description:       input.description,
      projectType:       input.projectType,
      technologies:      input.technologies ?? [],
      priority:          input.priority ?? 'MEDIUM',
      managerId,
      clientId,
      startDate:         parseDate(input.startDate),
      estimatedDelivery: parseDate(input.estimatedDelivery),
      budget:            input.budget,
      managerNotes:      input.managerNotes,
    },
    include: projectInclude,
  });

  // 3. Save gallery images if provided
  if (input.images && input.images.length > 0) {
    await prisma.projectGallery.createMany({
      data: input.images.map((url, i) => ({
        projectId: project.id,
        url,
        publicId: `gallery_${project.id}_${i}`,
        order: i,
      })),
    });
  }

  // Create default timeline stages
  const DEFAULT_STAGES = [
    'Project Created', 'Requirements Approved', 'UI Design',
    'Frontend Development', 'Backend Development', 'Testing',
    'Client Review', 'Bug Fixes', 'Deployment', 'Completed',
  ];

  await prisma.timelineStage.createMany({
    data: DEFAULT_STAGES.map((name, i) => ({
      projectId: project.id,
      name,
      order: i,
      status: i === 0 ? 'COMPLETED' : 'PENDING',
    })),
  });

  // Log activity
  await prisma.activityLog.create({
    data: { userId: currentUserId, action: 'PROJECT_CREATED', entity: 'Project', entityId: project.id },
  });

  return getProjectById(project.id, currentUserId, 'ADMIN');
}

// ─── List public projects ─────────────────────────────────────────────────────
export async function listPublicProjects() {
  return prisma.project.findMany({
    include: projectInclude,
    orderBy: { createdAt: 'desc' },
  });
}

// ─── List projects ────────────────────────────────────────────────────────────
export async function listProjects(managerId: string, role: string, query: ProjectPaginationInput) {
  const { page, limit, search, status } = query;
  const skip = (page - 1) * limit;

  const where = {
    // Managers see only their own; Admin sees all
    ...(role === 'MANAGER' ? { managerId } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? { OR: [
          { name:        { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ]}
      : {}),
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({ where, skip, take: limit, include: projectInclude, orderBy: { createdAt: 'desc' } }),
    prisma.project.count({ where }),
  ]);

  return { projects, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

// ─── Get single project ───────────────────────────────────────────────────────
export async function getProjectById(id: string, userId: string, role: string) {
  const project = await prisma.project.findUnique({ where: { id }, include: projectInclude });
  if (!project) throw new NotFoundError('Project not found');

  // Role-based access
  if (role === 'MANAGER' && project.managerId !== userId) throw new ForbiddenError('Access denied');
  if (role === 'CLIENT') {
    const cp = await prisma.clientProfile.findUnique({ where: { userId } });
    if (!cp || project.clientId !== cp.id) throw new ForbiddenError('Access denied');
  }

  return project;
}

// ─── Update project ───────────────────────────────────────────────────────────
export async function updateProject(id: string, managerId: string, input: UpdateProjectInput) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new NotFoundError('Project not found');
  if (project.managerId !== managerId) throw new ForbiddenError('Access denied');

  return prisma.project.update({
    where: { id },
    data: {
      ...input,
      startDate:         input.startDate         ? new Date(input.startDate)         : undefined,
      estimatedDelivery: input.estimatedDelivery ? new Date(input.estimatedDelivery) : undefined,
    },
    include: projectInclude,
  });
}

// ─── Assign developers ────────────────────────────────────────────────────────
export async function assignDevelopers(id: string, managerId: string, input: AssignDevelopersInput) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new NotFoundError('Project not found');
  if (project.managerId !== managerId) throw new ForbiddenError('Access denied');

  // Upsert developer assignments
  await Promise.all(
    input.developerIds.map(devId =>
      prisma.projectDeveloper.upsert({
        where:  { projectId_userId: { projectId: id, userId: devId } },
        create: { projectId: id, userId: devId },
        update: {},
      }),
    ),
  );

  return getProjectById(id, managerId, 'MANAGER');
}

// ─── Remove developer ─────────────────────────────────────────────────────────
export async function removeDeveloper(id: string, devId: string, managerId: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new NotFoundError('Project not found');
  if (project.managerId !== managerId) throw new ForbiddenError('Access denied');

  await prisma.projectDeveloper.deleteMany({ where: { projectId: id, userId: devId } });
}

// ─── Post progress update ─────────────────────────────────────────────────────
export async function postProgressUpdate(id: string, authorId: string, input: ProgressUpdateInput) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new NotFoundError('Project not found');

  const [update] = await prisma.$transaction([
    prisma.progressUpdate.create({
      data: { projectId: id, authorId, ...input },
    }),
    prisma.project.update({
      where: { id },
      data:  { completionPercent: input.progressPercent },
    }),
  ]);

  return update;
}

// ─── List progress updates ────────────────────────────────────────────────────
export async function listProgressUpdates(projectId: string) {
  return prisma.progressUpdate.findMany({
    where:   { projectId },
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { email: true, role: true } } },
  });
}

// ─── Delete project ───────────────────────────────────────────────────────────
export async function deleteProject(id: string, managerId: string, role: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new NotFoundError('Project not found');
  if (role === 'MANAGER' && project.managerId !== managerId) throw new ForbiddenError('Access denied');
  await prisma.project.delete({ where: { id } });
}
