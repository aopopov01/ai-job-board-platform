import { NextRequest, NextResponse } from 'next/server';
export interface SecurityHeadersConfig {
    enableCSP: boolean;
    enableHSTS: boolean;
    enableXSSProtection: boolean;
    enableClickjackProtection: boolean;
    enableContentTypeNosniff: boolean;
    enableReferrerPolicy: boolean;
    enablePermissionsPolicy: boolean;
    customHeaders?: Record<string, string>;
}
export interface CSPDirectives {
    defaultSrc: string[];
    scriptSrc: string[];
    styleSrc: string[];
    imgSrc: string[];
    fontSrc: string[];
    connectSrc: string[];
    frameSrc: string[];
    mediaSrc: string[];
    objectSrc: string[];
    workerSrc: string[];
    manifestSrc: string[];
    formAction: string[];
    baseUri: string[];
    upgradeInsecureRequests: boolean;
    blockAllMixedContent: boolean;
}
export declare class SecurityHeadersService {
    private config;
    constructor(config: SecurityHeadersConfig);
    getSecurityHeaders(): Record<string, string>;
    private getCSPHeader;
    private buildCSPString;
    private getPermissionsPolicyHeader;
    validateCSPViolation(violation: any): boolean;
    handleCSPReport(request: NextRequest): Promise<NextResponse>;
    private storeCSPViolation;
}
export declare const defaultSecurityConfig: SecurityHeadersConfig;
export declare const developmentSecurityConfig: SecurityHeadersConfig;
export declare const securityHeaders: SecurityHeadersService;
export declare function securityHeadersMiddleware(request: NextRequest): NextResponse;
export declare function generateCSPNonce(): string;
export declare function validateSecurityHeaders(headers: Record<string, string>): {
    isValid: boolean;
    missing: string[];
    warnings: string[];
};
//# sourceMappingURL=enhanced-headers.d.ts.map