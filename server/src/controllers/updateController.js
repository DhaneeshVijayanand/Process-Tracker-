const prisma = require('../prisma');

const getUpdatesByProject = async (req, res) => {
  try {
    const { id: projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (req.user.role === 'CLIENT' && project.clientId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this project feed' });
    }

    const updates = await prisma.update.findMany({
      where: { projectId },
      include: {
        author: {
          select: { id: true, userId: true, name: true, role: true }
        },
        reactions: {
          include: {
            user: {
              select: { id: true, userId: true, name: true }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: { id: true, userId: true, name: true, role: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format with reaction summary & user's current reactions
    const formattedUpdates = updates.map((update) => {
      const reactionCounts = {
        '🔥': 0,
        '👍': 0,
        '❤️': 0
      };

      const userReactions = [];

      update.reactions.forEach((r) => {
        if (reactionCounts[r.emoji] !== undefined) {
          reactionCounts[r.emoji]++;
        }
        if (r.userId === req.user.id) {
          userReactions.push(r.emoji);
        }
      });

      return {
        ...update,
        reactionCounts,
        userReactions
      };
    });

    res.json({ updates: formattedUpdates, project });
  } catch (error) {
    console.error('Get updates error:', error);
    res.status(500).json({ error: 'Failed to fetch project updates' });
  }
};

const createUpdate = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { text, stage, progress } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Update text description is required' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const validStages = ['Planning', 'In Progress', 'Review', 'Completed'];
    const updateStage = validStages.includes(stage) ? stage : project.stage;
    
    let parsedProgress = parseInt(progress, 10);
    if (isNaN(parsedProgress)) {
      parsedProgress = project.progress;
    } else {
      parsedProgress = Math.min(100, Math.max(0, parsedProgress));
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // 1. Create the update
    const newUpdate = await prisma.update.create({
      data: {
        projectId,
        authorId: req.user.id,
        text: text.trim(),
        imageUrl,
        stage: updateStage,
        progress: parsedProgress
      },
      include: {
        author: {
          select: { id: true, userId: true, name: true, role: true }
        },
        reactions: true,
        comments: true
      }
    });

    // 2. Sync project current stage and progress
    await prisma.project.update({
      where: { id: projectId },
      data: {
        stage: updateStage,
        progress: parsedProgress
      }
    });

    // 3. Notify the client of this project
    if (project.clientId) {
      await prisma.notification.create({
        data: {
          userId: project.clientId,
          message: `${req.user.name} published a new daily update on "${project.name}" (${updateStage} • ${parsedProgress}% complete)`
        }
      });
    }

    res.status(201).json({
      message: 'Daily update published successfully',
      update: {
        ...newUpdate,
        reactionCounts: { '🔥': 0, '👍': 0, '❤️': 0 },
        userReactions: []
      }
    });
  } catch (error) {
    console.error('Create update error:', error);
    res.status(500).json({ error: 'Failed to create update' });
  }
};

module.exports = {
  getUpdatesByProject,
  createUpdate
};
