'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!email.trim() || !password.trim()) {
            toast.error('กรุณากรอก Email และ Password', { duration: 2000 });
            return;
        }

        if (!email.includes('@')) {
            toast.error('รูปแบบ Email ไม่ถูกต้อง', { duration: 2000 });
            return;
        }

        setIsLoading(true);

        try {
            const { authAPI } = await import('@/services/api/auth');
            const response = await authAPI.login({ email, password });
            authAPI.setToken(response.token);
            toast.success('เข้าสู่ระบบสำเร็จ!', { duration: 2000 });
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
            toast.error(errorMessage, { duration: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#034A30] via-[#045A3C] to-[#056648] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="mb-4">
                        <h1 className="text-4xl font-bold text-white mb-2">DUKE FARM</h1>
                        <p className="text-emerald-200 text-lg">Admin Dashboard</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        เข้าสู่ระบบ
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@dukefarm.com"
                                disabled={isLoading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034A30] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034A30] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:cursor-not-allowed"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-[#034A30] border-gray-300 rounded focus:ring-[#034A30] cursor-pointer"
                                    disabled={isLoading}
                                />
                                <span className="ml-2 text-gray-600">จดจำฉันไว้</span>
                            </label>
                            <button
                                type="button"
                                className="text-[#034A30] hover:text-[#045A3C] font-medium transition-colors"
                                disabled={isLoading}
                            >
                                ลืมรหัสผ่าน?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#034A30] hover:bg-[#045A3C] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>กำลังเข้าสู่ระบบ...</span>
                                </>
                            ) : (
                                <span>เข้าสู่ระบบ</span>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-800 font-medium mb-2">
                            🔑 ข้อมูลทดสอบ (Demo):
                        </p>
                        <p className="text-xs text-amber-700">
                            Email: <code className="bg-amber-100 px-2 py-1 rounded">admin@dukefarm.com</code>
                        </p>
                        <p className="text-xs text-amber-700">
                            Password: <code className="bg-amber-100 px-2 py-1 rounded">admin123</code>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-emerald-100 text-sm">
                        © 2025 DukeFarm. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
