let teams = JSON.parse(localStorage.getItem("teams")) || [];
let matches = JSON.parse(localStorage.getItem("matches")) || [];
let standings = JSON.parse(localStorage.getItem("standings")) || {};

// Renderizar equipos, fixture y tabla al cargar la página
window.onload = () => {
  renderTeams();
  renderFixture();
  renderStandings();
};

// Agregar equipo
document.getElementById("addTeam").addEventListener("click", () => {
  const teamName = document.getElementById("teamName").value.trim();
  if (teamName && !teams.includes(teamName)) {
    teams.push(teamName);
    standings[teamName] = { played: 0, won: 0, drawn: 0, lost: 0, points: 0 };
    saveState();
    renderTeams();
  }
  document.getElementById("teamName").value = "";
});

// Generar Fixture
document.getElementById("generateFixture").addEventListener("click", () => {
  matches = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({ team1: teams[i], team2: teams[j], result: null });
    }
  }
  saveState();
  renderFixture();
});

// Botón para resetear todo
document.getElementById("resetAll").addEventListener("click", () => {
  if (confirm("Sind Sie sicher, dass Sie alles neu starten möchten?")) {
    teams = [];
    matches = [];
    standings = {};
    saveState();
    renderTeams();
    renderFixture();
    renderStandings();
  }
});

// Renderizar Equipos
function renderTeams() {
  const teamDisplay = document.getElementById("teamDisplay");
  teamDisplay.innerHTML = "";
  teams.forEach((team) => {
    teamDisplay.innerHTML += `<li>${team}</li>`;
  });
}

// Renderizar Fixture
function renderFixture() {
  const fixtureDiv = document.getElementById("matches");
  fixtureDiv.innerHTML = "";
  matches.forEach((match, index) => {
    const score1 = match.result ? match.result.score1 : "";
    const score2 = match.result ? match.result.score2 : "";
    const matchDiv = document.createElement("div");
    matchDiv.innerHTML = `
      <p>${match.team1} vs ${match.team2}</p>
      <input type="number" class="tore" id="score1-${index}" placeholder="Tore ${match.team1}" value="">
      <input type="number" class="tore" id="score2-${index}" placeholder="Tore ${match.team2}" value="">
      <button onclick="saveResult(${index})">Ergebnis speichern</button>
      <hr>
    `;
    fixtureDiv.appendChild(matchDiv);
  });
}

// Guardar Resultado
function saveResult(index) {
  const score1 = parseInt(document.getElementById(`score1-${index}`).value);
  const score2 = parseInt(document.getElementById(`score2-${index}`).value);

  if (!isNaN(score1) && !isNaN(score2)) {
    matches[index].result = { score1, score2 };
    updateStandings(matches[index].team1, matches[index].team2, score1, score2);
    saveState();
    renderStandings();

    // Resetear los inputs
    document.getElementById(`score1-${index}`).value = "";
    document.getElementById(`score2-${index}`).value = "";
  }
}

// Actualizar Tabla de Posiciones
function updateStandings(team1, team2, score1, score2) {
  standings[team1].played += 1;
  standings[team2].played += 1;

  if (score1 > score2) {
    standings[team1].won += 1;
    standings[team1].points += 3;
    standings[team2].lost += 1;
  } else if (score1 < score2) {
    standings[team2].won += 1;
    standings[team2].points += 3;
    standings[team1].lost += 1;
  } else {
    standings[team1].drawn += 1;
    standings[team2].drawn += 1;
    standings[team1].points += 1;
    standings[team2].points += 1;
  }
}

// Renderizar Tabla de Posiciones
function renderStandings() {
  const standingsTable = document.getElementById("standingsTable");
  standingsTable.innerHTML = "";

  // Ordenar equipos por puntos en orden descendente
  const sortedTeams = Object.keys(standings).sort((a, b) => standings[b].points - standings[a].points);

  sortedTeams.forEach((team) => {
    const row = `
      <tr>
        <td>${team}</td>
        <td>${standings[team].played}</td>
        <td>${standings[team].points}</td>
      </tr>
    `;
    standingsTable.innerHTML += row;
  });
}


// Guardar estado en localStorage
function saveState() {
  localStorage.setItem("teams", JSON.stringify(teams));
  localStorage.setItem("matches", JSON.stringify(matches));
  localStorage.setItem("standings", JSON.stringify(standings));
}

let countdownInterval;
let remainingTime = 5 * 60; // 5 minutos en segundos
let isRunning = false; // Estado inicial del temporizador

// Elementos del DOM
const timerDisplay = document.getElementById("timer");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");

// Función para actualizar el temporizador en pantalla
function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Función para iniciar o detener el temporizador
function startStopTimer() {
    if (isRunning) {
        // Detener el temporizador
        clearInterval(countdownInterval);
        isRunning = false;
        startStopBtn.textContent = "Start";
    } else {
        // Iniciar el temporizador
        countdownInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateTimerDisplay();
            } else {
                clearInterval(countdownInterval);
                alert("Fertig!!!");
                isRunning = false;
                startStopBtn.textContent = "Start";
            }
        }, 1000);
        isRunning = true;
        startStopBtn.textContent = "Stop";
    }
}

// Función para reiniciar el temporizador
function resetTimer() {
    clearInterval(countdownInterval);
    remainingTime = 5 * 60; // Reiniciar a 5 minutos
    updateTimerDisplay();
    isRunning = false;
    startStopBtn.textContent = "Start";
}

// Asignar eventos a los botones
startStopBtn.addEventListener("click", startStopTimer);
resetBtn.addEventListener("click", resetTimer);

// Inicializar el temporizador en pantalla
updateTimerDisplay();


