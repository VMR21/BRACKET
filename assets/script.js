document.querySelectorAll('.round-1 .match').forEach((match, index) => {
  const inputs = match.querySelectorAll('input');
  inputs.forEach(input => input.addEventListener('change', () => {
    const m1 = parseFloat(inputs[1].value);
    const m2 = parseFloat(inputs[3].value);
    if (!isNaN(m1) && !isNaN(m2)) {
      const winner = m1 > m2 ? inputs[0].value : inputs[2].value;
      inputs[4].value = winner;
      const r2Match = document.querySelectorAll('.round-2 .match')[Math.floor(index / 2)];
      const targetInput = r2Match.querySelectorAll('input')[index % 2];
      targetInput.value = winner;
    }
  }));
});

document.querySelectorAll('.round-2 .match').forEach((match, index) => {
  const inputs = match.querySelectorAll('input');
  inputs.forEach(input => input.addEventListener('change', () => {
    const winner = inputs[0].value || inputs[1].value;
    if (winner) {
      inputs[2].value = winner;
      const finalMatch = document.querySelector('.round-3 .match input:nth-child(' + (index + 1) + ')');
      finalMatch.value = winner;
    }
  }));
});

document.querySelector('.round-3 .match').addEventListener('change', () => {
  const inputs = document.querySelectorAll('.round-3 .match input');
  if (inputs[0].value && inputs[1].value) {
    inputs[2].value = Math.random() > 0.5 ? inputs[0].value : inputs[1].value;
  }
});
