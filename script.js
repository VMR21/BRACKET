document.addEventListener('DOMContentLoaded', () => {
    const playerInputs = document.querySelectorAll('.player-input');
    const multiplierInputs = document.querySelectorAll('.multiplier-input');
    const decideWinnerButtons = document.querySelectorAll('.decide-winner-btn');

    // Helper to get match element from an input or button
    const getMatchElement = (element) => element.closest('.match');

    // Check if player name and multiplier are both entered
    const arePlayerInputsComplete = (matchElement) => {
        const playerInputsInMatch = matchElement.querySelectorAll('.player-input:not([readonly])');
        const multiplierInputsInMatch = matchElement.querySelectorAll('.multiplier-input:not([readonly])');

        if (playerInputsInMatch.length === 0) return false; // No editable players in this match (e.g., winner box)

        let allComplete = true;
        for (let i = 0; i < playerInputsInMatch.length; i++) {
            if (playerInputsInMatch[i].value.trim() === '' || 
                (multiplierInputsInMatch[i] && multiplierInputsInMatch[i].value.trim() === '')) {
                allComplete = false;
                break;
            }
        }
        return allComplete;
    };

    // Toggle visibility/activity of the "Decide Winner" button
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

    // Add input event listeners to all player and multiplier fields
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

    // Event listeners for "Decide Winner" buttons
    decideWinnerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentMatch = getMatchElement(button);
            const matchId = currentMatch.id;

            const player1NameInput = currentMatch.querySelector('.player-input[data-player-id="1"]');
            const player1MultiplierInput = currentMatch.querySelector('.multiplier-input[data-player-id="1"]');
            const player2NameInput = currentMatch.querySelector('.player-input[data-player-id="2"]');
            const player2MultiplierInput = currentMatch.querySelector('.multiplier-input[data-player-id="2"]');

            const player1Name = player1NameInput ? player1NameInput.value.trim() : '';
            const player1Multiplier = player1MultiplierInput ? parseFloat(player1MultiplierInput.value) : NaN;
            const player2Name = player2NameInput ? player2NameInput.value.trim() : '';
            const player2Multiplier = player2MultiplierInput ? parseFloat(player2MultiplierInput.value) : NaN;

            if (!player1Name || isNaN(player1Multiplier) || !player2Name || isNaN(player2Multiplier)) {
                alert('Please enter names and valid multipliers for both players.');
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
                // Tie-breaker: If multipliers are equal, Player 1 wins by default.
                // You could add more complex logic here (e.g., random, user choice).
                alert('Multipliers are equal! Player 1 wins by default.');
                winnerName = player1Name;
                winnerMultiplier = player1Multiplier;
                winnerPlayerId = '1';
            }

            // Remove previous winner highlights and apply to current winner
            currentMatch.querySelectorAll('.player-input, .multiplier-input').forEach(input => {
                input.classList.remove('winner');
            });

            if (winnerPlayerId === '1') {
                player1NameInput.classList.add('winner');
                player1MultiplierInput.classList.add('winner');
            } else {
                player2NameInput.classList.add('winner');
                player2MultiplierInput.classList.add('winner');
            }

            // Mark current match as completed
            button.classList.remove('active');
            button.classList.add('match-completed');
            currentMatch.classList.add('completed');

            // Disable inputs in the completed match
            currentMatch.querySelectorAll('.player-input, .multiplier-input').forEach(input => {
                input.readOnly = true;
                input.style.pointerEvents = 'none';
            });

            // Progress winner to the next round
            const nextMatchId = currentMatch.dataset.nextMatch;
            const nextSlot = currentMatch.dataset.nextSlot;
            const targetLineId = `line-${matchId}-${nextMatchId}-${nextSlot}`; // Construct line ID

            if (nextMatchId === 'Winner') {
                const finalWinnerInput = document.querySelector('.final-winner-input');
                if (finalWinnerInput) {
                    finalWinnerInput.value = winnerName;
                    finalWinnerInput.classList.add('winner');
                    finalWinnerInput.style.pointerEvents = 'none';
                    // Activate final line
                    const finalLine = document.getElementById(targetLineId);
                    if (finalLine) finalLine.classList.add('active');
                }
            } else {
                const targetMatch = document.getElementById(nextMatchId);
                if (targetMatch) {
                    const targetPlayerInput = targetMatch.querySelector(`.player-input[data-player-id="${nextSlot}"]`);
                    const targetMultiplierInput = targetMatch.querySelector(`.multiplier-input[data-player-id="${nextSlot}"]`);

                    if (targetPlayerInput) {
                        targetPlayerInput.value = winnerName;
                        targetPlayerInput.readOnly = false; // Make it editable for the next round
                        targetPlayerInput.style.pointerEvents = 'auto';
                    }
                    if (targetMultiplierInput) {
                        targetMultiplierInput.value = winnerMultiplier;
                        targetMultiplierInput.readOnly = false; // Make it editable for the next round
                        targetMultiplierInput.style.pointerEvents = 'auto';
                    }

                    // Activate relevant line segment
                    const line = document.getElementById(targetLineId);
                    if (line) {
                        line.classList.add('active');
                    }

                    // Check if the target match is now ready for winner decision
                    toggleDecideWinnerButton(targetMatch);
                }
            }
        });
    });

    // Initial check for all matches on load to set button states
    document.querySelectorAll('.match').forEach(match => {
        toggleDecideWinnerButton(match);
    });

    // Initial load animations (optional)
    const initialAnimate = () => {
        const matches = document.querySelectorAll('.match');
        matches.forEach((match, index) => {
            match.style.animationDelay = `${index * 0.1}s`;
            match.style.opacity = 0;
            match.style.transform = 'translateY(20px)';
            match.style.animation = 'matchFadeIn 0.8s forwards ease-out';
        });
    };

    // Append CSS keyframes for dynamic animations
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes matchFadeIn {
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleSheet);

    initialAnimate();
});
