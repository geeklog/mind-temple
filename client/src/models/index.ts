import { Models } from '@rematch/core'
import { dolphins } from './dolphins'

export interface RootModel extends Models<RootModel> {
	dolphins: typeof dolphins
}

export const models: RootModel = { dolphins }