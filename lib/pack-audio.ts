// Tiny synthesized feedback, no audio files or network requests.
export function packSound(
  context: AudioContext,
  kind: "cut" | "swipe" | "rare",
) {
  const now = context.currentTime;
  const gain = context.createGain();
  gain.connect(context.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(
    kind === "rare" ? 0.055 : 0.035,
    now + 0.015,
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + (kind === "rare" ? 0.75 : 0.2),
  );
  if (kind === "cut" || kind === "swipe") {
    const buffer = context.createBuffer(
      1,
      Math.floor(context.sampleRate * 0.22),
      context.sampleRate,
    );
    const data = buffer.getChannelData(0);
    let seed = 17;
    for (let i = 0; i < data.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      data[i] = (seed / 4294967296) * 2 - 1;
    }
    const source = context.createBufferSource();
    source.buffer = buffer;
    const filter = context.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = kind === "cut" ? 3200 : 1100;
    source.connect(filter);
    filter.connect(gain);
    source.start();
    source.stop(now + 0.23);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  } else {
    [660, 880, 1320].forEach((frequency, i) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      oscillator.start(now + i * 0.065);
      oscillator.stop(now + 0.8);
      oscillator.onended = () => oscillator.disconnect();
    });
    setTimeout(() => gain.disconnect(), 1000);
  }
}
