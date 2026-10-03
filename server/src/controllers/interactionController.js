const prisma = require('../prisma');

const toggleReaction = async (req, res) => {
  try {
    const { id: updateId } = req.params;
    const { emoji } = req.body;

    const validEmojis = ['🔥', '👍', '❤️'];
    if (!validEmojis.includes(emoji)) {
      return res.status(400).json({ error: 'Valid emojis are 🔥, 👍, ❤️' });
    }

    const update = await prisma.update.findUnique({
      where: { id: updateId },
      include: {
        project: true
      }
    });

    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }

    // Role check for client
    if (req.user.role === 'CLIENT' && update.project.clientId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    // Check if reaction exists
    const existing = await prisma.reaction.findUnique({
      where: {
        updateId_userId_emoji: {
          updateId,
          userId: req.user.id,
          emoji
        }
      }
    });

    let action = '';
    if (existing) {
      await prisma.reaction.delete({
        where: { id: existing.id }
      });
      action = 'removed';
    } else {
      await prisma.reaction.create({
        data: {
          updateId,
          userId: req.user.id,
          emoji
        }
      });
      action = 'added';
    }

    // Return latest counts & user reactions for this update
    const allReactions = await prisma.reaction.findMany({
      where: { updateId }
    });

    const reactionCounts = { '🔥': 0, '👍': 0, '❤️': 0 };
    const userReactions = [];

    allReactions.forEach((r) => {
      if (reactionCounts[r.emoji] !== undefined) {
        reactionCounts[r.emoji]++;
      }
      if (r.userId === req.user.id) {
        userReactions.push(r.emoji);
      }
    });

    res.json({
      action,
      emoji,
      reactionCounts,
      userReactions
    });
  } catch (error) {
    console.error('Toggle reaction error:', error);
    res.status(500).json({ error: 'Failed to toggle reaction' });
  }
};

const addComment = async (req, res) => {
  try {
    const { id: updateId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const update = await prisma.update.findUnique({
      where: { id: updateId },
      include: {
        project: true,
        author: true
      }
    });

    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }

    if (req.user.role === 'CLIENT' && update.project.clientId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    const comment = await prisma.comment.create({
      data: {
        updateId,
        userId: req.user.id,
        text: text.trim()
      },
      include: {
        user: {
          select: { id: true, userId: true, name: true, role: true }
        }
      }
    });

    // Notify team/author if client comments
    if (req.user.role === 'CLIENT') {
      // Notify update author
      if (update.authorId && update.authorId !== req.user.id) {
        await prisma.notification.create({
          data: {
            userId: update.authorId,
            message: `Client ${req.user.name} commented on "${update.project.name}": "${text.trim().slice(0, 50)}${text.length > 50 ? '...' : ''}"`
          }
        });
      }
    }

    res.status(201).json({
      message: 'Comment posted',
      comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to post comment' });
  }
};

module.exports = {
  toggleReaction,
  addComment
};
