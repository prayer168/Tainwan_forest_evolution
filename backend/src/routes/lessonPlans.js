import crypto from 'node:crypto';
import express from 'express';
import { supabase } from '../config/supabase.js';
import { buildValidator } from '../middleware/validate.js';
import generateSchema from '../schemas/generate-request.schema.json' with { type: 'json' };
import enhanceSchema from '../schemas/enhance-request.schema.json' with { type: 'json' };
import {
  buildLanguageCheck,
  buildQualityReport,
  enhanceLessonPlan,
  generateLessonPlan
} from '../services/lessonPlanService.js';

const router = express.Router();

const makeId = () => `lp_${Date.now()}_${crypto.randomInt(1000, 10000)}`;

router.post('/generate', buildValidator(generateSchema), async (req, res) => {
  try {
    const { generation_mode, locale, script, input } = req.body;
    const lessonPlan = generateLessonPlan(input);
    const qualityReport = buildQualityReport(lessonPlan);
    const languageCheck = buildLanguageCheck(lessonPlan);
    const lesson_plan_id = makeId();

    const { error } = await supabase.from('lesson_plans').insert({
      lesson_plan_id,
      title: input.topic,
      stage: input.stage,
      grade: input.grade,
      subject: input.subject,
      topic: input.topic,
      duration_minutes: input.duration_minutes,
      generation_mode,
      locale,
      script,
      status: 'completed',
      lesson_plan_json: lessonPlan,
      quality_report_json: qualityReport,
      language_check_json: languageCheck
    });

    if (error) return res.status(500).json({ message: '寫入 Supabase 失敗', detail: error.message });

    return res.json({
      lesson_plan_id,
      status: 'completed',
      locale,
      script,
      lesson_plan: lessonPlan,
      quality_report: qualityReport,
      language_check: languageCheck
    });
  } catch (err) {
    return res.status(500).json({ message: '伺服器錯誤', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('lesson_plans')
    .select('lesson_plan_id,status,locale,script,lesson_plan_json,quality_report_json,language_check_json')
    .eq('lesson_plan_id', req.params.id)
    .maybeSingle();

  if (error) return res.status(500).json({ message: '查詢 Supabase 失敗', detail: error.message });
  if (!data) return res.status(404).json({ message: '找不到教案' });

  return res.json({
    lesson_plan_id: data.lesson_plan_id,
    status: data.status,
    locale: data.locale,
    script: data.script,
    lesson_plan: data.lesson_plan_json,
    quality_report: data.quality_report_json,
    language_check: data.language_check_json
  });
});

router.post('/:id/enhance', buildValidator(enhanceSchema), async (req, res) => {
  const { data, error } = await supabase
    .from('lesson_plans')
    .select('lesson_plan_id,status,locale,script,lesson_plan_json')
    .eq('lesson_plan_id', req.params.id)
    .maybeSingle();

  if (error) return res.status(500).json({ message: '查詢 Supabase 失敗', detail: error.message });
  if (!data) return res.status(404).json({ message: '找不到教案' });

  const nextPlan = enhanceLessonPlan(data.lesson_plan_json, req.body.mode, req.body);
  const qualityReport = buildQualityReport(nextPlan);
  const languageCheck = buildLanguageCheck(nextPlan);

  const { error: updateError } = await supabase
    .from('lesson_plans')
    .update({
      lesson_plan_json: nextPlan,
      quality_report_json: qualityReport,
      language_check_json: languageCheck
    })
    .eq('lesson_plan_id', req.params.id);

  if (updateError) return res.status(500).json({ message: '更新 Supabase 失敗', detail: updateError.message });

  return res.json({
    lesson_plan_id: data.lesson_plan_id,
    status: data.status,
    locale: data.locale,
    script: data.script,
    lesson_plan: nextPlan,
    quality_report: qualityReport,
    language_check: languageCheck
  });
});

export default router;
