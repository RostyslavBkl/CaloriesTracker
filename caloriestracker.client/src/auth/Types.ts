export interface User {
    id: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: User;
}
