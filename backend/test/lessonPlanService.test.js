import test from 'node:test';
import assert from 'node:assert/strict';
import { attachConsistency, extractJson } from '../src/services/lessonPlanUtils.js';

test('extractJson 可解析包含雜訊的 JSON 回應', () => {
  const data = extractJson('前置文字 {"a":1,"b":2} 後置文字');
  assert.equal(data.a, 1);
  assert.equal(data.b, 2);
});

test('attachConsistency 會補上 duration_check', () => {
  const plan = {
    meta: { duration_minutes: 45 },
    lesson_flow: [{ minutes: 10 }, { minutes: 35 }]
  };
  const result = attachConsistency(plan);
  assert.equal(result.consistency_report.duration_check.planned_total, 45);
  assert.equal(result.consistency_report.duration_check.actual_total, 45);
  assert.equal(result.consistency_report.duration_check.is_pass, true);
  assert.ok(result.updated_at);
});
