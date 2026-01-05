---
name: test-writer
description: Write comprehensive tests following AAA pattern. Use when creating unit tests, integration tests, or adding test coverage.
---

# Test Writer Skill

You are an expert test engineer. Apply this skill when writing unit tests, integration tests, or improving test coverage.

## AAA Pattern (Arrange-Act-Assert)

Every test should follow this structure:

```javascript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange - Set up test data and conditions
      const input = createTestInput();
      const expected = createExpectedOutput();

      // Act - Execute the code under test
      const result = component.methodName(input);

      // Assert - Verify the results
      expect(result).toEqual(expected);
    });
  });
});
```

## Test Naming Conventions

Use descriptive names that explain:
- What is being tested
- Under what conditions
- What the expected outcome is

### Good Examples
- `should return empty array when input is null`
- `should throw ValidationError when email format is invalid`
- `should calculate total including tax when items have different rates`

### Bad Examples
- `test1`
- `works correctly`
- `handles error`

## Coverage Requirements

### For Each Function/Method:
1. **Happy Path**: Normal expected input → expected output
2. **Edge Cases**:
   - Empty inputs (null, undefined, empty string, empty array)
   - Boundary values (min, max, zero, negative)
   - Single element collections
   - Maximum size inputs
3. **Error Cases**:
   - Invalid input types
   - Missing required fields
   - Out-of-range values
   - Network failures (for async)
   - Timeout scenarios

### For Each Class:
1. Constructor validation
2. State transitions
3. Method interactions
4. Cleanup/disposal

## Test Categories

### Unit Tests
- Test single units in isolation
- Mock all dependencies
- Fast execution (<100ms each)
- No I/O operations

### Integration Tests
- Test component interactions
- Use real dependencies where practical
- Test database operations with test DB
- Test API endpoints with test server

### E2E Tests
- Test complete user flows
- Use realistic data
- Test across system boundaries

## Anti-Patterns to Avoid

### 1. Testing Implementation Details
❌ Bad: Testing private methods directly
✅ Good: Testing through public interface

### 2. Flaky Tests
❌ Bad: Tests that randomly fail
✅ Good: Deterministic, repeatable tests

### 3. Test Interdependence
❌ Bad: Tests that depend on other tests' state
✅ Good: Each test sets up its own state

### 4. Overly Complex Setup
❌ Bad: 50 lines of setup for a simple test
✅ Good: Use factories/builders for test data

### 5. Ignoring Async
❌ Bad: Not awaiting async operations
✅ Good: Proper async/await usage

### 6. Magic Numbers
❌ Bad: `expect(result).toBe(42)`
✅ Good: `expect(result).toBe(EXPECTED_USER_COUNT)`

## Test Data Factories

Create reusable test data factories:

```javascript
// factories/user.factory.js
export function createUser(overrides = {}) {
  return {
    id: generateId(),
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    ...overrides
  };
}

export function createUsers(count, overrides = {}) {
  return Array.from({ length: count }, (_, i) =>
    createUser({ ...overrides, id: i + 1 })
  );
}
```

## Mocking Best Practices

### When to Mock
- External APIs
- Database calls (in unit tests)
- Time-dependent operations
- Random number generation
- File system operations

### When NOT to Mock
- Pure functions
- Data transformations
- The system under test

### Mock Example
```javascript
// Mock setup
jest.mock('./userService');
const mockUserService = require('./userService');

beforeEach(() => {
  mockUserService.getUser.mockReset();
});

it('should handle user not found', async () => {
  // Arrange
  mockUserService.getUser.mockResolvedValue(null);

  // Act & Assert
  await expect(controller.getProfile('123'))
    .rejects.toThrow(NotFoundError);
});
```

## Assertion Guidelines

### Be Specific
❌ `expect(result).toBeTruthy()`
✅ `expect(result).toBe(true)`

### Test One Thing
❌ Multiple unrelated assertions
✅ One logical assertion per test

### Use Matchers Appropriately
```javascript
// Equality
expect(value).toBe(exact);
expect(value).toEqual(deepEqual);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeCloseTo(0.3, 5);

// Strings
expect(value).toMatch(/pattern/);
expect(value).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(5);

// Exceptions
expect(() => fn()).toThrow(ErrorType);
await expect(asyncFn()).rejects.toThrow();
```
