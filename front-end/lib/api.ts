// API Base URL - Có thể cấu hình qua biến môi trường NEXT_PUBLIC_API_URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface RegisterData {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phoneNumber?: string | null;
  };
  access: string;
  refresh: string;
  message: string;
}

/** Kết quả parse lỗi từ API (DRF format) */
export interface AuthErrorResult {
  message: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Parse lỗi trả về từ API auth (Django REST framework format).
 * Hỗ trợ: field errors (array/string), non_field_errors, detail, message, error.
 */
export function parseAuthError(body: unknown, defaultMessage: string): AuthErrorResult {
  const fieldErrors: Record<string, string[]> = {};
  const messages: string[] = [];

  if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    for (const [key, value] of Object.entries(obj)) {
      if (value == null) continue;
      if (Array.isArray(value)) {
        const list = value.filter((v): v is string => typeof v === 'string');
        if (list.length) {
          if (key === 'non_field_errors') {
            messages.push(...list);
          } else {
            fieldErrors[key] = list;
            messages.push(...list);
          }
        }
      } else if (typeof value === 'string') {
        if (key === 'detail' || key === 'message' || key === 'error') {
          messages.unshift(value);
        } else {
          fieldErrors[key] = [value];
          messages.push(value);
        }
      }
    }
  }

  const message = messages.length ? messages.join(' ') : defaultMessage;
  const result: AuthErrorResult = { message };
  if (Object.keys(fieldErrors).length > 0) {
    result.fieldErrors = fieldErrors;
  }
  return result;
}

/**
 * Ném lỗi auth với message và fieldErrors (gắn vào error để trang có thể đọc).
 */
export class AuthError extends Error {
  fieldErrors?: Record<string, string[]>;

  constructor(result: AuthErrorResult) {
    super(result.message);
    this.name = 'AuthError';
    this.fieldErrors = result.fieldErrors;
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  // Validation: Phải có ít nhất một trong hai (email hoặc phoneNumber)
  if (!data.email && !data.phoneNumber) {
    throw new AuthError({ message: 'Vui lòng nhập email hoặc số điện thoại' });
  }

  // Frontend gửi fullName thành first_name, last_name = Guest
  const body = {
    username: data.username,
    password: data.password,
    first_name: data.fullName,
    last_name: 'Guest',
    ...(data.email && { email: data.email }),
    ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
  };

  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthError({
      message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.',
    });
  }

  const raw = await response.json().catch(() => ({}));
  if (!response.ok) {
    const result = parseAuthError(raw, 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    throw new AuthError(result);
  }

  return raw as AuthResponse;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new AuthError({
      message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.',
    });
  }

  const raw = await response.json().catch(() => ({}));
  if (!response.ok) {
    const result = parseAuthError(
      raw,
      'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.'
    );
    throw new AuthError(result);
  }

  return raw as AuthResponse;
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function setTokens(access: string, refresh: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function removeTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// Backward compatibility
export function getToken(): string | null {
  return getAccessToken();
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
}

export function removeToken(): void {
  removeTokens();
}

export function getUser(): AuthResponse['user'] | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as AuthResponse['user'];
  } catch {
    return null;
  }
}

export function setUser(user: AuthResponse['user']): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

export function removeUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
}
