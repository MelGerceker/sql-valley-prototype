# Mini SQL Trainer

A simple educational web app that teaches SQL basics through interactive challenges in a skill tree format, with a fun twist.

###  Features
- 3 beginner SQL challenges: SELECT, WHERE, JOIN.
- Progressive unlock system: Complete one challenge to unlcok the next one.
- Live feedback: Check if your answer was correct.
- Hint system: Progressively reveal missing tokens, or see whether your answer had extra or out of order tokens.
- Gamified breaks: Includes a mini Dart Game between challenges.

### Technologies Used
- HTML, CSS, JavaScript 
- Unit testing via JEST

## How to Use
- Click on the first challenge: SELECT.
- Type your answer and click the Submit button (or press Ctrl + Enter).
- Get immediate feedback:
  - Missing keywords
  - Extra / unexpected keywords
  - Out of order logic
- Hint button:
  - Reveal one by one the missing keywords you have
  - Shows the extra keywords you have
- Click Show Solution of you are stuck.
- After solving a challenge, play a quick dart game!
- Click the dart icon to view your scoreboard and track stats.

Branching:
After the 3rd challenge, users get prompted to choose their own path. This choice gets locally stored.

## Making Learning Fun: The Dart Game

Learning SQL from scratch can feel intimidating, hence I gamified the experience!
After each solved challenge, you are prompted with a mini dart game:
- A target appears at a random position.
- You have limited time to click as accurately as possible.
- Your accuracy is logged, and your average performance is displayed in the scoreboard.

This breaks repetition and helps keep users engaged and motivated.

**Scoreboard & Menu **
The menu (dart icon at the top-right):
- Displays your total darts thrown (i.e., completed challenges)
- Shows your latest accuracy store
- Tracks your average accuracy

## Relevance to SQL Valley Position @ TU/e

This project demonstrates:
- Input validation and custom feedback logic (relevant for the Educational Programmer role)
- Event-driven UI and interactive node unlocking (relevant for the Skill Tree Tool Developer role)

### Credits
The dartboard image (dartBoard.html and dartBoard.css) is adapted from David Altreiter - [CodePen: Dartboard](https://codepen.io/altreiter/pen/XzQeGJ). Licensed under the MIT License (see assets/LICENSE-THIRD-PARTY.txt for full text).

## Project Structure
```
sql-valley-prototype/
├── assets/                # Visuals, license info
├── scripts/               # Visuals, license info
│   ├── app.js/            # Core logic and event listeners
│   ├── challenges.js/     # All data regarding each challenge questions and their data tables.
│   ├── dartGame.js/       # Logic for the dart game
│   ├── validator.js/      # Validate logic for the submit button
├── test/                  # Unit testing via Jest
│   ├── hintFeature.test.js/ 
│   ├── validator.test.js/
├── app.css/               # Component based styling such as dart game, solution & feedback
├── base.css/              # General styling and visual layout
├── index.html/            # Main page
├── package-lock.json/
├── package.json/
├── README.md/
```
---

Feel free to fork, open issues, or submit pull requests!
