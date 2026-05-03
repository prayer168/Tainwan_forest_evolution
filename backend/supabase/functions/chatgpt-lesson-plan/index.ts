// Supabase Edge Function: chatgpt-lesson-plan
// Deploy: supabase functions deploy chatgpt-lesson-plan
// Secrets: supabase secrets set OPENAI_API_KEY=... OPENAI_MODEL=gpt-4.1-mini

import OpenAI from 'https://esm.sh/openai@4.103.0';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') || 'gpt-4.1-mini';

if (!OPENAI_API_KEY) {
  throw new Error('Supabase Secrets 缺少 OPENAI_API_KEY');
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

function responseJson(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();

    const prompt = `請使用繁體中文輸出教案 JSON，不要 markdown。\n輸入：${JSON.stringify(body)}`;

    const response = await openai.responses.create({
      model: OPENAI_MODEL,
      input: prompt,
      temperature: 0.3
    });

    const output = response.output_text;
    if (!output) return responseJson({ message: 'ChatGPT 無回應' }, 502);

    return responseJson(output);
  } catch (error) {
    return responseJson({ message: 'Edge Function 失敗', detail: String(error) }, 500);
  }
});
