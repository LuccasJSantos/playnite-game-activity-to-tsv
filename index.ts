import fs from 'fs/promises'
import { DateTime } from 'luxon'

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

const buildTSV = (activities: GameActivity[]): string => {
    const columns = [['Id', 'Name', 'SessionDate', 'HoursPlayed']]

    const sortByDateDesc = (rowA: any[], rowB: any[]) => rowA[2] < rowB[2] ? 1 : -1

    const table = activities.flatMap((activity) => {
        const items = activity.Items.map<any[]>((item) => {
            const date = DateTime.fromISO(item.DateSession)
            return [activity.Id, activity.Name, date.toFormat('yyyy-MM-dd HH:mm:ss'), item.ElapsedSeconds / 86400]
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