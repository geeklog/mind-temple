import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import createRematchPersist from '@rematch/persist';
import storage from 'redux-persist/lib/storage'
import { models, RootModel } from './models';

const persistPlugin: any = createRematchPersist({
  key: 'root',
  storage,
  whitelist: ['app'],
  throttle: 1000,
  version: 1,
})

export const store = init({
  models,
  plugins: [persistPlugin]
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
