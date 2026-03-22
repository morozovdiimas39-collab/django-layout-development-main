import { NextRequest, NextResponse } from 'next/server';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface NoteAnalysis {
  action: 'create_task' | 'change_status' | 'both' | 'none';
  task?: { text: string; deadline: string }; // ISO date
  status?: string;
  summary?: string; // короткое объяснение что Gemini понял
}

const PROMPT = (note: string) => `
Ты — ассистент менеджера CRM. Проанализируй заметку и верни JSON.

Статусы воронки:
- "new" — новый лид
- "thinking" — думает / не решил
- "trial" — договорились на пробное занятие
- "enrolled" — записался / оплатил курс
- "called_target" — целевой, но пока не записался
- "irrelevant" — нецелевой

Правила:
1. Если упоминается дата/время для звонка, встречи, напоминания — action: "create_task", заполни task.deadline в ISO 8601 (год 2025 если не указан, время 10:00 если не указано).
2. Если ясно что клиент записался / оплатил / подтвердил участие — action: "change_status", status: "enrolled".
3. Если клиент согласился на пробное — action: "change_status", status: "trial".
4. Если клиент думает / перезвонит сам / взял паузу — action: "change_status", status: "thinking".
5. Если оба условия — action: "both", заполни и task, и status.
6. Иначе — action: "none".

Текущая дата: ${new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}.

Заметка: "${note}"

Верни ТОЛЬКО валидный JSON без markdown, без пояснений:
{
  "action": "...",
  "task": { "text": "...", "deadline": "..." },
  "status": "...",
  "summary": "..."
}
`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ action: 'none', summary: 'GEMINI_API_KEY не задан' } as NoteAnalysis);
  }

  const { note } = await req.json();
  if (!note?.trim()) {
    return NextResponse.json({ action: 'none' } as NoteAnalysis);
  }

  try {
    const resp = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT(note) }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
      }),
    });

    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed: NoteAnalysis = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ action: 'none', summary: 'Ошибка анализа' } as NoteAnalysis);
  }
}
