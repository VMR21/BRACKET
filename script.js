document.addEventListener('DOMContentLoaded', () => {
    const playerInputs = document.querySelectorAll('.player-input');
    const multiplierInputs = document.querySelectorAll('.multiplier-input');
    const decideWinnerButtons = document.querySelectorAll('.decide-winner-btn');

    const getMatchElement = (element) => element.closest('.match');

    const arePlayerInputsComplete = (matchElement) => {
        const player1NameInput = matchElement.querySelector('.player-input[data-player-id="1"]:not([readonly])');
        const player1MultiplierInput = matchElement.querySelector('.multiplier-input[data-player-id="1"]:not([readonly])');
        const player2NameInput = matchElement.querySelector('.player-input[data-player-id="2"]:not([readonly])');
        const player2MultiplierInput = matchElement.querySelector('.multiplier-input[data-player-id="2"]:not([readonly])');

        if (!player1NameInput || !player2NameInput) return false;

        return (
            player1NameInput.value.trim() !== '' &&
            player2NameInput.value.trim() !== '' &&
            player1MultiplierInput.value.trim() !== '' &&
            player2MultiplierInput.value.trim() !== ''
        );
    };

    const toggleDecideWinnerButton = (matchElement) => {
        const decideBtn = matchElement.querySelector('.decide-winner-btn');
        if (decideBtn && !decideBtn.classList.contains('match-completed')) {
            if (arePlayerInputsComplete(matchElement)) {
                decideBtn.classList.add('active');
            } else {
                decideBtn.classList.remove('active');
            }
        }
    };

    playerInputs.forEach(input => {
        input.addEventListener('input', () => toggleDecideWinnerButton(getMatchElement(input)));
        input.addEventListener('focus', () => input.style.boxShadow = '0 0 10px var(--glow-color)');
        input.addEventListener('blur', () => input.style.boxShadow = '');
    });

    multiplierInputs.forEach(input => {
        input.addEventListener('input', () => toggleDecideWinnerButton(getMatchElement(input)));
        input.addEventListener('focus', () => input.style.boxShadow = '0 0 10px var(--glow-color)');
        input.addEventListener('blur', () => input.style.boxShadow = '');
    });

    decideWinnerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentMatch = getMatchElement(button);
            const matchId = currentMatch.id;

            const player1NameInput = currentMatch.querySelector('.player-input[data-player-id="1"]');
            const player1MultiplierInput = currentMatch.querySelector('.multiplier-input[data-player-id="1"]');
            const player2NameInput = currentMatch.querySelector('.player-input[data-player-id="2"]');
            const player2MultiplierInput = currentMatch.querySelector('.multiplier-input[data-player-id="2"]');

            const player1Name = player1NameInput.value.trim();
            const player1Multiplier = parseFloat(player1MultiplierInput.value);
            const player2Name = player2NameInput.value.trim();
            const player2Multiplier = parseFloat(player2MultiplierInput.value);

            if (!player1Name || isNaN(player1Multiplier) || !player2Name || isNaN(player2Multiplier)) {
                alert('Please enter both names and valid multipliers.');
                return;
            }

            let winnerName = '';
            let winnerMultiplier = 0;
            let winnerPlayerId = '';

            if (player1Multiplier > player2Multiplier) {
                winnerName = player1Name;
                winnerMultiplier = player1Multiplier;
                winnerPlayerId = '1';
            } else if (player2Multiplier > player1Multiplier) {
                winnerName = player2Name;
                winnerMultiplier = player2Multiplier;
                winnerPlayerId = '2';
            } else {
                alert(`It's a tie! ${player1Name} wins by default.`);
                winnerName = player1Name;
                winnerMultiplier = player1Multiplier;
                winnerPlayerId = '1';
            }

            // Highlight winner
            [player1NameInput, player1MultiplierInput, player2NameInput, player2MultiplierInput].forEach(input => input.classList.remove('winner'));
            if (winnerPlayerId === '1') {
                player1NameInput.classList.add('winner');
                player1MultiplierInput.classList.add('winner');
            } else {
                player2NameInput.classList.add('winner');
                player2MultiplierInput.classList.add('winner');
            }

            // Lock current match
            currentMatch.classList.add('completed');
            button.classList.remove('active');
            button.classList.add('match-completed');
            currentMatch.querySelectorAll('input').forEach(i => {
                i.readOnly = true;
                i.style.pointerEvents = 'none';
            });

            const nextMatchId = currentMatch.dataset.nextMatch;
            const nextSlot = currentMatch.dataset.nextSlot;
            const targetLineId = `line-${matchId}-${nextMatchId}-${nextSlot}`;

            if (nextMatchId === 'Winner') {
                const finalWinnerInput = document.querySelector('#match-Winner .final-winner-input');
                if (finalWinnerInput) {
                    finalWinnerInput.value = winnerName;
                    finalWinnerInput.classList.add('winner');
                    finalWinnerInput.style.pointerEvents = 'none';
                }

                const finalLine = document.getElementById(targetLineId);
                if (finalLine) finalLine.classList.add('active');
            } else {
                const targetMatch = document.getElementById(nextMatchId);
                if (targetMatch) {
                    const targetName = targetMatch.querySelector(`.player-input[data-player-id="${nextSlot}"]`);
                    const targetMultiplier = targetMatch.querySelector(`.multiplier-input[data-player-id="${nextSlot}"]`);

                    if (targetName) {
                        targetName.value = winnerName;
                        targetName.readOnly = false;
                        targetName.style.pointerEvents = 'auto';
                    }

                    if (targetMultiplier) {
                        targetMultiplier.value = winnerMultiplier;
                        targetMultiplier.readOnly = false;
                        targetMultiplier.style.pointerEvents = 'auto';
                    }

                    const line = document.getElementById(targetLineId);
                    if (line) line.classList.add('active');

                    toggleDecideWinnerButton(targetMatch);
                }
            }
        });
    });

    document.querySelectorAll('.match').forEach(match => toggleDecideWinnerButton(match));

    // Animations
    const initialAnimateMatches = () => {
        const matches = document.querySelectorAll('.match');
        matches.forEach((match, index) => {
            match.style.animationDelay = `${index * 0.08}s`;
            match.style.opacity = 0;
            match.style.transform = 'translateY(20px)';
            match.style.animation = 'matchFadeIn 0.7s forwards ease-out';
        });
    };

    if (!document.querySelector('style[data-keyframe-matchfadein]')) {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.setAttribute('data-keyframe-matchfadein', 'true');
        styleSheet.innerText = `
            @keyframes matchFadeIn {
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    initialAnimateMatches();
});
