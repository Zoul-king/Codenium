/**
 * Seed test data for the thesis functional tests using the test client account.
 * Creates: a Quote (CONVERTED), a Project (ACTIVE), milestones, messages,
 * a payment and a document so the client dashboard sections render real data.
 */
import {
  PrismaClient,
  ProjectType,
  PlanCategory,
  PlanTier,
  BillingModel,
  QuoteStatus,
  ProjectStatus,
  MilestoneStatus,
  PaymentStatus,
  DocumentType,
  UserRole,
  UserStatus
} from "@prisma/client";

const prisma = new PrismaClient();

const CLIENT_EMAIL = "gc.aztelwolf@gmail.com";

async function main() {
  const client = await prisma.user.findUnique({ where: { email: CLIENT_EMAIL } });
  if (!client) {
    throw new Error(`Client ${CLIENT_EMAIL} not found. Register first via /register.`);
  }

  // Reuse or create a PM
  let pm = await prisma.user.findFirst({ where: { role: UserRole.PM } });
  if (!pm) {
    pm = await prisma.user.create({
      data: {
        firstName: "Patricia",
        lastName: "Mendoza",
        email: `pm.tesis.${Date.now()}@codenium.test`,
        passwordHash: "$2a$10$abcdefghijklmnopqrstuv.notarealhash",
        role: UserRole.PM,
        status: UserStatus.ACTIVE
      }
    });
  }

  // Quote
  const quote = await prisma.quote.create({
    data: {
      folio: `Q-${Date.now()}`,
      clientId: client.id,
      title: "Sitio corporativo Aztel Wolf",
      description: "Sitio institucional con blog, contacto y panel administrador.",
      projectType: ProjectType.WEB,
      planCategory: PlanCategory.BUSINESS,
      planTier: PlanTier.INTERMEDIATE,
      billingModel: BillingModel.ONE_TIME,
      estimatedPrice: 45000,
      estimatedTimeline: "6 semanas",
      status: QuoteStatus.CONVERTED
    }
  });

  // Project
  const project = await prisma.project.create({
    data: {
      quoteId: quote.id,
      clientId: client.id,
      pmId: pm.id,
      name: "Sitio corporativo Aztel Wolf",
      description: "Sitio institucional con blog, contacto y panel administrador.",
      status: ProjectStatus.ACTIVE,
      startDate: new Date("2026-04-01"),
      dueDate: new Date("2026-06-30"),
      budget: 45000,
      progress: 35,
      stagingUrl: "https://staging.aztelwolf.codenium.dev"
    }
  });

  // Milestones
  await prisma.milestone.createMany({
    data: [
      {
        projectId: project.id,
        title: "Descubrimiento y wireframes",
        description: "Workshops de descubrimiento, mapa del sitio y wireframes.",
        status: MilestoneStatus.COMPLETED,
        completedAt: new Date("2026-04-12"),
        dueDate: new Date("2026-04-15"),
        order: 1
      },
      {
        projectId: project.id,
        title: "Diseño visual",
        description: "Sistema de diseño y pantallas finales.",
        status: MilestoneStatus.IN_PROGRESS,
        dueDate: new Date("2026-05-15"),
        order: 2
      },
      {
        projectId: project.id,
        title: "Desarrollo frontend",
        description: "Maquetado responsivo de todas las secciones.",
        status: MilestoneStatus.PENDING,
        dueDate: new Date("2026-06-05"),
        order: 3
      },
      {
        projectId: project.id,
        title: "Lanzamiento",
        description: "QA final, despliegue y entrega de credenciales.",
        status: MilestoneStatus.PENDING,
        dueDate: new Date("2026-06-30"),
        order: 4
      }
    ]
  });

  // Messages
  await prisma.message.create({
    data: {
      projectId: project.id,
      senderId: pm.id,
      content: "Hola Aztel, ya cargamos los wireframes en el espacio de entregables. Quedo atento a tus comentarios."
    }
  });

  // Payment
  await prisma.payment.create({
    data: {
      projectId: project.id,
      createdById: pm.id,
      concept: "Anticipo 50%",
      amount: 22500,
      status: PaymentStatus.PAID,
      paidAt: new Date("2026-04-05"),
      reference: "TRF-0001"
    }
  });

  await prisma.payment.create({
    data: {
      projectId: project.id,
      createdById: pm.id,
      concept: "Liquidación a entrega",
      amount: 22500,
      status: PaymentStatus.PENDING,
      dueDate: new Date("2026-06-30")
    }
  });

  // Document (deliverable)
  await prisma.document.create({
    data: {
      projectId: project.id,
      uploadedById: pm.id,
      name: "Wireframes v1.pdf",
      fileUrl: "/uploads/seed/wireframes-v1.pdf",
      fileType: "application/pdf",
      category: DocumentType.DELIVERABLE
    }
  });

  console.log(JSON.stringify({
    ok: true,
    clientId: client.id,
    pmId: pm.id,
    quoteId: quote.id,
    projectId: project.id
  }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
