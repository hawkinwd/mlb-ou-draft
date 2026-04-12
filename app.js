const TEAM_IDS = {
  Yankees:147, 'Red Sox':111, 'Blue Jays':141, Orioles:110, Rays:139,
  Tigers:116, Royals:118, Guardians:114, Twins:142, 'White Sox':145,
  Astros:117, Mariners:136, Rangers:140, Athletics:133, Angels:108,
  Braves:144, Mets:121, Phillies:143, Marlins:146, Nationals:120,
  Cubs:112, Brewers:158, Reds:113, Pirates:134, Cardinals:138,
  Dodgers:119, Padres:135, Giants:137, 'D-backs':109, Rockies:115
};

async function load() {
  const res = await fetch('data.json');
  const data = await res.json();

  const app = document.getElementById('app');

  let html =
    `<div><table>
      <tr><th></th><th>Rank</th><th>Player</th><th>Proj. Correct</th>
      <th>✓</th><th>✗</th><th>Tiebreaker</th></tr>`;

  const worst_pick = {diff: 0, team: null, player: null};
  const best_pick = {diff: Infinity, team: null, player: null};

  data.players.forEach((p,i)=>{
    const correct_teams = p.teams.filter(t => t.correct);
    const incorrect_teams = p.teams.filter(t => !t.correct);
    html += `<tr class="player" onclick="toggle(${i})">
      <td class="chevron">&#9654;</td>
      <td>${i+1}</td>
      <td>${p.name}</td>
      <td>${p.correct}</td>
      <td>${correct_teams.map(t => `<img src="https://www.mlbstatic.com/team-logos/${TEAM_IDS[t.team]}.svg" />`).join("")}
      <td>${incorrect_teams.map(t => `<img src="https://www.mlbstatic.com/team-logos/${TEAM_IDS[t.team]}.svg" />`).join("")}
      <td>${p.tiebreaker}</td>
    </tr>`;

    html += `<tr id="row-${i}" class="hidden"><td colspan="7">
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

      const actual_diff = t.pace - t.line;
      const mult = t.pick === "Over" ? 1 : -1;

      if (actual_diff * mult < worst_pick['diff']) {
        worst_pick['diff'] = actual_diff * mult;
        worst_pick['player'] = p;
        worst_pick['team'] = t;
      } else if (actual_diff * mult > best_pick['diff']) {
        best_pick['diff'] = actual_diff * mult;
        best_pick['player'] = p;
        best_pick['team'] = t;
      }
    });

    html += `</table></td></tr>`;
  });

  html += "</table>";
  html += `<div class="bw-grid">${displayBWCards(worst_pick, 'Worst')} ${displayBWCards(best_pick, 'Best')}</div>`;
  html += `<div style="text-align: right; padding-top: 10px">Last Updated: ${data.last_updated}</div></div>`;
  app.innerHTML = html;
}

function displayBWCards(bw, title) {
  return `
    <div class="bw-card">
      <div class="bw-header ${title === "Best" ? "best" : "worst"}">${title} Pick</div>
      <div class="bw-name">${bw['player'].name}</div>
      <div class="bw-team">
        <img src="https://www.mlbstatic.com/team-logos/${TEAM_IDS[bw['team'].team]}.svg" />
        ${bw['team'].team}
      </div>
      <span class="bw-badge ${bw['team'].pick === "Over" ? "badge-over" : "badge-under"}">
        ${bw['team'].pick}
      </span>
      <div class="bw-stats">
        <div class="stat">
          <span class="stat-label">Pace</span>
          <span class="stat-value">${bw['team'].pace}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Line</span>
          <span class="stat-value">${bw['team'].line}</span>
        </div>
      </div>
    </div>
  `;
}

function toggle(i){
  const row = document.getElementById(`row-${i}`);
  row.classList.toggle("hidden");

  const playerRows = document.querySelectorAll('tr.player');
  const chevron = playerRows[i].querySelector('.chevron');
  const isOpen = !row.classList.contains("hidden");
  chevron.textContent = isOpen ? '▼' : '▶';
}

load();