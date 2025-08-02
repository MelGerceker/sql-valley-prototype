let currentSkill = null;
let currentSkillIndex = -1;
const skillOrder = ["select", "where", "join"];
let branchChosen = null;
const completedSkills = new Set();

let dartsThrown = 0;
let missingTokens = [];
let revealedIndex = 0;

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
const dartsThrownElement = document.getElementById("darts-thrown");

const hintRevealContainer = document.getElementById("hint-reveal");
const hintKeywordDisplay = document.getElementById("hint-keyword-display");
const revealNextBtn = document.getElementById("reveal-next-hint");
const querySubmitContainer = document.querySelector(".query-submit-container");

const toggle = document.querySelector(".menu__toggle");
const overlay = document.querySelector(".menu__overlay");
const panel = document.querySelector(".menu__panel");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressDisplay = document.getElementById("challenge-progress");
const navContainer = document.getElementById("challenge-nav");

// CTRL + Enter for submit button
userInput.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault(); // prevents new line in the text area
        submitBtn.click();
    }
});

// Event: Skill button clicked
/*
skillButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        //console.log("Clicked:", btn.dataset.skill);

        currentSkill = btn.dataset.skill;
        currentSkillIndex = skillOrder.indexOf(currentSkill);

        skillButtons.forEach(b => b.classList.remove("current"));
        btn.classList.add("current");

        progressDisplay.textContent = `Challenge ${currentSkillIndex + 1} of ${skillOrder.length}`;

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

        challengeArea.classList.remove("hidden");
        renderTable(currentSkill);
        userInput.focus();

        prevBtn.disabled = currentSkillIndex === 0;
        nextBtn.disabled = currentSkillIndex === skillOrder.length - 1;
        progressDisplay.textContent = `Challenge ${currentSkillIndex + 1} of ${skillOrder.length}`;
        navContainer.classList.remove("hidden");


    });
});
*/
document.getElementById("skill-tree").addEventListener("click", (e) => {
    const btn = e.target.closest(".node");
    if (!btn) return;

    currentSkill = btn.dataset.skill;
    currentSkillIndex = skillOrder.indexOf(currentSkill);

    document.querySelectorAll(".node").forEach(b => b.classList.remove("current"));
    btn.classList.add("current");

    progressDisplay.textContent = `Challenge ${currentSkillIndex + 1} of ${skillOrder.length}`;

    const challenge = challenges[currentSkill];
    if (!challenge) return;

    challengeTitle.textContent = challenge.title;
    challengeDescription.textContent = challenge.description;
    userInput.value = "";
    feedback.textContent = "";

    showSolutionBtn.classList.add("hidden");
    solutionText.classList.add("hidden");
    solutionText.textContent = "";

    challengeArea.classList.remove("hidden");
    renderTable(currentSkill);
    userInput.focus();

    prevBtn.disabled = currentSkillIndex === 0;
    nextBtn.disabled = currentSkillIndex === skillOrder.length - 1;
    navContainer.classList.remove("hidden");
});


// For previous/next challenge buttons
function loadSkillByIndex(index) {
    if (index < 0 || index >= skillOrder.length) return;

    const skill = skillOrder[index];
    const skillBtn = [...document.querySelectorAll(".node")].find(btn => btn.dataset.skill === skill);

    if (skillBtn) skillBtn.click();
}



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

        const isFirstTime = !completedSkills.has(currentSkill);

        if (isFirstTime) {
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
        }

        // First Branching
        if (currentSkill === "join") {
            setTimeout(() => {
                showBranchChoice();
            }, 500);
        } else {
            setTimeout(() => {
                startDartGame();
            }, 1000);
        }

        // Start dart game
        setTimeout(() => {
            startDartGame();
        }, 1000);
    }

    // Show solution button after an attempt
    showSolutionBtn.classList.remove("hidden");
    solutionText.classList.add("hidden");

});

