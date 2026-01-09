import { useState } from 'react';
import { Lock, User as UserIcon, Shield, Mail, Warehouse } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { UserRole } from '../types';

export function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('Searcher');
    const [godownId, setGodownId] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload: any = {
                username,
                email,
                password,
                role
            };

            if (godownId) {
                payload.godownId = parseInt(godownId);
            }

            const { data } = await api.post('/auth/register', payload);

            // Auto login after register
            login(data.token, data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Try a different email/username.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join the Stock Manager System</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            icon={UserIcon}
                            label="Username"
                            required
                        />

                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            label="Email"
                            required
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            label="Password"
                            required
                        />

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Shield size={20} />
                                </div>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                                >
                                    <option value="Searcher">Searcher</option>
                                    <option value="StockInCharge">Stock In-Charge</option>
                                    <option value="Supervisor">Supervisor (Admin)</option>
                                </select>
                            </div>
                        </div>

                        <Input
                            type="number"
                            placeholder="Godown ID (Optional)"
                            value={godownId}
                            onChange={(e) => setGodownId(e.target.value)}
                            icon={Warehouse}
                            label="Godown ID"
                        />

                        {(role === 'StockInCharge' || role === 'Supervisor') && (
                            <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-700">
                                Note: creating elevated roles is currently unrestricted for demo purposes.
                            </div>
                        )}

                        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
