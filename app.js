// Model: Skill definitions and challenges
// TODO: Move the challenges section for SoC
const challenges = {
    select: {
        title: "SELECT Challenge",
        description: "Write a query to select all data from the 'Customers' table.",
        expected: {
            answer: "SELECT * FROM Customers;"
        },
        tableHTML: `
        <strong>Customers Table</strong>
        <table class="sql-table">
            <thead><tr><th>CustomerID</th><th>CustomerName</th><th>Age</th></tr></thead>
            <tbody>
                <tr><td>1</td><td>Alice</td><td>25</td></tr>
                <tr><td>2</td><td>Bob</td><td>35</td></tr>
                <tr><td>3</td><td>Charlie</td><td>40</td></tr>
            </tbody>
        </table>
    `
    },
    where: {
        title: "WHERE Challenge",
        description: "Select customers who are older than 30.",
        expected: {
            answer: "SELECT CustomerName FROM Customers WHERE Age > 30;"
        },
        tableHTML: `
        <strong>Customers Table</strong>
        <table class="sql-table">
            <thead><tr><th>CustomerID</th><th>CustomerName</th><th>Age</th></tr></thead>
            <tbody>
                <tr><td>1</td><td>Alice</td><td>25</td></tr>
                <tr><td>2</td><td>Bob</td><td>35</td></tr>
                <tr><td>3</td><td>Charlie</td><td>40</td></tr>
            </tbody>
        </table>
    `
    },
    join: {
        title: "JOIN Challenge",
        description: "Join Customers with Orders on CustomerID.",
        expected: {
            answer: "SELECT Orders.OrderID, Customers.CustomerName FROM Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;"
        },
        tableHTML: `
        <div class="sql-joined-tables">
            <strong>Customers Table</strong>
            <table class="sql-table">
                <thead><tr><th>CustomerID</th><th>CustomerName</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>Dave</td></tr>
                    <tr><td>2</td><td>Eva</td></tr>
                </tbody>
            </table>

            <strong>Orders Table</strong>
            <table class="sql-table">
                <thead><tr><th>OrderID</th><th>CustomerID</th></tr></thead>
                <tbody>
                    <tr><td>101</td><td>1</td></tr>
                    <tr><td>102</td><td>2</td></tr>
                    <tr><td>103</td><td>2</td></tr>
                </tbody>
            </table>
        </div>
        `

    }
};

let currentSkill = null;

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
        console.log("Clicked:", btn.dataset.skill);

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
        const nextBtn = [...skillButtons].find(
            (btn) => btn.disabled && !btn.classList.contains("completed")
        );
        if (nextBtn) nextBtn.disabled = false;

        const currentBtn = [...skillButtons].find(
            (btn) => btn.dataset.skill === currentSkill
        );
        currentBtn.classList.add("completed");
    }

    // Show solution button after an attempt
    showSolutionBtn.classList.remove("hidden");
    solutionText.classList.add("hidden");

});

// Event: Show Solution
showSolutionBtn.addEventListener("click", () => {
    const solution = challenges[currentSkill].expected.answer;
    solutionText.textContent = `✅ Solution: ${solution}`;
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
