import type { Module } from './Module'

export default class Injector<T> {
    injectors: Module<T>[]

    constructor(...handlers: Module<T>[]) {
        this.injectors = handlers
    }

    execute(data: T): string[] {
        return this.injectors.map((inj) => inj.execute(data))
    }
}
