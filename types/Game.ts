enum ECompletionStatus {
    "Beaten" = "Beaten",
    "Playing" = "Playing",
    "Abandoned" = "Abandoned",
    "Plan to Play" = "Plan to, Play",
    "Completed" = "Completed",
    "Not Played" = "Not, Played",
    "Played" = "Played",
    "On Hold" = "On Hold",
}

export default interface Game {
    "_id": {
        "$guid": string
    }
    "BackgroundImage": string
    "Description": string
    "GenreIds": Array<{
        "$guid": string
    }>
    "Favorite": boolean
    "Icon": string
    "CoverImage": string
    "LastActivity": {
        "$date": string
    }
    "ReleaseDate": string
    "Playtime": {
        "$numberLong": string
    }
    "Added": {
        "$date": string
    }
    "Modified": {
        "$date": string
    }
    "PlayCount": {
        "$numberLong": string
    }
    "CommunityScore": number
    "CompletionStatus": {
        "_id": {
            "$guid": string
        }
        "Name": ECompletionStatus
    }
    "RecentActivity": {
        "$date": string
    }
    "RecentActivitySegment": string
    "Name": string
}