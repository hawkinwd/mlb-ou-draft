async function loadData() {
  const res = await fetch('data.json');
  const data = await res.json();

  const container = document.getElementById('standings');

  let html = '<table><tr><th>Player</th><th>Correct</th><th>Tiebreaker</th></tr>';

  data.players.forEach(p => {
    html += `<tr>
      <td>${p.name}</td>
      <td>${p.correct}</td>
      <td>${p.tiebreaker}</td>
    </tr>`;
  });

  html += '</table>';
  container.innerHTML = html;
}

loadData();