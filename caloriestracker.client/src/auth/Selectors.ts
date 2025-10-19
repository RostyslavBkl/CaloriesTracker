import { RootState } from '../store';

export const selectUser = (s: RootState) => s.auth.user;
export const selectAuthLoading = (s: RootState) => s.auth.loading;
export const selectAuthError = (s: RootState) => s.auth.error;
export const selectIsAuthenticated = (s: RootState) =>
    !!s.auth.user && (!!(s.auth.user as any).id || !!(s.auth.user as any).token);