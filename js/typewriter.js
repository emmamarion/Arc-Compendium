const dialogueContent = {
    home: "Welcome to my website! This is a project for my college webdesign class!",
    about: "What's up?"
};

const element = document.querySelector(".typewriter");
const container = document.querySelector("#typewriter-container");
const typeSpeed = 50; // miliseconds per character
let typingTimeout;

const talkSound = new Audio("audio/talkingSound.wav");

function startTyping(sectionKey) {
    // Pick text from array
    const textToType = dialogueContent[sectionKey];

    // Stop current typing
    clearTimeout(typingTimeout)

    // Accessability: update aria label immediately for screen readers
    container.setAttribute("aria-label", textToType);

    // Accessability: Move the screen reader to read the new label
    container.focus();

    // Clear text
    element.textContent = "";

    // Handle reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
    // If user prefers reduced motion, show full text immediately
    element.textContent = textToType;
    element.style.borderRight = 'none'; // Remove cursor
    } else {
        element.style.borderRight = '2px solid black'; // Restore cursor in case preferences change
        let i = 0
        function typeWriter() {
            if (i < textToType.length){
                let char = textToType.charAt(i);
                element.textContent += char
                i++;

                if (char != " " && i % 2 == 0) {
                    playBlip();
                }
                typingTimeout = setTimeout(typeWriter, typeSpeed)
            }
        }
        typeWriter();   
    }
}

function playBlip() {
    const soundClone = talkSound.cloneNode();
    soundClone.playbackRate = 0.8 + Math.random() * 0.4
    soundClone.volume = 0.5;
    soundClone.play()
}

