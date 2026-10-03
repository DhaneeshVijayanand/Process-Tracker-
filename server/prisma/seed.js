const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing records in correct relation order
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.update.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Purged existing records');

  // Password hashes
  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash('admin123', salt);
  const teamPass = await bcrypt.hash('team123', salt);
  const clientPass = await bcrypt.hash('client123', salt);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      userId: 'admin',
      name: 'Sarah Connor (Program Director)',
      passwordHash: adminPass,
      role: 'ADMIN'
    }
  });

  const team = await prisma.user.create({
    data: {
      userId: 'team',
      name: 'Alex Vance (Lead Architect)',
      passwordHash: teamPass,
      role: 'TEAM'
    }
  });

  const client = await prisma.user.create({
    data: {
      userId: 'client',
      name: 'Elena Rostova (Apex Enterprise)',
      passwordHash: clientPass,
      role: 'CLIENT'
    }
  });

  console.log('✅ Created users: admin, team, client');

  // 2. Create Sample Project for Client
  const project = await prisma.project.create({
    data: {
      name: 'NextGen BA Analytics & Workflow Core',
      clientId: client.id,
      stage: 'In Progress',
      progress: 65
    }
  });

  console.log(`✅ Created sample project: "${project.name}" (ID: ${project.id})`);

  // 3. Create Sample Updates
  const update1 = await prisma.update.create({
    data: {
      projectId: project.id,
      authorId: team.id,
      stage: 'Planning',
      progress: 30,
      text: 'Discovery & Business Architecture Milestone complete. Finalized stakeholder interview matrix across 4 business verticals. All 14 core user journeys mapped to compliance requirements and validated.',
      imageUrl: '/uploads/sample-blueprint.svg',
      createdAt: new Date(Date.now() - 48 * 3600 * 1000) // 2 days ago
    }
  });

  // Reactions for update 1
  await prisma.reaction.createMany({
    data: [
      { updateId: update1.id, userId: client.id, emoji: '🔥' },
      { updateId: update1.id, userId: team.id, emoji: '👍' }
    ]
  });

  // Comment on update 1
  await prisma.comment.create({
    data: {
      updateId: update1.id,
      userId: client.id,
      text: 'Phenomenal progress, Alex! The traceability matrix matches exactly what our audit committee needed.',
      createdAt: new Date(Date.now() - 40 * 3600 * 1000)
    }
  });

  // Update 2
  const update2 = await prisma.update.create({
    data: {
      projectId: project.id,
      authorId: team.id,
      stage: 'In Progress',
      progress: 65,
      text: 'Real-time telemetry and executive HUD interface deployed! Integrated live data simulator and validated sub-second latency for transaction stream monitors. Ready for preliminary client walkthrough.',
      imageUrl: '/uploads/sample-dashboard.svg',
      createdAt: new Date(Date.now() - 4 * 3600 * 1000) // 4 hours ago
    }
  });

  // Reactions for update 2
  await prisma.reaction.createMany({
    data: [
      { updateId: update2.id, userId: client.id, emoji: '❤️' },
      { updateId: update2.id, userId: client.id, emoji: '🔥' },
      { updateId: update2.id, userId: admin.id, emoji: '👍' }
    ]
  });

  // Comments for update 2
  await prisma.comment.create({
    data: {
      updateId: update2.id,
      userId: client.id,
      text: 'The glassmorphic charts look stunning. Can we review the KPI breakdown tomorrow morning?',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000)
    }
  });

  await prisma.comment.create({
    data: {
      updateId: update2.id,
      userId: team.id,
      text: 'Confirmed! Sending the calendar invite for 10:00 AM EST with interactive link.',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000)
    }
  });

  console.log('✅ Created 2 sample updates with reactions and comments');

  // 4. Sample Notifications
  await prisma.notification.create({
    data: {
      userId: client.id,
      message: `Alex Vance published a new daily update on "${project.name}" (In Progress • 65% complete)`,
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 3600 * 1000)
    }
  });

  await prisma.notification.create({
    data: {
      userId: team.id,
      message: `Client Elena Rostova commented on "${project.name}": "The glassmorphic charts look stunning..."`,
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 3600 * 1000)
    }
  });

  console.log('✅ Created sample notifications');
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
