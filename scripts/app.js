let currentSkill = null;
const skillOrder = ["select", "where", "join"];
const completedSkills = new Set();
let dartsThrown = 0;

const skillButtons = document.querySelectorAll(".node");
const challengeArea = document.getElementById("challenge-area");
const challengeTitle = document.getElementById("challenge-title");
const challengeDescription = document.getElementById("challenge-description");
const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const feedback = document.getElementById("feedback");
const showSolutionBtn = document.getElementById("show-solution-btn");
const solutionText = document.getElementById("solution-text");
const tableRef = document.getElementById("table-reference");
const toggleBtn = document.getElementById("toggle-table-btn");
const tableContainer = document.getElementById("table-reference");
const hintBtn = document.getElementById("hint-btn");
const hintText = document.getElementById("hint-text");
const menuToggle = document.getElementById("menu-toggle");
const menuPanel = document.getElementById("menu-panel");
const menuOverlay = document.getElementById("menu-overlay");
const dartsThrownElement = document.getElementById("darts-thrown");

// CTRL + Enter for submit button
userInput.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault(); // prevents new line in the text area
        submitBtn.click();
    }
});

// Event: Skill button clicked
skillButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        //console.log("Clicked:", btn.dataset.skill);

        currentSkill = btn.dataset.skill;

        skillButtons.forEach(b => b.classList.remove("current"));
        btn.classList.add("current");


        const challenge = challenges[currentSkill];
        if (!challenge) return; // avoid errors

        challengeTitle.textContent = challenge.title;
        challengeDescription.textContent = challenge.description;
        userInput.value = "";
        feedback.textContent = "";

        // Reset shown solution
        showSolutionBtn.classList.add("hidden");
        solutionText.classList.add("hidden");
        solutionText.textContent = "";

        hintText.classList.add("hidden");
        hintText.textContent = "";

        challengeArea.classList.remove("hidden");
        renderTable(currentSkill);
        userInput.focus();

    });
});

// Event: Submit answer
submitBtn.addEventListener("click", () => {
    const answer = userInput.value.trim();
    const expected = challenges[currentSkill].expected;
    const result = validateSQL(answer, expected);

    feedback.textContent = result.feedback;
    feedback.style.color = result.status === "full" ? "green" :
        result.status === "partial" ? "orange" :
            "red";

    if (result.status === "full") {
        const currentBtn = [...skillButtons].find(
            (btn) => btn.dataset.skill === currentSkill
        );
        currentBtn.classList.add("completed");
        completedSkills.add(currentSkill);

        dartsThrown++;
        dartsThrownElement.textContent = dartsThrown;

        // Unlock next skill if previous one is completed
        const currentIndex = skillOrder.indexOf(currentSkill);
        const nextSkill = skillOrder[currentIndex + 1];

        if (nextSkill && !completedSkills.has(nextSkill)) {
            const nextBtn = [...skillButtons].find(
                (btn) => btn.dataset.skill === nextSkill
            );
            if (nextBtn) nextBtn.disabled = false;
        }


        // Start dart game
        setTimeout(() => {
            startDartGame();
            dartScoreText.style.display = "block";
        }, 1000);

    }

    // Show solution button after an attempt
    showSolutionBtn.classList.remove("hidden");
    solutionText.classList.add("hidden");
    hintText.classList.add("hidden");

});

// Event: Show Solution
showSolutionBtn.addEventListener("click", () => {
    const solution = challenges[currentSkill].expected.answer;
    solutionText.textContent = `${solution}`;
    solutionText.style.color = "var(--green)";
    solutionText.classList.remove("hidden");
});


// Note: Show solutions button is not removed after correct solution is entered by the user.
// This is due to allow explanations in the solutions in the future.

// Event: Hint Button
hintBtn.addEventListener("click", () => {
    const answer = userInput.value.trim();
    const expected = challenges[currentSkill].expected;
    const result = validateSQL(answer, expected);

    let hintMessage = "";
    if (result.missing.length > 0) {
        hintMessage = `Missing: ${result.missing.join(", ")}`;
    } else if (result.extra.length > 0) {
        hintMessage = `Extra: ${result.extra.join(", ")}`;
    } else {
        hintMessage = "No hints available.";
    }

    solutionText.textContent = hintMessage;
    solutionText.style.color = "orange";
    solutionText.classList.remove("hidden");
});


// Renders Data Tables for Each Exercise
function renderTable(skillKey) {
    const challenge = challenges[skillKey];
    if (challenge && challenge.tableHTML) {
        tableRef.innerHTML = challenge.tableHTML;
        tableRef.classList.remove("hidden");
    } else {
        tableRef.innerHTML = "";
        tableRef.classList.add("hidden");
    }
}

toggleBtn.addEventListener('click', () => {
    const isHidden = tableContainer.classList.toggle('hidden');
    toggleBtn.textContent = isHidden ? '► Show Table' : '▼ Hide Table';
});


// Slider Menu
function isMobile() {
    return window.innerWidth <= 768;
}

function openMenu() {
    menuOverlay.classList.remove("hidden");
    if (isMobile()) {
        menuPanel.classList.add("open-mobile");
    } else {
        menuPanel.classList.add("open-desktop");
    }
}

function closeMenu() {
    menuOverlay.classList.add("hidden");
    menuPanel.classList.remove("open-mobile", "open-desktop");
}

// Open on toggle icon click
menuToggle.addEventListener("click", openMenu);

// Close when clicking outside the menu panel / on Escape key
menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) {
        closeMenu();
    }
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menuOverlay.classList.contains("hidden")) {
        closeMenu();
    }
})