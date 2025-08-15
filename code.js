let gameData = { player1: "", player2: "", scores: [], roundTimers: [] };

function startGame() {
    const player1Name = document.getElementById("player1").value.trim();
    const player2Name = document.getElementById("player2").value.trim();

    if (!player1Name || !player2Name) {
        alert("يرجى إدخال أسماء اللاعبين أولاً!");
        return;
    }

    gameData.player1 = player1Name;
    gameData.player2 = player2Name;
    gameData.scores = [];
    gameData.roundTimers = [];

    document.getElementById("header1").textContent = player1Name;
    document.getElementById("header2").textContent = player2Name;

    document.getElementById("setup").style.display = "none";
    document.getElementById("gameBoard").style.display = "block";

    updateTotals();
    addRound();
}

function addRound() {
    if (isGameFinished()) return;

    const scoresBody = document.getElementById("scoresBody");
    const roundNumber = gameData.scores.length + 1;

    const row = document.createElement("tr");
    row.innerHTML = `
    <td>
      <input
        type="number"
        class="score-input"
        id="p1_round${roundNumber}"
        placeholder="0" min="0" max="751" step="1"
        inputmode="numeric" pattern="[0-9]*"
        onchange="updateTotals(); startRoundTimer(${roundNumber})"
      />
    </td>
    <td>
      <input
        type="number"
        class="score-input"
        id="p2_round${roundNumber}"
        placeholder="0" min="0" max="751" step="1"
        inputmode="numeric" pattern="[0-9]*"
        onchange="updateTotals(); startRoundTimer(${roundNumber})"
      />
    </td>
  `;

    scoresBody.appendChild(row);
    gameData.scores.push({ player1: 0, player2: 0 });
    gameData.roundTimers.push(null);

    document.getElementById(`p1_round${roundNumber}`).focus();
}

function startRoundTimer(roundNumber) {
    if (gameData.roundTimers[roundNumber - 1]) {
        clearTimeout(gameData.roundTimers[roundNumber - 1]);
    }
    gameData.roundTimers[roundNumber - 1] = setTimeout(() => {
        lockRoundInputs(roundNumber);
    }, 20000);
}

function lockRoundInputs(roundNumber) {
    const p1Input = document.getElementById(`p1_round${roundNumber}`);
    const p2Input = document.getElementById(`p2_round${roundNumber}`);
    if (p1Input && p2Input) {
        p1Input.disabled = true;
        p2Input.disabled = true;
    }
}

function updateTotals() {
    let total1 = 0;
    let total2 = 0;

    gameData.scores.forEach((score, index) => {
        const roundNumber = index + 1;
        const p1Input = document.getElementById(`p1_round${roundNumber}`);
        const p2Input = document.getElementById(`p2_round${roundNumber}`);

        if (p1Input && p2Input) {
            const p1Score = parseInt(p1Input.value) || 0;
            const p2Score = parseInt(p2Input.value) || 0;

            gameData.scores[index] = { player1: p1Score, player2: p2Score };

            total1 += p1Score;
            total2 += p2Score;
        }
    });

    const total1Element = document.getElementById("total1");
    const total2Element = document.getElementById("total2");

    total1Element.textContent = total1;
    total2Element.textContent = total2;

    total1Element.className = "total-score";
    total2Element.className = "total-score";

    if (total1 >= 751) {
        total1Element.classList.add("loser");
        if (total2 < 751) total2Element.classList.add("winner");
        showGameResult(gameData.player2, gameData.player1);
    } else if (total2 >= 751) {
        total2Element.classList.add("loser");
        total1Element.classList.add("winner");
        showGameResult(gameData.player1, gameData.player2);
    } else {
        document.getElementById("gameStatus").innerHTML = "";
    }
}

function isGameFinished() {
    const total1 = parseInt(document.getElementById("total1").textContent) || 0;
    const total2 = parseInt(document.getElementById("total2").textContent) || 0;
    return total1 >= 751 || total2 >= 751;
}

function showGameResult(winner, loser) {
    const gameStatus = document.getElementById("gameStatus");
    const loserName = loser.toLowerCase().trim();
    const loserImage = (loserName === "كنان" || loserName === "kenan")
        ? '<br><img src="https://i.imgur.com/WGq9YR9.jpeg" alt="كنان" class="loser-image" style="width:100px !important; height:auto !important; display:inline-block; vertical-align:middle;">'
        : '';

        let soundFile = "gameover.mp3"; // الصوت الافتراضي
    if (loserName === "صقر" || loserName === "sa8rgg") {
        soundFile = "sa8rgg.mp3"; // الصوت الخاص بصقر
    }
    endGameSound.volume = 0.9; // اختياري
    endGameSound.play().catch(() => {}); // لتفادي مشاكل التشغيل التلقائي


    gameStatus.innerHTML = `
    <div class="game-won">
      🎉 تهانينا! ${winner} فاز باللعبة!<br>
      😔 ${loser} خسر بوصوله إلى 751 نقطة
      ${loserImage}
    </div>
  `;
}

function resetScores() {
    if (!confirm("هل أنت متأكد من مسح جميع النتائج؟")) return;

    gameData.roundTimers.forEach((t) => t && clearTimeout(t));
    document.getElementById("scoresBody").innerHTML = "";
    gameData.scores = [];
    gameData.roundTimers = [];
    document.getElementById("total1").textContent = "0";
    document.getElementById("total2").textContent = "0";
    document.getElementById("total1").className = "total-score";
    document.getElementById("total2").className = "total-score";
    document.getElementById("gameStatus").innerHTML = "";
    addRound();
}

function newGame() {
    if (!confirm("هل تريد بدء لعبة جديدة؟ سيتم فقدان النتائج الحالية.")) return;

    gameData.roundTimers.forEach((t) => t && clearTimeout(t));

    document.getElementById("setup").style.display = "block";
    document.getElementById("gameBoard").style.display = "none";
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";
    document.getElementById("scoresBody").innerHTML = "";
    document.getElementById("gameStatus").innerHTML = "";
    gameData = { player1: "", player2: "", scores: [], roundTimers: [] };
}

document.getElementById("player1").addEventListener("keypress", function (e) {
    if (e.key === "Enter") document.getElementById("player2").focus();
});
document.getElementById("player2").addEventListener("keypress", function (e) {
    if (e.key === "Enter") startGame();
});
