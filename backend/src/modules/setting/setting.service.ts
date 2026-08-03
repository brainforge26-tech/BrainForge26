import { prisma } from '../../config/database';

export async function getSettingsByKey(key: string) {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return setting?.value || null;
}

export async function getAllSettings() {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, any> = {};
  settings.forEach((s) => {
    map[s.key] = s.value;
  });
  return map;
}

export async function upsertSetting(key: string, value: any) {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
