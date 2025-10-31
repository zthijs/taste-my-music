# Testing Documentation

This project uses **Vitest** and **Svelte Testing Library** for unit and component testing.

## Running Tests

### Run all tests in watch mode

```bash
pnpm test
```

### Run tests once (CI mode)

```bash
pnpm test:run
```

### Run tests with UI interface

```bash
pnpm test:ui
```

### Run tests with coverage report

```bash
pnpm test:coverage
```

## Test Structure

Tests are located alongside the files they test:

- `src/lib/helpers/*.test.ts` - Utility function tests
- `src/lib/components/*.test.ts` - Component tests
- `src/lib/server/services/*.test.ts` - Service business logic tests

## Testing Stack

- **Vitest** - Fast unit test framework powered by Vite
- **@testing-library/svelte** - Simple and complete Svelte testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **happy-dom** - Lightweight DOM implementation for tests

## Test Coverage

### Utility Functions ✅

- `formatting.ts` - Date formatting, number formatting, text truncation, JSON parsing
- `utils.ts` - Class name utility (`cn()`) with Tailwind merge support

### Components ✅

- `page-header.svelte` - Page header with title and description
- `loading-message.svelte` - Loading indicator with customizable message
- `artist-card.svelte` - Artist display card with image, genres, and Spotify link
- `section-cards.svelte` - Dashboard statistics cards
- `site-header.svelte` - Main application header

### Service Business Logic ✅

- `profile-service.ts` - Data staleness detection, genre aggregation logic, Spotify API fallback strategies
- `recommendation-service.ts` - Artist filtering, recommendation enrichment, AI response parsing
- `style-sentence-service.ts` - Sentence validation, AI extraction, force refresh logic

## Writing Tests

### Testing Utility Functions

```typescript
import { describe, it, expect } from 'vitest';
import { formatNumber } from './formatting';

describe('formatNumber', () => {
 it('should format numbers with commas', () => {
  expect(formatNumber(1000)).toBe('1,000');
 });
});
```

### Testing Svelte Components

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import MyComponent from './my-component.svelte';

describe('MyComponent', () => {
 it('should render with props', () => {
  render(MyComponent, {
   props: { title: 'Test Title' }
  });
  
  expect(screen.getByText('Test Title')).toBeInTheDocument();
 });
});
```

### Testing Service Logic

Focus on **business logic** rather than testing the language itself:

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('recommendation filtering', () => {
 it('should filter out already followed artists', () => {
  const recommendations = [
   { artistId: 'id1', name: 'Artist 1' },
   { artistId: 'id2', name: 'Artist 2' }
  ];
  const followedIds = new Set(['id2']);
  
  const filtered = recommendations.filter(
   rec => !followedIds.has(rec.artistId)
  );
  
  expect(filtered).toHaveLength(1);
  expect(filtered[0].artistId).toBe('id1');
 });
});
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how it does it
2. **Test business logic, not the language** - Don't test basic JavaScript/TypeScript features
3. **Use meaningful test names** - Describe what the test validates
4. **Mock external dependencies** - Use Vitest's mocking for APIs, databases, etc.
5. **Test edge cases** - Include boundary conditions and error scenarios

### What NOT to test

❌ Basic object property checks (`expect(obj.property).toBeDefined()`)  
❌ Language features (`Array.map`, `Object.keys`, etc.)  
❌ Third-party library functionality  

### What TO test

✅ Business logic and algorithms  
✅ Data transformations specific to your app  
✅ Component rendering and user interactions  
✅ Error handling and edge cases  
✅ Conditional logic and branching  

## Common Testing Patterns

### Testing with Mocks

```typescript
import { vi } from 'vitest';

const mockFn = vi.fn()
 .mockResolvedValueOnce('first call')
 .mockResolvedValueOnce('second call');
```

### Testing Async Code

```typescript
it('should handle async operations', async () => {
 const result = await asyncFunction();
 expect(result).toBe('expected');
});
```

### Testing Error Scenarios

```typescript
it('should handle errors gracefully', () => {
 const invalidData = '';
 const isValid = invalidData.trim() !== '';
 expect(isValid).toBe(false);
});
```

## CI/CD Integration

Add to your CI pipeline:

```bash
pnpm test:run
```

For coverage reporting:

```bash
pnpm test:coverage
```

## Troubleshooting

### Tests not running

- Ensure test files match pattern: `*.test.ts` or `*.spec.ts`
- Check that `vite.config.ts` includes test configuration

### Import errors

- Verify `src/tests/vitest.d.ts` declares Svelte module types
- Check that aliases (`$lib`) are configured in `vite.config.ts`

### DOM not available

- Confirm `environment: 'happy-dom'` in Vitest config
