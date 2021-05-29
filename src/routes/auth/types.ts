export interface AccessToken {
  id: string;
  role?: string;
  tkId: string;
  iat: number;
  exp: number;
  refreshToken: string;
}
