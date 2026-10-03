const prisma = require('../prisma');

const getAllProjects = async (req, res) => {
  try {
    const isClient = req.user.role === 'CLIENT';
    const where = isClient ? { clientId: req.user.id } : {};

    const projects = await prisma.project.findMany({
      where,
      include: {
        client: {
          select: { id: true, userId: true, name: true }
        },
        _count: {
          select: { updates: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ projects });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, userId: true, name: true }
        },
        _count: {
          select: { updates: true }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (req.user.role === 'CLIENT' && project.clientId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this project' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, clientId, stage, progress } = req.body;

    if (!name || !clientId) {
      return res.status(400).json({ error: 'Project name and clientId are required' });
    }

    // Verify client exists and is a CLIENT
    const client = await prisma.user.findUnique({
      where: { id: clientId }
    });

    if (!client || client.role !== 'CLIENT') {
      return res.status(400).json({ error: 'Specified client not found or does not have CLIENT role' });
    }

    const validStages = ['Planning', 'In Progress', 'Review', 'Completed'];
    const projectStage = validStages.includes(stage) ? stage : 'Planning';
    const projectProgress = typeof progress === 'number' ? Math.min(100, Math.max(0, progress)) : 0;

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        clientId,
        stage: projectStage,
        progress: projectProgress
      },
      include: {
        client: {
          select: { id: true, userId: true, name: true }
        }
      }
    });

    // Notify client about new project
    await prisma.notification.create({
      data: {
        userId: client.id,
        message: `New project "${project.name}" has been initiated and assigned to your dashboard!`
      }
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await prisma.project.delete({
      where: { id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject
};
