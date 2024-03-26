export interface AuthGetRequest extends ExpressRequest {
  readonly params: {
    id: string;
  }
}

export interface AuthPostRequest extends ExpressRequest {
  readonly body: {
    id: string;
    pw?: string;
    sessionId?: string
  }
}