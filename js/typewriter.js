const dialogueContent = {
    home: "Welcome to my website! My name is Swirly Wirly Toffee, but you can just call me Toffee. Click on any of the buttons on my tail to explore the website! If I'm taking too long to talk, try clicking on the speech bubble.",
    writing: "WRITING",
    photography: "PHOTAGRAPHY!",
    about: "The owner of this website is Emma Marion. She's a Junior at the University of Michigan School of Information (UMSI) studying user experience (UX) design. She actually built this website for her final project in her web design class! How cool is that?"
};

// GLOBAL VARIABLES
const element = document.querySelector(".typewriter"); // span element
const container = document.querySelector("#typewriter-container"); // p element
const speechBubble = document.querySelector(".speech-bubble"); // div element
const contentSections = document.querySelectorAll(".content-section") // all content sections

// BUTTONS
const homeBtn = document.querySelector('#homeBtn') // home button
const writingBtn = document.querySelector('#writingBtn') // writing button
const photoBtn = document.querySelector('#photoBtn') // photo button
const aboutBtn = document.querySelector('#aboutBtn') // about button
const muteBtn = document.querySelector('#muteBtn') // mute button

// EVENT LISTENERS
homeBtn.addEventListener('click', () => startTyping('home'));
writingBtn.addEventListener('click', () => startTyping('writing'))
photoBtn.addEventListener('click', () => startTyping('photography'));
aboutBtn.addEventListener('click', () => startTyping('about'));

muteBtn.addEventListener('click', () => toggleMute());


let currentFullText = "";
const typeSpeed = 50; // miliseconds per character
let typingTimeout;

// AUDIO POOLING SETUP
const audioPool = [];
let lastSoundTime = 0; // Tracks when the last sound was played
const poolSize = 6; // Create 6 copies to reuse. Enough to allow overlap.
const talkSoundSrc = "audio/talkingSound.wav";

// Initialize the pool once when the page loads
for (let i = 0; i < poolSize; i++) {
    const audio = new Audio(talkSoundSrc);
    audio.volume = 0.5;
    
    // PRE-CALCULATE: Assign a permanent random speed to this specific audio copy
    audio.playbackRate = 0.8 + Math.random() * 0.4; 
    audioPool.push(audio);
}

function startTyping(sectionKey) {
    if (!dialogueContent[sectionKey]) return;

    // Convert sectionKey to the id of an HTML section element
    const targetId = "#" + sectionKey + "-content";
    
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.add('hidden');
    });

    // Get the section we wanto show
    const targetSelection = document.querySelector(targetId);

    // Show it
    if (targetSelection) {
        targetSelection.classList.remove('hidden')
    }

    // Pick text from array and store globally for skip function
    currentFullText = dialogueContent[sectionKey];

    // Stop current typing
    clearTimeout(typingTimeout)

    // Accessibility: update aria label immediately for screen readers
    container.setAttribute("aria-label", currentFullText);

    // Accessibility: Move the screen reader to read the new label
    container.focus();

    // Clear text
    element.textContent = "";

    // Handle reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
    // If user prefers reduced motion, show full text immediately
    element.textContent = currentFullText;
    element.style.borderRight = 'none'; // Remove cursor
    } else {
        element.style.borderRight = '2px solid black'; // Restore cursor in case preferences change
        let i = 0
        function typeWriter() {
            if (i < currentFullText.length){
                let char = currentFullText.charAt(i);
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

let poolIndex = 0;
let isMuted = true;

function playBlip() {
    if (isMuted) return;

    const audio = audioPool[poolIndex];
    
    if (window.innerWidth < 768) return;

    audio.currentTime = 0;
    audio.play();
    poolIndex = (poolIndex + 1) % poolSize;
}

function toggleMute() {
    isMuted = !isMuted;
    const btn = document.querySelector("#muteBtn");

    if (isMuted) {
        btn.setAttribute("aria-pressed", "true");
    } else {
        btn.setAttribute("aria-pressed", "false")
    }
}

function skipDialogue() {
    clearTimeout(typingTimeout);
    element.textContent = currentFullText;
    element.style.borderRight = 'none';
}