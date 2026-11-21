// Teaching fixtures. Capacity is expressed as Docker engine RAM, in MiB.
export const nodes = [
  { id: "pi", name: "Raspberry Pi", platform: "linux/arm64", ramMb: 4096, free: 2048, reliability: 0.5, loadFactor: 0.35 },
  { id: "mac", name: "Apple Silicon Mac", platform: "linux/arm64", ramMb: 8192, free: 6144, reliability: 0.5, loadFactor: 0.20 },
  { id: "vps", name: "x86 VPS", platform: "linux/amd64", ramMb: 4096, free: 3072, reliability: 1, loadFactor: 0.15 },
];

export function explainPlacement({ platform, ram, policy, macOffline }) {
  const candidates = [];
  const rejected = [];
  for (const node of nodes) {
    const result = { id: node.id, name: node.name, platform: node.platform, free: node.free };
    if (macOffline && node.id === "mac") {
      rejected.push({ ...result, reason: "Node is offline. Heartbeats have stopped." });
    } else if (policy === "pinned" && node.id !== "mac") {
      rejected.push({ ...result, reason: "Service is pinned to the Mac that holds its local volume." });
    } else if (platform !== "multi" && platform !== node.platform) {
      rejected.push({ ...result, reason: "Image does not support this platform with emulation disabled." });
    } else if (node.free < ram) {
      rejected.push({ ...result, reason: `Needs ${ram} MiB. The node has ${node.free} MiB free.` });
    } else {
      // Fleet's production weighting, applied to the constraints exposed here.
      const headroom = (node.free - ram) / node.ramMb;
      const reliability = node.reliability;
      const load = 1 - node.loadFactor;
      const score = 0.5 * headroom + 0.3 * reliability + 0.2 * load;
      candidates.push({ ...result, headroom, reliability, load, score: Number(score.toFixed(6)) });
    }
  }
  candidates.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return { candidates, rejected };
}
