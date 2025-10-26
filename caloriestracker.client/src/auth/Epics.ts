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

const normalizeMessage = (raw?: any): string =>
    String(raw || '').toLowerCase().trim();

const isPasswordError = (msg: string): boolean =>
    ['password', 'invalid', 'incorrect', 'credentials', 'unauthorized', '401', 'weak', 'short', 'must be'].some(k => msg.includes(k));

const isEmailNotFoundError = (msg: string): boolean =>
    ['not found', 'no account', '404', 'doesn\'t exist', "doesn't exist", 'not registered', 'no user'].some(k => msg.includes(k));

const isEmailExistsError = (msg: string): boolean =>
    ['exists', 'already', 'taken', 'duplicate', '409', 'registered', 'in use'].some(k => msg.includes(k));

const processGraphQLErrors = (errors: any[], context: 'login' | 'register'): string => {
    if (!errors?.length) return context === 'login' ? 'Login failed' : 'Registration failed';

    const errorMsg = normalizeMessage(errors[0].message);

    if (context === 'login') {
        if (isEmailNotFoundError(errorMsg)) return "Login doesn't exist";
        if (isPasswordError(errorMsg)) return "Invalid email or password";
        return errors[0].message || "Login failed";
    }

    if (isEmailExistsError(errorMsg)) return "Email already exists";
    if (isPasswordError(errorMsg)) return "Password must be at least 6 characters";
    return errors[0].message || "Registration failed";
};

const validateAuthPayload = (payload: AuthResponse | undefined, context: 'login' | 'register'): string | null => {
    if (!payload?.user) {
        const msg = normalizeMessage(payload?.message);

        if (context === 'login') {
            if (isEmailNotFoundError(msg)) return "Login doesn't exist";
            if (isPasswordError(msg)) return "Invalid email or password";
            return payload?.message || "Login doesn't exist";
        }

        if (isEmailExistsError(msg)) return "Email already exists";
        if (isPasswordError(msg)) return "Password must be at least 6 characters";
        return payload?.message || "Registration failed";
    }

    if (payload.success === false) {
        const msg = normalizeMessage(payload.message);

        if (context === 'login') {
            if (isEmailNotFoundError(msg)) return "Login doesn't exist";
            if (isPasswordError(msg)) return payload.message || "Invalid email or password";
            return payload.message || "Invalid email or password";
        }

        if (isEmailExistsError(msg)) return "Email already exists";
        if (isPasswordError(msg)) return payload.message || "Password must be at least 6 characters";
        return payload.message || "Registration failed";
    }

    return null;
};

export const loginEpic: Epic = (action$) =>
    action$.pipe(
        ofType(loginStart.type),
        switchMap((action: ReturnType<typeof loginStart>) => {
            const { email, password } = action.payload;

            return from(loginApi(email, password)).pipe(
                map((result) => {
                    if (result?.errors?.length) {
                        return loginFailure(processGraphQLErrors(result.errors, 'login'));
                    }

                    const payload: AuthResponse | undefined = result?.data?.login;

                    const error = validateAuthPayload(payload, 'login');
                    if (error) return loginFailure(error);

                    if (!payload?.user) {
                        return loginFailure("Login failed");
                    }

                    return loginSuccess({ user: payload.user });
                }),
                catchError((err) => of(loginFailure(err?.message || "Network error. Please try again.")))
            );
        })
    );

export const registerEpic: Epic = (action$) =>
    action$.pipe(
        ofType(registerStart.type),
        switchMap((action: ReturnType<typeof registerStart>) =>
            from(registerApi(action.payload.email, action.payload.password)).pipe(
                map((result) => {
                    if (result?.errors?.length) {
                        return registerFailure(processGraphQLErrors(result.errors, 'register'));
                    }

                    const payload: AuthResponse | undefined = result?.data?.register;

                    const error = validateAuthPayload(payload, 'register');
                    if (error) return registerFailure(error);

                    if (!payload?.user) {
                        return registerFailure("Registration failed");
                    }

                    return registerSuccess({ user: payload.user });
                }),
                catchError((err) => of(registerFailure(err?.message || "Network error. Please try again.")))
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
                    if (result?.errors?.length) {
                        return logoutFailure(result.errors[0]?.message || "Logout failed");
                    }

                    if (result?.data?.logout === false) {
                        return logoutFailure("Logout failed");
                    }

                    return logoutSuccess();
                }),
                catchError((err) => of(logoutFailure(err?.message || "Network error")))
            )
        )
    );

export const authEpics = [loginEpic, registerEpic, checkAuthEpic, logoutEpic];