document.addEventListener('DOMContentLoaded', () => {
    const playerInputs = document.querySelectorAll('.player-input');
    const multiplierInputs = document.querySelectorAll('.multiplier-input');
    const decideWinnerButtons = document.querySelectorAll('.decide-winner-btn');
    const vsTexts = document.querySelectorAll('.vs-text');

    // Mapping for match progression and line activation
    const progressionMap = {
        'R1A': { nextMatchId: 'R2A', nextPlayerSlot: '1', lineId: 'line-R1A-R2A-1' },
        'R1B': { nextMatchId: 'R2A', nextPlayerSlot: '2', lineId: 'line-R1B-R2A-2' },
        'R1C': { nextMatchId: 'R2B', nextPlayerSlot: '1', lineId: 'line-R1C-R2B-1' },
        'R1D': { nextMatchId: 'R2B', nextPlayerSlot: '2', lineId: 'line-R1D-R2B-2' },
        'R2A': { nextMatchId: 'R3A', nextPlayerSlot: '1', lineId: 'line-R2A-R3A-1' },
        'R2B': { nextMatchId: 'R3A', nextPlayerSlot: '2', lineId: 'line-R2B-R3A-2' },
        'R3A': { nextMatchId: 'Winner', nextPlayerSlot: '1', lineId: 'line-R3A-Winner' }
    };

    // Helper to get match element from an input
    const getMatchElement = (input) => input.closest('.match');

    // Check if player name and multiplier are both entered
    const arePlayerInputsComplete = (matchElement) => {
        const player1NameInput = matchElement.querySelector('.player-input[data-player-id="1"]');
        const player1MultiplierInput = matchElement.querySelector('.multiplier-input[data-player-id="1"]');
        const player2NameInput = matchElement.querySelector('.player-input[data-player-id="2"]');
        const player2MultiplierInput = matchElement.querySelector('.multiplier-input[data-player-id="2"]');

        const isPlayer1Complete = player1NameInput && player1MultiplierInput &&
                                  player1NameInput.value.trim() !== '' && player1MultiplierInput.value.trim() !== '';
        const isPlayer2Complete = player2NameInput && player2MultiplierInput &&
                                  player2NameInput.value.trim() !== '' && player2MultiplierInput.value.trim() !== '';

        // For winner display box, only check the single input
        if (matchElement.id === 'match-Winner') {
            return player1NameInput && player1NameInput.value.trim() !== '';
        }

        return isPlayer1Complete && isPlayer2Complete;
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

    // Event listeners for all player and multiplier inputs
    playerInputs.forEach(input => {
        input.addEventListener('input', () => {
            const currentMatch = getMatchElement(input);
            if (currentMatch) {
                toggleDecideWinnerButton(currentMatch);
            }
        });
        input.addEventListener('focus', () => {
            input.style.boxShadow = '0 0 10px var(--glow-color)';
        });
        input.addEventListener('blur', () => {
            input.style.boxShadow = '';
        });
    });

    multiplierInputs.forEach(input => {
        input.addEventListener('input', () => {
            const currentMatch = getMatchElement(input);
            if (currentMatch) {
                toggleDecideWinnerButton(currentMatch);
            }
        });
        input.addEventListener('focus', () => {
            input.style.boxShadow = '0 0 10px var(--glow-color)';
        });
        input.addEventListener('blur', () => {
            input.style.boxShadow = '';
        });
    });

    // Event listeners for "Decide Winner" buttons
    decideWinnerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const matchId = button.dataset.matchId;
            const currentMatch = document.getElementById(matchId);

            const player1NameInput = currentMatch.querySelector('.player-input[data-player-id="1"]');
            const player1MultiplierInput = currentMatch.querySelector('.multiplier-input[data-player-id="1"]');
            const player2NameInput = currentMatch.querySelector('.player-input[data-player-id="2"]');
            const player2MultiplierInput = currentMatch.querySelector('.multiplier-input[data-player-id="2"]');

            const player1Name = player1NameInput ? player1NameInput.value.trim() : '';
            const player1Multiplier = player1MultiplierInput ? parseFloat(player1MultiplierInput.value) : 0;
            const player2Name = player2NameInput ? player2NameInput.value.trim() : '';
            const player2Multiplier = player2MultiplierInput ? parseFloat(player2MultiplierInput.value) : 0;

            if (!player1Name || isNaN(player1Multiplier) || !player2Name || isNaN(player2Multiplier)) {
                alert('Please enter names and valid multipliers for both players.');
                return;
            }

            let winnerName = '';
            let winnerMultiplier = 0;
            let winningPlayerId = '';

            if (player1Multiplier > player2Multiplier) {
                winnerName = player1Name;
                winnerMultiplier = player1Multiplier;
                winningPlayerId = '1';
            } else if (player2Multiplier > player1Multiplier) {
                winnerName = player2Name;
                winnerMultiplier = player2Multiplier;
                winningPlayerId = '2';
            } else {
                // Tie-breaker: If multipliers are equal, Player 1 wins (can be customized)
                alert('Multipliers are equal! Player 1 wins by default (can be customized).');
                winnerName = player1Name;
                winnerMultiplier = player1Multiplier;
                winningPlayerId = '1';
            }

            // Apply winner styling to inputs in the current match
            player1NameInput.classList.remove('winner');
            player1MultiplierInput.classList.remove('winner');
            player2NameInput.classList.remove('winner');
            player2MultiplierInput.classList.remove('winner');

            if (winningPlayerId === '1') {
                player1NameInput.classList.add('winner');
                player1MultiplierInput.classList.add('winner');
            } else {
                player2NameInput.classList.add('winner');
                player2MultiplierInput.classList.add('winner');
            }

            // Mark match as completed
            button.classList.remove('active');
            button.classList.add('match-completed');
            currentMatch.classList.add('completed');

            // Disable inputs in the completed match
            currentMatch.querySelectorAll('.player-input, .multiplier-input').forEach(input => {
                input.readOnly = true;
                input.style.pointerEvents = 'none';
            });

            // Progress winner to the next round
            const nextRoundData = progressionMap[matchId];
            if (nextRoundData) {
                const targetMatch = document.getElementById(nextRoundData.nextMatchId);
                if (targetMatch) {
                    const targetPlayerInput = targetMatch.querySelector(`.player-input[data-player-id="${nextRoundData.nextPlayerSlot}"]`);
                    const targetMultiplierInput = targetMatch.querySelector(`.multiplier-input[data-player-id="${nextRoundData.nextPlayerSlot}"]`);

                    if (targetPlayerInput) {
                        targetPlayerInput.value = winnerName;
                        if (targetMultiplierInput) {
                            targetMultiplierInput.value = winnerMultiplier;
                        }
                        // Re-enable editing for the next round's inputs that were populated
                        targetPlayerInput.readOnly = false;
                        targetPlayerInput.style.pointerEvents = 'auto';
                        if (targetMultiplierInput) {
                            targetMultiplierInput.readOnly = false;
                            targetMultiplierInput.style.pointerEvents = 'auto';
                        }

                        // Check if the target match is now ready for winner decision
                        toggleDecideWinnerButton(targetMatch);
                    }
                }

                // Activate relevant line segment
                const line = document.getElementById(nextRoundData.lineId);
                if (line) {
                    line.classList.add('active');
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
