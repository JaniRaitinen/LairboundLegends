class Shard:

    def __init__(self, goalid, weather, name, icon, reached):
        self.goalid = goalid
        self.weather = weather
        self.name = name
        self.icon = "https://openweathermap.org/img/wn/" + icon + ".png"
        self.reached = reached

# done
