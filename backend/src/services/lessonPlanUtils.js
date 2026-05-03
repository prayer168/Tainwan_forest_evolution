export function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('ChatGPT 回傳格式無法解析為 JSON');
  }
  return JSON.parse(text.slice(start, end + 1));
}

function sumMinutes(flow = []) {
  return flow.reduce((sum, item) => sum + (item.minutes || 0), 0);
}

export function attachConsistency(plan) {
  const actual = sumMinutes(plan.lesson_flow || []);
  const planned = plan?.meta?.duration_minutes || actual;

  return {
    ...plan,
    consistency_report: {
      duration_check: {
        planned_total: planned,
        actual_total: actual,
        is_pass: Math.abs(planned - actual) <= 1
      }
    },
    updated_at: new Date().toISOString()
  };
}
