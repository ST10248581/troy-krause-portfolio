// Initialize Typed.js intro text
const typed = new Typed("#typedText", {
    strings: [
        "> Initializing Interface...\n> Verifying identity...\n> Agent confirmed: Troy Krause. \n> \n> Type 'launch' to begin portfolio navigation"
    ],
    typeSpeed: 50,
    backSpeed: 0,
    showCursor: false,
    loop: false,
});

const terminalInput = document.getElementById("terminalInput");
const terminal = document.getElementById("terminal");
const mainContent = document.getElementById("mainContent");

terminalInput.focus();

terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const command = terminalInput.value.trim().toLowerCase();
        if (command === "launch") {
            startTransition();
            terminalInput.value = "";
        } else {
            terminalInput.value = "";
            terminalInput.placeholder = "Access Denied. Try again.";
        }
    }
});

function startTransition() {
    terminal.classList.remove("terminal-initial");
    terminal.classList.add("terminal-launched");

    mainContent.classList.remove("main-hidden");
    mainContent.classList.add("main-visible");
}

