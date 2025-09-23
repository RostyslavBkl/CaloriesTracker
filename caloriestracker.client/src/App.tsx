import { useState } from 'react';
import './App.css';

type Nullable<T> = T | null;

interface User {
    id: number;
    email: string;
    passwordHash: string;
    salt: string;
    displayName?: Nullable<string>;
    sex?: Nullable<string>;
    birthDate?: Nullable<string>;
    heightCm?: Nullable<number>;
    weightKg?: Nullable<number>;
    preferredHeightUnit: string;
    preferredWeightUnit: string;
}

export default function App() {
    const [userId, setUserId] = useState<string>('1');
    const [loadedUser, setLoadedUser] = useState<User | null>(null);
    const [creating, setCreating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function getUserById() {
        setError(null);
        setLoadedUser(null);

        const idNum = Number(userId);
        if (!Number.isFinite(idNum) || idNum <= 0) {
            setError('Enter a valid numeric id.');
            return;
        }

        try {
            const resp = await fetch(`/api/users/${idNum}`, { method: 'GET' });
            if (resp.status === 404) {
                setError('User not found.');
                return;
            }
            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`GET failed: ${resp.status} ${text}`);
            }
            const data: User = await resp.json();
            setLoadedUser(data);
        } catch (e: any) {
            setError(e.message ?? 'Request failed');
        }
    }

    async function createUser() {
        setError(null);
        setCreating(true);
        try {
            const body: Partial<User> = {
                email: 'test@example.com',
                passwordHash: 'hash',
                salt: 'salt',
                displayName: 'Test User',
                sex: null,
                birthDate: null,
                heightCm: null,
                weightKg: null,
                preferredHeightUnit: 'cm',
                preferredWeightUnit: 'kg'
            };

            const resp = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`POST failed: ${resp.status} ${text}`);
            }

            const newId: number = await resp.json();
            setUserId(String(newId));
            await getUserById();
        } catch (e: any) {
            setError(e.message ?? 'Request failed');
        } finally {
            setCreating(false);
        }
    }

    return (
        <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
            <h1>Users</h1>

            <section style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                <label>
                    User Id:&nbsp;
                    <input
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        inputMode="numeric"
                        style={{ padding: '0.4rem' }}
                    />
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={getUserById}>Load user</button>
                    <button onClick={createUser} disabled={creating}>
                        {creating ? 'Creating...' : 'Create sample user'}
                    </button>
                </div>
            </section>

            {error && (
                <div style={{ background: '#fee', border: '1px solid #f99', padding: '0.75rem', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {loadedUser && (
                <table className="table table-striped" aria-label="user">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Email</th>
                            <th>DisplayName</th>
                            <th>BirthDate</th>
                            <th>HeightCm</th>
                            <th>WeightKg</th>
                            <th>HeightUnit</th>
                            <th>WeightUnit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{loadedUser.id}</td>
                            <td>{loadedUser.email}</td>
                            <td>{loadedUser.displayName ?? '-'}</td>
                            <td>{loadedUser.birthDate ?? '-'}</td>
                            <td>{loadedUser.heightCm ?? '-'}</td>
                            <td>{loadedUser.weightKg ?? '-'}</td>
                            <td>{loadedUser.preferredHeightUnit}</td>
                            <td>{loadedUser.preferredWeightUnit}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
}
