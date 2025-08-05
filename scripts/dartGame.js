let dartScoreTotal = 0;
let dartShots = 0;
let dartTimeout;

const dartGame = document.getElementById("dart-game");
const dartTarget = document.getElementById("dart-target");
const accuracyText = document.getElementById("accuracy");
const avgText = document.getElementById("average");
const dartMessage = document.getElementById("dart-message");

function updateScoreUI(accuracy) {
    const avg = dartShots ? Math.round(dartScoreTotal / dartShots) : 0;
    accuracyText.textContent = `Accuracy: ${accuracy}%`;
    avgText.textContent = `Avg: ${avg}%`;
}

function hideDartGame() {
    document.body.style.overflow = '';
    dartGame.classList.add("hidden");
}

function startDartGame() {
    challengeArea.classList.add("hidden");
    dartGame.classList.remove("hidden");
    dartTarget.style.visibility = "visible";

    disableUI();

    // Avoid placement bugs and overflow
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';


    const gameRect = dartGame.getBoundingClientRect();
    const targetSize = 100;
    const padding = 20;

    const maxX = gameRect.width - targetSize - padding;
    const maxY = gameRect.height - targetSize - padding;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    dartTarget.style.left = `${randomX}px`;
    dartTarget.style.top = `${randomY}px`;

    dartTimeout = setTimeout(() => {
        dartTarget.style.visibility = "hidden";

        dartMessage.textContent = "Too slow!";
        dartMessage.classList.remove("hidden");


        setTimeout(() => {
            dartMessage.classList.add("hidden");
            updateScoreUI(0); // missed
            hideDartGame();
            enableUI();
        }, 1000);
    }, 1500);

}

// temporarily disable all other pointer events
function disableUI() {
    document.querySelectorAll("body > *:not(#dart-game)").forEach(el => {
        el.style.pointerEvents = "none";
    });
}

function enableUI() {
    document.querySelectorAll("body > *:not(#dart-game)").forEach(el => {
        el.style.removeProperty("pointer-events");
    });
}

// Handle click/aim of user
document.addEventListener("click", (e) => {
    if (
        dartGame.classList.contains("hidden") ||
        dartTarget.style.visibility === "hidden" ||
        !dartTarget.contains(e.target)
    ) return;
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
    dartTarget.style.visibility = "hidden";

    setTimeout(() => {
        hideDartGame();
        enableUI(); // fixes pointer issue after successful hit
    }, 300);
});
