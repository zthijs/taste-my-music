import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    parseJSON,
    safeStringify,
    truncateText,
    formatNumber,
    formatPercentage,
    formatDuration,
    formatRelativeTime
} from './formatting';

describe('formatting helpers', () => {
    describe('parseJSON', () => {
        it('should parse valid JSON string', () => {
            const result = parseJSON('{"name":"test"}', {});
            expect(result).toEqual({ name: 'test' });
        });

        it('should return fallback for null value', () => {
            const fallback = { default: true };
            const result = parseJSON(null, fallback);
            expect(result).toEqual(fallback);
        });

        it('should return fallback for invalid JSON', () => {
            const fallback = { default: true };
            const result = parseJSON('invalid json', fallback);
            expect(result).toEqual(fallback);
        });

        it('should handle arrays', () => {
            const result = parseJSON('[1,2,3]', []);
            expect(result).toEqual([1, 2, 3]);
        });
    });

    describe('safeStringify', () => {
        it('should stringify valid objects', () => {
            const result = safeStringify({ name: 'test', age: 30 });
            expect(result).toBe('{"name":"test","age":30}');
        });

        it('should stringify arrays', () => {
            const result = safeStringify([1, 2, 3]);
            expect(result).toBe('[1,2,3]');
        });

        it('should return {} for circular references', () => {
            const circular: any = { name: 'test' };
            circular.self = circular;
            const result = safeStringify(circular);
            expect(result).toBe('{}');
        });

        it('should stringify primitives', () => {
            expect(safeStringify('test')).toBe('"test"');
            expect(safeStringify(42)).toBe('42');
            expect(safeStringify(true)).toBe('true');
        });
    });

    describe('truncateText', () => {
        it('should not truncate text shorter than maxLength', () => {
            const result = truncateText('Hello', 10);
            expect(result).toBe('Hello');
        });

        it('should truncate text longer than maxLength', () => {
            const result = truncateText('Hello World', 5);
            expect(result).toBe('Hello...');
        });

        it('should handle exact maxLength', () => {
            const result = truncateText('Hello', 5);
            expect(result).toBe('Hello');
        });

        it('should handle empty string', () => {
            const result = truncateText('', 10);
            expect(result).toBe('');
        });
    });

    describe('formatNumber', () => {
        it('should format numbers with commas', () => {
            expect(formatNumber(1000)).toBe('1,000');
            expect(formatNumber(1000000)).toBe('1,000,000');
        });

        it('should handle small numbers', () => {
            expect(formatNumber(42)).toBe('42');
            expect(formatNumber(999)).toBe('999');
        });

        it('should handle zero', () => {
            expect(formatNumber(0)).toBe('0');
        });

        it('should handle decimals', () => {
            expect(formatNumber(1234.56)).toBe('1,234.56');
        });
    });

    describe('formatPercentage', () => {
        it('should format decimal as percentage', () => {
            expect(formatPercentage(0.5)).toBe('50%');
            expect(formatPercentage(0.75)).toBe('75%');
        });

        it('should handle 0 and 1', () => {
            expect(formatPercentage(0)).toBe('0%');
            expect(formatPercentage(1)).toBe('100%');
        });

        it('should round to whole number', () => {
            expect(formatPercentage(0.456)).toBe('46%');
            expect(formatPercentage(0.999)).toBe('100%');
        });
    });

    describe('formatDuration', () => {
        it('should format milliseconds as mm:ss', () => {
            expect(formatDuration(60000)).toBe('1:00');
            expect(formatDuration(90000)).toBe('1:30');
        });

        it('should pad seconds with leading zero', () => {
            expect(formatDuration(65000)).toBe('1:05');
            expect(formatDuration(5000)).toBe('0:05');
        });

        it('should handle zero duration', () => {
            expect(formatDuration(0)).toBe('0:00');
        });

        it('should handle long durations', () => {
            expect(formatDuration(600000)).toBe('10:00');
            expect(formatDuration(3661000)).toBe('61:01');
        });
    });

    describe('formatRelativeTime', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2025-10-31T12:00:00Z'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should return "just now" for recent dates', () => {
            const date = new Date('2025-10-31T11:59:30Z');
            expect(formatRelativeTime(date)).toBe('just now');
        });

        it('should return minutes ago', () => {
            const date = new Date('2025-10-31T11:55:00Z');
            expect(formatRelativeTime(date)).toBe('5 minutes ago');
        });

        it('should return hours ago', () => {
            const date = new Date('2025-10-31T09:00:00Z');
            expect(formatRelativeTime(date)).toBe('3 hours ago');
        });

        it('should return days ago', () => {
            const date = new Date('2025-10-29T12:00:00Z');
            expect(formatRelativeTime(date)).toBe('2 days ago');
        });

        it('should return formatted date for old dates', () => {
            const date = new Date('2025-10-20T12:00:00Z');
            const result = formatRelativeTime(date);
            expect(result).toMatch(/10\/20\/2025|20\/10\/2025/);
        });
    });
});
