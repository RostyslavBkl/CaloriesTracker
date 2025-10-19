import { Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
    loginStart, loginSuccess, loginFailure,
    registerStart, registerSuccess, registerFailure,
    checkAuthStart, checkAuthSuccess, checkAuthFailure,
    logoutStart, logoutSuccess, logoutFailure,
} from './AuthSlices';
import { loginApi, registerApi, meApi, logoutApi } from './Api';
import { AuthResponse } from './Types';

export const loginEpic: Epic = (action$) =>
    action$.pipe(
        ofType(loginStart.type),
        switchMap((action: ReturnType<typeof loginStart>) =>
            from(loginApi(action.payload.email, action.payload.password)).pipe(
                map((result) => {
                    if (result?.errors?.length) {
                        return loginFailure(result.errors[0].message || "Login failed");
                    }

                    const payload: AuthResponse | undefined = result?.data?.login;

                    if (!payload?.success || !payload?.user) {
                        return loginFailure("Invalid data to login");
                    }

                    return loginSuccess({ user: payload.user });
                }),
                catchError((err) => of(loginFailure(err?.message || "Network error")))
            )
        )
    );


export const registerEpic: Epic = (action$) =>
    action$.pipe(
        ofType(registerStart.type),
        switchMap((action: ReturnType<typeof registerStart>) =>
            from(registerApi(action.payload.email, action.payload.password)).pipe(
                map((result) => {
                    if (result?.errors?.[0]?.message) {
                        return registerFailure(result?.errors?.[0]?.message || "Registration failed");
                    }

                    const payload: AuthResponse | undefined = result?.data?.register;

                    if (!payload?.success || !payload.user) {
                        return registerFailure(payload?.message?.trim() || "Registration failed");
                    }

                    return registerSuccess({ user: payload.user });
                }),
                catchError((err) => of(registerFailure(err?.message || "Network error")))
            )
        )
    );

export const checkAuthEpic: Epic = (action$) =>
    action$.pipe(
        ofType(checkAuthStart.type),
        switchMap(() =>
            from(meApi()).pipe(
                map((result) => {
                    if (!result?.data?.me) return checkAuthFailure();
                    return checkAuthSuccess(result?.data?.me);
                }),
                catchError(() => of(checkAuthFailure()))
            )
        )
    );

export const logoutEpic: Epic = (action$) =>
    action$.pipe(
        ofType(logoutStart.type),
        switchMap(() =>
            from(logoutApi()).pipe(
                map((result) => {
                    if (result?.errors?.length || result?.data?.logout !== true) {
                        return logoutFailure("Logout failed");
                    }
                    return logoutSuccess();
                }),
                catchError((err) => of(logoutFailure(err?.message || "Network error")))
            )
        )
    );

export const authEpics = [loginEpic, registerEpic, checkAuthEpic, logoutEpic];
