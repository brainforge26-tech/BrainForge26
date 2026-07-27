export interface ProjectItem {
  id: string;
  title: string;
  category: 'Web Apps' | 'AI / ML' | 'Mobile Apps' | 'Enterprise';
  type: string;
  description: string;
  fullDescription: string;
  client: string;
  timeline: string;
  role: string;
  coverImage: string;
  images: string[];
  tech: string[];
  features: string[];
  challenge: string;
  solution: string;
  impact: string;
  status: 'Completed' | 'Active';
  color: string;
  demoUrl?: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'ecommerce-platform',
    title: 'Next-Gen E-Commerce Platform',
    category: 'Web Apps',
    type: 'Web Application',
    description: 'Full-stack marketplace with real-time inventory, Stripe payments, AI recommendations, and an admin dashboard for a US retail brand.',
    fullDescription: 'An enterprise-scale e-commerce platform built to support over 100,000 active daily shoppers. Features real-time stock synchronization, multi-currency checkout, dynamic price engine, and personalized AI product recommendations.',
    client: 'Apex Retail Group (USA)',
    timeline: '3 Months (2025)',
    role: 'Lead Full-Stack & UI/UX Team',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    ],
    tech: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Stripe API', 'Redis', 'Tailwind CSS'],
    features: [
      'Sub-second Server-Side Rendering (SSR) page speed',
      'Multi-tenant vendor dashboard with analytics',
      'Stripe & Apple Pay one-click checkout integration',
      'Automated inventory sync & low-stock alerts',
    ],
    challenge: 'Handling sudden traffic surges during flash sales while maintaining instantaneous search latency across 50,000+ SKU catalogs.',
    solution: 'Implemented Redis caching layers with PostgreSQL read-replicas, elastic search indexing, and edge-rendered Next.js page components.',
    impact: 'Increased checkout conversion rate by +34% and reduced load times by 68%.',
    status: 'Completed',
    color: '#C02C54',
    demoUrl: 'https://demo-ecommerce.brainforge.com',
  },
  {
    id: 'saas-analytics-dashboard',
    title: 'SaaS Data & AI Analytics Platform',
    category: 'AI / ML',
    type: 'Data & AI Platform',
    description: 'Real-time analytics dashboard with custom SVG chart library, AI anomaly detection, multi-tenant RBAC, and automated reporting.',
    fullDescription: 'An intuitive, ultra-fast analytics dashboard engineered for B2B SaaS companies. It processes millions of telemetry data points per hour and surfaces predictive AI insights for churn prevention.',
    client: 'DataMetrics Systems (UK)',
    timeline: '4 Months (2025)',
    role: 'Full-Stack Architecture',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    ],
    tech: ['React', 'Node.js', 'Python PyTorch', 'TimescaleDB', 'WebSockets', 'Chart.js'],
    features: [
      'Real-time WebSocket streaming for metric charts',
      'AI anomaly detection with automated Slack alerts',
      'Role-Based Access Control (RBAC) & Team Workspaces',
      'One-click PDF/CSV executive report exports',
    ],
    challenge: 'Rendering high-frequency live time-series charts without freezing browser UI thread during peak load.',
    solution: 'Utilized Web Workers for background data processing and WebGL-accelerated chart rendering engines.',
    impact: 'Streamlined metric reporting for 45+ enterprise clients with 99.99% uptime.',
    status: 'Completed',
    color: '#A61C43',
    demoUrl: 'https://demo-analytics.brainforge.com',
  },
  {
    id: 'mobile-delivery-app',
    title: 'Smart Logistics & Delivery Mobile App',
    category: 'Mobile Apps',
    type: 'Mobile Application',
    description: 'Cross-platform logistics tracking app with live GPS route optimization, push notifications, and driver dispatch portal.',
    fullDescription: 'A comprehensive mobile solution built for last-mile delivery fleets. Provides drivers with optimized routing, digital proof-of-delivery signatures, and real-time customer tracking links.',
    client: 'SwiftLogistics Corp (Canada)',
    timeline: '3.5 Months (2025)',
    role: 'Mobile Dev & Backend Lead',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80',
    ],
    tech: ['React Native', 'TypeScript', 'Express.js', 'Google Maps API', 'Socket.io', 'Firebase'],
    features: [
      'Turn-by-turn navigation with dynamic traffic rerouting',
      'In-app camera photo capture & electronic signatures',
      'Live customer SMS tracking updates & ETA sharing',
      'Offline mode data synchronization for weak cell zones',
    ],
    challenge: 'Maintaining precise GPS location tracking in background mode without draining driver mobile battery.',
    solution: 'Implemented intelligent geofencing algorithms and batch location update sync intervals.',
    impact: 'Reduced average delivery times by 22% across 12,000 daily package dispatches.',
    status: 'Completed',
    color: '#851636',
    demoUrl: 'https://demo-delivery.brainforge.com',
  },
  {
    id: 'healthcare-portal',
    title: 'AI Patient Portal & Telemedicine System',
    category: 'Enterprise',
    type: 'Enterprise Healthcare',
    description: 'HIPAA-compliant patient portal with AI appointment scheduling, WebRTC video consultation, and EHR system integration.',
    fullDescription: 'An end-to-end digital health platform connecting patients with medical specialists. Includes secure video consultations, automated prescription renewals, and AI-assisted symptom triage.',
    client: 'NovaCare Health System (USA)',
    timeline: '5 Months (2024)',
    role: 'Enterprise Full-Stack Lead',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
    ],
    tech: ['Next.js 15', 'Prisma', 'PostgreSQL', 'WebRTC', 'Twilio API', 'Tailwind CSS'],
    features: [
      'HIPAA & GDPR encrypted medical record vaults',
      'HD WebRTC video visits with live prescription notes',
      'AI triage assistant for symptom intake forms',
      'Integrated insurance verification & billing portal',
    ],
    challenge: 'Meeting strict HIPAA security compliance while keeping video streaming latency ultra-low.',
    solution: 'Designed end-to-end encrypted WebRTC peer connection pipelines with zero-knowledge data storage architecture.',
    impact: 'Served over 50,000 patient tele-health visits with 99.8% positive rating.',
    status: 'Completed',
    color: '#C02C54',
    demoUrl: 'https://demo-health.brainforge.com',
  },
];
