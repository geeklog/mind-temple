import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import storage from 'redux-persist/lib/storage';
import { models, RootModel } from './models';
import createPersistPlugin from '@rematch/persist';

const persistPlugin: any = createPersistPlugin({
  key: 'root',
  storage,
  whitelist: ['app'],
  throttle: 5000,
  version: 1,
});

export const store = init({
  models,
  plugins: [persistPlugin]
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
