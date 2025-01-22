export type { default as Game } from './Game'
export type { default as Genre } from './Genre'
export type GameActivityItem = {
    "DateSession": string
    "ElapsedSeconds": number
}
export type GameActivity = {
    Id: string
    Name: string
    Items: GameActivityItem[]
}
