import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './Types';

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state, _action: PayloadAction<{ email: string; password: string }>) => {
            state.loading = true;
            state.error = null;
        },
        registerStart: (state, _action: PayloadAction<{ email: string; password: string }>) => {
            state.loading = true;
            state.error = null;
        },
        checkAuthStart: (state) => {
            state.loading = true;
        },

        loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
            state.loading = false;
            state.user = action.payload.user;
            state.error = null;
        },
        registerSuccess: (state, action: PayloadAction<{ user: User; message?: string }>) => {
            state.loading = false;
            state.user = action.payload.user;
            state.error = null;
            if (action.payload.message) {
                state.error = action.payload.message;
            }
        },
        checkAuthSuccess: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },

        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        registerFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        checkAuthFailure: (state) => {
            state.loading = false;
            state.user = null;
        },

        logoutStart: (state) => {
            state.loading = true;
        },
        logoutSuccess: (state) => {
            state.loading = false;
            state.user = null;
            state.error = null;
        },
        logoutFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    checkAuthStart,
    checkAuthSuccess,
    checkAuthFailure,
    logoutStart,
    logoutSuccess,
    logoutFailure,
    clearError,
} = authSlice.actions;

export default authSlice.reducer;
