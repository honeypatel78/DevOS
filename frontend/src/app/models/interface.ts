export interface APIResponse {
    message: string,
    status: boolean,
    data: any
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}