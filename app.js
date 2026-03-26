async function load() {
  const res = await fetch('data.json');
  const data = await res.json();

  const app = document.getElementById('app');

  let html = `<table>
    <tr><th>Rank</th><th>Player</th><th>Correct</th><th>Tiebreaker</th></tr>`;

  data.players.forEach((p,i)=>{
    html += `<tr class="player" onclick="toggle(${i})">
      <td>${i+1}</td>
      <td>${p.name}</td>
      <td>${p.correct}</td>
      <td>${p.tiebreaker}</td>
    </tr>`;

    html += `<tr id="row-${i}" class="hidden"><td colspan="4">
      <table>
        <tr>
          <th>Team</th><th>Pick</th><th>Line</th>
          <th>Record</th><th>Pace</th><th>Guess</th><th>Status</th>
        </tr>`;

    p.teams.forEach(t=>{
      html += `<tr>
        <td>${t.team}</td>
        <td>${t.pick}</td>
        <td>${t.line}</td>
        <td>${t.wins}-${t.losses}</td>
        <td>${t.pace}</td>
        <td>${t.guess}</td>
        <td class="${t.correct?'correct':'wrong'}">${t.correct?'✓':'✗'}</td>
      </tr>`;
    });

    html += `</table></td></tr>`;
  });

  html += "</table>";
  app.innerHTML = html;
}

function toggle(i){
  const row = document.getElementById(`row-${i}`);
  row.classList.toggle("hidden");
}

load();