export interface GetUserInfoRequest extends ExpressRequest {
  readonly params: {
    id: string;
  }
}

export interface PostUserCreateRequest extends ExpressRequest {
  readonly body: {
    id: string;
    pw: string;
    name?: string;
    phone?: number;
    email?: string;
  }
}

export interface PatchUserTendencyRequest extends ExpressRequest {
  readonly body: {
    id: string;
    inward: boolean;
    quickly: boolean;
    song: boolean;
    songName?: string;
  }
}

export interface PutUserChangePasswordRequest extends ExpressRequest {
  readonly body: {
    id: string;
    pw?: string;
  }
}