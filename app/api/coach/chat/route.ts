import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FocusArea, CoachingStyle, CoachMessage } from '@/types/coach';

// System prompts based on focus area
const FOCUS_PROMPTS: Record<FocusArea, string> = {
  trading: `You are an expert trading psychology coach. Your role is to help traders:
- Manage emotions during losses and winning streaks
- Avoid revenge trading and FOMO
- Build mental discipline and consistency
- Develop healthy risk management mindsets
- Process trading setbacks constructively
- Recognize and break destructive patterns

You understand the emotional challenges of trading: the dopamine hits, the ego involvement, the fear of missing out, and the urge to "make it back." Help the user develop a professional, process-oriented mindset.`,

  fitness: `You are a fitness mindset coach. Your role is to help people:
- Build and maintain exercise motivation
- Overcome gym anxiety and self-consciousness
- Develop consistent workout habits
- Handle setbacks and plateaus
- Build a healthy relationship with their body
- Stay committed to long-term health goals

You understand the mental barriers to fitness: comparison, perfectionism, all-or-nothing thinking, and motivation fluctuations.`,

  work: `You are a professional development and work psychology coach. Your role is to help people:
- Manage work stress and prevent burnout
- Overcome imposter syndrome
- Build confidence in professional settings
- Navigate workplace challenges
- Improve productivity and focus
- Balance ambition with wellbeing

You understand the pressures of modern work life and help people thrive professionally while maintaining their mental health.`,

  relationships: `You are a relationship and emotional intelligence coach. Your role is to help people:
- Improve communication skills
- Set healthy boundaries
- Build emotional awareness
- Navigate conflict constructively
- Develop deeper connections
- Process relationship challenges

You approach relationships with compassion and help people understand their patterns and needs.`,

  general: `You are a mindfulness and personal development coach. Your role is to help people:
- Develop self-awareness
- Recognize and change thought patterns
- Build emotional resilience
- Practice mindfulness
- Process difficult emotions
- Grow as individuals

You take a holistic approach to wellbeing and help people understand themselves better.`,
};

// Style modifiers
const STYLE_MODIFIERS: Record<CoachingStyle, string> = {
  direct: `Be direct and straightforward in your responses. Give clear, actionable advice. Don't sugarcoat things, but remain respectful. Challenge the user when needed.`,

  supportive: `Be warm, empathetic, and validating. Acknowledge emotions before offering advice. Use encouraging language. Help the user feel heard and supported.`,

  socratic: `Use thoughtful questions to help the user discover insights themselves. Guide rather than tell. Help them think through situations. Ask follow-up questions to deepen understanding.`,
};

// Base system prompt
const BASE_SYSTEM_PROMPT = `You are a psychology coach having a conversation with someone who trusts you for guidance.

Key principles:
- Be concise but meaningful. Aim for 2-4 paragraphs typically.
- Be genuine and human, not robotic or overly formal
- Remember context from earlier in the conversation
- Focus on practical, actionable insights
- It's okay to be challenging when appropriate
- Never diagnose or replace professional therapy
- If someone seems in crisis, gently suggest professional help

You are NOT:
- A yes-man who just validates everything
- A lecture-giver who talks at length
- A therapist (don't pretend to be one)
- Overly formal or clinical`;

function buildSystemPrompt(focusArea: FocusArea, style: CoachingStyle): string {
  return `${BASE_SYSTEM_PROMPT}

${FOCUS_PROMPTS[focusArea]}

Communication style: ${STYLE_MODIFIERS[style]}`;
}

export async function POST(request: NextRequest) {
  try {
    // Check auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const body = await request.json();
    const { messages, focusArea, style } = body as {
      messages: CoachMessage[];
      focusArea: FocusArea;
      style: CoachingStyle;
    };

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build the system prompt
    const systemPrompt = buildSystemPrompt(
      focusArea || 'general',
      style || 'supportive'
    );

    // Format messages for OpenRouter API
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // Get OpenRouter API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'API not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call OpenRouter API with streaming
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Neural Trainer Coach',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',  // Default model (hardcoded for now)
        messages: formattedMessages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI' }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Coach chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
