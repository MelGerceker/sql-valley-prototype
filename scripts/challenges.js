// Model: Skill definitions and challenges
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
            <div class="table-block">
                <strong>Customers Table</strong>
                <table class="sql-table">
                    <thead><tr><th>CustomerID</th><th>CustomerName</th></tr></thead>
                    <tbody>
                        <tr><td>1</td><td>Dave</td></tr>
                        <tr><td>2</td><td>Eva</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="table-block">
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
        </div>
        `

    },
        p1c1: {
        title: "Path 1 - Challenge 1",
        description: "This is the first challenge in path 1. Type ANSWER.",
        expected: {
            answer: "answer"
        },
    },
         p2c1: {
        title: "Path 2 - Challenge 1",
        description: "This is the first challenge in path 2. Type ANSWER.",
        expected: {
            answer: "answer"
        },
    }
};