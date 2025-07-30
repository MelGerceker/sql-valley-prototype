const { validateSQL } = require('./validator');

describe('validateSQL', () => {

    test('returns full match for correct query', () => {
        const input = "SELECT * FROM Customers;";
        const expected = { answer: "SELECT * FROM Customers;" };
        const result = validateSQL(input, expected);
        expect(result.status).toBe("full");
        expect(result.exactMatch).toBe(true);
    });

    test('detects missing token', () => {
        const input = "SELECT FROM Customers;";
        const expected = { answer: "SELECT * FROM Customers;" };
        const result = validateSQL(input, expected);
        expect(result.status).toBe("partial");
        expect(result.missing).toContain("*");
    });

    test('detects extra token', () => {
        const input = "SELECT * FROM Customers NOW;";
        const expected = { answer: "SELECT * FROM Customers;" };
        const result = validateSQL(input, expected);
        expect(result.status).toBe("fail");
        expect(result.extra).toContain("NOW");
    });

    test('detects tokens out of order', () => {
        const input = "FROM Customers SELECT *;";
        const expected = { answer: "SELECT * FROM Customers;" };
        const result = validateSQL(input, expected);
        expect(result.status).toBe("partial");
        expect(result.outOfOrder.length).toBeGreaterThan(0);
    });

    test('fallback incorrect case', () => {
        const input = "GIBBERISH JUNK";
        const expected = { answer: "SELECT * FROM Customers;" };
        const result = validateSQL(input, expected);
        expect(result.status).toBe("fail");
    });

});
