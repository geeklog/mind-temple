import { createModel } from '@rematch/core';
import { RootModel } from './index';

export type DolphinsState = number;

export const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

export const dolphins = createModel<RootModel>()({
	state: 0,
	reducers: {
		increment: (state: DolphinsState, payload: number) => state + payload,
	},
	effects: (dispatch: any) => {
		const { dolphins } = dispatch
		return {
			async incrementAsync(): Promise<void> {
				await delay(500)
				dolphins.increment(1)
			},
		}
	},
})
