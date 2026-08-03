import 'dotenv/config';
import { Role, ApplicationStatus, JobType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/database';

async function main() {
  console.log('🌱 [Corporate Software Services Seed] Commencing database seeding...');

  const passwordHash = await bcrypt.hash('admin123', 10);

  // 1. Admin Account initialization
  const adminEmail = 'admin@brainforceit.com';
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
      name: 'Super Admin',
      isActive: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      name: 'Super Admin',
      isActive: true,
    },
  });
  console.log(`✅ Admin account initialized: ${adminEmail} / admin123`);

  // 2. Team Members (Showcase developers - NO login)
  await prisma.teamMember.deleteMany({});
  const teamMembers = await Promise.all([
    prisma.teamMember.create({
      data: {
        name: 'Alex Vance',
        position: 'Chief Technology Officer & Lead Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        bio: '12+ years of experience architecting resilient enterprise microservices, AI systems, and cloud infra.',
        skills: ['Software Architecture', 'Cloud Infrastructure', 'Team Leadership', 'Distributed Systems'],
        technologies: ['Node.js', 'Go', 'Kubernetes', 'PostgreSQL', 'AWS'],
        experience: '12+ Years',
        portfolioLinks: ['https://github.com/alexvance'],
        githubUrl: 'https://github.com/alexvance',
        linkedinUrl: 'https://linkedin.com/in/alexvance',
        email: 'alex.vance@brainforceit.com',
        displayOrder: 1,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: 'Sophia Chen',
        position: 'Principal AI & Machine Learning Engineer',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
        bio: 'Specialist in Large Language Models, computer vision pipelines, and predictive analytics platforms.',
        skills: ['Deep Learning', 'LLM Fine-Tuning', 'NLP', 'Computer Vision'],
        technologies: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'LangChain'],
        experience: '8+ Years',
        portfolioLinks: ['https://github.com/sophiachen-ai'],
        githubUrl: 'https://github.com/sophiachen-ai',
        linkedinUrl: 'https://linkedin.com/in/sophiachen-ai',
        email: 'sophia.chen@brainforceit.com',
        displayOrder: 2,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: 'Marcus Thorne',
        position: 'Senior Full-Stack Solutions Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        bio: 'Passionate full-stack developer dedicated to pixel-perfect UIs, high-throughput APIs, and clean code.',
        skills: ['Frontend Architecture', 'REST & GraphQL APIs', 'Performance Optimization'],
        technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS'],
        experience: '7+ Years',
        portfolioLinks: ['https://github.com/marcusthorne'],
        githubUrl: 'https://github.com/marcusthorne',
        linkedinUrl: 'https://linkedin.com/in/marcusthorne',
        email: 'marcus.thorne@brainforceit.com',
        displayOrder: 3,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: 'Elena Rostova',
        position: 'Senior Mobile Applications Specialist',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        bio: 'Crafts fluid native & cross-platform iOS and Android mobile experiences for millions of active users.',
        skills: ['Mobile UX', 'Cross-Platform Dev', 'App Store Deployment', 'CI/CD Pipelines'],
        technologies: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase'],
        experience: '6+ Years',
        portfolioLinks: ['https://github.com/elena-rostova'],
        githubUrl: 'https://github.com/elena-rostova',
        linkedinUrl: 'https://linkedin.com/in/elena-rostova',
        email: 'elena.rostova@brainforceit.com',
        displayOrder: 4,
        isActive: true,
        isFeatured: true,
      },
    }),
  ]);
  console.log(`✅ ${teamMembers.length} team members created`);

  // 3. Clear existing services & categories
  await prisma.service.deleteMany({});
  await prisma.serviceCategory.deleteMany({});

  // 4. Complete Software Services Catalog (14 Categories)
  const CATALOG_DATA = [
    {
      category: '🌐 Website Development',
      slug: 'website-development',
      description: 'Custom corporate websites, e-commerce platforms, web applications, and digital portals.',
      icon: 'Globe',
      order: 1,
      services: [
        { title: 'Corporate Website', isFeatured: true, overview: 'High-impact corporate web portal designed to build trust, showcase services, and capture qualified enterprise leads.', tech: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'] },
        { title: 'Business Website', isFeatured: false, overview: 'Professional business web representation with dynamic CMS, service listings, and inquiry conversion engines.', tech: ['Next.js', 'Node.js', 'PostgreSQL'] },
        { title: 'Portfolio Website', isFeatured: false, overview: 'Stunning interactive visual portfolio for agency showcases, creative studios, and technical consultants.', tech: ['React', 'Framer Motion', 'TailwindCSS'] },
        { title: 'Landing Page', isFeatured: true, overview: 'Ultra-fast, high-converting product and event landing pages optimized for maximum lead acquisition.', tech: ['Next.js', 'TailwindCSS'] },
        { title: 'News Portal', isFeatured: false, overview: 'High-throughput news publishing engine with real-time article delivery, RSS feeds, and advertising management.', tech: ['Next.js', 'Node.js', 'Redis'] },
        { title: 'Blog Website', isFeatured: false, overview: 'SEO-focused content management blog system with Markdown editing and social sharing.', tech: ['Next.js', 'Prisma'] },
        { title: 'School/College Website', isFeatured: false, overview: 'Educational institution portal with notice boards, academic program catalogs, and student information pages.', tech: ['Next.js', 'PostgreSQL'] },
        { title: 'Hospital Website', isFeatured: false, overview: 'Healthcare facility website with doctor directory, department listings, and online appointment booking request.', tech: ['React', 'Node.js'] },
        { title: 'NGO Website', isFeatured: false, overview: 'Non-profit organisation portal with donation campaign tracking, cause stories, and volunteer forms.', tech: ['Next.js', 'Stripe'] },
        { title: 'Hotel & Resort Website', isFeatured: false, overview: 'Luxury hotel booking and showcase website featuring room virtual tours, amenities, and reservation systems.', tech: ['React', 'Next.js'] },
        { title: 'Restaurant Website', isFeatured: false, overview: 'Digital menu, table reservation, and online food ordering interface for restaurants and culinary brands.', tech: ['React', 'TailwindCSS'] },
        { title: 'Real Estate Website', isFeatured: false, overview: 'Property listing portal with interactive property search filters, floor plan viewers, and agent contacts.', tech: ['Next.js', 'PostgreSQL'] },
        { title: 'Multi Vendor Marketplace', isFeatured: false, overview: 'Scalable multi-vendor e-commerce platform with seller dashboards, commission tracking, and payout management.', tech: ['React', 'Node.js', 'PostgreSQL', 'Redis'] },
        { title: 'E-commerce Website', isFeatured: true, overview: 'Enterprise e-commerce store with product catalog, cart management, checkout gateways, and order tracking.', tech: ['Next.js', 'Stripe', 'PostgreSQL'] },
        { title: 'Booking Website', isFeatured: false, overview: 'Automated appointment and service booking engine with Google Calendar sync and payment integration.', tech: ['React', 'Node.js'] },
        { title: 'Membership Website', isFeatured: false, overview: 'Gated community and subscription content portal with tier management and recurring billing.', tech: ['Next.js', 'Stripe'] },
        { title: 'LMS (Learning Management System)', isFeatured: false, overview: 'Interactive online course learning platform with video lessons, quizzes, certificates, and student analytics.', tech: ['React', 'Node.js', 'AWS S3'] },
        { title: 'Custom Web Application', isFeatured: true, overview: 'Bespoke web application tailored to your unique complex business logic and operational workflow.', tech: ['React', 'Next.js', 'Node.js', 'PostgreSQL'] },
      ],
    },
    {
      category: '📱 Mobile App Development',
      slug: 'mobile-app-development',
      description: 'Native and cross-platform mobile apps for iOS and Android devices.',
      icon: 'Smartphone',
      order: 2,
      services: [
        { title: 'Android App', isFeatured: false, overview: 'Native Android mobile application built for high performance, device optimization, and Google Play compliance.', tech: ['Kotlin', 'Android SDK', 'Jetpack Compose'] },
        { title: 'iOS App', isFeatured: false, overview: 'Native iOS application delivering smooth Apple ecosystem experiences for iPhone and iPad users.', tech: ['Swift', 'SwiftUI', 'iOS SDK'] },
        { title: 'Flutter App', isFeatured: true, overview: 'Cross-platform native-code mobile app for iOS and Android built from a single clean Flutter codebase.', tech: ['Flutter', 'Dart', 'Firebase'] },
        { title: 'React Native App', isFeatured: false, overview: 'High-speed cross-platform mobile application powered by React and native UI components.', tech: ['React Native', 'TypeScript', 'Expo'] },
        { title: 'Hybrid App', isFeatured: false, overview: 'Lightweight multi-platform mobile application wrapping modern web tech for fast release cycles.', tech: ['Ionic', 'Capacitor', 'React'] },
        { title: 'Progressive Web App (PWA)', isFeatured: false, overview: 'Installable web app providing offline capabilities, push notifications, and app-like responsiveness.', tech: ['Next.js', 'Service Workers'] },
        { title: 'E-commerce App', isFeatured: true, overview: 'Feature-rich mobile shopping app with one-tap payment checkout, order push alerts, and recommendations.', tech: ['Flutter', 'Node.js'] },
        { title: 'Food Delivery App', isFeatured: false, overview: 'Real-time multi-tier food ordering app for customers, drivers, and restaurant kitchen terminals.', tech: ['React Native', 'WebSockets', 'Google Maps'] },
        { title: 'Ride Sharing App', isFeatured: false, overview: 'On-demand ride hailing app with live GPS tracking, dynamic fare calculation, and driver matching.', tech: ['Flutter', 'Node.js', 'WebSockets'] },
        { title: 'Courier App', isFeatured: false, overview: 'Package pickup and doorstep delivery tracking mobile app with barcode scanning and digital signature.', tech: ['Flutter', 'Firebase'] },
        { title: 'Pharmacy App', isFeatured: false, overview: 'Medicine ordering app with prescription upload, dosage reminder alerts, and door delivery tracking.', tech: ['React Native', 'Node.js'] },
        { title: 'Hospital App', isFeatured: false, overview: 'Patient portal mobile app for lab result views, telemedicine video consultations, and appointment management.', tech: ['Flutter', 'WebRTC'] },
        { title: 'School App', isFeatured: false, overview: 'Parent-teacher communication app for homework notifications, attendance tracking, and fee payments.', tech: ['React Native', 'Firebase'] },
        { title: 'Banking App', isFeatured: true, overview: 'Bank-grade secure mobile banking app with biometric authentication, instant fund transfer, and card controls.', tech: ['Flutter', 'Kotlin', 'Swift', 'Security Hardening'] },
        { title: 'OTT App', isFeatured: false, overview: 'Video streaming media application supporting HD video playback, adaptive bitrate, and offline downloads.', tech: ['React Native', 'ExoPlayer', 'HLS'] },
        { title: 'Chat App', isFeatured: false, overview: 'End-to-end encrypted messaging application with instant chat, voice notes, and media sharing.', tech: ['Flutter', 'WebSockets', 'WebRTC'] },
      ],
    },
    {
      category: '💻 Custom Software Development',
      slug: 'custom-software-development',
      description: 'Enterprise ERPs, CRMs, management software, and custom business operations platforms.',
      icon: 'Code2',
      order: 3,
      services: [
        { title: 'ERP Software', isFeatured: true, overview: 'Integrated Enterprise Resource Planning software unifying finance, inventory, HR, sales, and supply chain.', tech: ['Node.js', 'React', 'PostgreSQL', 'Docker'] },
        { title: 'CRM Software', isFeatured: true, overview: 'Customer Relationship Management system for lead pipeline tracking, deal automation, and customer support history.', tech: ['Next.js', 'PostgreSQL'] },
        { title: 'POS Software', isFeatured: false, overview: 'Point of Sale software for retail & hospitality with barcode scanning, receipt printing, and daily reconciliation.', tech: ['Electron', 'React', 'SQLite'] },
        { title: 'HR & Payroll Software', isFeatured: false, overview: 'Automated HR system handling employee onboarding, biometric attendance, tax calculation, and salary slips.', tech: ['Node.js', 'React', 'PostgreSQL'] },
        { title: 'Inventory Management', isFeatured: false, overview: 'Stock tracking software with multi-warehouse support, reorder alerts, batch/serial tracking, and audit logs.', tech: ['React', 'Node.js'] },
        { title: 'Accounting Software', isFeatured: false, overview: 'Double-entry accounting system with general ledger, invoicing, expense tracking, and financial statements.', tech: ['Next.js', 'PostgreSQL'] },
        { title: 'Billing Software', isFeatured: false, overview: 'Automated recurring subscription and transactional billing system with automated invoice email dispatch.', tech: ['Node.js', 'React'] },
        { title: 'Hospital Management', isFeatured: true, overview: 'Comprehensive Hospital Information System (HIS) covering IPD/OPD, doctor scheduling, pharmacy, and lab test reports.', tech: ['React', 'Node.js', 'PostgreSQL'] },
        { title: 'Clinic Management', isFeatured: false, overview: 'Streamlined doctor prescription pad, patient history, and appointment queue management for private medical clinics.', tech: ['React', 'Next.js'] },
        { title: 'Pharmacy Management', isFeatured: false, overview: 'Pharmacy inventory software with drug expiry alerts, batch management, and instant POS checkout.', tech: ['React', 'PostgreSQL'] },
        { title: 'School Management', isFeatured: false, overview: 'School ERP system for student admissions, fee collection, exam grade reporting, and parent communication.', tech: ['React', 'Node.js'] },
        { title: 'University Management', isFeatured: false, overview: 'University portal for course credit registration, faculty management, transcript generation, and campus ops.', tech: ['Next.js', 'PostgreSQL'] },
        { title: 'Library Management', isFeatured: false, overview: 'Book cataloging software with ISBN scanning, patron circulation, fine calculation, and e-book access.', tech: ['React', 'Node.js'] },
        { title: 'Hotel Management', isFeatured: false, overview: 'Hotel PMS for front-desk check-ins, room housekeeping status, guest folio billing, and channel manager sync.', tech: ['React', 'PostgreSQL'] },
        { title: 'Restaurant Management', isFeatured: false, overview: 'Kitchen Display System (KDS), table management, and order billing software for casual and fine dining.', tech: ['React', 'Node.js'] },
        { title: 'Gym Management', isFeatured: false, overview: 'Fitness club membership management software with biometric gate access and personal trainer scheduling.', tech: ['React', 'PostgreSQL'] },
        { title: 'Garments ERP', isFeatured: false, overview: 'Specialized textile & apparel ERP covering fabric procurement, cutting master, sewing lines, and export documentation.', tech: ['React', 'Node.js', 'PostgreSQL'] },
        { title: 'Manufacturing ERP', isFeatured: false, overview: 'Production planning and Bill of Materials (BOM) software for industrial manufacturing plants.', tech: ['Node.js', 'PostgreSQL'] },
        { title: 'Real Estate ERP', isFeatured: false, overview: 'Property developer ERP managing land acquisition, construction milestones, unit sales, and installment collection.', tech: ['React', 'Node.js'] },
        { title: 'Warehouse Management', isFeatured: false, overview: 'WMS platform supporting bin location tracking, pick-and-pack routing, and handheld scanner integration.', tech: ['React', 'Node.js', 'Redis'] },
        { title: 'Document Management', isFeatured: false, overview: 'Secure cloud document repository with OCR search, document versioning, and access authorization matrix.', tech: ['Next.js', 'AWS S3'] },
        { title: 'Asset Management', isFeatured: false, overview: 'IT and physical asset lifecycle tracking software with QR code tagging, maintenance logs, and depreciation math.', tech: ['React', 'PostgreSQL'] },
        { title: 'Attendance System', isFeatured: false, overview: 'Biometric fingerprint, RFID, and facial recognition attendance integration with real-time shift logs.', tech: ['Node.js', 'PostgreSQL'] },
        { title: 'Visitor Management', isFeatured: false, overview: 'Digital visitor check-in kiosk system with badge printing, host notification, and security logs.', tech: ['React', 'Node.js'] },
        { title: 'Queue Management', isFeatured: false, overview: 'Token dispenser and digital queue display system for bank branches, customer service centers, and clinics.', tech: ['React', 'WebSockets'] },
        { title: 'Ticketing System', isFeatured: false, overview: 'Helpdesk support ticketing software with SLA escalation rules, automated agent routing, and resolution metrics.', tech: ['React', 'Node.js'] },
        { title: 'Auction System', isFeatured: false, overview: 'Real-time online bidding and auction platform with live countdown timers, bid validation, and winner checkout.', tech: ['Next.js', 'WebSockets', 'Redis'] },
        { title: 'Transport Management', isFeatured: false, overview: 'Passenger transport & ticket reservation system with seat selection maps and online payment processing.', tech: ['React', 'Node.js'] },
        { title: 'Fleet Management', isFeatured: false, overview: 'Commercial vehicle fleet software for GPS tracking, fuel monitoring, driver behavior logs, and maintenance alerts.', tech: ['React', 'IoT Core', 'PostgreSQL'] },
        { title: 'Logistics Management', isFeatured: false, overview: 'End-to-end freight & parcel logistics management software handling manifest creation, sorting, and hub dispatch.', tech: ['React', 'Node.js'] },
        { title: 'Agriculture Management', isFeatured: false, overview: 'Farm management software for crop yield forecasting, fertilizer schedules, and contract farming accounting.', tech: ['React', 'PostgreSQL'] },
        { title: 'NGO Management', isFeatured: false, overview: 'Donor relationship and field project expense tracking software built for non-profit organizations.', tech: ['React', 'Node.js'] },
        { title: 'Cooperative Management', isFeatured: false, overview: 'Cooperative society software for member savings accounts, share capital, and loan disbursement tracking.', tech: ['React', 'PostgreSQL'] },
        { title: 'ISP Billing Software', isFeatured: false, overview: 'Internet Service Provider billing software with Mikrotik API integration, bandwidth control, and auto-suspension.', tech: ['Node.js', 'Mikrotik API', 'PostgreSQL'] },
        { title: 'Microfinance Software', isFeatured: false, overview: 'Microfinance institution software managing field collector handheld apps, weekly installment recovery, and audit reports.', tech: ['React', 'Node.js'] },
        { title: 'Loan Management System', isFeatured: false, overview: 'Comprehensive credit scoring, loan origination, installment schedule calculator, and NPA tracking software.', tech: ['Next.js', 'PostgreSQL'] },
        { title: 'Multi-branch Management', isFeatured: false, overview: 'Centralized cloud dashboard for managing operations, sales, and inventory across multiple retail/branch locations.', tech: ['React', 'Node.js'] },
        { title: 'Custom Business Software', isFeatured: true, overview: 'Fully customized enterprise software engineered to digitize your specific proprietary business workflows.', tech: ['React', 'Next.js', 'Node.js', 'PostgreSQL'] },
      ],
    },
    {
      category: '🤖 AI & Automation',
      slug: 'ai-automation',
      description: 'Artificial intelligence, natural language processing, computer vision, and workflow automation.',
      icon: 'Cpu',
      order: 4,
      services: [
        { title: 'AI Chatbot', isFeatured: true, overview: 'Intelligent conversational AI chatbot for customer engagement, product recommendations, and instant query resolution.', tech: ['Python', 'OpenAI API', 'LangChain', 'FastAPI'] },
        { title: 'Customer Support Bot', isFeatured: false, overview: 'Automated 24/7 customer support bot integrated with your knowledge base to resolve 80%+ of routine tickets automatically.', tech: ['Python', 'RAG', 'Vector DB'] },
        { title: 'Voice Bot', isFeatured: false, overview: 'AI-powered speech-to-text and text-to-speech voice assistant for automated phone customer service calls.', tech: ['Python', 'Whisper AI', 'Twilio API'] },
        { title: 'AI Agent', isFeatured: true, overview: 'Autonomous AI agents capable of executing multi-step business tasks, web research, data extraction, and tool actions.', tech: ['Python', 'LangChain', 'AutoGPT Architecture'] },
        { title: 'OCR (Document Scan)', isFeatured: false, overview: 'Document optical character recognition system extracting structured text from invoices, passports, and receipts.', tech: ['Tesseract', 'PyTorch', 'OpenCV'] },
        { title: 'Face Recognition', isFeatured: false, overview: 'High-accuracy biometric face recognition system for touchless attendance, access control, and identity verification.', tech: ['Python', 'OpenCV', 'DeepFace'] },
        { title: 'Recommendation System', isFeatured: false, overview: 'Machine learning recommendation engine boosting e-commerce sales with personalized product suggestions.', tech: ['Python', 'Scikit-learn', 'TensorFlow'] },
        { title: 'Predictive Analytics', isFeatured: false, overview: 'Predictive ML models analyzing historical trends to forecast sales, inventory demand, and customer churn.', tech: ['Python', 'Pandas', 'XGBoost'] },
        { title: 'Workflow Automation', isFeatured: false, overview: 'Automated workflow pipelines connecting your disparate business apps, eliminating manual data entry.', tech: ['Node.js', 'Python', 'Webhooks'] },
        { title: 'AI Content Generation', isFeatured: false, overview: 'Custom AI writing assistant for generating marketing copy, SEO articles, and product descriptions at scale.', tech: ['OpenAI API', 'Next.js'] },
        { title: 'AI Image Processing', isFeatured: false, overview: 'Computer vision pipeline for automated image enhancement, background removal, and defect inspection.', tech: ['PyTorch', 'OpenCV'] },
        { title: 'AI Translation', isFeatured: false, overview: 'Neural machine translation pipeline for multi-lingual website localization and real-time document translation.', tech: ['Python', 'Transformer Models'] },
        { title: 'AI Search', isFeatured: false, overview: 'Semantic vector search engine delivering instant relevant document and product search results.', tech: ['Pinecone', 'Qdrant', 'OpenAI Embeddings'] },
        { title: 'RAG Chatbot', isFeatured: false, overview: 'Retrieval-Augmented Generation chatbot grounded strictly in your company proprietary PDF documents and database.', tech: ['LangChain', 'Pinecone', 'Python'] },
        { title: 'LLM Integration', isFeatured: false, overview: 'Seamless integration of Large Language Models into your existing web, desktop, or mobile software applications.', tech: ['OpenAI', 'Anthropic', 'FastAPI'] },
        { title: 'OpenAI Integration', isFeatured: false, overview: 'Custom OpenAI GPT-4o API integration with tailored prompt engineering and fine-tuning for your enterprise.', tech: ['OpenAI SDK', 'Node.js'] },
        { title: 'Gemini Integration', isFeatured: false, overview: 'Google Gemini Pro & Flash multimodal AI integration for high-speed text, image, and document reasoning.', tech: ['Google GenAI SDK', 'Python'] },
        { title: 'Claude Integration', isFeatured: false, overview: 'Anthropic Claude 3.5 Sonnet integration for complex reasoning, long-context analysis, and precision coding tasks.', tech: ['Anthropic SDK', 'TypeScript'] },
      ],
    },
    {
      category: '☁️ Cloud & DevOps',
      slug: 'cloud-devops',
      description: 'Cloud infrastructure engineering, containerization, CI/CD automation, and server management.',
      icon: 'Cloud',
      order: 5,
      services: [
        { title: 'VPS Setup', isFeatured: false, overview: 'Hardened Linux Virtual Private Server setup with OS optimization, firewall configuration, and automated backups.', tech: ['Ubuntu', 'Nginx', 'UFW', 'Bash'] },
        { title: 'AWS Deployment', isFeatured: true, overview: 'Enterprise Amazon Web Services cloud architecture setup using EC2, RDS, S3, ECS, and CloudFront CDN.', tech: ['AWS EC2', 'RDS', 'S3', 'CloudFront'] },
        { title: 'Azure Deployment', isFeatured: false, overview: 'Microsoft Azure cloud environment setup, App Service deployment, and Azure SQL configuration.', tech: ['Microsoft Azure', 'Azure DevOps'] },
        { title: 'Google Cloud Deployment', isFeatured: false, overview: 'Google Cloud Platform (GCP) infrastructure deployment utilizing Compute Engine, Cloud Run, and BigQuery.', tech: ['GCP', 'Cloud Run', 'BigQuery'] },
        { title: 'Docker', isFeatured: false, overview: 'Containerization of applications for consistent, isolated development, testing, and production environments.', tech: ['Docker', 'Docker Compose'] },
        { title: 'Kubernetes', isFeatured: false, overview: 'Production Kubernetes cluster orchestration for automated scaling, self-healing, and rolling deployments.', tech: ['Kubernetes', 'Helm', 'K8s'] },
        { title: 'CI/CD', isFeatured: true, overview: 'Automated Continuous Integration & Continuous Deployment pipelines via GitHub Actions and GitLab CI.', tech: ['GitHub Actions', 'GitLab CI/CD'] },
        { title: 'Nginx Configuration', isFeatured: false, overview: 'High-performance Nginx web server tuning, reverse proxy setup, rate limiting, and SSL termination.', tech: ['Nginx', 'Lua'] },
        { title: 'SSL Setup', isFeatured: false, overview: 'Let\'s Encrypt and wildcard SSL certificate installation, auto-renewal scripts, and HTTPS enforcement.', tech: ['Certbot', 'OpenSSL'] },
        { title: 'Domain & DNS', isFeatured: false, overview: 'Enterprise DNS management, Cloudflare setup, MX/DMARC/SPF record configuration, and domain routing.', tech: ['Cloudflare', 'Route53'] },
        { title: 'Server Monitoring', isFeatured: false, overview: '24/7 infrastructure performance monitoring with Prometheus, Grafana, and real-time Slack/SMS alerts.', tech: ['Prometheus', 'Grafana', 'Datadog'] },
        { title: 'Backup & Disaster Recovery', isFeatured: false, overview: 'Automated off-site database and file system backups with tested zero-downtime disaster recovery playbooks.', tech: ['AWS S3', 'Restic', 'Bash'] },
      ],
    },
    {
      category: '🔗 API Development',
      slug: 'api-development',
      description: 'Custom RESTful APIs, GraphQL services, third-party integrations, and webhook handlers.',
      icon: 'Layers',
      order: 6,
      services: [
        { title: 'REST API', isFeatured: true, overview: 'High-throughput RESTful API backend development with OpenAPI documentation, JWT authentication, and rate limiting.', tech: ['Node.js', 'Express', 'Swagger'] },
        { title: 'GraphQL API', isFeatured: false, overview: 'Flexible GraphQL API endpoint development with Apollo Server, query optimization, and real-time subscriptions.', tech: ['GraphQL', 'Apollo Server'] },
        { title: 'Payment Gateway Integration', isFeatured: true, overview: 'Secure integration of local and international payment gateways including bKash, Nagad, SSLCommerz, Stripe, and PayPal.', tech: ['Node.js', 'Payment APIs'] },
        { title: 'SMS API', isFeatured: false, overview: 'Automated SMS notification API integration for OTP verification, transactional alerts, and customer updates.', tech: ['Twilio', 'Local SMS Gateways'] },
        { title: 'Email API', isFeatured: false, overview: 'Transactional email API setup using SendGrid, Amazon SES, or Mailgun for reliable inbox delivery.', tech: ['SendGrid', 'AWS SES'] },
        { title: 'WhatsApp API', isFeatured: false, overview: 'Official WhatsApp Business Cloud API integration for automated customer messaging and interactive bot flows.', tech: ['WhatsApp Cloud API', 'Node.js'] },
        { title: 'Telegram Bot API', isFeatured: false, overview: 'Custom Telegram bot development for automated alerts, channel broadcasts, and interactive customer commands.', tech: ['Telegram Bot SDK', 'Node.js'] },
        { title: 'Facebook API', isFeatured: false, overview: 'Meta Graph API integration for social login, Messenger bot automation, and catalog synchronization.', tech: ['Meta API', 'OAuth2'] },
        { title: 'Google API', isFeatured: false, overview: 'Google Cloud API integrations including OAuth Login, Google Drive, Google Sheets, and Workspace APIs.', tech: ['Google APIs', 'OAuth2'] },
        { title: 'Maps Integration', isFeatured: false, overview: 'Google Maps API and Mapbox integration for interactive location finders, route calculation, and geocoding.', tech: ['Google Maps API', 'Mapbox'] },
        { title: 'Third-party API Integration', isFeatured: false, overview: 'Custom API connector development to bridge legacy enterprise software with modern SaaS services.', tech: ['Node.js', 'Python', 'REST/SOAP'] },
      ],
    },
    {
      category: '🎨 UI/UX & Design',
      slug: 'ui-ux-design',
      description: 'User interface design, user experience strategy, wireframing, and corporate brand identity.',
      icon: 'Palette',
      order: 7,
      services: [
        { title: 'UI Design', isFeatured: true, overview: 'Visually stunning, accessible user interfaces built with modern color palettes, typography, and interactive micro-animations.', tech: ['Figma', 'Design Systems'] },
        { title: 'UX Design', isFeatured: false, overview: 'User research, wireframing, and user journey mapping to design intuitive digital products that convert.', tech: ['Figma', 'User Research'] },
        { title: 'Figma Design', isFeatured: false, overview: 'Pixel-perfect Figma UI component libraries with auto-layout, design tokens, and developer handover specs.', tech: ['Figma'] },
        { title: 'Wireframe', isFeatured: false, overview: 'Low-fidelity and high-fidelity wireframing to map core user flows and layout hierarchy before development.', tech: ['Figma', 'Balsamiq'] },
        { title: 'Prototype', isFeatured: false, overview: 'Interactive clickable prototypes for user testing and stakeholder pitch presentations.', tech: ['Figma', 'Protopie'] },
        { title: 'Dashboard Design', isFeatured: true, overview: 'Complex SaaS and enterprise data dashboard UI/UX designed for clarity, fast data scannability, and dark modes.', tech: ['Figma', 'Tailwind'] },
        { title: 'Mobile App Design', isFeatured: false, overview: 'Human Interface & Material Design compliant mobile app screens tailored for iOS and Android devices.', tech: ['Figma'] },
        { title: 'Design System', isFeatured: false, overview: 'Scalable corporate design system with reusable UI tokens, components, and brand usage guidelines.', tech: ['Figma', 'Storybook'] },
        { title: 'Logo Design', isFeatured: false, overview: 'Memorable corporate logo design vector assets representing your brand identity and market positioning.', tech: ['Adobe Illustrator'] },
        { title: 'Brand Identity', isFeatured: false, overview: 'Complete corporate branding kit including logo usage, color palette, typography guidelines, and business stationery.', tech: ['Illustrator', 'Figma'] },
      ],
    },
    {
      category: '📈 Digital Marketing',
      slug: 'digital-marketing',
      description: 'Search engine optimization, social media marketing, pay-per-click advertising, and growth strategy.',
      icon: 'TrendingUp',
      order: 8,
      services: [
        { title: 'SEO', isFeatured: true, overview: 'Comprehensive technical, on-page, and off-page Search Engine Optimization to rank your website on Google page 1.', tech: ['Google Search Console', 'Ahrefs'] },
        { title: 'Local SEO', isFeatured: false, overview: 'Google Business Profile optimization and local citation building to drive foot traffic and local customer leads.', tech: ['Google My Business'] },
        { title: 'Facebook Marketing', isFeatured: false, overview: 'Meta ad campaign management, retargeting funnels, and creative ad copy for high ROI social conversions.', tech: ['Meta Business Suite'] },
        { title: 'Google Ads', isFeatured: false, overview: 'PPC Search, Display, and Shopping campaign setup with conversion tracking and keyword bid optimization.', tech: ['Google Ads', 'GA4'] },
        { title: 'YouTube Marketing', isFeatured: false, overview: 'YouTube channel SEO, video ad campaigns, and content optimization to capture video search traffic.', tech: ['YouTube Studio'] },
        { title: 'Email Marketing', isFeatured: false, overview: 'Automated email newsletter drip sequences, customer segmentation, and high-deliverability email templates.', tech: ['Klaviyo', 'Mailchimp'] },
        { title: 'Content Marketing', isFeatured: false, overview: 'Strategic blog post content creation, infographics, and whitepapers designed to build domain authority.', tech: ['SEO Content'] },
        { title: 'Social Media Management', isFeatured: false, overview: 'Consistent social content creation, community management, and brand engagement across major platforms.', tech: ['Canva', 'Buffer'] },
        { title: 'Branding', isFeatured: false, overview: 'Strategic brand positioning, messaging frameworks, and visual market differentiation campaigns.', tech: ['Strategy'] },
        { title: 'Marketing Strategy', isFeatured: false, overview: 'Data-driven omnichannel digital growth roadmap designed to achieve customer acquisition targets.', tech: ['Analytics', 'Strategy'] },
      ],
    },
    {
      category: '🔒 Cyber Security',
      slug: 'cyber-security',
      description: 'Vulnerability assessments, penetration testing, security audits, and data encryption.',
      icon: 'ShieldCheck',
      order: 9,
      services: [
        { title: 'Security Audit', isFeatured: true, overview: 'Comprehensive architecture security audit inspecting code security, server configurations, and access controls.', tech: ['OWASP', 'Nessus'] },
        { title: 'Penetration Testing', isFeatured: false, overview: 'Ethical hacking and penetration testing of web applications, APIs, and cloud servers to identify exploit vectors.', tech: ['Burp Suite', 'Metasploit'] },
        { title: 'Vulnerability Assessment', isFeatured: false, overview: 'Automated and manual security scanning to discover unpatched software vulnerabilities and CVE risks.', tech: ['Nmap', 'OpenVAS'] },
        { title: 'Security Monitoring', isFeatured: false, overview: 'Real-time Security Information and Event Management (SIEM) setup to detect and block malicious intrusion attempts.', tech: ['Wazuh', 'Fail2ban'] },
        { title: 'Firewall Setup', isFeatured: false, overview: 'Web Application Firewall (WAF) configuration protecting your web assets against DDoS, SQLi, and XSS attacks.', tech: ['Cloudflare WAF', 'ModSecurity'] },
        { title: 'Data Encryption', isFeatured: false, overview: 'Implementation of AES-256 data encryption at rest and TLS 1.3 encryption in transit across all databases and endpoints.', tech: ['AES-256', 'TLS 1.3'] },
        { title: 'Identity & Access Management', isFeatured: false, overview: 'Role-Based Access Control (RBAC), multi-factor authentication (MFA), and OAuth2 single sign-on security.', tech: ['OAuth2', 'JWT', 'MFA'] },
      ],
    },
    {
      category: '🧪 QA & Testing',
      slug: 'qa-testing',
      description: 'Automated and manual software quality assurance, load testing, and API verification.',
      icon: 'CheckCircle2',
      order: 10,
      services: [
        { title: 'Manual Testing', isFeatured: false, overview: 'Meticulous manual exploratory testing covering cross-browser compatibility, edge cases, and UI usability.', tech: ['TestRail', 'Jira'] },
        { title: 'Automation Testing', isFeatured: true, overview: 'Automated end-to-end regression test suite development ensuring zero breaking bugs during continuous deployments.', tech: ['Playwright', 'Cypress', 'Selenium'] },
        { title: 'Performance Testing', isFeatured: false, overview: 'Application speed profiling and database query optimization to achieve sub-second page load times.', tech: ['Lighthouse', 'WebPageTest'] },
        { title: 'Load Testing', isFeatured: false, overview: 'Stress testing software under heavy concurrent traffic to determine breaking limits and bottleneck bottlenecks.', tech: ['k6', 'JMeter'] },
        { title: 'Security Testing', isFeatured: false, overview: 'Automated static application security testing (SAST) integrated into continuous build pipelines.', tech: ['SonarQube', 'Snyk'] },
        { title: 'API Testing', isFeatured: false, overview: 'Automated API functional contract validation, payload verification, and error response code testing.', tech: ['Postman', 'REST Assured'] },
        { title: 'Mobile Testing', isFeatured: false, overview: 'Mobile app test execution across physical iOS and Android devices for screen responsiveness and battery usage.', tech: ['Appium', 'BrowserStack'] },
      ],
    },
    {
      category: '🛠️ Maintenance & Support',
      slug: 'maintenance-support',
      description: 'Ongoing technical maintenance, SLA bug fixing, version upgrades, and AMC contracts.',
      icon: 'Wrench',
      order: 11,
      services: [
        { title: 'Software Maintenance', isFeatured: true, overview: 'Proactive software maintenance ensuring high uptime, security patch application, and operational stability.', tech: ['Linux', 'Docker', 'Git'] },
        { title: 'Website Maintenance', isFeatured: false, overview: 'Regular website updates, plugin patches, content updates, speed optimization, and daily cloud backups.', tech: ['WordPress', 'Next.js'] },
        { title: 'App Maintenance', isFeatured: false, overview: 'Mobile app updates for new iOS and Android OS releases, API adjustments, and crash log resolution.', tech: ['Flutter', 'React Native'] },
        { title: 'Bug Fixing', isFeatured: false, overview: 'Rapid response bug diagnosis and code hotfixes for critical production errors.', tech: ['Debugging', 'Node.js'] },
        { title: 'Feature Enhancement', isFeatured: false, overview: 'Continuous incremental feature development and UI enhancements to evolve existing software platforms.', tech: ['Full-stack'] },
        { title: 'Version Upgrade', isFeatured: false, overview: 'Safe migration and version upgrade of legacy frameworks, Node.js versions, and database schemas.', tech: ['Migration Scripts'] },
        { title: 'Technical Support', isFeatured: false, overview: 'Dedicated 24/7 technical support helpdesk with guaranteed SLA response times for enterprise software.', tech: ['Helpdesk SLA'] },
        { title: 'AMC (Annual Maintenance Contract)', isFeatured: true, overview: 'Comprehensive annual maintenance contract covering server health, bug fixes, updates, and emergency support.', tech: ['SLA Contract'] },
      ],
    },
    {
      category: '📊 Data & Analytics',
      slug: 'data-analytics',
      description: 'Business intelligence dashboards, data pipelines, ETL workflows, and data warehousing.',
      icon: 'BarChart3',
      order: 12,
      services: [
        { title: 'Business Intelligence Dashboard', isFeatured: true, overview: 'Custom executive BI dashboard visualizing key operational metrics, KPI charts, and real-time business reports.', tech: ['PowerBI', 'Metabase', 'React'] },
        { title: 'Data Analytics', isFeatured: false, overview: 'Advanced data modeling and statistical analysis to extract actionable business insights from raw enterprise data.', tech: ['Python', 'SQL', 'Pandas'] },
        { title: 'Data Visualization', isFeatured: false, overview: 'Interactive custom charts, heatmaps, and geospatial map visualizations for web and mobile dashboards.', tech: ['D3.js', 'Recharts', 'Chart.js'] },
        { title: 'ETL Pipeline', isFeatured: false, overview: 'Automate Data Extraction, Transformation, and Loading (ETL) pipelines processing high-volume streaming data.', tech: ['Apache Airflow', 'Python'] },
        { title: 'Data Warehouse', isFeatured: false, overview: 'Centralized cloud data warehouse architecture setup aggregating multi-source enterprise data.', tech: ['Snowflake', 'BigQuery'] },
      ],
    },
    {
      category: '💳 Payment & FinTech',
      slug: 'payment-fintech',
      description: 'Mobile financial services integrations, payment gateways, and subscription billing.',
      icon: 'CreditCard',
      order: 13,
      services: [
        { title: 'bKash Integration', isFeatured: true, overview: 'Seamless bKash merchant payment gateway and checkout API integration for Bangladeshi digital transactions.', tech: ['bKash Tokenized API', 'Node.js'] },
        { title: 'Nagad Integration', isFeatured: true, overview: 'Direct Nagad mobile banking payment gateway integration for automated online payment validation.', tech: ['Nagad Merchant API'] },
        { title: 'Rocket Integration', isFeatured: false, overview: 'DBBL Rocket payment gateway integration for instant online customer checkout.', tech: ['Rocket API'] },
        { title: 'SSLCommerz', isFeatured: true, overview: 'SSLCommerz payment gateway integration supporting all Bangladeshi debit/credit cards and MFS channels.', tech: ['SSLCommerz V4 API'] },
        { title: 'ShurjoPay', isFeatured: false, overview: 'ShurjoPay payment gateway integration for merchant websites and mobile applications.', tech: ['ShurjoPay API'] },
        { title: 'Stripe', isFeatured: true, overview: 'International Stripe Checkout, Payment Intents, and Elements integration for global credit card processing.', tech: ['Stripe SDK', 'Node.js'] },
        { title: 'PayPal', isFeatured: false, overview: 'PayPal Smart Payment Buttons and subscription checkout integration for international clients.', tech: ['PayPal SDK'] },
        { title: 'Subscription Billing', isFeatured: false, overview: 'Automated recurring subscription engine handling plan upgrades, prorated billing, and dunning emails.', tech: ['Stripe Billing', 'PostgreSQL'] },
      ],
    },
    {
      category: '📦 Industry-Specific Solutions',
      slug: 'industry-specific-solutions',
      description: 'Specialized enterprise software tailored for specific industry domain requirements.',
      icon: 'Building2',
      order: 14,
      services: [
        { title: 'Hospital', isFeatured: true, overview: 'Enterprise hospital management software with EMR, bed allocation, OPD/IPD billing, and diagnostic labs.', tech: ['React', 'Node.js', 'PostgreSQL'] },
        { title: 'School & College', isFeatured: false, overview: 'Integrated academic institution management platform for student life cycle and online fees.', tech: ['React', 'PostgreSQL'] },
        { title: 'University', isFeatured: false, overview: 'University portal handling course registration, grade transcripts, faculty, and student portals.', tech: ['Next.js', 'Node.js'] },
        { title: 'Pharmacy', isFeatured: false, overview: 'Retail and wholesale pharmacy management system with drug batch, expiry, and POS checkout.', tech: ['React', 'SQLite'] },
        { title: 'Restaurant', isFeatured: false, overview: 'Restaurant POS, Kitchen Display System (KDS), and online order management software.', tech: ['React', 'Node.js'] },
        { title: 'Super Shop', isFeatured: false, overview: 'Supermarket POS and inventory software with fast barcode scanning and weigh scale integration.', tech: ['Electron', 'React'] },
        { title: 'Garments', isFeatured: false, overview: 'Textile & garments manufacturing ERP for merchandising, fabric procurement, and export orders.', tech: ['React', 'PostgreSQL'] },
        { title: 'Construction', isFeatured: false, overview: 'Construction project management software for contractor billing, material estimation, and site logs.', tech: ['React', 'Node.js'] },
        { title: 'Real Estate', isFeatured: false, overview: 'Property developer ERP managing project plots, sales bookings, installment plans, and CRM.', tech: ['Next.js', 'PostgreSQL'] },
        { title: 'Travel Agency', isFeatured: false, overview: 'Travel agency software for tour package booking, flight booking API integration, and passenger invoices.', tech: ['React', 'Node.js'] },
        { title: 'Hotel', isFeatured: false, overview: 'Hotel Property Management System (PMS) for room reservations, housekeeping, and guest folios.', tech: ['React', 'PostgreSQL'] },
        { title: 'Courier', isFeatured: false, overview: 'Parcel courier & logistics software with pickup tracking, sorting hub manifests, and merchant COD payouts.', tech: ['Flutter', 'Node.js'] },
        { title: 'Logistics', isFeatured: false, overview: 'Freight logistics management platform supporting shipment tracking, customs docs, and fleet management.', tech: ['React', 'Node.js'] },
        { title: 'NGO', isFeatured: false, overview: 'Non-profit management system for beneficiary tracking, grant budgeting, and field reports.', tech: ['React', 'PostgreSQL'] },
        { title: 'Government', isFeatured: false, overview: 'Secure public sector e-governance software with citizen services, document workflow, and audit logs.', tech: ['React', 'Node.js', 'PostgreSQL'] },
        { title: 'Manufacturing', isFeatured: false, overview: 'Industrial manufacturing plant ERP for Bill of Materials (BOM), production scheduling, and QA.', tech: ['React', 'Node.js'] },
        { title: 'Agriculture', isFeatured: false, overview: 'Agri-business software for contract farmer records, crop harvest tracking, and supply chain sales.', tech: ['React', 'PostgreSQL'] },
        { title: 'Banking', isFeatured: false, overview: 'Core banking subsystem software for account management, transaction processing, and audit logs.', tech: ['Node.js', 'PostgreSQL'] },
        { title: 'Insurance', isFeatured: false, overview: 'Insurance management system covering policy issuance, premium collection schedules, and claim settlement.', tech: ['React', 'Node.js'] },
        { title: 'Telecom', isFeatured: false, overview: 'Telecom subscriber billing and inventory management software for ISP and telecom operators.', tech: ['Node.js', 'PostgreSQL'] },
      ],
    },
  ];

  let totalServicesCreated = 0;
  for (const cat of CATALOG_DATA) {
    const createdCategory = await prisma.serviceCategory.create({
      data: {
        name: cat.category,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
      },
    });

    for (let index = 0; index < cat.services.length; index++) {
      const s = cat.services[index];
      const serviceSlug = `${cat.slug}-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      await prisma.service.create({
        data: {
          title: s.title,
          slug: serviceSlug,
          categoryId: createdCategory.id,
          icon: cat.icon,
          overview: s.overview,
          features: [
            'Enterprise-Grade Reliability',
            'Scalable Cloud Ready Architecture',
            '24/7 Technical Support SLA',
            'Full Source Code Ownership'
          ],
          technologies: s.tech,
          faq: [
            { question: `What is the delivery timeline for ${s.title}?`, answer: `Standard implementation takes 2-6 weeks depending on custom features and integration scope.` },
            { question: 'Do you provide maintenance after launch?', answer: 'Yes, we provide 90 days of free post-launch support followed by flexible AMC maintenance plans.' }
          ],
          ctaText: 'Request Consultation',
          ctaUrl: '/contact',
          order: index + 1,
          isActive: true,
          isFeatured: s.isFeatured,
        },
      });
      totalServicesCreated++;
    }
  }

  console.log(`✅ ${CATALOG_DATA.length} Service Categories & ${totalServicesCreated} Catalog Services initialized`);

  // 5. Portfolio Projects & Industries
  await prisma.portfolioProject.deleteMany({});
  await prisma.industry.deleteMany({});

  const industries = ['Fintech', 'Healthcare', 'Retail & E-Commerce', 'Logistics & Supply Chain', 'EdTech'];
  for (let i = 0; i < industries.length; i++) {
    await prisma.industry.create({
      data: {
        name: industries[i],
        slug: industries[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `Cutting-edge software solutions custom engineered for ${industries[i]} businesses.`,
        order: i + 1,
      },
    });
  }

  await prisma.portfolioProject.createMany({
    data: [
      {
        title: 'Apex Global Supply Chain & Fleet Tracking',
        slug: 'apex-global-supply-chain-fleet-tracking',
        coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Real-time GPS fleet telemetry, automated route dispatching, and inventory predictive platform.',
        overview: 'Developed a high-concurrency cloud platform processing 5M+ IoT data points daily across 1,200 cargo fleets.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'WebSockets', 'AWS IoT Core'],
        industry: 'Logistics & Supply Chain',
        features: ['Real-time Telemetry Maps', 'Automated Driver Dispatching', 'Custom ETA Algorithms'],
        results: ['34% Reduction in Fleet Idle Time', '99.99% Operational Uptime', 'Over $2.4M Annual Fuel Savings'],
        liveUrl: 'https://apexlogistics.io',
        isFeatured: true,
        order: 1,
      },
      {
        title: 'Vanguard Banking & Digital Wealth Mobile Platform',
        slug: 'vanguard-banking-digital-wealth-mobile-platform',
        coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Next-generation digital banking app with automated portfolio rebalancing and instant SEPA transfers.',
        overview: 'Engineered bank-grade mobile app compliant with PCI-DSS and SOC2 security standards.',
        technologies: ['Flutter', 'Python', 'FastAPI', 'Redis', 'Docker'],
        industry: 'Fintech',
        features: ['Biometric Login', 'Micro-investment Portfolios', 'Instant Peer Payments'],
        results: ['1.2M+ Active Users', '4.9 Star App Store Rating'],
        liveUrl: 'https://vanguardwealth.com',
        isFeatured: true,
        order: 2,
      },
    ],
  });
  console.log('✅ Portfolio & Industries initialized');

  // 6. Jobs
  await prisma.job.deleteMany({});
  await prisma.job.createMany({
    data: [
      {
        title: 'Senior Lead Full-Stack Engineer',
        slug: 'senior-lead-full-stack-engineer',
        department: 'Engineering',
        location: 'Remote / Hybrid',
        type: JobType.FULL_TIME,
        experience: '5+ Years',
        description: 'We are seeking a seasoned Lead Full-Stack Engineer to architect next-generation client software.',
        requirements: [
          '5+ years experience with React/Next.js and Node.js/TypeScript',
          'Deep knowledge of PostgreSQL, Redis, and cloud architectures (AWS/GCP)',
          'Experience leading agile engineering teams and code reviews'
        ],
        responsibilities: [
          'Architect and deliver end-to-end scalable web applications',
          'Mentor junior developers and establish engineering best practices',
          'Collaborate directly with product managers and enterprise clients'
        ],
        salaryRange: '$110,000 - $140,000 / year',
        isActive: true,
      },
      {
        title: 'AI / Machine Learning Specialist',
        slug: 'ai-machine-learning-specialist',
        department: 'AI & Innovation',
        location: 'Remote',
        type: JobType.FULL_TIME,
        experience: '3+ Years',
        description: 'Join our AI team building LLM integrations, computer vision pipelines, and intelligent agents.',
        requirements: [
          'Strong background in Python, PyTorch/TensorFlow, and HuggingFace models',
          'Hands-on experience fine-tuning LLMs and building RAG pipelines',
          'Solid understanding of REST APIs and microservice deployment'
        ],
        responsibilities: [
          'Train, fine-tune, and deploy ML models into production environments',
          'Design vector DB indexing and retrieval workflows'
        ],
        salaryRange: '$120,000 - $150,000 / year',
        isActive: true,
      },
    ],
  });
  console.log('✅ Jobs initialized');

  // 7. Technologies
  await prisma.technology.deleteMany({});
  await prisma.technology.createMany({
    data: [
      { name: 'React', slug: 'react', icon: 'Atom', category: 'Frontend', description: 'Modern declarative component framework.', order: 1 },
      { name: 'Next.js', slug: 'nextjs', icon: 'Zap', category: 'Frontend', description: 'Full-stack React framework with SSR and App Router.', order: 2 },
      { name: 'Node.js', slug: 'nodejs', icon: 'Server', category: 'Backend', description: 'Asynchronous event-driven runtime engine.', order: 3 },
      { name: 'Python', slug: 'python', icon: 'Terminal', category: 'AI & Data', description: 'High-level language for AI, ML, and data processing.', order: 4 },
      { name: 'TypeScript', slug: 'typescript', icon: 'FileCode', category: 'Languages', description: 'Strongly typed JavaScript superset.', order: 5 },
      { name: 'PostgreSQL', slug: 'postgresql', icon: 'Database', category: 'Database', description: 'Advanced open-source relational database.', order: 6 },
      { name: 'AWS Cloud', slug: 'aws', icon: 'Cloud', category: 'Cloud & DevOps', description: 'Enterprise cloud computing and infrastructure.', order: 7 },
      { name: 'Docker', slug: 'docker', icon: 'Box', category: 'Cloud & DevOps', description: 'Containerization engine for reliable deployment.', order: 8 },
    ],
  });
  console.log('✅ Technologies initialized');

  // 8. Testimonials & FAQs & Client Logos
  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: 'Sarah Jenkins',
        company: 'Apex Global Logistics',
        position: 'VP of Operations',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        rating: 5,
        text: 'BrainForge26 transformed our logistics infrastructure. Their technical execution was flawless and completed ahead of schedule.',
        order: 1,
      },
      {
        clientName: 'David Sterling',
        company: 'Vanguard Digital Banking',
        position: 'Head of Product',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        rating: 5,
        text: 'Working with BrainForge26 felt like having an elite team of engineers inside our company. Highly recommended for enterprise projects.',
        order: 2,
      },
    ],
  });

  await prisma.faq.deleteMany({});
  await prisma.faq.createMany({
    data: [
      {
        question: 'What engagement models do you offer?',
        answer: 'We offer Dedicated Development Teams, Fixed-Scope Project Delivery, and Strategic Technology Consulting.',
        category: 'Engagement',
        order: 1,
      },
      {
        question: 'How do you ensure code quality and security?',
        answer: 'All code undergoes strict code reviews, automated CI/CD static security analysis, unit testing, and compliance checks (SOC2 / ISO27001 standards).',
        category: 'Quality Assurance',
        order: 2,
      },
      {
        question: 'Can you scale up a team on short notice?',
        answer: 'Yes, our talent pool of pre-vetted senior software engineers allows us to scale teams within 1-2 weeks.',
        category: 'Team Scaling',
        order: 3,
      },
    ],
  });

  await prisma.clientLogo.deleteMany({});
  await prisma.clientLogo.createMany({
    data: [
      { name: 'Apex Global', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80', order: 1 },
      { name: 'Vanguard Wealth', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80', order: 2 },
    ],
  });
  console.log('✅ Testimonials, FAQs, Client logos initialized');

  // 9. Site Settings
  await prisma.siteSetting.deleteMany({});
  await prisma.siteSetting.createMany({
    data: [
      {
        key: 'general',
        value: {
          companyName: 'BrainForge26',
          tagline: 'Enterprise Software & AI Solutions Company',
          description: 'We design, build, and scale enterprise web platforms, mobile applications, and artificial intelligence solutions.',
          contactEmail: 'contact@brainforge26.tech',
          contactPhone: '+1 (800) 555-0199',
          address: '75 Broad Street, 21st Floor, New York, NY 10004',
          socialLinks: {
            github: 'https://github.com/brainforge26',
            linkedin: 'https://linkedin.com/company/brainforge26',
            twitter: 'https://twitter.com/brainforge26'
          }
        },
      },
      {
        key: 'hero',
        value: {
          badgeText: 'Elite Software Engineering Agency',
          heading: 'We Build Scalable Software & AI Systems For Global Enterprises',
          subheading: 'From custom cloud applications to intelligent machine learning models, we partner with industry leaders to power their digital transformation.',
          primaryCtaText: 'Discuss Your Project',
          primaryCtaUrl: '/contact',
          secondaryCtaText: 'View Portfolio',
          secondaryCtaUrl: '/portfolio'
        },
      },
    ],
  });
  console.log('✅ Site settings initialized');

  console.log('🎉 Corporate Software Services Catalog Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
