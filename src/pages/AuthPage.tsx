import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
	const { login, register, loading } = useAuth();
	const [mode, setMode] = useState<'login' | 'register'>('login');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');

	const submit = async () => {
		if (mode === 'login') await login(email, password);
		else await register(email, password, name || null);
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-sm bg-white border rounded-lg p-6 space-y-4">
				<h1 className="text-xl font-semibold">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
				{mode === 'register' && (
					<div>
						<label className="text-sm text-gray-700">Name</label>
						<Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
					</div>
				)}
				<div>
					<label className="text-sm text-gray-700">Email</label>
					<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
				</div>
				<div>
					<label className="text-sm text-gray-700">Password</label>
					<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
				</div>
				<Button onClick={submit} disabled={loading} className="w-full">{mode === 'login' ? 'Sign in' : 'Sign up'}</Button>
				<Button variant="ghost" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full">
					{mode === 'login' ? "Don't have an account? Sign up" : 'Have an account? Sign in'}
				</Button>
			</div>
		</div>
	);
}
