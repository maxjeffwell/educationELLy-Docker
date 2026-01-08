import fetch from 'node-fetch';

// Shared AI Gateway URL (deployed on NAS)
const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL || 'http://shared-ai-gateway:8002';

/**
 * POST /ai/study-recommendations
 * Generate personalized study recommendations for a student
 *
 * Body: {
 *   gradeLevel: number,
 *   compositeLevel: string,
 *   ellStatus: string,
 *   nativeLanguage: string
 * }
 */
export async function generateStudyRecommendations(req, res) {
  try {
    const { gradeLevel, compositeLevel, ellStatus, nativeLanguage } = req.body;

    if (!gradeLevel) {
      return res.status(400).json({ error: 'Grade level is required' });
    }

    const prompt = `Generate 3 study recommendations for an English Language Learner:
Grade Level: ${gradeLevel}
Proficiency: ${compositeLevel || 'Not specified'}
ELL Status: ${ellStatus || 'Not specified'}
Native Language: ${nativeLanguage || 'Not specified'}

Provide specific, actionable recommendations for improving English language skills.`;

    const response = await fetch(`${AI_GATEWAY_URL}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        app: 'education',
        maxTokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();

    return res.json({
      success: true,
      recommendations: data.response,
      student: {
        gradeLevel,
        compositeLevel,
        ellStatus
      }
    });

  } catch (error) {
    console.error('Study recommendations error:', error);
    return res.status(500).json({
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
}

/**
 * POST /ai/flashcard
 * Generate educational flashcard
 *
 * Body: {
 *   topic: string,
 *   content: string,
 *   gradeLevel?: number
 * }
 */
export async function generateFlashcard(req, res) {
  try {
    const { topic, content, gradeLevel } = req.body;

    if (!topic || !content) {
      return res.status(400).json({ error: 'Topic and content are required' });
    }

    const response = await fetch(`${AI_GATEWAY_URL}/api/ai/flashcard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: gradeLevel ? `${topic} (Grade ${gradeLevel})` : topic,
        content
      })
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();

    return res.json({
      success: true,
      flashcard: {
        topic: data.topic,
        question: data.question,
        answer: data.answer
      },
      gradeLevel
    });

  } catch (error) {
    console.error('Flashcard generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate flashcard',
      message: error.message
    });
  }
}

/**
 * POST /ai/quiz
 * Generate quiz questions for a topic
 *
 * Body: {
 *   topic: string,
 *   difficulty: 'easy' | 'medium' | 'hard',
 *   count: number,
 *   gradeLevel?: number
 * }
 */
export async function generateQuiz(req, res) {
  try {
    const { topic, difficulty = 'medium', count = 3, gradeLevel } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const fullTopic = gradeLevel ? `${topic} for Grade ${gradeLevel}` : topic;

    const response = await fetch(`${AI_GATEWAY_URL}/api/ai/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: fullTopic,
        difficulty,
        count
      })
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();

    return res.json({
      success: true,
      topic,
      difficulty,
      gradeLevel,
      count: data.count,
      questions: data.questions
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate quiz',
      message: error.message
    });
  }
}

/**
 * POST /ai/chat
 * Multi-turn conversational chat for educational help
 *
 * Body: {
 *   messages: [{ role: 'user' | 'assistant', content: string }],
 *   context: {
 *     userRole?: 'teacher' | 'student',
 *     gradeLevel?: number,
 *     ellStatus?: string,
 *     nativeLanguage?: string,
 *     studentId?: string
 *   }
 * }
 */
export async function chat(req, res) {
  try {
    const { messages, context = {} } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Default context for educationELLy
    const chatContext = {
      app: 'educationelly',
      ...context
    };

    const response = await fetch(`${AI_GATEWAY_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        context: chatContext,
        maxTokens: 512,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();

    return res.json({
      success: true,
      response: data.response,
      model: data.model,
      backend: data.backend
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: 'Chat failed',
      message: error.message
    });
  }
}

/**
 * GET /ai/health
 * Check AI Gateway health
 */
export async function checkAIHealth(req, res) {
  try {
    const response = await fetch(`${AI_GATEWAY_URL}/health`);
    const data = await response.json();

    return res.json({
      success: true,
      gateway: data
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      error: 'AI Gateway unavailable',
      message: error.message
    });
  }
}
