import { DateTime } from 'luxon'

import type { Game as IGame, Genre as IGenre, GenrePriority as IGenrePriority } from '../types';
import type { ActivityModule } from './Module'

import GameLiteDB from '../db/Game.json' with { type: 'json' }
import GenreLiteDB from '../db/Genre.json' with { type: 'json' }
import GenrePriorityLiteDB from '../db/GenrePriority.json' with { type: 'json' }

const GameDB = GameLiteDB as IGame[]
const GenreDB = GenreLiteDB as IGenre[]
const GenrePriorityDB = GenrePriorityLiteDB as IGenrePriority[]

export const Id: ActivityModule = {
    execute(data) {
        return data.activity.Id
    }
}

export const Name: ActivityModule = {
    execute(data) {
        return data.activity.Name
    }
}

export const Genre: ActivityModule = {
    execute(data) {
        const gameData = GameDB.find((game) => game._id.$guid === data.activity.Id)

        if (!gameData || !gameData.GenreIds) return 'Undefined'

        // Prioritize Genre
        const genreSortedByPriority = GenrePriorityDB.sort((genreA, genreB) => genreA.priority < genreB.priority ? -1 : 1)
        const genreId = genreSortedByPriority.find((genrePriority) => {
            return gameData.GenreIds.find((gameGenre) => gameGenre.$guid === genrePriority.id)
        }).id

        const genre = GenreDB.find(genre => genre._id.$guid === genreId)

        if (!genre) return 'Undefined'

        return genre.Name
    }
}

export const DateSession: ActivityModule = {
    execute(data) {
        const date = DateTime.fromISO(data.item.DateSession)
        return date.toFormat('yyyy-MM-dd HH:mm:ss')
    }
}

export const TimePlayed: ActivityModule = {
    execute(data) {
        return String(data.item.ElapsedSeconds / 86400)
    }
}