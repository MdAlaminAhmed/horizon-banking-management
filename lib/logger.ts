// Production-safe logging utility
// Automatically disabled in production unless explicitly enabled

const isDevelopment = process.env.NODE_ENV === 'development';
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true';

export const logger = {
    info: (...args: any[]) => {
        if (isDevelopment || isDebugEnabled) {
            console.log('[INFO]', ...args);
        }
    },

    success: (...args: any[]) => {
        if (isDevelopment || isDebugEnabled) {
            console.log('✅', ...args);
        }
    },

    warn: (...args: any[]) => {
        if (isDevelopment || isDebugEnabled) {
            console.warn('⚠️', ...args);
        }
    },

    error: (...args: any[]) => {
        // Always log errors, even in production
        console.error('❌', ...args);
    },

    debug: (...args: any[]) => {
        if (isDevelopment && isDebugEnabled) {
            console.log('[DEBUG]', ...args);
        }
    },

    // Performance logging (always enabled when perf monitoring is on)
    perf: (label: string, ms: number) => {
        if (isDevelopment || isDebugEnabled) {
            console.log(`[perf] ${label}: ${ms.toFixed(1)}ms`);
        }
    }
};

// Export individual functions for convenience
export const { info, success, warn, error, debug, perf } = logger;
