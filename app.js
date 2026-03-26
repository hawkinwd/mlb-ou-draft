async function load() {
  const res = await fetch('data.json');
  const data = await res.json();

  const app = document.getElementById('app');

const TEAM_IDS = {
  Yankees:147, 'Red Sox':111, 'Blue Jays':141, Orioles:110, Rays:139,
  Tigers:116, Royals:118, Guardians:114, Twins:142, 'White Sox':145,
  Astros:117, Mariners:136, Rangers:140, Athletics:133, Angels:108,
  Braves:144, Mets:121, Phillies:143, Marlins:146, Nationals:120,
  Cubs:112, Brewers:158, Reds:113, Pirates:134, Cardinals:138,
  Dodgers:119, Padres:135, Giants:137, 'D-backs':109, Rockies:115
};

  let html = `<div><table>
    <tr><th>Rank</th><th>Player</th><th>Proj. Correct</th><th>✓</th><th>✗</th><th>Tiebreaker</th></tr>`;

  data.players.forEach((p,i)=>{
    correct_teams = p.teams.filter(t => t.correct);
    incorrect_teams = p.teams.filter(t => !t.correct);
    html += `<tr class="player" onclick="toggle(${i})">
      <td>${i+1}</td>
      <td>${p.name}</td>
      <td>${p.correct}</td>
      <td>${correct_teams.map(t => `<img src="https://www.mlbstatic.com/team-logos/${TEAM_IDS[t.team]}.svg" />`).join("")}
      <td>${incorrect_teams.map(t => `<img src="https://www.mlbstatic.com/team-logos/${TEAM_IDS[t.team]}.svg" />`).join("")}
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
        <td>
          <img src="https://www.mlbstatic.com/team-logos/${TEAM_IDS[t.team]}.svg" />
          ${t.team}
        </td>
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
  html += `<div style="text-align: right;">Last Updated: ${data.last_updated}</div></div>`;
  app.innerHTML = html;
}

function toggle(i){
  const row = document.getElementById(`row-${i}`);
  row.classList.toggle("hidden");
}

load();