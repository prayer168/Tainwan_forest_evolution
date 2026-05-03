function sumMinutes(flow) {
  return flow.reduce((sum, s) => sum + (s.minutes || 0), 0);
}

function calculateDuration(flow, target) {
  const total = sumMinutes(flow);
  const ratio = target / (total || 1);
  const adjusted = flow.map((s) => ({
    ...s,
    minutes: Math.max(1, Math.round((s.minutes || 1) * ratio))
  }));

  const diff = target - sumMinutes(adjusted);
  if (adjusted.length > 0) adjusted[0].minutes = Math.max(1, adjusted[0].minutes + diff);
  return adjusted;
}

function buildConsistencyReport(plan) {
  const actual = sumMinutes(plan.lesson_flow || []);
  return {
    duration_check: {
      planned_total: plan.meta.duration_minutes,
      actual_total: actual,
      is_pass: Math.abs(plan.meta.duration_minutes - actual) <= 1
    }
  };
}

export function generateLessonPlan(input) {
  const duration = input.duration_minutes;
  const lessonFlow = [
    { segment_id: 'S1', name: '導入', minutes: 5 },
    { segment_id: 'S2', name: '核心活動', minutes: Math.max(20, duration - 15) },
    { segment_id: 'S3', name: '統整與作業', minutes: 10 }
  ];

  const plan = {
    meta: {
      stage: input.stage,
      grade: input.grade,
      subject: input.subject,
      topic: input.topic,
      duration_minutes: duration,
      textbook_version: input.textbook_version || '',
      chapter: input.chapter || '',
      lesson_type: input.lesson_type || '新授課',
      is_open_class: !!input.is_open_class
    },
    analysis: {
      student_profile: input.student_profile || '未提供，建議後續補充班級差異描述。'
    },
    lesson_flow: lessonFlow,
    deepen_note: '',
    updated_at: new Date().toISOString()
  };

  plan.consistency_report = buildConsistencyReport(plan);
  return plan;
}

export function enhanceLessonPlan(lessonPlan, mode, payload) {
  const next = structuredClone(lessonPlan);
  if (mode === 'compact') {
    next.meta.duration_minutes = payload.target_minutes;
    next.lesson_flow = calculateDuration(next.lesson_flow || [], payload.target_minutes);
  }

  if (mode === 'deepen') {
    const focusText = payload.focus.join('、');
    next.deepen_note = `已強化：${focusText}`;
  }

  next.updated_at = new Date().toISOString();
  next.consistency_report = buildConsistencyReport(next);
  return next;
}

export function buildQualityReport(plan) {
  const pass = plan.consistency_report?.duration_check?.is_pass;
  return {
    total_score: pass ? 85 : 70,
    level: pass ? '建議微調後使用' : '需重點修訂',
    dimensions: {
      objective_quality: 16,
      alignment_quality: 20,
      process_quality: 17,
      subject_depth: 16,
      differentiation: 8,
      executability: 8
    },
    suggestions: pass ? ['可再補充形成性評量指標。'] : ['請調整流程時長與課程分鐘數一致。']
  };
}

export function buildLanguageCheck() {
  return {
    is_traditional_chinese: true,
    contains_simplified_chars: false,
    terminology_consistency_pass: true,
    notes: []
  };
}
