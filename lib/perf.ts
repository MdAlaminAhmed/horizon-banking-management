// Lightweight perf helpers for instrumentation and timeouts
import { perf } from './logger';

export async function withTimer<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    try {
        return await fn();
    } finally {
        const t1 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        const ms = t1 - t0;
        perf(label, ms);
    }
} export async function withTimeout<T>(p: Promise<T>, ms: number, label = 'operation'): Promise<T> {
    let timer: NodeJS.Timeout | null = null;
    const to = new Promise<never>((_, rej) => {
        timer = setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms);
    });
    try {
        return await Promise.race([p, to]);
    } finally {
        if (timer) clearTimeout(timer);
    }
}
