const ragService = require('../services/ragService');

/**
 * Handle incoming RAG chat question
 * POST /api/rag/chat
 */
exports.chat = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid message string is required.'
      });
    }

    const result = await ragService.query(message.trim(), history || []);

    res.status(200).json({
      success: true,
      data: {
        query: message.trim(),
        answer: result.answer,
        targetLocation: result.targetLocation || null,
        sources: result.sources || [],
        suggestedActions: result.suggestedActions || [],
        suggestedFollowUps: result.suggestedFollowUps || []
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get curated suggested prompt chips
 * GET /api/rag/suggested
 */
exports.getSuggestedQuestions = async (req, res, next) => {
  try {
    const prompts = ragService.getSuggestedPrompts();
    res.status(200).json({
      success: true,
      data: prompts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get knowledge base indexing stats
 * GET /api/rag/stats
 */
exports.getStats = async (req, res, next) => {
  try {
    const stats = ragService.getStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
