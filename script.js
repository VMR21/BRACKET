document.addEventListener('DOMContentLoaded', () => {
    const decideWinnerButtons = document.querySelectorAll('.decide-winner-btn');

    const getMatchElement = (element) => element.closest('.match');

    decideWinnerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const match = getMatchElement(button);
            const matchId = match.id;
            const nextMatchId = match.dataset.nextMatch;
            const nextSlot = match.dataset.nextSlot;

            const p1Name = match.querySelector('.player-input[data-player-id="1"]');
            const p1Mult = match.querySelector('.multiplier-input[data-player-id="1"]');
            const p2Name = match.querySelector('.player-input[data-player-id="2"]');
            const p2Mult = match.querySelector('.multiplier-input[data-player-id="2"]');

            if (!p1Name || !p2Name || !p1Mult || !p2Mult || !p1Name.value || !p2Name.value || !p1Mult.value || !p2Mult.value) {
                alert('Please enter both names and multipliers.');
                return;
            }

            const m1 = parseFloat(p1Mult.value);
            const m2 = parseFloat(p2Mult.value);
            let winnerName = '';

            if (m1 > m2 || m1 === m2) {
                winnerName = p1Name.value;
            } else {
                winnerName = p2Name.value;
            }

            // Set winner name to correct target based on current match
            if (matchId === 'match-R1A') {
                document.querySelector('input[placeholder="Winner R1A/B"][data-player-id="1"]').value = winnerName;
            } else if (matchId === 'match-R1B') {
                document.querySelector('input[placeholder="Winner R1A/B"][data-player-id="2"]').value = winnerName;
            } else if (matchId === 'match-R1C') {
                document.querySelector('input[placeholder="Winner R1C/D"][data-player-id="1"]').value = winnerName;
            } else if (matchId === 'match-R1D') {
                document.querySelector('input[placeholder="Winner R1C/D"][data-player-id="2"]').value = winnerName;
            } else if (matchId === 'match-R2A') {
                document.querySelector('input[placeholder="Winner R2A/B"][data-player-id="1"]').value = winnerName;
            } else if (matchId === 'match-R2B') {
                document.querySelector('input[placeholder="Winner R2A/B"][data-player-id="2"]').value = winnerName;
            } else if (matchId === 'match-R3A') {
                document.querySelector('input.final-winner-input[placeholder="Tournament Champion"]').value = winnerName;
            }

            // Lock current match fields
            match.querySelectorAll('input').forEach(input => {
                input.readOnly = true;
                input.style.pointerEvents = 'none';
            });
            button.disabled = true;
        });
    });
});
