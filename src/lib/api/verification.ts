import { api } from './client';

export interface TokenResponse {
    token: string;
    instructions: string;
}

export interface VerificationResult {
    verified: boolean;
    message: string;
    characterName: string;
    itemLevel: string;
    serverName: string;
    className: string;
}

export const verificationApi = {
    generateToken: () => {
        return api.post<TokenResponse>('/api/verification/generate-token', {});
    },

    verifyProfile: (memberNo: string) => {
        return api.post<VerificationResult>('/api/verification/verify', { memberNo });
    }
};