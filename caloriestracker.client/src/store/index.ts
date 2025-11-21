import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import authReducer from '../auth/AuthSlices';
import { authEpics } from '../auth/Epics';
import nutritionGoalReducer from '../nutrition/nutritionGoalSlice';
import { nutritionGoalEpics } from '../nutrition/nutritionGoalEpics';

const epicMiddleware = createEpicMiddleware();

const rootEpic = combineEpics(
    ...authEpics,
    ...nutritionGoalEpics
);

export const store = configureStore({
    reducer: {
        auth: authReducer,
        nutritionGoal: nutritionGoalReducer,
    },
    middleware: getDefault =>
        getDefault({ serializableCheck: false }).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
