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
    serviceName: "Web & Cloud Platforms",
    shortDescription:
      "Modern SPAs, APIs, and cloud-native deployments tailored to your scale.",
    detailedDescription:
      "We design and ship production-grade web applications with observability, CI/CD, and security built in from day one.",
    serviceImage:
      "https://static.wixstatic.com/media/47e7bb_6be7d45725c54ac8a5bcd40a8bda53ae~mv2.png?originWidth=576&originHeight=384",
    slug: "web-cloud-platforms",
    isFeatured: true,
  },
  {
    _id: "svc-data",
    serviceName: "Data & Integrations",
    shortDescription:
      "Pipelines, warehouses, and reliable integrations between your systems.",
    detailedDescription:
      "From ETL to event-driven architectures, we connect products and teams with dependable data flows.",
    serviceImage:
      "https://static.wixstatic.com/media/47e7bb_6be7d45725c54ac8a5bcd40a8bda53ae~mv2.png?originWidth=576&originHeight=384",
    slug: "data-integrations",
    isFeatured: true,
  },
  {
    _id: "svc-security",
    serviceName: "Security & Compliance",
    shortDescription:
      "Hardening, reviews, and operational practices that reduce real risk.",
    detailedDescription:
      "Threat modeling, secure SDLC, and pragmatic controls aligned to how your team actually ships.",
    serviceImage:
      "https://static.wixstatic.com/media/47e7bb_6be7d45725c54ac8a5bcd40a8bda53ae~mv2.png?originWidth=576&originHeight=384",
    slug: "security-compliance",
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
