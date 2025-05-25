document.addEventListener('DOMContentLoaded', () => {
    const playerInputs = document.querySelectorAll('.player-input');
    const selectWinnerButtons = document.querySelectorAll('.select-winner');
    const vsTexts = document.querySelectorAll('.vs-text');
    const bracketLines = document.querySelectorAll('.bracket-line');

    // Map match IDs to their corresponding input targets in the next round
    const nextRoundTargets = {
        'R1A': { player1: { targetMatch: 'R2A', targetPlayerId: 1 }, lineId: 'line-R1A-R2A-1' },
        'R1B': { player2: { targetMatch: 'R2A', targetPlayerId: 2 }, lineId: 'line-R1A-R2A-2' },
        'R1C': { player1: { targetMatch: 'R2B', targetPlayerId: 1 }, lineId: 'line-R1B-R2B-1' }, // Note: R1C and R1D feed into R2B
        'R1D': { player2: { targetMatch: 'R2B', targetPlayerId: 2 }, lineId: 'line-R1B-R2B-2' },

        'R2A': { player1: { targetMatch: 'R3A', targetPlayerId: 1 }, lineId: 'line-R2A-R3A-1' },
        'R2B': { player2: { targetMatch: 'R3A', targetPlayerId: 2 }, lineId: 'line-R2A-R3A-2' },

        'R3A': { player1: { targetMatch: 'Winner', targetPlayerId: 1 }, lineId: 'line-R3A-Winner' }
    };

    // Helper to get match element from an input
    const getMatchElement = (input) => input.closest('.match');

    // Helper to check if both inputs in a match have content
    const checkBothPlayersEntered = (matchElement) => {
        const inputs = matchElement.querySelectorAll('.player-input:not([readonly])');
        if (inputs.length < 2) return false; // Not a starting match
        return Array.from(inputs).every(input => input.value.trim() !== '');
    };

    // Update 'vs-text' visibility
    const updateVsText = (matchElement) => {
        const vsSpan = matchElement.querySelector('.vs-text');
        if (checkBothPlayersEntered(matchElement)) {
            vsSpan.classList.add('active');
        } else {
            vsSpan.classList.remove('active');
        }
    };

    // Show/hide winner selection button
    const toggleWinnerButton = (matchElement) => {
        const winnerBtn = matchElement.querySelector('.select-winner');
        const inputs = matchElement.querySelectorAll('.player-input:not([readonly])');
        if (winnerBtn) {
            if (inputs.length === 2 && checkBothPlayersEntered(matchElement) && !winnerBtn.classList.contains('match-completed')) {
                winnerBtn.classList.add('active');
            } else {
                winnerBtn.classList.remove('active');
            }
        }
    };

    // Event listeners for player inputs
    playerInputs.forEach(input => {
        // Initial check for 'vs-text' and winner button
        const matchElement = getMatchElement(input);
        if (matchElement && matchElement.dataset.round === 'R1') { // Only for first round inputs
            updateVsText(matchElement);
            toggleWinnerButton(matchElement);
        }

        input.addEventListener('input', () => {
            const currentMatch = getMatchElement(input);
            if (currentMatch) {
                updateVsText(currentMatch);
                toggleWinnerButton(currentMatch);
            }
        });

        // Basic focus/blur animations for all inputs
        input.addEventListener('focus', () => {
            input.style.boxShadow = '0 0 10px var(--glow-color)';
        });
        input.addEventListener('blur', () => {
            input.style.boxShadow = ''; // Remove glow unless winner
        });
    });

    // Event listeners for select winner buttons
    selectWinnerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const matchId = button.dataset.matchId;
            const winnerTarget = button.dataset.winnerTarget; // e.g., "R2A-P1" or "Winner"
            const currentMatch = document.getElementById(matchId);

            // Determine which player won from the current match's inputs
            const playersInMatch = currentMatch.querySelectorAll('.player-input');
            let winnerName = '';
            let winnerInput = null;

            // Simple selection logic: for each player, ask which one is the winner
            // In a real scenario, you'd click on the *player's name* to select them.
            // For now, let's assume the first input is "Player A" and second is "Player B"
            // and the button needs to know WHICH player it represents winning.
            // A more robust UI would be:
            // <button class="select-winner" data-player-id="1">Player 1 Wins</button>
            // <button class="select-winner" data-player-id="2">Player 2 Wins</button>
            // For simplicity with one button, we'll just pick player 1 for now, or you modify the buttons.
            // Let's modify the buttons to select a specific player.

            // Re-evaluating the click logic:
            // The HTML currently has one button per match, data-winner-target indicates the next slot.
            // We need to know which *player* within the match just won.
            // Let's change the HTML buttons to be next to each player.
            // For now, to make the current HTML work, I'll just pick the first player's name as winner for demo.
            // A better way is below (commented out in HTML, but here for conceptual clarity):

            // NEW APPROACH: Instead of one button per match, buttons are per player-entry.
            const playerEntry = button.closest('.player-entry'); // Get the entry for the winning player
            if (playerEntry) {
                winnerInput = playerEntry.querySelector('.player-input');
                winnerName = winnerInput.value.trim();
            }

            if (!winnerName) {
                alert('Please enter a player name before selecting a winner.');
                return;
            }

            // Highlight the winner in the current match
            playersInMatch.forEach(input => input.classList.remove('winner'));
            if (winnerInput) {
                winnerInput.classList.add('winner');
            }
            
            // Mark match as completed
            button.classList.remove('active');
            button.classList.add('match-completed');
            currentMatch.classList.add('completed'); // Add a class to the match box itself

            // Disable inputs in the completed match
            playersInMatch.forEach(input => {
                input.readOnly = true;
                input.style.pointerEvents = 'none'; // Make them non-clickable
            });

            // Progress winner to next round
            if (winnerTarget === 'Winner') {
                const finalWinnerInput = document.querySelector('.final-winner-input');
                if (finalWinnerInput) {
                    finalWinnerInput.value = winnerName;
                    finalWinnerInput.classList.add('winner');
                    finalWinnerInput.style.pointerEvents = 'none';
                    // Trigger final line animation
                    const lineId = nextRoundTargets[matchId].lineId;
                    if (lineId) {
                        document.getElementById(lineId).classList.add('active');
                    }
                }
            } else {
                const [targetMatchId, targetPlayerSlot] = winnerTarget.split('-'); // e.g., 'R2A', 'P1'
                const targetMatch = document.getElementById(targetMatchId);
                if (targetMatch) {
                    const targetInput = targetMatch.querySelector(`.player-input[data-player-id="${targetPlayerSlot.replace('P', '')}"]`);
                    if (targetInput) {
                        targetInput.value = winnerName;
                        // Enable editing for the next round's inputs if they are not readonly
                        targetInput.readOnly = false;
                        targetInput.style.pointerEvents = 'auto';

                        // Check if the target match now has both players
                        const nextMatchInputs = targetMatch.querySelectorAll('.player-input.winner-input');
                        const nextMatchReady = Array.from(nextMatchInputs).every(input => input.value.trim() !== '');

                        if (nextMatchReady) {
                            updateVsText(targetMatch);
                            toggleWinnerButton(targetMatch); // Activate winner button for the next match
                        }
                    }
                }
                
                // Activate relevant line segments
                const lineId = nextRoundTargets[matchId].lineId;
                if (lineId) {
                    document.getElementById(lineId).classList.add('active');
                }
            }
        });
    });

    // Initial load animations (optional)
    const initialAnimate = () => {
        const matches = document.querySelectorAll('.match');
        matches.forEach((match, index) => {
            match.style.animationDelay = `${index * 0.1}s`; // Staggered animation
            match.style.opacity = 0; // Start hidden
            match.style.transform = 'translateY(20px)'; // Start slightly below
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

    initialAnimate(); // Run initial animation on page load
});
