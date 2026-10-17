export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producers = 2;
const crew = 6;
const productionPerProducer = 3;

interface ShiftResult {
  producers: number;
  crew: number;
  production: number;
  consumption: number;
  balance: number;
}

interface BarRenderInfo {
  label: string;
  value: number;
  color: string;
}

function calculateShift(producersCount: number): ShiftResult {
  const production = producersCount * productionPerProducer;
  const consumption = crew;
  const balance = production - consumption;
  return {
    producers: producersCount,
    crew,
    production,
    consumption,
    balance,
  };
}

function updateVisuals() {
  const result = calculateShift(producers);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateCrewSquares(result.producers);

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${result.producers} / ${result.crew}`, 18, 76);

  const barRenderInfos: BarRenderInfo[] = [
    { label: "Production", value: result.production, color: "#27766b" },
    { label: "Consumption", value: result.consumption, color: "#a44d23" },
  ];

  barRenderInfos.forEach((barInfo, i) => {
    const labelY = 102 + i * 52;
    const barY = 110 + i * 52;

    // label
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${barInfo.label}: ${barInfo.value}`, 18, labelY);

    // bar
    ctx.fillStyle = barInfo.color;
    ctx.fillRect(18, barY, barInfo.value * 14, 20);
  });

  readout.textContent =
    `Assigned: ${result.producers}/${result.crew} · Production: ${result.production} · Consumption: ${result.consumption} · Balance: ${
      result.balance > 0 ? "+" : ""
    }${result.balance}`;
}

function updateCrewSquares(producers: number) {
  for (let i = 0; i < crew; i++) {
    ctx.fillStyle = i < producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  updateVisuals();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(crew, producers + 1);
  updateVisuals();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    updateVisuals();
  };
updateVisuals();
