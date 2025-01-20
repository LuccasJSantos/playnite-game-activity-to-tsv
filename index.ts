import fs from 'fs/promises'
import { DateTime } from 'luxon'

import type IGame from './types/Game'
import type IGenre from './types/Genre'

import GameLiteDB from './db/Game.json' with { type: 'json' }
import GenreLiteDB from './db/Genre.json' with { type: 'json' }

const GameDB = GameLiteDB as IGame[]
const GenreDB = GenreLiteDB as IGenre[]

const PATH = `${process.env.APPDATA}\\Playnite\\ExtensionsData\\afbb1a0d-04a1-4d0c-9afa-c6e42ca855b4\\GameActivity`
const OUTPUT_FILENAME = 'Game Activity.tsv'

type GameActivity = {
    Id: string
    Name: string
    Items: Array<{
        "DateSession": string,
        "ElapsedSeconds": number,
    }>
}

const writeFile = (path: string, filename: string, data: string) => {
    return fs.writeFile(`${path}\\${filename}`, data, { encoding: 'utf-8' })
}

const readFiles = async <T>(path: string) => {
    const files = await fs.readdir(path, { encoding: 'utf-8' })

    const promises = files
        .filter(file => file.includes('.json'))
        .map(file => fs.readFile(`${path}\\${file}`, { encoding: 'utf-8' }))

    return Promise.allSettled(promises)
        .then(res => res.filter(it => it.status === 'fulfilled'))
        .then<T[]>(res => res.map(res => JSON.parse(res.value)))
}

const getGenreByGameId = (id: string) => {
    const gameData = GameDB.find((game) => game._id.$guid === id)

    if (!gameData || !gameData.GenreIds) return 'Undefined'

    // Get genre by priority
    const genreId = GenreDB
        .sort((genreA, genreB) => genreA.Priority < genreB.Priority ? -1 : 1)
        .find((genre) => {
            return gameData.GenreIds.find((gameGenre) => gameGenre.$guid === genre._id.$guid)
        })

    const genre = GenreDB.find((genre) => genre._id.$guid === genreId?._id.$guid)

    if (!genre) return 'Undefined'

    return genre.Name
}

const buildTSV = (activities: GameActivity[]): string => {
    const columns = [['Id', 'Name', 'Genre', 'SessionDate', 'HoursPlayed']]

    const sortByDateDesc = (rowA: any[], rowB: any[]) => rowA[3] < rowB[3] ? 1 : -1

    const table = activities.flatMap((activity) => {
        const items = activity.Items.map<any[]>((item) => {
            const date = DateTime.fromISO(item.DateSession)
            const genre = getGenreByGameId(activity.Id)
            return [activity.Id, activity.Name, genre, date.toFormat('yyyy-MM-dd HH:mm:ss'), item.ElapsedSeconds / 86400]
        })

        return items
    }).sort(sortByDateDesc)

    return columns.concat(table).join('\n').replace(/\,/g, '\t')
}

const init = async () => {
    const content = await readFiles<GameActivity>(PATH)
        .then(activities => activities.filter(activity => Boolean(activity.Items.length)))
        .then(buildTSV)

    await writeFile(PATH, OUTPUT_FILENAME, content)
}

init()