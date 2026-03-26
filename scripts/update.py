import requests, json

URL = "https://statsapi.mlb.com/api/v1/standings?leagueId=103,104"

TEAM_MAP = {
 "Yankees":"New York Yankees","Mariners":"Seattle Mariners","Tigers":"Detroit Tigers","Royals":"Kansas City Royals","Giants":"San Francisco Giants",
 "Cubs":"Chicago Cubs","Mets":"New York Mets","Athletics":"Oakland Athletics","Astros":"Houston Astros","Red Sox":"Boston Red Sox",
 "Brewers":"Milwaukee Brewers","Pirates":"Pittsburgh Pirates","Dodgers":"Los Angeles Dodgers","Angels":"Los Angeles Angels","Twins":"Minnesota Twins",
 "Braves":"Atlanta Braves","Diamondbacks":"Arizona Diamondbacks","Nationals":"Washington Nationals","Guardians":"Cleveland Guardians","Rockies":"Colorado Rockies",
 "Reds":"Cincinnati Reds","Padres":"San Diego Padres","Phillies":"Philadelphia Phillies","Cardinals":"St. Louis Cardinals","Blue Jays":"Toronto Blue Jays",
 "White Sox":"Chicago White Sox","Rangers":"Texas Rangers","Orioles":"Baltimore Orioles","Marlins":"Miami Marlins","Rays":"Tampa Bay Rays"
}

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
        full = TEAM_MAP[team["team"]]
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

json.dump(picks, open("data.json","w"), indent=2)