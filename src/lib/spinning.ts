type SpinTick = {
  delay: number;
  index: number;
};

export function generateSpinTicks(itemCount: number, totalMs = 5000): SpinTick[] {
  const ticks: SpinTick[] = [];
  let elapsed = 0;
  let interval = 60;
  while (elapsed < totalMs) {
    const index = Math.floor(Math.random() * itemCount);
    ticks.push({ delay: elapsed, index });
    elapsed += interval;
    const ratio = elapsed / totalMs;
    if (ratio > 0.8) interval = 480;
    else if (ratio > 0.6) interval = 240;
    else if (ratio > 0.4) interval = 120;
    else interval = 60;
  }
  return ticks;
}

export function pickFinalIndex(itemCount: number): number {
  return Math.floor(Math.random() * itemCount);
}
