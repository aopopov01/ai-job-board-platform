import { NextResponse } from 'next/server';
export class SecurityHeadersService {
    config;
    constructor(config) {
        this.config = config;
    }
    // Get comprehensive security headers
    getSecurityHeaders() {
        const headers = {};
        // X-Content-Type-Options
        if (this.config.enableContentTypeNosniff) {
            headers['X-Content-Type-Options'] = 'nosniff';
        }
        // X-Frame-Options (Clickjacking protection)
        if (this.config.enableClickjackProtection) {
            headers['X-Frame-Options'] = 'DENY';
        }
        // X-XSS-Protection (Legacy but still useful)
        if (this.config.enableXSSProtection) {
            headers['X-XSS-Protection'] = '1; mode=block';
        }
        // Strict-Transport-Security (HTTPS enforcement)
        if (this.config.enableHSTS) {
            headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
        }
        // Content Security Policy
        if (this.config.enableCSP) {
            headers['Content-Security-Policy'] = this.getCSPHeader();
        }
        // Referrer Policy
        if (this.config.enableReferrerPolicy) {
            headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
        }
        // Permissions Policy (Feature Policy)
        if (this.config.enablePermissionsPolicy) {
            headers['Permissions-Policy'] = this.getPermissionsPolicyHeader();
        }
        // Custom headers
        if (this.config.customHeaders) {
            Object.assign(headers, this.config.customHeaders);
        }
        return headers;
    }
    // Generate Content Security Policy header
    getCSPHeader() {
        const directives = {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // Required for Next.js
                "'unsafe-eval'", // Required for development
                "https://js.stripe.com",
                "https://cdn.jsdelivr.net",
                "https://unpkg.com",
                "https://ajax.googleapis.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'", // Required for CSS-in-JS
                "https://fonts.googleapis.com",
                "https://cdn.jsdelivr.net"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "blob:",
                "https:",
                "https://images.unsplash.com",
                "https://avatars.githubusercontent.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "https://cdn.jsdelivr.net"
            ],
            connectSrc: [
                "'self'",
                "https://api.stripe.com",
                "https://*.supabase.co",
                "https://api.github.com",
                "https://api.linkedin.com",
                "https://api.openai.com",
                "wss://*.supabase.co" // WebSocket connections
            ],
            frameSrc: [
                "'self'",
                "https://js.stripe.com",
                "https://www.google.com" // reCAPTCHA
            ],
            mediaSrc: ["'self'", "https:", "blob:"],
            objectSrc: ["'none'"],
            workerSrc: ["'self'", "blob:"],
            manifestSrc: ["'self'"],
            formAction: ["'self'"],
            baseUri: ["'self'"],
            upgradeInsecureRequests: true,
            blockAllMixedContent: true
        };
        return this.buildCSPString(directives);
    }
    // Build CSP string from directives
    buildCSPString(directives) {
        const cspParts = [];
        // Add source directives
        if (directives.defaultSrc.length > 0) {
            cspParts.push(`default-src ${directives.defaultSrc.join(' ')}`);
        }
        if (directives.scriptSrc.length > 0) {
            cspParts.push(`script-src ${directives.scriptSrc.join(' ')}`);
        }
        if (directives.styleSrc.length > 0) {
            cspParts.push(`style-src ${directives.styleSrc.join(' ')}`);
        }
        if (directives.imgSrc.length > 0) {
            cspParts.push(`img-src ${directives.imgSrc.join(' ')}`);
        }
        if (directives.fontSrc.length > 0) {
            cspParts.push(`font-src ${directives.fontSrc.join(' ')}`);
        }
        if (directives.connectSrc.length > 0) {
            cspParts.push(`connect-src ${directives.connectSrc.join(' ')}`);
        }
        if (directives.frameSrc.length > 0) {
            cspParts.push(`frame-src ${directives.frameSrc.join(' ')}`);
        }
        if (directives.mediaSrc.length > 0) {
            cspParts.push(`media-src ${directives.mediaSrc.join(' ')}`);
        }
        if (directives.objectSrc.length > 0) {
            cspParts.push(`object-src ${directives.objectSrc.join(' ')}`);
        }
        if (directives.workerSrc.length > 0) {
            cspParts.push(`worker-src ${directives.workerSrc.join(' ')}`);
        }
        if (directives.manifestSrc.length > 0) {
            cspParts.push(`manifest-src ${directives.manifestSrc.join(' ')}`);
        }
        if (directives.formAction.length > 0) {
            cspParts.push(`form-action ${directives.formAction.join(' ')}`);
        }
        if (directives.baseUri.length > 0) {
            cspParts.push(`base-uri ${directives.baseUri.join(' ')}`);
        }
        // Add boolean directives
        if (directives.upgradeInsecureRequests) {
            cspParts.push('upgrade-insecure-requests');
        }
        if (directives.blockAllMixedContent) {
            cspParts.push('block-all-mixed-content');
        }
        return cspParts.join('; ');
    }
    // Generate Permissions Policy header
    getPermissionsPolicyHeader() {
        const policies = [
            'accelerometer=()',
            'ambient-light-sensor=()',
            'autoplay=()',
            'battery=()',
            'camera=()',
            'cross-origin-isolated=()',
            'display-capture=()',
            'document-domain=()',
            'encrypted-media=()',
            'execution-while-not-rendered=()',
            'execution-while-out-of-viewport=()',
            'fullscreen=(self)',
            'geolocation=()',
            'gyroscope=()',
            'keyboard-map=()',
            'magnetometer=()',
            'microphone=()',
            'midi=()',
            'navigation-override=()',
            'payment=(self)',
            'picture-in-picture=()',
            'publickey-credentials-get=()',
            'screen-wake-lock=()',
            'sync-xhr=()',
            'usb=()',
            'web-share=(self)',
            'xr-spatial-tracking=()'
        ];
        return policies.join(', ');
    }
    // Validate CSP violations (for reporting)
    validateCSPViolation(violation) {
        const requiredFields = [
            'blocked-uri',
            'document-uri',
            'violated-directive',
            'original-policy'
        ];
        return requiredFields.every(field => violation[field] !== undefined);
    }
    // Generate CSP report endpoint
    async handleCSPReport(request) {
        try {
            const body = await request.json();
            const report = body['csp-report'];
            if (!this.validateCSPViolation(report)) {
                return NextResponse.json({ error: 'Invalid CSP report' }, { status: 400 });
            }
            // Log CSP violation
            console.warn('CSP Violation detected:', {
                blockedUri: report['blocked-uri'],
                documentUri: report['document-uri'],
                violatedDirective: report['violated-directive'],
                originalPolicy: report['original-policy'],
                lineNumber: report['line-number'],
                columnNumber: report['column-number'],
                sourceFile: report['source-file'],
                statusCode: report['status-code'],
                referrer: report['referrer']
            });
            // Store CSP violation in database for analysis
            await this.storeCSPViolation(report);
            return NextResponse.json({ status: 'received' });
        }
        catch (error) {
            console.error('Failed to handle CSP report:', error);
            return NextResponse.json({ error: 'Failed to process report' }, { status: 500 });
        }
    }
    // Store CSP violation for analysis
    async storeCSPViolation(report) {
        try {
            // In production, store in database
            // For now, we'll log it
            console.log('CSP Violation stored:', {
                timestamp: new Date().toISOString(),
                violation: report
            });
        }
        catch (error) {
            console.error('Failed to store CSP violation:', error);
        }
    }
}
// Default security configuration
export const defaultSecurityConfig = {
    enableCSP: true,
    enableHSTS: true,
    enableXSSProtection: true,
    enableClickjackProtection: true,
    enableContentTypeNosniff: true,
    enableReferrerPolicy: true,
    enablePermissionsPolicy: true,
    customHeaders: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'cross-origin'
    }
};
// Development configuration (more permissive)
export const developmentSecurityConfig = {
    enableCSP: true,
    enableHSTS: false, // Disable HSTS in development
    enableXSSProtection: true,
    enableClickjackProtection: true,
    enableContentTypeNosniff: true,
    enableReferrerPolicy: true,
    enablePermissionsPolicy: false, // Disable in development for easier debugging
    customHeaders: {
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
        'Cross-Origin-Opener-Policy': 'unsafe-none',
        'Cross-Origin-Resource-Policy': 'cross-origin'
    }
};
// Create security headers service instance
export const securityHeaders = new SecurityHeadersService(process.env.NODE_ENV === 'development'
    ? developmentSecurityConfig
    : defaultSecurityConfig);
