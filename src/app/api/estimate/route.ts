import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are a calorie estimation assistant.
When given a food description, return ONLY a valid JSON object with this exact structure:
{"items":[{"name":"<food name>","calories":<integer>}],"total_calories":<integer>}

Rules:
- Always estimate even for vague or messy inputs. Never refuse.
- Split multiple foods into separate items when possible.
- Calories must be positive integers.
- total_calories must equal the sum of all items[].calories.
- Return ONLY the JSON object. No prose, no markdown, no code fences.
- If you cannot identify a food, make a reasonable mid-range estimate.
- Normalize food names (e.g. "chkn brto" → "Chicken Burrito").`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = typeof body?.input === 'string' ? body.input.trim().slice(0, 500) : '';

    if (!input) {
      return NextResponse.json({ error: 'input required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: input }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 512,
      },
    });

    const text = result.response.text();
    const data = JSON.parse(text) as {
      items: { name: string; calories: number }[];
      total_calories: number;
    };

    const total_calories = data.items.reduce((sum, item) => sum + (item.calories || 0), 0);

    return NextResponse.json({ items: data.items, total_calories });
  } catch (err) {
    console.error('[estimate]', err);
    return NextResponse.json({ error: 'estimation failed' }, { status: 500 });
  }
}