// Branching
//TODO: choice screen also pops up before dart game, fix
function showBranchChoice() {
    const modal = document.getElementById("branch-modal");
    const path1Btn = document.getElementById("path1-btn");
    const path2Btn = document.getElementById("path2-btn");

    modal.classList.remove("hidden");

    const handleChoice = (path) => {
        branchChosen = path;
        modal.classList.add("hidden");

        if (!skillOrder.includes(branchChosen)) {
            skillOrder.push(branchChosen);

            const nextBtn = document.createElement("button");
            nextBtn.className = "node";
            nextBtn.textContent = branchChosen.toUpperCase();
            nextBtn.dataset.skill = branchChosen;
            document.getElementById("skill-tree").appendChild(nextBtn);

        }

        document.querySelector(`.node[data-skill="${branchChosen}"]`).click();
    };

    path1Btn.onclick = () => handleChoice("p1c1");
    path2Btn.onclick = () => handleChoice("p2c1");
}



// Event: Show Solution
showSolutionBtn.addEventListener("click", () => {
    const solution = challenges[currentSkill].expected.answer;
    solutionText.textContent = `${solution}`;
    solutionText.style.color = "var(--green)";
    solutionText.classList.remove("hidden");

    hintRevealContainer.classList.add("hidden");
});


// Note: Show solutions button is not removed after correct solution is entered by the user.
// This is due to allow explanations in the solutions in the future.

// Event: Hint Button
hintRevealContainer.id = "hint-reveal";
hintRevealContainer.classList.add("hidden");
hintKeywordDisplay.id = "hint-keyword-display";
revealNextBtn.id = "reveal-next-hint";
revealNextBtn.textContent = "→";

// Reveal button handler
revealNextBtn.addEventListener("click", () => {
    if (revealedIndex < missingTokens.length) {
        hintKeywordDisplay.textContent = `${missingTokens[revealedIndex]}, ${revealedIndex + 1}/${missingTokens.length}`;
        revealedIndex++;
    }
    if (revealedIndex >= missingTokens.length) {
        revealNextBtn.disabled = true;
    }
});

hintBtn.addEventListener("click", () => {
    const answer = userInput.value.trim();
    const expected = challenges[currentSkill].expected;
    const result = validateSQL(answer, expected);

    if (result.missing.length > 0) {
        missingTokens = result.missing;
        revealedIndex = 0;

        hintRevealContainer.classList.remove("hidden");
        hintKeywordDisplay.textContent = `You have ${missingTokens.length} missing token(s).`;
        revealNextBtn.disabled = false;

        solutionText.classList.add("hidden");
    } else if (result.extra.length > 0) {
        hintRevealContainer.classList.add("hidden");

        const extraHint = `Extra: ${result.extra.join(", ")}`;
        solutionText.textContent = extraHint;
        solutionText.style.color = "orange";
        solutionText.classList.remove("hidden");

    } else {
        hintRevealContainer.classList.add("hidden");
        solutionText.textContent = "No hints available.";
        solutionText.style.color = "orange";
        solutionText.classList.remove("hidden");
    }
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
    overlay.classList.add("is-open");
    panel.classList.add(isMobile() ? "is-mobile-open" : "is-desktop-open");
}

function closeMenu() {
    overlay.classList.remove("is-open");
    panel.classList.remove("is-mobile-open", "is-desktop-open");
}

toggle.addEventListener("click", openMenu);

// Close when clicking outside the menu panel / on Escape key
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeMenu();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        closeMenu();
    }

    if (e.key === "ArrowLeft" && !prevBtn.disabled) prevBtn.click();
    if (e.key === "ArrowRight" && !nextBtn.disabled) nextBtn.click();

});

prevBtn.addEventListener("click", () => loadSkillByIndex(currentSkillIndex - 1));
nextBtn.addEventListener("click", () => loadSkillByIndex(currentSkillIndex + 1));
