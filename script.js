document.addEventListener('DOMContentLoaded', () => {
    const playerInputs = document.querySelectorAll('.player-input');

    playerInputs.forEach(input => {
        // Add a simple 'sparkle' effect when input is focused/blurred or content changes
        input.addEventListener('focus', () => {
            input.style.transition = 'none'; // Temporarily disable transition for immediate glow
            input.style.boxShadow = '0 0 15px var(--glow-color), 0 0 25px var(--glow-color-stronger)';
            input.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            // Re-enable transition and remove immediate glow
            input.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
            if (input.value.trim() === '') {
                input.style.boxShadow = ''; // Remove glow if empty
            } else {
                // Keep a subtle glow if there's content
                input.style.boxShadow = '0 0 5px var(--glow-color), 0 0 10px rgba(0, 224, 255, 0.3)';
            }
            input.classList.remove('focused');
        });

        // Add a subtle animation when text is typed
        input.addEventListener('input', () => {
            if (input.value.length > 0 && !input.classList.contains('has-content')) {
                input.classList.add('has-content');
                input.style.animation = 'textPopIn 0.3s ease-out';
            } else if (input.value.length === 0 && input.classList.contains('has-content')) {
                input.classList.remove('has-content');
                input.style.animation = 'none'; // Reset animation
            }
        });

        input.addEventListener('animationend', () => {
            input.style.animation = ''; // Remove animation style after it ends
        });
    });

    // Custom CSS variable for stronger glow for JS interactivity
    document.documentElement.style.setProperty('--glow-color-stronger', 'rgba(0, 224, 255, 0.7)');

    // Optional: Add a subtle overall background flicker/pulse for extra "coolness"
    const backgroundAnim = document.querySelector('.background-animation');
    setInterval(() => {
        backgroundAnim.style.opacity = (Math.random() * 0.1) + 0.6; // Opacity between 0.6 and 0.7
    }, 5000); // Change every 5 seconds

    // Add a simple animation for player input boxes on load
    playerInputs.forEach((input, index) => {
        input.style.setProperty('--delay', `${index * 0.05}s`); // Staggered delay
        input.style.animation = 'inputFadeIn 0.5s forwards ease-out';
        input.style.opacity = 0; // Start hidden
        input.style.transform = 'translateY(10px)'; // Start slightly below
    });
});

// Keyframe for text pop-in effect
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    @keyframes textPopIn {
        0% { transform: scale(0.9); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes inputFadeIn {
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);
