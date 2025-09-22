import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

type AuthState = {
	token: string | null;
	email: string | null;
	name: string | null;
	loading: boolean;
};

type AuthContextType = AuthState & {
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name?: string | null) => Promise<void>;
	logout: () => void;
};

const AuthCtx = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<AuthState>({ token: null, email: null, name: null, loading: true });

	useEffect(() => {
		const token = localStorage.getItem('auth_token');
		if (!token) return setState((s) => ({ ...s, loading: false }));
		(async () => {
			try {
				const me = await api<{ id: string; email: string; name?: string }>(`/me`, 'GET', undefined, token);
				setState({ token, email: me.email || null, name: me.name || null, loading: false });
			} catch {
				localStorage.removeItem('auth_token');
				setState({ token: null, email: null, name: null, loading: false });
			}
		})();
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		const { token } = await api<{ token: string }>(`/auth/login`, 'POST', { email, password });
		localStorage.setItem('auth_token', token);
		const me = await api<{ id: string; email: string; name?: string }>(`/me`, 'GET', undefined, token);
		setState({ token, email: me.email || null, name: me.name || null, loading: false });
	}, []);

	const register = useCallback(async (email: string, password: string, name?: string | null) => {
		const { token } = await api<{ token: string }>(`/auth/register`, 'POST', { email, password, name });
		localStorage.setItem('auth_token', token);
		const me = await api<{ id: string; email: string; name?: string }>(`/me`, 'GET', undefined, token);
		setState({ token, email: me.email || null, name: me.name || null, loading: false });
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem('auth_token');
		setState({ token: null, email: null, name: null, loading: false });
	}, []);

	const value = useMemo(() => ({ ...state, login, register, logout }), [state, login, register, logout]);

	return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthCtx);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
