export interface APIResponse {
    message: string,
    status: boolean,
    data: any
}

export interface AuthResponse {
  status: boolean;
  user: {
    id: number;
    username: string;
    role: string;
    avatar?: string;
  };
  message?: string;
}

export interface LikeCountResponse {
  status: boolean;
  likeCount: number;
}

export interface LikeCheckResponse {
  status: boolean;
  liked: boolean;
}

export interface LikeResponse {
  status: boolean;
  message: string;
}