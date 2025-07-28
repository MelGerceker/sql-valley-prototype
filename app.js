// Model: Skill definitions and challenges
const challenges = {
    select: {
        title: "SELECT Challenge",
        description: "Write a query to select all data from the 'Customers' table.",
        expected: {
            answer: "SELECT * FROM Customers;"
        }
    },
    where: {
        title: "WHERE Challenge",
        description: "Select customers who are older than 30.",
        expected: {
            answer: "SELECT CustomerName FROM Customers WHERE Age > 30;"
        }
    },
    join: {
        title: "JOIN Challenge",
        description: "Join Customers with Orders on CustomerID.",
        expected: {
            answer: "SELECT Orders.OrderID, Customers.CustomerName FROM Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;"
        }
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

// Event: Skill button clicked
skillButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        currentSkill = btn.dataset.skill;
        const challenge = challenges[currentSkill];
        challengeTitle.textContent = challenge.title;
        challengeDescription.textContent = challenge.description;
        userInput.value = "";
        feedback.textContent = "";
        challengeArea.classList.remove("hidden");
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

//TODO: Old solution from previous exercise is still shown
