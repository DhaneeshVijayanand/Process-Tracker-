const prisma = require('../prisma');

const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalProjects, totalUpdates, totalComments] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.update.count(),
      prisma.comment.count()
    ]);

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { id: true }
    });

    const projects = await prisma.project.findMany({
      include: {
        client: {
          select: { name: true }
        },
        _count: {
          select: { updates: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const chartData = projects.map((p) => ({
      id: p.id,
      name: p.name,
      clientName: p.client?.name || 'Unassigned',
      updateCount: p._count.updates,
      progress: p.progress,
      stage: p.stage
    }));

    res.json({
      metrics: {
        totalUsers,
        totalProjects,
        totalUpdates,
        totalComments
      },
      roleBreakdown: usersByRole.reduce((acc, curr) => {
        acc[curr.role.toLowerCase()] = curr._count.id;
        return acc;
      }, { admin: 0, team: 0, client: 0 }),
      chartData
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard statistics' });
  }
};

module.exports = {
  getAdminStats
};
