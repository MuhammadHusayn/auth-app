export interface IAuthenticationResponse {
    token: string;
    expiresAt: Date;
    refreshToken: string;
}
