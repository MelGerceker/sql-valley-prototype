let currentSkill = null;
const skillOrder = ["select", "where", "join"];
const completedSkills = new Set();

// DOM elements
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


// CTRL + Enter for submit button
userInput.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault(); // prevents new line in the text area
        submitBtn.click();
    }
});

//FIX: Bug with unlocking new skill
// Third skill gets unlocked when solving the first challenge twice!!!


// Event: Skill button clicked
skillButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        //console.log("Clicked:", btn.dataset.skill);

        currentSkill = btn.dataset.skill;
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
        /*
        const nextBtn = [...skillButtons].find(
            (btn) => btn.disabled && !btn.classList.contains("completed")
        );
        if (nextBtn) nextBtn.disabled = false;

        const currentBtn = [...skillButtons].find(
            (btn) => btn.dataset.skill === currentSkill
        );
        currentBtn.classList.add("completed");
        */
        const currentBtn = [...skillButtons].find(
            (btn) => btn.dataset.skill === currentSkill
        );
        currentBtn.classList.add("completed");
        completedSkills.add(currentSkill);

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

});

// Event: Show Solution
showSolutionBtn.addEventListener("click", () => {
    const solution = challenges[currentSkill].expected.answer;
    solutionText.textContent = `${solution}`;
    solutionText.classList.remove("hidden");
});

// Note: Show solutions button is not removed after correct solution is entered by the user.
// This is due to allow explanations in the solutions in the future.

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
    tableContainer.classList.toggle('hidden');
    toggleBtn.textContent = tableContainer.classList.contains('hidden') ? 'Show Table' : 'Hide Table';
});