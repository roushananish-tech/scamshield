// Turns raw text + signal spans into render-ready segments. Pure data: the UI
// builds DOM nodes from these with textContent, never innerHTML.

/**
 * @param {string} raw
 * @param {{n:number, spans:[number,number][]}[]} signals
 * @returns {{text:string, ids:number[]}[]} segments whose text joins back to `raw`
 */
export function buildSegments(raw, signals) {
  const marks = [];
  for (const s of signals) {
    for (const [a, b] of s.spans) {
      const start = Math.max(0, Math.min(a, raw.length));
      const end = Math.max(start, Math.min(b, raw.length));
      if (end > start) marks.push({ start, end, n: s.n });
    }
  }
  const cuts = new Set([0, raw.length]);
  for (const m of marks) { cuts.add(m.start); cuts.add(m.end); }
  const points = [...cuts].sort((x, y) => x - y);
  const out = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (b <= a) continue;
    const ids = [...new Set(marks.filter((m) => m.start <= a && m.end >= b).map((m) => m.n))].sort((x, y) => x - y);
    const last = out[out.length - 1];
    if (last && last.ids.join() === ids.join()) last.text += raw.slice(a, b);
    else out.push({ text: raw.slice(a, b), ids });
  }
  return out;
}
