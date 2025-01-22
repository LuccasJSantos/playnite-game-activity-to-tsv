import type { GameActivity, GameActivityItem } from '../types';

export interface Module<T> {
    execute(data: T): string
}

export interface ActivityModule extends Module<{
    activity: GameActivity
    item: GameActivityItem
}> { }