import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import authReducer from '../auth/AuthSlices';
import { authEpics } from '../auth/Epics';

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefault) =>
        getDefault({ serializableCheck: false }).concat(epicMiddleware),
});

epicMiddleware.run(combineEpics(...authEpics));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
