const speciesProfiles = {
  pioneer: { label: "先驅樹種（如山黃麻）", color: "#ff8f66" },
  mid: { label: "中期樹種（如楠櫧類）", color: "#4e79a7" },
  climax: { label: "極盛相樹種（如紅檜、台灣扁柏）", color: "#59a14f" },
  understory: { label: "下木層與灌叢", color: "#9c6ad6" },
};

const elevationParams = {
  low: { climaxBoost: 0.85, pioneerDecay: 0.9 },
  mid: { climaxBoost: 1, pioneerDecay: 1 },
  high: { climaxBoost: 1.2, pioneerDecay: 1.1 },
};

const disturbanceParams = {
  low: { pioneerPulse: 12, recoveryDelay: 12 },
  medium: { pioneerPulse: 24, recoveryDelay: 24 },
  high: { pioneerPulse: 38, recoveryDelay: 40 },
};

const canvas = document.getElementById("compositionChart");
const ctx = canvas.getContext("2d");
const elevationEl = document.getElementById("elevation");
const disturbanceEl = document.getElementById("disturbance");
const yearRangeEl = document.getElementById("yearRange");
const yearLabelEl = document.getElementById("yearLabel");
const insightListEl = document.getElementById("insightList");
const legendEl = document.getElementById("legend");
const playBtn = document.getElementById("playBtn");

let playing = false;
let playTimer = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function successionAt(year, elevation, disturbance) {
  const ep = elevationParams[elevation];
  const dp = disturbanceParams[disturbance];

  const pioneer = clamp(
    66 * Math.exp(-year / (32 * ep.pioneerDecay)) + dp.pioneerPulse * Math.exp(-year / 10),
    4,
    82,
  );

  const mid = clamp(65 / (1 + Math.exp(-(year - (24 + dp.recoveryDelay / 3)) / 13)) - 8, 5, 58);

  const climax = clamp(
    (58 / (1 + Math.exp(-(year - (62 + dp.recoveryDelay)) / 19))) * ep.climaxBoost,
    2,
    68,
  );

  const totalMain = pioneer + mid + climax;
  const understory = clamp(100 - totalMain, 5, 25);

  const normalizeFactor = 100 / (pioneer + mid + climax + understory);

  return {
    pioneer: pioneer * normalizeFactor,
    mid: mid * normalizeFactor,
    climax: climax * normalizeFactor,
    understory: understory * normalizeFactor,
  };
}

function generateSeries(maxYear, elevation, disturbance) {
  const points = [];
  for (let y = 1; y <= maxYear; y += 2) {
    points.push({ year: y, ...successionAt(y, elevation, disturbance) });
  }
  return points;
}

function drawAxes(width, height, padding) {
  ctx.strokeStyle = "#446f5a";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();

  ctx.fillStyle = "#315646";
  ctx.font = "12px sans-serif";

  for (let p = 0; p <= 100; p += 20) {
    const y = height - padding.bottom - ((height - padding.top - padding.bottom) * p) / 100;
    ctx.fillText(`${p}%`, 8, y + 4);

    ctx.strokeStyle = "#e3f2e733";
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }
}

function drawSeries(series, key, color, width, height, padding, maxYear) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4;
  ctx.beginPath();

  series.forEach((point, index) => {
    const x =
      padding.left +
      ((width - padding.left - padding.right) * (point.year - 1)) /
        Math.max(1, maxYear - 1);
    const y =
      height -
      padding.bottom -
      ((height - padding.top - padding.bottom) * point[key]) / 100;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

function updateInsights(current, year, elevation, disturbance) {
  const elevationText = {
    low: "低海拔",
    mid: "中海拔",
    high: "高海拔",
  }[elevation];

  const disturbanceText = {
    low: "低干擾",
    medium: "中干擾",
    high: "高干擾",
  }[disturbance];

  const dominant = Object.entries(current)
    .sort((a, b) => b[1] - a[1])[0][0];
  const dominantLabel = speciesProfiles[dominant].label;

  insightListEl.innerHTML = `
    <li>在 ${elevationText}、${disturbanceText} 情境下，第 ${year} 年以「${dominantLabel}」為優勢，約 ${current[dominant].toFixed(1)}%。</li>
    <li>先驅樹種占比 ${current.pioneer.toFixed(1)}%，顯示早期恢復痕跡${
    current.pioneer > 35 ? "仍明顯" : "已逐步淡化"
  }。</li>
    <li>極盛相樹種占比 ${current.climax.toFixed(1)}%，${
    current.climax > 35 ? "代表林分趨於穩定成熟" : "表示仍在向成熟林過渡"
  }。</li>
  `;
}

function renderLegend() {
  legendEl.innerHTML = "";
  Object.values(speciesProfiles).forEach((profile) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `<span class="swatch" style="background:${profile.color}"></span>${profile.label}`;
    legendEl.appendChild(item);
  });
}

function render() {
  const elevation = elevationEl.value;
  const disturbance = disturbanceEl.value;
  const maxYear = Number(yearRangeEl.value);
  yearLabelEl.textContent = String(maxYear);

  const width = canvas.width;
  const height = canvas.height;
  const padding = { left: 52, right: 24, top: 20, bottom: 38 };

  const series = generateSeries(maxYear, elevation, disturbance);

  ctx.clearRect(0, 0, width, height);
  drawAxes(width, height, padding);

  Object.entries(speciesProfiles).forEach(([key, profile]) => {
    drawSeries(series, key, profile.color, width, height, padding, maxYear);
  });

  ctx.fillStyle = "#315646";
  ctx.font = "12px sans-serif";
  ctx.fillText("演替年數", width / 2 - 20, height - 10);

  const current = successionAt(maxYear, elevation, disturbance);
  updateInsights(current, maxYear, elevation, disturbance);
}

[elevationEl, disturbanceEl, yearRangeEl].forEach((el) => {
  el.addEventListener("input", render);
});

playBtn.addEventListener("click", () => {
  if (playing) {
    clearInterval(playTimer);
    playBtn.textContent = "自動播放演替";
    playing = false;
    return;
  }

  playBtn.textContent = "暫停播放";
  playing = true;
  playTimer = setInterval(() => {
    const next = Number(yearRangeEl.value) >= 200 ? 1 : Number(yearRangeEl.value) + 1;
    yearRangeEl.value = String(next);
    render();
  }, 70);
});

renderLegend();
render();
