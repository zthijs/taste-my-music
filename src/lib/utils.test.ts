import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names', () => {
            const result = cn('class1', 'class2');
            expect(result).toBe('class1 class2');
        });

        it('should handle conditional classes', () => {
            const result = cn('base', false && 'hidden', 'visible');
            expect(result).toBe('base visible');
        });

        it('should merge Tailwind classes correctly', () => {
            const result = cn('px-2 py-1', 'px-4');
            expect(result).toBe('py-1 px-4');
        });

        it('should handle arrays of classes', () => {
            const result = cn(['class1', 'class2'], 'class3');
            expect(result).toBe('class1 class2 class3');
        });

        it('should handle objects with truthy/falsy values', () => {
            const result = cn({
                active: true,
                disabled: false,
                primary: true
            });
            expect(result).toBe('active primary');
        });

        it('should handle empty input', () => {
            const result = cn();
            expect(result).toBe('');
        });

        it('should handle null and undefined', () => {
            const result = cn('base', null, undefined, 'end');
            expect(result).toBe('base end');
        });

        it('should handle complex Tailwind merging', () => {
            const result = cn('bg-red-500 hover:bg-blue-500', 'bg-green-500');
            expect(result).toBe('hover:bg-blue-500 bg-green-500');
        });

        it('should handle multiple modifier classes', () => {
            const result = cn('text-sm md:text-base', 'lg:text-lg');
            expect(result).toBe('text-sm md:text-base lg:text-lg');
        });

        it('should override conflicting utility classes', () => {
            const result = cn('p-4', 'p-8');
            expect(result).toBe('p-8');
        });
    });
});