// Middleware function for Next.js
export function securityHeadersMiddleware(request) {
    const response = NextResponse.next();
    // Apply security headers
    const headers = securityHeaders.getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    // Add security context to response
    response.headers.set('X-Security-Context', 'protected');
    return response;
}
// CSP nonce generator for inline scripts
export function generateCSPNonce() {
    return Buffer.from(crypto.randomUUID()).toString('base64');
}
// Security headers validator
export function validateSecurityHeaders(headers) {
    const requiredHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'Strict-Transport-Security',
        'Content-Security-Policy',
        'Referrer-Policy'
    ];
    const missing = requiredHeaders.filter(header => !headers[header]);
    const warnings = [];
    // Check for common security issues
    if (headers['X-Frame-Options'] === 'ALLOWALL') {
        warnings.push('X-Frame-Options set to ALLOWALL may allow clickjacking');
    }
    if (headers['Content-Security-Policy']?.includes("'unsafe-eval'")) {
        warnings.push('CSP contains unsafe-eval which may allow code injection');
    }
    if (!headers['Strict-Transport-Security']?.includes('includeSubDomains')) {
        warnings.push('HSTS should include includeSubDomains directive');
    }
    return {
        isValid: missing.length === 0,
        missing,
        warnings
    };
}
//# sourceMappingURL=enhanced-headers.js.map