import { readFileSync, existsSync } from "node:fs";
import { MongoClient } from "mongodb";

function loadDotEnv() {
  if (!existsSync(".env")) return;
  const raw = readFileSync(".env", "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadDotEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "vexora";

if (!uri) {
  console.error("Set MONGODB_URI in .env (see .env.example).");
  process.exit(1);
}

const services = [
  {
    _id: "svc-web",
    serviceName: "Web Development",
    shortDescription: "High-performance, AI-integrated web platforms engineered for scale.",
    detailedDescription: "We build modern, responsive web applications using the latest frameworks, integrated with AI capabilities for enhanced user experience and performance.",
    serviceImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    slug: "web-development",
    isFeatured: true,
  },
  {
    _id: "svc-app",
    serviceName: "App Development",
    shortDescription: "Intelligent mobile experiences for iOS and Android.",
    detailedDescription: "Custom mobile applications with integrated AI features like voice recognition, predictive text, and personalized content delivery.",
    serviceImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800",
    slug: "app-development",
    isFeatured: true,
  },
  {
    _id: "svc-custom",
    serviceName: "Custom Software Development",
    shortDescription: "Tailored software solutions powered by machine learning.",
    detailedDescription: "Bespoke software systems designed to solve complex business problems using advanced algorithms and data processing.",
    serviceImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800",
    slug: "custom-software",
    isFeatured: true,
  },
  {
    _id: "svc-uiux",
    serviceName: "UI/UX Design",
    shortDescription: "Data-driven design focused on conversion and engagement.",
    detailedDescription: "Intuitive interfaces designed through user behavior analysis and AI-powered design tools to ensure maximum accessibility.",
    serviceImage: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800",
    slug: "ui-ux-design",
    isFeatured: false,
  },
  {
    _id: "svc-ecommerce",
    serviceName: "E-Commerce Development",
    shortDescription: "Next-gen online stores with AI product recommendations.",
    detailedDescription: "Scalable e-commerce platforms featuring intelligent search, personalized shopping experiences, and automated inventory management.",
    serviceImage: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=800",
    slug: "ecommerce-development",
    isFeatured: false,
  },
  {
    _id: "svc-automation",
    serviceName: "Automation Solutions",
    shortDescription: "Streamlining workflows with intelligent robotic process automation.",
    detailedDescription: "End-to-end automation of repetitive tasks using AI agents and machine learning to boost operational efficiency.",
    serviceImage: "https://images.unsplash.com/photo-1518433278983-bc970678609a?q=80&w=800",
    slug: "automation-solutions",
    isFeatured: true,
  },
  {
    _id: "svc-erp",
    serviceName: "ERP & Management Systems",
    shortDescription: "Integrated business management with predictive analytics.",
    detailedDescription: "Comprehensive ERP systems that unify your business processes with AI-driven insights for better decision making.",
    serviceImage: "https://images.unsplash.com/photo-1454165833767-131f369501d?q=80&w=800",
    slug: "erp-management-systems",
    isFeatured: false,
  },
  {
    _id: "svc-admin",
    serviceName: "Admin Dashboard Systems",
    shortDescription: "Powerful data visualization and management consoles.",
    detailedDescription: "Custom admin panels featuring real-time telemetry, AI-assisted data analysis, and intuitive management tools.",
    serviceImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
    slug: "admin-dashboard-systems",
    isFeatured: false,
  },
  {
    _id: "svc-maintenance",
    serviceName: "Maintenance & Support",
    shortDescription: "24/7 proactive monitoring and technical evolution.",
    detailedDescription: "Ongoing support and maintenance using predictive monitoring to prevent issues before they occur and keep systems updated.",
    serviceImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800",
    slug: "maintenance-support",
    isFeatured: false,
  },
];

const projects = [
  {
    _id: "proj-ops-console",
    projectTitle: "Operations Control Console",
    projectDescription:
      "Real-time telemetry and workflow tooling for distributed field operations with role-based access and audit trails.",
    technologiesUsed: "React, Node.js, Postgres, AWS",
    projectImage:
      "https://static.wixstatic.com/media/47e7bb_04348de70fc94f7eb76fa4e3f3ef2054~mv2.png?originWidth=1152&originHeight=704",
    clientName: "Enterprise logistics partner",
    projectUrl: "https://example.com",
    completionDate: new Date("2024-11-15"),
  },
  {
    _id: "proj-commerce",
    projectTitle: "Composable Commerce Rollout",
    projectDescription:
      "Headless storefront, payment orchestration, and inventory sync across regions with resilient fallbacks.",
    technologiesUsed: "Next.js, Stripe, Redis, Kubernetes",
    projectImage:
      "https://static.wixstatic.com/media/47e7bb_04348de70fc94f7eb76fa4e3f3ef2054~mv2.png?originWidth=1152&originHeight=704",
    clientName: "Retail brand",
    completionDate: new Date("2025-02-01"),
  },
];

const testimonials = [
  {
    _id: "t-1",
    clientName: "Priya N.",
    reviewText:
      "The team shipped a complex platform on time without sacrificing quality. Communication was exceptional throughout.",
    clientRoleCompany: "CTO, Series B SaaS",
    rating: 5,
    clientImage:
      "https://static.wixstatic.com/media/47e7bb_a0d934450b2c4f1ab21d4c235925a4f3~mv2.png?originWidth=128&originHeight=128",
    datePosted: new Date("2025-01-10"),
  },
  {
    _id: "t-2",
    clientName: "Marcus L.",
    reviewText:
      "Security and performance were treated as first-class concerns, not afterthoughts. Exactly what we needed.",
    clientRoleCompany: "Head of Engineering, Fintech",
    rating: 5,
    clientImage:
      "https://static.wixstatic.com/media/47e7bb_a0d934450b2c4f1ab21d4c235925a4f3~mv2.png?originWidth=128&originHeight=128",
    datePosted: new Date("2025-03-01"),
  },
];

const teammembers = [
  {
    _id: "team-lead",
    fullName: "Alex Rivera",
    jobTitle: "Principal Engineer",
    bio: "Leads architecture across cloud-native and data-heavy systems.",
    profilePhoto:
      "https://static.wixstatic.com/media/47e7bb_a0d934450b2c4f1ab21d4c235925a4f3~mv2.png?originWidth=128&originHeight=128",
    linkedInUrl: "https://www.linkedin.com",
    email: "alex@example.com",
    displayOrder: 1,
  },
];

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);
  const now = new Date();

  for (const [name, docs] of [
    ["services", services],
    ["projects", projects],
    ["testimonials", testimonials],
    ["teammembers", teammembers],
  ]) {
    const coll = db.collection(name);
    const count = await coll.countDocuments();
    if (count > 0) {
      console.log(`Skipping ${name} (${count} documents already present)`);
      continue;
    }
    const stamped = docs.map((d) => ({
      ...d,
      _createdDate: now,
      _updatedDate: now,
    }));
    await coll.insertMany(stamped);
    console.log(`Seeded ${name}: ${stamped.length} documents`);
  }
} finally {
  await client.close();
}
