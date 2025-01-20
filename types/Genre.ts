enum EGenre {
    "Sport" = "Sport",
    "Tactical" = "Tactical",
    "Racing" = "Racing",
    "Indie" = "Indie",
    "Shooter" = "Shooter",
    "Hack and slash/Beat 'em up" = "Hack and slash/Beat 'em up",
    "Arcade" = "Arcade",
    "Platform" = "Platform",
    "Puzzle" = "Puzzle",
    "Visual Novel" = "Visual Novel",
    "Point-and-click" = "Point-and-click",
    "Fighting" = "Fighting",
    "Adventure" = "Adventure",
    "Turn-based strategy (TBS)" = "Turn-based strategy (TBS)",
    "Music" = "Music",
    "Card & Board Game" = "Card & Board Game",
    "Role-playing (RPG)" = "Role-playing (RPG)",
    "Real Time Strategy (RTS)" = "Real Time Strategy (RTS)",
    "Strategy" = "Strategy",
    "Simulator" = "Simulator",
    "Pinball" = "Pinball",
    "Quiz/Trivia" = "Quiz/Trivia",
    "MOBA" = "MOBA",
}

export default interface Genre {
    "_id": {
        "$guid": string
    }
    "Name": EGenre
    "Priority": number
}