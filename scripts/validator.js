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

    // Missing tokens respectively with and without correct tokens
    if (missingTokens.length === correctTokens.length && extraTokens.length === userTokens.length) {
        results.status = "fail";
        results.feedback = `❌ Query is incorrect, no valid SQL structure found.`;
        return results;
    }

    if (missingTokens.length > 0) {
        results.status = "partial";
        results.feedback = `⚠️ Partial match.`;
        return results;
    }

    // Extra tokens
    if (extraTokens.length > 0) {
        results.status = "fail";
        results.feedback = `❌ Query is incorrect, some extra parts are present.`;
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


if (typeof module !== 'undefined') {
    module.exports = { validateSQL };
}

