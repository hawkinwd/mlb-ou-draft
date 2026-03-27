import requests, json
from datetime import datetime
import zoneinfo

URL = "https://statsapi.mlb.com/api/v1/standings?leagueId=103,104"

standings = requests.get(URL).json()

records = {}
for rec in standings["records"]:
    for t in rec["teamRecords"]:
        name = t["team"]["name"]
        records[name] = {
            "wins": t["wins"],
            "losses": t["losses"]
        }

picks = json.load(open("picks.json"))

for player in picks["players"]:
    correct = 0
    tb = 0

    for team in player["teams"]:
        full = team["team"]
        wins = records[full]["wins"]
        losses = records[full]["losses"]

        games = wins + losses
        pace = (wins / games) * 162 if games else 0

        is_correct = (pace > team["line"]) if team["pick"]=="Over" else (pace < team["line"])

        team.update({
            "wins": wins,
            "losses": losses,
            "pace": round(pace,1),
            "correct": is_correct,
            "diff": round(pace - team["guess"],1)
        })

        if is_correct:
            correct += 1
            tb += abs(pace - team["guess"])

    player["correct"] = correct
    player["tiebreaker"] = round(tb,1)

picks["players"].sort(key=lambda x: (-x["correct"], x["tiebreaker"]))

picks["last_updated"] = datetime.now(zoneinfo.ZoneInfo("America/New_York")).strftime("%B %d, %Y, %I:%M %p")

json.dump(picks, open("data.json","w"), indent=2)