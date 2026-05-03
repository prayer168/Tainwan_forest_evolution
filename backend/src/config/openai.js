import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('缺少 OPENAI_API_KEY，請設定後再啟動服務');
}

export const openai = new OpenAI({ apiKey });
export const openaiModel = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
