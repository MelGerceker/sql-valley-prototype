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


// Validator:
// TODO: Move to another file for Seperation of Concerns
function validateSQL(input, expected) {
    const normalize = (str) =>
        str.toUpperCase().replace(/\s+/g, " ").replace(/;$/, "").trim();

    const userQuery = normalize(input);
    const correctQuery = normalize(expected.answer);

    const userTokens = userQuery.split(" ");
    const correctTokens = correctQuery.split(" ");

    const results = {
        feedback: "",
        status: "fail",
        missing: [],
        extra: [],
        outOfOrder: [],
        exactMatch: false
    };

    // Full match
    if (userQuery === correctQuery && userTokens.length === correctTokens.length) {
        results.status = "full";
        results.feedback = "✅ Perfect!";
        results.exactMatch = true;
        return results;
    }

    // Detect missing and extra tokens
    const missingTokens = correctTokens.filter(t => !userTokens.includes(t));
    const extraTokens = userTokens.filter(t => !correctTokens.includes(t));
    results.missing = missingTokens;
    results.extra = extraTokens;

    // TODO: Fix that when "gibberish" is the input, it goes to the missing tokens case.
    // TODO: Fix that when the answer is correct, but there are extra tokens it goes to fallback results. (?)

    // Missing tokens
    if (missingTokens.length > 0) {
        results.status = "partial";
        results.feedback = `⚠️ Partial match, some parts are missing.`;
        //TODO: Add hints button which will show:
        // Missing: ${results.missingKeywords.join(", ")}       
        return results;
    }

    // Extra tokens
    if (extraTokens.length > 0) {
        results.status = "fail";
        results.feedback = `❌ Query is incorrect, some extra parts are present.`;
        //TODO: Add hints button which will show:
        // Extra token(s): ${extraTokens.join(", ")}
        return results;
    }

    // Order check
    const outOfOrderTokens = [];
    for (let i = 0; i < correctTokens.length; i++) {
        if (userTokens[i] !== correctTokens[i]) {
            outOfOrderTokens.push({
                expected: correctTokens[i],
                found: userTokens[i] || "(none)"
            });
        }
    }
    results.outOfOrder = outOfOrderTokens;

    if (outOfOrderTokens.length > 0) {
        results.status = "partial";
        results.feedback = "⚠️ Some tokens are out of order.";
        return results;
    }

    // Fallback fail
    results.status = "fail";
    results.feedback = `❌ Query is incorrect.`;
    return results;

}

// Event: Show Solution
showSolutionBtn.addEventListener("click", () => {
    const solution = challenges[currentSkill].expected.answer;
    solutionText.textContent = `✅ Solution: ${solution}`;
    solutionText.classList.remove("hidden");
});

//TODO: Old solution from previous exercise is still shown

