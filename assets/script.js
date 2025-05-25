const round1 = document.querySelectorAll(".round-1 .match");
const round2slots = [["r2m1p1", "r2m1p2"], ["r2m2p1", "r2m2p2"]];
const finalSlots = ["final1", "final2"];

round1.forEach((match, index) => {
  const inputs = match.querySelectorAll("input");
  const winnerDiv = match.querySelector(".winner");

  inputs.forEach(input => input.addEventListener("change", () => {
    const m1 = parseFloat(inputs[1].value);
    const m2 = parseFloat(inputs[3].value);
    const n1 = inputs[0].value;
    const n2 = inputs[2].value;
    if (!isNaN(m1) && !isNaN(m2) && n1 && n2) {
      const winner = m1 > m2 ? n1 : n2;
      winnerDiv.textContent = winner;
      const r2 = winnerDiv.dataset.next;
      const slot = round2slots[r2][index % 2];
      document.getElementById(slot).textContent = winner;
    }
  }));
});

document.querySelectorAll(".round-2 .match").forEach((match, index) => {
  const slots = match.querySelectorAll(".slot");
  const winnerDiv = match.querySelector(".winner");

  slots.forEach(slot => {
    const observer = new MutationObserver(() => {
      const p1 = slots[0].textContent.trim();
      const p2 = slots[1].textContent.trim();
      if (p1 && p2) {
        const winner = Math.random() > 0.5 ? p1 : p2;
        winnerDiv.textContent = winner;
        document.getElementById(finalSlots[index]).textContent = winner;
      }
    });
    observer.observe(slot, { childList: true });
  });
});

document.querySelectorAll(".round-3 .match").forEach(match => {
  const slots = match.querySelectorAll(".slot");
  const winnerDiv = match.querySelector(".winner");

  slots.forEach(slot => {
    const observer = new MutationObserver(() => {
      const p1 = slots[0].textContent.trim();
      const p2 = slots[1].textContent.trim();
      if (p1 && p2) {
        winnerDiv.textContent = Math.random() > 0.5 ? p1 : p2;
      }
    });
    observer.observe(slot, { childList: true });
  });
});
