const bracket = document.getElementById("bracket");

const roundConfig = [8, 4, 2, 1, 1];
const rounds = [];

function createMatch(round, index) {
    const container = document.createElement("div");
    container.className = "match-box mb-4";

    const p1Input = document.createElement("input");
    p1Input.placeholder = "Player 1";
    const m1Input = document.createElement("input");
    m1Input.placeholder = "Mult 1";
    
    const p2Input = document.createElement("input");
    p2Input.placeholder = "Player 2";
    const m2Input = document.createElement("input");
    m2Input.placeholder = "Mult 2";
    
    const resultInput = document.createElement("input");
    resultInput.placeholder = "Winner";
    resultInput.disabled = true;
    
    [p1Input, m1Input, p2Input, m2Input].forEach(input => {
        input.addEventListener("change", () => {
            const m1 = parseFloat(m1Input.value);
            const m2 = parseFloat(m2Input.value);
            if (!isNaN(m1) && !isNaN(m2)) {
                resultInput.value = m1 > m2 ? p1Input.value : p2Input.value;
                if (round + 1 < roundConfig.length) {
                    const nextMatch = rounds[round + 1][Math.floor(index / 2)];
                    const pos = index % 2 === 0 ? 0 : 1;
                    nextMatch.players[pos].value = resultInput.value;
                }
            }
        });
    });

    container.appendChild(p1Input);
    container.appendChild(m1Input);
    container.appendChild(p2Input);
    container.appendChild(m2Input);
    container.appendChild(resultInput);
    
    return { container, players: [p1Input, p2Input] };
}

roundConfig.forEach((matches, round) => {
    const col = document.createElement("div");
    col.className = "flex flex-col items-center";
    const matchList = [];
    for (let i = 0; i < matches; i++) {
        const match = createMatch(round, i);
        col.appendChild(match.container);
        matchList.push(match);
    }
    bracket.appendChild(col);
    rounds.push(matchList);
});
