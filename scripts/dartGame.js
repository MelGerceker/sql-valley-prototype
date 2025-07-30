let dartScoreTotal = 0;
let dartShots = 0;
let dartTimeout;

const dartGame = document.getElementById("dart-game");
const dartTarget = document.getElementById("dart-target");
const scoreBox = document.getElementById("score-ui");
const accuracyText = document.getElementById("accuracy");
const avgText = document.getElementById("average");

function updateScoreUI(accuracy) {
    const avg = dartShots ? Math.round(dartScoreTotal / dartShots) : 0;
    accuracyText.textContent = `🎯 Accuracy: ${accuracy}%`;
    avgText.textContent = `🎯 Avg: ${avg}%`;
}

function setScorePositionFloating(floating = true) {
    if (floating) {
        scoreBox.classList.remove("static");
        scoreBox.classList.remove("hidden");
    } else {
        scoreBox.classList.add("static");
        scoreBox.classList.remove("hidden");
    }
}

function hideDartGame() {
    document.body.style.overflow = '';
    dartGame.classList.add("hidden");
    setScorePositionFloating(false);
}

function startDartGame() {
    challengeArea.classList.add("hidden");
    dartGame.classList.remove("hidden");
    dartTarget.style.display = "block";

    setScorePositionFloating(true);

    // Avoid placement bugs and overflow
    window.scrollTo(0, 0); 
    document.body.style.overflow = 'hidden';

    const targetSize = 300; // temp solution
    // Note: Not sure if the target can appear on the h1 or skill buttons
    const padding = 20;
    const maxX = window.innerWidth - targetSize - padding;
    const maxY = window.innerHeight - targetSize - padding;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    dartTarget.style.left = `${randomX}px`;
    dartTarget.style.top = `${randomY}px`;

    dartTimeout = setTimeout(() => {
        dartTarget.style.display = "none";
        accuracyText.textContent = "Too slow!";
        avgText.textContent = ""; // needed?

        setTimeout(() => {
            updateScoreUI(0); // missed
            hideDartGame();
        }, 1500);
    }, 3000);

}

// Handle click/aim of user
document.addEventListener("click", (e) => {
    if (dartGame.classList.contains("hidden")) return;
    if (dartTarget.style.display === "none") return;
    if (!dartTarget.contains(e.target)) return;

    clearTimeout(dartTimeout); // cancel dart removal

    const targetRect = dartTarget.getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const distance = Math.hypot(e.clientX - targetCenterX, e.clientY - targetCenterY);
    const maxRadius = targetRect.width / 2;
    let accuracy = Math.max(0, 100 - (distance / maxRadius) * 100);
    accuracy = Math.round(accuracy);

    dartScoreTotal += accuracy;
    dartShots++;

    updateScoreUI(accuracy);
    dartTarget.style.display = "none";
    setTimeout(hideDartGame, 1500);
});
