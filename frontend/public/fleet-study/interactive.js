import { explainPlacement } from "./scheduler.js";

for (const group of document.querySelectorAll("[data-pane-group]")) {
  const buttons = [...group.querySelectorAll("[data-pane]")];
  const panels = buttons.map((button) => document.getElementById(button.dataset.pane));
  if (!panels.every(Boolean)) continue;

  const select = (index) => {
    buttons.forEach((button, i) => {
      button.setAttribute("aria-pressed", String(i === index));
      panels[i].hidden = i !== index;
    });
  };

  buttons.forEach((button, i) => button.addEventListener("click", () => select(i)));
  select(0);
  group.querySelector("[data-pane-controls]").hidden = false;
}

const form = document.getElementById("placement-form");
const results = document.getElementById("placement-results");
const outcome = document.getElementById("placement-outcome");

if (form && results && outcome) {
  const render = () => {
    const { platform, ram, policy, offline } = form.elements;
    const { candidates, rejected } = explainPlacement({
      platform: platform.value,
      ram: Number(ram.value),
      policy: policy.value,
      macOffline: offline.checked,
    });

    outcome.textContent = candidates.length
      ? `${candidates[0].name} selected · ${candidates.length} of 3 nodes eligible`
      : "No eligible node. The workload stays unplaced.";

    const cards = [...candidates, ...rejected].map((node, index) => {
      const card = document.createElement("article");
      const status = node.reason ? "rejected" : index === 0 ? "selected" : "eligible";
      card.className = "node-result";
      card.dataset.status = status;
      const label = document.createElement("span");
      label.className = "result-status";
      label.textContent = status;
      const name = document.createElement("h3");
      name.textContent = node.name;
      const meta = document.createElement("p");
      meta.className = "node-meta";
      meta.textContent = `${node.platform} · ${node.free} MiB free`;
      const info = document.createElement("p");
      info.textContent = node.reason || `Rank ${index + 1} · score ${node.score.toFixed(3)}`;
      card.append(label, name, meta, info);
      if (!node.reason) {
        const breakdown = document.createElement("small");
        breakdown.textContent = `Headroom ${node.headroom.toFixed(2)} · reliability ${node.reliability.toFixed(2)} · idle ${node.load.toFixed(2)}`;
        card.append(breakdown);
      }
      return card;
    });
    results.replaceChildren(...cards);
  };

  form.addEventListener("change", render);
  form.addEventListener("reset", () => queueMicrotask(render));
  form.hidden = false;
  render();
}
