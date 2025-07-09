export interface EnhancedSession {
    id: string;
    sessionId: string;
    userId: string;
    deviceFingerprint: string;
    ipAddress: string;
    userAgent: string;
    locationData?: {
        country?: string;
        region?: string;
        city?: string;
        timezone?: string;
    };
    isActive: boolean;
    securityFlags: {
        suspiciousActivity: boolean;
        locationChange: boolean;
        deviceChange: boolean;
        concurrentSessions: boolean;
        unusualHours: boolean;
    };
    createdAt: string;
    lastActivity: string;
    expiresAt: string;
}
export interface SessionSecurityEvent {
    sessionId: string;
    userId: string;
    eventType: 'created' | 'updated' | 'expired' | 'invalidated' | 'suspicious_activity' | 'location_change' | 'device_change';
    ipAddress: string;
    userAgent: string;
    details: any;
    timestamp: string;
}
export interface SessionValidationResult {
    isValid: boolean;
    session?: EnhancedSession;
    requiresReauth: boolean;
    securityFlags: string[];
    riskScore: number;
}
export declare class EnhancedSessionManager {
    private defaultSessionTimeout;
    private maxConcurrentSessions;
    private suspiciousActivityThreshold;
    createSession(userId: string, request: {
        ipAddress: string;
        userAgent: string;
        headers: Record<string, string>;
    }): Promise<EnhancedSession>;
    validateSession(sessionId: string, request: {
        ipAddress: string;
        userAgent: string;
        headers: Record<string, string>;
    }): Promise<SessionValidationResult>;
    updateSessionActivity(session: EnhancedSession, request: {
        ipAddress: string;
        userAgent: string;
        headers: Record<string, string>;
    }): Promise<void>;
    invalidateSession(sessionId: string): Promise<void>;
    invalidateAllUserSessions(userId: string): Promise<void>;
    getUserActiveSessions(userId: string): Promise<EnhancedSession[]>;
    cleanupExpiredSessions(): Promise<void>;
    private generateDeviceFingerprint;
    private getLocationData;
    private isSignificantLocationChange;
    private checkSuspiciousActivity;
    private isUnusualHours;
    private invalidateOldestSession;
    private mapDatabaseToSession;
    private logSecurityEvent;
    getSessionAnalytics(userId: string): Promise<{
        totalSessions: number;
        activeSessions: number;
        deviceCount: number;
        locationCount: number;
        securityFlags: Record<string, number>;
    }>;
}
export declare const enhancedSessionManager: EnhancedSessionManager;
export declare const startSessionCleanup: () => void;
//# sourceMappingURL=enhanced-sessions.d.ts.map