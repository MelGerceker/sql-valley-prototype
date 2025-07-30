const { validateSQL } = require('../scripts/validator');

function getHintText(result) {
    if (result.missing.length > 0) {
        return `Missing: ${result.missing.join(", ")}`;
    } else if (result.extra.length > 0) {
        return `Extra: ${result.extra.join(", ")}`;
    } else {
        return "No hints available.";
    }
}

describe('Hint button logic', () => {

    test('displays missing tokens as hint', () => {
        const input = "SELECT FROM Customers;";
        const expected = { answer: "SELECT * FROM Customers;" };
        const result = validateSQL(input, expected);
        const hint = getHintText(result);
        expect(hint).toBe("Missing: *");
    });

    test('displays extra tokens as hint', () => {
        const input = "SELECT * FROM Customers EXTRA;";
        const expected = { answer: "SELECT * FROM Customers;" };
        const result = validateSQL(input, expected);
        const hint = getHintText(result);
        expect(hint).toBe("Extra: EXTRA");
    });

    test('displays no hints if nothing is missing or extra', () => {
        const input = "SELECT * FROM Customers;";
        const expected = { answer: "SELECT * FROM Customers;" };
        const result = validateSQL(input, expected);
        const hint = getHintText(result);
        expect(hint).toBe("No hints available.");
    });

    test('does not return missing if query is complete but out of order', () => {
        const input = "FROM Customers SELECT *;";
        const expected = { answer: "SELECT * FROM Customers;" };
        const result = validateSQL(input, expected);
        const hint = getHintText(result);
        expect(hint).toBe("No hints available.");
    });

});
