export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  token?: string | null;
  body?: unknown;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333').trim().replace(/\/$/, ''));

async function request<TResponse>(
  path: string,
  { token, body, headers, ...init }: ApiRequestOptions = {},
): Promise<TResponse> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  const finalHeaders = new Headers(headers);
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders.set('Content-Type', 'application/json');
  }
  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...init,
    headers: finalHeaders,
    body:
      body instanceof FormData
        ? body
        : body === undefined
          ? undefined
          : JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : undefined;

  if (!response.ok) {
    const message =
      (payload && typeof payload.message === 'string' && payload.message) ||
      `Erro na requisição: ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return payload as TResponse;
}

export const apiClient = {
  login(payload: LoginPayload) {
    return request<LoginResponse>('/login', {
      method: 'POST',
      body: payload,
    });
  },
  register(payload: CreateUserPayload) {
    return request<{ user: UserDto }>('/users', {
      method: 'POST',
      body: payload,
    });
  },
  listUsers(token: string) {
    return request<{ users: UserDto[] }>('/users', {
      method: 'GET',
      token,
    });
  },
  getUser(id: string, token: string) {
    return request<{ user: UserDto }>(`/users/${id}`, {
      method: 'GET',
      token,
    });
  },
  updateUser(id: string, payload: UpdateUserPayload, token: string) {
    return request<{ user: UserDto }>(`/users/${id}`, {
      method: 'PUT',
      token,
      body: payload,
    });
  },
  deleteUser(id: string, token: string) {
    return request<void>(`/users/${id}`, {
      method: 'DELETE',
      token,
    });
  },
};

export type { ApiError };
