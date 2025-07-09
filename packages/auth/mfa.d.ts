export interface MFASetup {
    userId: string;
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
    isEnabled: boolean;
}
export interface MFAVerificationResult {
    isValid: boolean;
    backupCodeUsed?: boolean;
    attemptsRemaining?: number;
}
export interface MFASettings {
    id: string;
    userId: string;
    secret: string;
    backupCodes: string[];
    enabled: boolean;
    createdAt: string;
    lastUsed?: string;
    failedAttempts: number;
}
export declare class PracticalMFAService {
    private encryptionKey;
    constructor();
    enableMFA(userId: string): Promise<MFASetup>;
    verifyAndEnableMFA(userId: string, token: string): Promise<boolean>;
    verifyMFAToken(userId: string, token: string): Promise<MFAVerificationResult>;
    disableMFA(userId: string, currentToken: string): Promise<boolean>;
    regenerateBackupCodes(userId: string, currentToken: string): Promise<string[]>;
    isMFAEnabled(userId: string): Promise<boolean>;
    getMFAStatus(userId: string): Promise<{
        enabled: boolean;
        backupCodesRemaining: number;
        lastUsed?: string;
        canSetup: boolean;
    }>;
    private getMFASettings;
    private getUserEmail;
    private generateBackupCodes;
    private verifyBackupCode;
    private resetFailedAttempts;
    private logMFAEvent;
    private encrypt;
    private decrypt;
    private hashBackupCode;
}
export declare const mfaService: PracticalMFAService;
//# sourceMappingURL=mfa.d.ts.map