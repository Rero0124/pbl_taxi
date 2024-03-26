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

export interface PostUserFollowCreateRequest extends ExpressRequest {
  readonly params: {
    id: string;
  }
  readonly body: {
    userId: string;
  }
}

export interface PutUserTendencyRequest extends ExpressRequest {
  readonly params: {
    id: string;
  }
  readonly body: {
    inward: boolean;
    quickly: boolean;
    song: boolean;
    songName: string | null;
  }
}

export interface PatchUserInitRequest extends ExpressRequest {
  readonly params: {
    id: string;
  }
}

export interface PatchUserChangePasswordRequest extends ExpressRequest {
  readonly params: {
    id: string;
  }
  readonly body: {
    pw: string;
    npw: string;
  }
}