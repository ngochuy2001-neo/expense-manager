'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import * as api from '../../lib/api';
import ErrorAlert from '../components/ErrorAlert';

/** Map lỗi theo field từ backend (first_name, last_name...) sang field form (fullName, username...) */
function mapRegisterFieldErrors(
  fieldErrors: Record<string, string[]>
): Record<string, string[]> {
  const mapped: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (key === 'first_name' || key === 'last_name') {
      mapped.fullName = mapped.fullName || [];
      mapped.fullName.push(...messages);
    } else {
      mapped[key] = messages;
    }
  }
  return mapped;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const clearError = () => {
    setError('');
    setFieldErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    const name = e.target.name;
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!formData.fullName || formData.fullName.trim().length === 0) {
      setError('Vui lòng nhập họ tên đầy đủ');
      return;
    }

    // Phải có ít nhất một trong hai (email hoặc phoneNumber)
    const hasEmail = formData.email && formData.email.trim().length > 0;
    const hasPhone = formData.phoneNumber && formData.phoneNumber.trim().length > 0;
    
    if (!hasEmail && !hasPhone) {
      setError('Vui lòng nhập email hoặc số điện thoại');
      return;
    }

    // Validate email format if provided
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Email không hợp lệ');
      return;
    }

    // Validate phone number format if provided
    if (hasPhone && !/^[0-9]{10,11}$/.test(formData.phoneNumber.trim())) {
      setError('Số điện thoại phải có 10-11 chữ số');
      return;
    }

    if (formData.username.length < 3) {
      setError('Tên người dùng phải có ít nhất 3 ký tự');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    clearError();

    try {
      const registerData: api.RegisterData = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName.trim(),
      };
      if (hasEmail) registerData.email = formData.email.trim();
      if (hasPhone) registerData.phoneNumber = formData.phoneNumber.trim();

      await register(registerData);
    } catch (err) {
      if (err instanceof api.AuthError) {
        setError(err.message);
        if (err.fieldErrors) {
          setFieldErrors(mapRegisterFieldErrors(err.fieldErrors));
        }
      } else {
        setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Đăng ký
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Tạo tài khoản mới để bắt đầu
            </p>
          </div>

          {error && (
            <ErrorAlert
              title="Đăng ký thất bại"
              message={error}
              onDismiss={clearError}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Tên người dùng <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                aria-invalid={!!fieldErrors.username}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 ${
                  fieldErrors.username ? 'border-red-500 dark:border-red-600' : 'border border-zinc-300 dark:border-zinc-600'
                }`}
                placeholder="Tên người dùng (tối thiểu 3 ký tự)"
              />
              {fieldErrors.username && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{fieldErrors.username[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Họ tên đầy đủ <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                aria-invalid={!!fieldErrors.fullName}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 ${
                  fieldErrors.fullName ? 'border-red-500 dark:border-red-600' : 'border border-zinc-300 dark:border-zinc-600'
                }`}
                placeholder="Nhập họ tên đầy đủ"
              />
              {fieldErrors.fullName && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{fieldErrors.fullName[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Email <span className="text-zinc-500 text-xs">(một trong hai)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!fieldErrors.email}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 ${
                  fieldErrors.email ? 'border-red-500 dark:border-red-600' : 'border border-zinc-300 dark:border-zinc-600'
                }`}
                placeholder="Email (email hoặc số điện thoại)"
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Số điện thoại <span className="text-zinc-500 text-xs">(một trong hai)</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                aria-invalid={!!fieldErrors.phoneNumber}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 ${
                  fieldErrors.phoneNumber ? 'border-red-500 dark:border-red-600' : 'border border-zinc-300 dark:border-zinc-600'
                }`}
                placeholder="Số điện thoại (10-11 chữ số)"
              />
              {fieldErrors.phoneNumber && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{fieldErrors.phoneNumber[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  aria-invalid={!!fieldErrors.password}
                  className={`w-full px-4 py-3 pr-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 ${
                    fieldErrors.password ? 'border-red-500 dark:border-red-600' : 'border border-zinc-300 dark:border-zinc-600'
                  }`}
                  placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 focus:outline-none"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
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
              {fieldErrors.password && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{fieldErrors.password[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiển thị mật khẩu xác nhận'}
                >
                  {showConfirmPassword ? (
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Đã có tài khoản?{' '}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
