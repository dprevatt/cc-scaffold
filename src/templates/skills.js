/**
 * Skill templates for CC Scaffold
 * Each skill contains full SKILL.md content with frontmatter and detailed instructions
 */

export const skills = {
  'code-reviewer': {
    name: 'code-reviewer',
    description: 'Review code for quality, security, and best practices',
    content: `---
name: code-reviewer
description: Review code for quality, security, and best practices. USE THIS SKILL for any code changes, before commits, during PR reviews, when editing files, when refactoring.
---

# Code Reviewer Skill

You are an expert code reviewer. Apply this skill whenever reviewing code changes, before commits, during PR reviews, or when editing/refactoring files.

## Review Checklist

### 1. Correctness
- [ ] Logic is correct and handles all cases
- [ ] Edge cases are handled appropriately
- [ ] No off-by-one errors or boundary issues
- [ ] Null/undefined values handled properly
- [ ] Async operations handled correctly (await, error handling)
- [ ] State mutations are intentional and correct

### 2. Security
- [ ] No hardcoded secrets or credentials
- [ ] User input is validated and sanitized
- [ ] SQL queries use parameterized statements
- [ ] No XSS vulnerabilities (output encoding)
- [ ] Authentication/authorization checks in place
- [ ] Sensitive data not logged or exposed
- [ ] HTTPS used for external requests
- [ ] No path traversal vulnerabilities

### 3. Maintainability
- [ ] Code is self-documenting with clear names
- [ ] Functions are small and focused (single responsibility)
- [ ] No code duplication (DRY principle)
- [ ] Complex logic has explanatory comments
- [ ] Consistent coding style
- [ ] No magic numbers or strings
- [ ] Dependencies are necessary and up-to-date

### 4. Performance
- [ ] No unnecessary loops or iterations
- [ ] Database queries are optimized
- [ ] No N+1 query problems
- [ ] Large data sets handled efficiently
- [ ] Caching used where appropriate
- [ ] No memory leaks (event listeners, subscriptions)
- [ ] Lazy loading for expensive operations

### 5. Testing
- [ ] Unit tests cover critical paths
- [ ] Edge cases have test coverage
- [ ] Tests are meaningful, not just for coverage
- [ ] Mocks/stubs used appropriately
- [ ] Integration tests for complex interactions

## Output Format

Provide feedback in this format:

\`\`\`
## Code Review Summary

**Overall Assessment**: [APPROVE / REQUEST CHANGES / NEEDS DISCUSSION]

### Critical Issues 🚨
- [file:line] Issue description
  - Why it's a problem
  - Suggested fix

### Warnings ⚠️
- [file:line] Issue description
  - Recommendation

### Suggestions 💡
- [file:line] Improvement opportunity
  - How to improve

### Positive Notes ✅
- What was done well
\`\`\`

## Code Smell Patterns to Detect

### Bloaters
- Long methods (>20 lines)
- Large classes (>300 lines)
- Long parameter lists (>4 params)
- Primitive obsession
- Data clumps

### Object-Orientation Abusers
- Switch statements on type
- Refused bequest
- Alternative classes with different interfaces
- Temporary field

### Change Preventers
- Divergent change
- Shotgun surgery
- Parallel inheritance hierarchies

### Dispensables
- Lazy class
- Speculative generality
- Dead code
- Duplicate code
- Comments explaining bad code

### Couplers
- Feature envy
- Inappropriate intimacy
- Message chains
- Middle man

## Security Vulnerability Patterns

### Injection
- SQL: \`query = "SELECT * FROM users WHERE id = " + userId\`
- Command: \`exec(userInput)\`
- LDAP, XPath, NoSQL injection patterns

### Broken Authentication
- Weak password requirements
- Missing rate limiting
- Session fixation vulnerabilities
- Insecure password storage

### Sensitive Data Exposure
- Logging sensitive data
- Transmitting without encryption
- Weak cryptography

### XSS
- \`innerHTML = userInput\`
- \`document.write(userInput)\`
- Unescaped template variables

### Insecure Deserialization
- Deserializing untrusted data
- Missing type validation
`
  },

  'test-writer': {
    name: 'test-writer',
    description: 'Write comprehensive tests following AAA pattern',
    content: `---
name: test-writer
description: Write comprehensive tests following AAA pattern. Use when creating unit tests, integration tests, or adding test coverage.
---

# Test Writer Skill

You are an expert test engineer. Apply this skill when writing unit tests, integration tests, or improving test coverage.

## AAA Pattern (Arrange-Act-Assert)

Every test should follow this structure:

\`\`\`javascript
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
\`\`\`

## Test Naming Conventions

Use descriptive names that explain:
- What is being tested
- Under what conditions
- What the expected outcome is

### Good Examples
- \`should return empty array when input is null\`
- \`should throw ValidationError when email format is invalid\`
- \`should calculate total including tax when items have different rates\`

### Bad Examples
- \`test1\`
- \`works correctly\`
- \`handles error\`

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
❌ Bad: \`expect(result).toBe(42)\`
✅ Good: \`expect(result).toBe(EXPECTED_USER_COUNT)\`

## Test Data Factories

Create reusable test data factories:

\`\`\`javascript
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
\`\`\`

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
\`\`\`javascript
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
\`\`\`

## Assertion Guidelines

### Be Specific
❌ \`expect(result).toBeTruthy()\`
✅ \`expect(result).toBe(true)\`

### Test One Thing
❌ Multiple unrelated assertions
✅ One logical assertion per test

### Use Matchers Appropriately
\`\`\`javascript
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
\`\`\`
`
  },

  'security-auditor': {
    name: 'security-auditor',
    description: 'Audit code for security vulnerabilities',
    content: `---
name: security-auditor
description: Audit code for security vulnerabilities. Use for auth logic, data handling, API endpoints, before deployments.
---

# Security Auditor Skill

You are an expert security auditor. Apply this skill when reviewing authentication logic, data handling, API endpoints, or preparing for deployments.

## OWASP Top 10 Checklist

### 1. Injection (A03:2021)
- [ ] SQL queries use parameterized statements or ORM
- [ ] NoSQL queries sanitize user input
- [ ] OS commands never include user input directly
- [ ] LDAP queries are parameterized
- [ ] XML parsers disable external entities

**Search Patterns:**
\`\`\`
# SQL Injection
"SELECT.*FROM.*WHERE.*" + variable
"INSERT INTO.*VALUES.*" + variable
query(.*\${.*}.*) # Template literals in queries

# Command Injection
exec(userInput)
spawn(command + userInput)
system(userInput)
\`\`\`

### 2. Broken Authentication (A07:2021)
- [ ] Passwords hashed with bcrypt/scrypt/argon2 (not MD5/SHA1)
- [ ] Session tokens are cryptographically random
- [ ] Session invalidation on logout
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts
- [ ] MFA available for sensitive operations
- [ ] Password requirements enforced

### 3. Sensitive Data Exposure (A02:2021)
- [ ] Sensitive data encrypted at rest
- [ ] TLS 1.2+ for data in transit
- [ ] No sensitive data in URLs
- [ ] No sensitive data in logs
- [ ] Proper key management
- [ ] PII properly handled

**Search Patterns:**
\`\`\`
console.log(.*password
console.log(.*token
console.log(.*secret
console.log(.*apiKey
\`\`\`

### 4. XML External Entities (A05:2021)
- [ ] XML parsing disables DTD
- [ ] External entity processing disabled
- [ ] XSLT transformations secured

### 5. Broken Access Control (A01:2021)
- [ ] Authorization checks on all endpoints
- [ ] CORS properly configured
- [ ] Directory traversal prevented
- [ ] Forced browsing prevented
- [ ] IDOR vulnerabilities addressed

### 6. Security Misconfiguration (A05:2021)
- [ ] Default credentials changed
- [ ] Error messages don't leak info
- [ ] Security headers configured
- [ ] Unnecessary features disabled
- [ ] Debug mode disabled in production

### 7. Cross-Site Scripting (A03:2021)
- [ ] Output encoding for HTML context
- [ ] Output encoding for JavaScript context
- [ ] Output encoding for URL context
- [ ] Content-Security-Policy header set
- [ ] HttpOnly flag on cookies

**Search Patterns:**
\`\`\`
innerHTML =
document.write(
dangerouslySetInnerHTML
v-html=
[innerHTML]
\`\`\`

### 8. Insecure Deserialization (A08:2021)
- [ ] Type validation before deserialization
- [ ] Integrity checks on serialized data
- [ ] Isolation of deserialization code
- [ ] Monitoring for deserialization exceptions

### 9. Using Components with Known Vulnerabilities (A06:2021)
- [ ] Dependencies regularly updated
- [ ] Security advisories monitored
- [ ] npm audit / safety check run
- [ ] SBOM maintained

### 10. Insufficient Logging & Monitoring (A09:2021)
- [ ] Authentication events logged
- [ ] Authorization failures logged
- [ ] Input validation failures logged
- [ ] Logs protected from injection
- [ ] Alerting configured

## Severity Classification

### Critical (Fix Immediately)
- Remote code execution
- SQL injection
- Authentication bypass
- Hardcoded secrets

### High (Fix This Sprint)
- XSS vulnerabilities
- CSRF without protection
- Sensitive data exposure
- Broken access control

### Medium (Fix Soon)
- Information disclosure
- Weak cryptography
- Missing security headers
- Verbose error messages

### Low (Track & Fix)
- Missing best practices
- Outdated dependencies (no known vulns)
- Minor information leakage

## Security Report Format

\`\`\`
## Security Audit Report

**Audit Date**: YYYY-MM-DD
**Scope**: [Files/Features audited]
**Risk Level**: [Critical/High/Medium/Low]

### Executive Summary
Brief overview of findings.

### Critical Findings 🚨
1. **[Vulnerability Name]**
   - Location: file:line
   - Description: What the vulnerability is
   - Impact: What an attacker could do
   - Remediation: How to fix it
   - CVSS Score: X.X

### High Findings
[Same format]

### Medium Findings
[Same format]

### Low Findings
[Same format]

### Recommendations
1. Immediate actions
2. Short-term improvements
3. Long-term security initiatives

### Compliance Notes
- OWASP alignment
- Regulatory considerations (GDPR, HIPAA, etc.)
\`\`\`

## Common Vulnerability Patterns

### Authentication Bypass
\`\`\`javascript
// VULNERABLE
if (user.role == 'admin') { // Type coercion
if (token) { // Truthy check insufficient

// SECURE
if (user.role === 'admin') { // Strict equality
if (await validateToken(token)) { // Proper validation
\`\`\`

### Path Traversal
\`\`\`javascript
// VULNERABLE
const file = path.join(uploadDir, req.params.filename);

// SECURE
const filename = path.basename(req.params.filename);
const file = path.join(uploadDir, filename);
\`\`\`

### Mass Assignment
\`\`\`javascript
// VULNERABLE
User.update(req.body); // Attacker can set isAdmin: true

// SECURE
const { name, email } = req.body;
User.update({ name, email }); // Whitelist fields
\`\`\`
`
  },

  'doc-generator': {
    name: 'doc-generator',
    description: 'Generate documentation from code',
    content: `---
name: doc-generator
description: Generate documentation from code. Use for README, API docs, inline documentation.
---

# Documentation Generator Skill

You are an expert technical writer. Apply this skill when creating README files, API documentation, or inline code documentation.

## Documentation Types

### 1. README.md Template

\`\`\`markdown
# Project Name

Brief description (1-2 sentences).

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\\\`\\\`\\\`bash
npm install package-name
\\\`\\\`\\\`

## Quick Start

\\\`\\\`\\\`javascript
import { feature } from 'package-name';

// Minimal working example
\\\`\\\`\\\`

## Usage

### Basic Usage
[Code example with explanation]

### Advanced Usage
[More complex examples]

## API Reference

### functionName(params)
Description of what it does.

**Parameters:**
- \`param1\` (Type): Description
- \`param2\` (Type, optional): Description

**Returns:** Type - Description

**Example:**
\\\`\\\`\\\`javascript
const result = functionName(value);
\\\`\\\`\\\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | 'default' | What it does |

## Contributing

Guidelines for contributors.

## License

MIT
\`\`\`

### 2. API Documentation

\`\`\`markdown
# API Documentation

## Authentication

All endpoints require a Bearer token:
\\\`\\\`\\\`
Authorization: Bearer <token>
\\\`\\\`\\\`

## Endpoints

### GET /api/resource

Retrieves a list of resources.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20) |

**Response:**
\\\`\\\`\\\`json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
\\\`\\\`\\\`

**Error Responses:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Server error |
\`\`\`

### 3. Inline Code Documentation

#### JSDoc Style
\`\`\`javascript
/**
 * Calculates the total price including tax.
 *
 * @param {number} price - The base price of the item
 * @param {number} [taxRate=0.1] - The tax rate (default 10%)
 * @returns {number} The total price including tax
 * @throws {Error} If price is negative
 *
 * @example
 * const total = calculateTotal(100, 0.08);
 * // Returns: 108
 */
function calculateTotal(price, taxRate = 0.1) {
  if (price < 0) throw new Error('Price cannot be negative');
  return price * (1 + taxRate);
}
\`\`\`

#### TypeScript Style
\`\`\`typescript
/**
 * User authentication service.
 * Handles login, logout, and token management.
 */
interface AuthService {
  /**
   * Authenticates a user with email and password.
   * @param credentials - User login credentials
   * @returns Promise resolving to authenticated user
   * @throws AuthError if credentials are invalid
   */
  login(credentials: LoginCredentials): Promise<User>;
}
\`\`\`

## Writing Standards

### Do's
- Use active voice
- Be concise and specific
- Include working code examples
- Keep examples minimal but complete
- Update docs with code changes
- Use consistent terminology

### Don'ts
- Don't use jargon without explanation
- Don't assume prior knowledge
- Don't leave TODOs in public docs
- Don't include outdated examples
- Don't skip error cases

## Code Example Requirements

### Every Example Must:
1. Be copy-pasteable (actually work)
2. Show imports/setup needed
3. Include expected output
4. Handle errors appropriately
5. Use realistic but simple data

### Example Template
\`\`\`javascript
// What this example demonstrates
import { feature } from 'package';

// Setup (if needed)
const config = { /* minimal config */ };

// The actual usage
const result = feature(config);

// Expected output
console.log(result);
// => { expected: 'output' }
\`\`\`

## Architecture Documentation

### ADR (Architecture Decision Record)
\`\`\`markdown
# ADR-001: Database Selection

## Status
Accepted

## Context
We need a database for storing user data with high availability requirements.

## Decision
We will use PostgreSQL with read replicas.

## Consequences
### Positive
- ACID compliance
- Strong ecosystem

### Negative
- Operational complexity
- Higher initial cost
\`\`\`

### System Diagrams
- Use Mermaid for inline diagrams
- Include sequence diagrams for complex flows
- Document data flow

\`\`\`mermaid
sequenceDiagram
    Client->>+API: Request
    API->>+DB: Query
    DB-->>-API: Data
    API-->>-Client: Response
\`\`\`
`
  },

  'commit-msg-generator': {
    name: 'commit-msg-generator',
    description: 'Generate conventional commit messages from staged changes',
    content: `---
name: commit-msg-generator
description: Generate conventional commit messages from staged changes.
---

# Commit Message Generator Skill

You are an expert at writing clear, conventional commit messages. Apply this skill when committing changes.

## Conventional Commit Format

\`\`\`
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
\`\`\`

## Commit Types

| Type | Description | Example |
|------|-------------|---------|
| feat | New feature | \`feat: add user registration\` |
| fix | Bug fix | \`fix: resolve null pointer in login\` |
| docs | Documentation only | \`docs: update API reference\` |
| style | Formatting, no code change | \`style: fix indentation\` |
| refactor | Code change, no feature/fix | \`refactor: extract validation logic\` |
| perf | Performance improvement | \`perf: optimize database queries\` |
| test | Adding/updating tests | \`test: add unit tests for auth\` |
| build | Build system changes | \`build: update webpack config\` |
| ci | CI configuration | \`ci: add GitHub Actions workflow\` |
| chore | Maintenance tasks | \`chore: update dependencies\` |
| revert | Revert previous commit | \`revert: revert "feat: add feature"\` |

## Scope Examples

Scopes indicate the area of change:
- \`feat(auth): add OAuth support\`
- \`fix(api): handle timeout errors\`
- \`refactor(ui): simplify form validation\`
- \`test(utils): add date formatting tests\`

## Writing Good Descriptions

### Do's
- Use imperative mood ("add" not "added")
- Be specific about what changed
- Keep under 50 characters
- Start lowercase after type

### Don'ts
- Don't end with a period
- Don't be vague ("fix stuff")
- Don't repeat the type ("feat: add new feature")

## Good Examples

\`\`\`
feat(auth): add password reset via email

Implements password reset flow:
- Send reset email with token
- Token expires after 1 hour
- Rate limit: 3 requests per hour

Closes #123
\`\`\`

\`\`\`
fix(cart): prevent negative quantities

Users could enter negative quantities which caused
incorrect totals. Now validates minimum of 1.

Fixes #456
\`\`\`

\`\`\`
refactor(api): extract validation middleware

Moved inline validation to reusable middleware.
No functional changes.
\`\`\`

\`\`\`
perf(queries): add index for user lookups

Reduces user search from 500ms to 50ms average.
\`\`\`

## Bad Examples (and why)

\`\`\`
# Too vague
fix: fix bug

# Wrong mood
feat: added login

# Too long
feat: add the ability for users to reset their password through email verification

# Ends with period
docs: update readme.

# Redundant
feat: new feature for authentication
\`\`\`

## Breaking Changes

Use \`!\` or footer for breaking changes:

\`\`\`
feat(api)!: change authentication to JWT

BREAKING CHANGE: API now requires JWT tokens instead of sessions.
Migration guide: https://docs.example.com/jwt-migration
\`\`\`

## Footer References

\`\`\`
fix(auth): resolve session timeout issue

Fixes #123
Closes #124
Refs #100
\`\`\`

## Multi-line Body Guidelines

When to use a body:
- Explaining why the change was made
- Describing what changed at a high level
- Listing breaking changes or migrations

Format:
- Separate from subject with blank line
- Wrap at 72 characters
- Use bullet points for lists

## Commit Message Template

\`\`\`
# <type>[scope]: <subject>
#
# [body - explain why, not what]
#
# [footer - references, breaking changes]
#
# Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
# Scope: auth, api, ui, db, etc.
# Subject: imperative, lowercase, no period, <50 chars
# Body: wrap at 72 chars, explain motivation
# Footer: Closes #issue, BREAKING CHANGE:
\`\`\`
`
  },

  'refactoring-advisor': {
    name: 'refactoring-advisor',
    description: 'Identify code smells and suggest refactoring patterns',
    content: `---
name: refactoring-advisor
description: Identify code smells and suggest refactoring patterns.
---

# Refactoring Advisor Skill

You are an expert at identifying code smells and applying refactoring patterns. Apply this skill when improving code quality without changing behavior.

## Code Smell Categories

### 1. Bloaters
Code that has grown too large.

#### Long Method (>20 lines)
**Smell:** Method tries to do too much
**Refactoring:**
- Extract Method
- Replace Temp with Query
- Introduce Parameter Object
- Preserve Whole Object

\`\`\`javascript
// Before: Long method
function processOrder(order) {
  // 50 lines of validation
  // 30 lines of calculation
  // 20 lines of persistence
}

// After: Extracted methods
function processOrder(order) {
  validateOrder(order);
  const totals = calculateTotals(order);
  await saveOrder(order, totals);
}
\`\`\`

#### Large Class (>300 lines)
**Smell:** Class has too many responsibilities
**Refactoring:**
- Extract Class
- Extract Subclass
- Extract Interface

#### Long Parameter List (>4 params)
**Smell:** Function requires too many arguments
**Refactoring:**
- Introduce Parameter Object
- Preserve Whole Object
- Replace Parameter with Method Call

\`\`\`javascript
// Before
function createUser(name, email, phone, address, city, zip, country) {}

// After
function createUser(userData) {
  const { name, email, phone, address } = userData;
}
\`\`\`

### 2. Object-Orientation Abusers

#### Switch Statements on Type
**Smell:** Switch based on object type
**Refactoring:**
- Replace Type Code with Subclasses
- Replace Conditional with Polymorphism

\`\`\`javascript
// Before
function getArea(shape) {
  switch (shape.type) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
  }
}

// After
class Circle {
  getArea() { return Math.PI * this.radius ** 2; }
}
class Rectangle {
  getArea() { return this.width * this.height; }
}
\`\`\`

#### Refused Bequest
**Smell:** Subclass doesn't use inherited methods
**Refactoring:**
- Replace Inheritance with Delegation
- Extract Superclass

### 3. Change Preventers

#### Divergent Change
**Smell:** One class changed for many different reasons
**Refactoring:**
- Extract Class

#### Shotgun Surgery
**Smell:** One change requires edits in many places
**Refactoring:**
- Move Method
- Move Field
- Inline Class

### 4. Dispensables

#### Dead Code
**Smell:** Unreachable or unused code
**Refactoring:**
- Remove Dead Code

#### Duplicate Code
**Smell:** Same code in multiple places
**Refactoring:**
- Extract Method
- Extract Class
- Pull Up Method
- Form Template Method

#### Lazy Class
**Smell:** Class that doesn't do enough
**Refactoring:**
- Inline Class
- Collapse Hierarchy

#### Speculative Generality
**Smell:** "We might need this someday"
**Refactoring:**
- Collapse Hierarchy
- Inline Class
- Remove Parameter

### 5. Couplers

#### Feature Envy
**Smell:** Method uses another class more than its own
**Refactoring:**
- Move Method
- Extract Method then Move

\`\`\`javascript
// Before: Feature envy
class OrderPrinter {
  printOrder(order) {
    console.log(order.customer.name);
    console.log(order.customer.address);
    console.log(order.items.map(i => i.name).join(', '));
  }
}

// After: Method moved
class Order {
  getFormattedDetails() {
    return \`\${this.customer.name}\\n\${this.customer.address}\`;
  }
}
\`\`\`

#### Inappropriate Intimacy
**Smell:** Classes know too much about each other
**Refactoring:**
- Move Method
- Move Field
- Change Bidirectional to Unidirectional
- Extract Class

## Refactoring Patterns

### Extract Method
\`\`\`javascript
// Before
function printOwing() {
  // print banner
  console.log("********************");
  console.log("***** Customer *****");
  console.log("********************");

  // print details
  console.log(\`name: \${this.name}\`);
  console.log(\`amount: \${this.amount}\`);
}

// After
function printOwing() {
  printBanner();
  printDetails();
}

function printBanner() {
  console.log("********************");
  console.log("***** Customer *****");
  console.log("********************");
}
\`\`\`

### Replace Magic Number with Constant
\`\`\`javascript
// Before
if (age >= 18) { /* ... */ }

// After
const LEGAL_AGE = 18;
if (age >= LEGAL_AGE) { /* ... */ }
\`\`\`

### Introduce Explaining Variable
\`\`\`javascript
// Before
if ((platform.toUpperCase().indexOf("MAC") > -1) &&
    (browser.toUpperCase().indexOf("IE") > -1)) {

// After
const isMacOS = platform.toUpperCase().indexOf("MAC") > -1;
const isIE = browser.toUpperCase().indexOf("IE") > -1;
if (isMacOS && isIE) {
\`\`\`

## Safety Checklist

Before refactoring:
- [ ] Tests exist and pass
- [ ] Understand what the code does
- [ ] No pending changes in progress

During refactoring:
- [ ] Make small, incremental changes
- [ ] Run tests after each change
- [ ] Commit frequently
- [ ] One refactoring at a time

After refactoring:
- [ ] All tests still pass
- [ ] No behavior has changed
- [ ] Code is more readable
- [ ] Review the diff
`
  },

  'api-design-reviewer': {
    name: 'api-design-reviewer',
    description: 'Review API design for REST/GraphQL best practices',
    content: `---
name: api-design-reviewer
description: Review API design for REST/GraphQL best practices.
---

# API Design Reviewer Skill

You are an expert API designer. Apply this skill when designing or reviewing REST or GraphQL APIs.

## REST API Design Rules

### URL Design

#### Use Nouns, Not Verbs
\`\`\`
# Good
GET /users
POST /users
GET /users/123
DELETE /users/123

# Bad
GET /getUsers
POST /createUser
GET /getUserById/123
\`\`\`

#### Use Plural Nouns
\`\`\`
# Good
/users
/products
/orders

# Bad
/user
/product
/order
\`\`\`

#### Hierarchy for Relationships
\`\`\`
# Good
GET /users/123/orders
GET /orders/456/items

# Bad
GET /getUserOrders?userId=123
\`\`\`

#### Use Hyphens, Not Underscores
\`\`\`
# Good
/user-profiles
/order-items

# Bad
/user_profiles
/orderItems
\`\`\`

### HTTP Methods

| Method | Usage | Idempotent | Safe |
|--------|-------|------------|------|
| GET | Retrieve resource | Yes | Yes |
| POST | Create resource | No | No |
| PUT | Replace resource | Yes | No |
| PATCH | Partial update | No | No |
| DELETE | Remove resource | Yes | No |

### Status Codes

#### Success (2xx)
| Code | Usage |
|------|-------|
| 200 | OK - GET, PUT, PATCH success |
| 201 | Created - POST success |
| 204 | No Content - DELETE success |

#### Client Error (4xx)
| Code | Usage |
|------|-------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - Auth insufficient |
| 404 | Not Found - Resource missing |
| 409 | Conflict - Resource state conflict |
| 422 | Unprocessable - Validation failed |
| 429 | Too Many Requests - Rate limited |

#### Server Error (5xx)
| Code | Usage |
|------|-------|
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### Response Format

#### Success Response
\`\`\`json
{
  "data": {
    "id": "123",
    "type": "user",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
\`\`\`

#### Error Response
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
\`\`\`

#### Collection Response
\`\`\`json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  },
  "links": {
    "self": "/users?page=1",
    "next": "/users?page=2",
    "last": "/users?page=5"
  }
}
\`\`\`

### Pagination

#### Offset-based
\`\`\`
GET /users?page=2&limit=20
GET /users?offset=40&limit=20
\`\`\`

#### Cursor-based (for large datasets)
\`\`\`
GET /users?cursor=abc123&limit=20
\`\`\`

### Filtering

\`\`\`
GET /users?status=active
GET /users?role=admin&status=active
GET /users?created_after=2024-01-01
GET /products?price_min=10&price_max=100
\`\`\`

### Sorting

\`\`\`
GET /users?sort=name
GET /users?sort=-created_at (descending)
GET /users?sort=name,-created_at (multiple)
\`\`\`

### Field Selection

\`\`\`
GET /users?fields=id,name,email
GET /users/123?fields=id,name
\`\`\`

### Versioning

\`\`\`
# URL versioning (recommended)
/api/v1/users
/api/v2/users

# Header versioning
Accept: application/vnd.api+json; version=1
\`\`\`

## GraphQL Best Practices

### Schema Design
\`\`\`graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts(first: Int, after: String): PostConnection!
}

type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
}

type PostEdge {
  node: Post!
  cursor: String!
}
\`\`\`

### Naming Conventions
- Types: PascalCase (User, BlogPost)
- Fields: camelCase (firstName, createdAt)
- Enums: SCREAMING_SNAKE_CASE (ORDER_STATUS)
- Mutations: verb + noun (createUser, updatePost)

### Error Handling
\`\`\`graphql
type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
}

type CreateUserPayload {
  user: User
  errors: [UserError!]!
}

type UserError {
  field: String
  message: String!
  code: ErrorCode!
}
\`\`\`

## API Review Checklist

### Design
- [ ] URLs use nouns, not verbs
- [ ] Consistent naming conventions
- [ ] Proper HTTP methods used
- [ ] Appropriate status codes
- [ ] Consistent response format

### Security
- [ ] Authentication required
- [ ] Authorization checked
- [ ] Rate limiting configured
- [ ] Input validated
- [ ] Sensitive data not exposed

### Performance
- [ ] Pagination implemented
- [ ] Field selection available
- [ ] Caching headers set
- [ ] No N+1 queries
- [ ] Response size reasonable

### Documentation
- [ ] OpenAPI/Swagger spec
- [ ] All endpoints documented
- [ ] Request/response examples
- [ ] Error codes listed
- [ ] Authentication explained
`
  },

  'database-reviewer': {
    name: 'database-reviewer',
    description: 'Review database schema and queries for optimization and safety',
    content: `---
name: database-reviewer
description: Review database schema and queries for optimization and safety.
---

# Database Reviewer Skill

You are an expert database engineer. Apply this skill when reviewing database schema, queries, or migrations.

## Schema Design Checklist

### Tables
- [ ] Primary key defined (prefer UUID or auto-increment)
- [ ] Foreign keys have proper constraints
- [ ] NOT NULL where appropriate
- [ ] DEFAULT values set where sensible
- [ ] Table names are plural (users, orders)
- [ ] Column names are snake_case

### Indexes
- [ ] Primary keys indexed (automatic)
- [ ] Foreign keys indexed
- [ ] Frequently filtered columns indexed
- [ ] Composite indexes for multi-column queries
- [ ] No redundant indexes
- [ ] Index naming convention followed

### Relationships
- [ ] One-to-many: FK on many side
- [ ] Many-to-many: junction table
- [ ] ON DELETE/UPDATE actions defined
- [ ] Circular dependencies avoided

### Data Types
- [ ] Appropriate types for data (not VARCHAR for everything)
- [ ] Proper precision for decimals
- [ ] TIMESTAMP WITH TIME ZONE for dates
- [ ] TEXT vs VARCHAR chosen appropriately
- [ ] ENUM for fixed options

## Query Optimization

### N+1 Query Detection
\`\`\`javascript
// Bad: N+1 queries
const users = await User.findAll();
for (const user of users) {
  const orders = await Order.findByUserId(user.id); // N queries
}

// Good: Eager loading
const users = await User.findAll({
  include: [{ model: Order }]
});

// Good: Batch loading
const users = await User.findAll();
const userIds = users.map(u => u.id);
const orders = await Order.findAll({
  where: { userId: userIds }
});
\`\`\`

### Index Usage
\`\`\`sql
-- Check if query uses indexes
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Create index for slow queries
CREATE INDEX idx_users_email ON users(email);

-- Composite index for multi-column queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
\`\`\`

### Query Patterns

#### Use LIMIT for pagination
\`\`\`sql
-- Bad: Fetch all then slice
SELECT * FROM users;

-- Good: Limit at database level
SELECT * FROM users ORDER BY id LIMIT 20 OFFSET 40;
\`\`\`

#### Avoid SELECT *
\`\`\`sql
-- Bad: Fetches unnecessary columns
SELECT * FROM users;

-- Good: Specific columns
SELECT id, name, email FROM users;
\`\`\`

#### Use JOINs efficiently
\`\`\`sql
-- Bad: Multiple queries
SELECT * FROM orders WHERE user_id = 123;
SELECT * FROM users WHERE id = 123;

-- Good: Single JOIN
SELECT o.*, u.name
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.id = 123;
\`\`\`

### Slow Query Patterns

| Pattern | Problem | Solution |
|---------|---------|----------|
| \`LIKE '%value'\` | Can't use index | Full-text search |
| \`ORDER BY RAND()\` | Scans entire table | Application-side random |
| \`SELECT COUNT(*)\` on large tables | Full table scan | Estimated counts |
| Functions on indexed columns | Index bypassed | Store computed values |

## Migration Safety

### Safe Operations
- Adding nullable columns
- Adding indexes concurrently
- Adding tables
- Dropping unused indexes

### Dangerous Operations
- Dropping columns/tables
- Renaming columns
- Changing column types
- Adding NOT NULL to existing columns

### Safe Migration Pattern
\`\`\`sql
-- Step 1: Add new column (nullable)
ALTER TABLE users ADD COLUMN new_email VARCHAR(255);

-- Step 2: Backfill data (in batches)
UPDATE users SET new_email = email WHERE id BETWEEN 1 AND 1000;

-- Step 3: Add constraints
ALTER TABLE users ALTER COLUMN new_email SET NOT NULL;

-- Step 4: Drop old column (after confirming app doesn't use it)
ALTER TABLE users DROP COLUMN email;

-- Step 5: Rename (optional)
ALTER TABLE users RENAME COLUMN new_email TO email;
\`\`\`

### Zero-Downtime Migrations
1. New code must work with old and new schema
2. Deploy new code
3. Run migration
4. Clean up old code references

## Query Security

### SQL Injection Prevention
\`\`\`javascript
// Bad: String concatenation
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// Good: Parameterized queries
const query = 'SELECT * FROM users WHERE id = $1';
await client.query(query, [userId]);

// Good: ORM with parameterization
await User.findOne({ where: { id: userId } });
\`\`\`

### Access Control
\`\`\`sql
-- Row-level security
CREATE POLICY user_policy ON documents
  USING (user_id = current_user_id());

-- Grant minimal permissions
GRANT SELECT, INSERT ON users TO app_user;
REVOKE DELETE ON users FROM app_user;
\`\`\`

## Performance Checklist

- [ ] Queries use indexes (check EXPLAIN)
- [ ] No N+1 query problems
- [ ] Pagination implemented
- [ ] Proper connection pooling
- [ ] Read replicas for heavy reads
- [ ] Caching for hot data
- [ ] Batch operations for bulk changes
- [ ] Transactions used appropriately
`
  },

  'accessibility-auditor': {
    name: 'accessibility-auditor',
    description: 'Audit UI for WCAG compliance',
    content: `---
name: accessibility-auditor
description: Audit UI for WCAG compliance. Use for UI development, forms, navigation, interactive elements.
---

# Accessibility Auditor Skill

You are an expert accessibility specialist. Apply this skill when developing UI components, forms, navigation, or interactive elements.

## WCAG 2.1 Checklist

### Principle 1: Perceivable

#### 1.1 Text Alternatives
- [ ] All images have alt text
- [ ] Decorative images use \`alt=""\` or CSS backgrounds
- [ ] Complex images have long descriptions
- [ ] Form inputs have labels

\`\`\`html
<!-- Good: Meaningful alt text -->
<img src="chart.png" alt="Sales chart showing 20% growth in Q4">

<!-- Good: Decorative image -->
<img src="decoration.png" alt="">

<!-- Good: Form label -->
<label for="email">Email address</label>
<input type="email" id="email" name="email">
\`\`\`

#### 1.2 Time-based Media
- [ ] Videos have captions
- [ ] Videos have audio descriptions
- [ ] Audio has transcripts

#### 1.3 Adaptable
- [ ] Semantic HTML used correctly
- [ ] Reading order makes sense
- [ ] Content doesn't rely on sensory characteristics

\`\`\`html
<!-- Good: Semantic structure -->
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main>
  <article>
    <h1>Page Title</h1>
    <section>
      <h2>Section Heading</h2>
    </section>
  </article>
</main>
<footer>...</footer>
\`\`\`

#### 1.4 Distinguishable
- [ ] Color contrast ratio at least 4.5:1 (text)
- [ ] Color contrast ratio at least 3:1 (large text)
- [ ] Information not conveyed by color alone
- [ ] Text resizable to 200% without loss
- [ ] No horizontal scrolling at 320px width

### Principle 2: Operable

#### 2.1 Keyboard Accessible
- [ ] All functionality keyboard accessible
- [ ] No keyboard traps
- [ ] Focus visible at all times
- [ ] Logical tab order

\`\`\`javascript
// Good: Custom keyboard handling
button.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
});
\`\`\`

#### 2.2 Enough Time
- [ ] Timing can be adjusted
- [ ] Auto-updating content can be paused
- [ ] No content flashes more than 3 times/second

#### 2.3 Seizures and Physical Reactions
- [ ] No content flashes more than 3 times/second

#### 2.4 Navigable
- [ ] Skip links provided
- [ ] Page titles descriptive
- [ ] Focus order logical
- [ ] Link purpose clear

\`\`\`html
<!-- Good: Skip link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Good: Descriptive link -->
<a href="/products">View all products</a>

<!-- Bad: Vague link -->
<a href="/products">Click here</a>
\`\`\`

### Principle 3: Understandable

#### 3.1 Readable
- [ ] Language of page set
- [ ] Language changes indicated
- [ ] Abbreviations explained

\`\`\`html
<html lang="en">
<p>The <abbr title="World Wide Web Consortium">W3C</abbr> sets standards.</p>
\`\`\`

#### 3.2 Predictable
- [ ] Focus doesn't trigger unexpected changes
- [ ] Consistent navigation
- [ ] Consistent identification

#### 3.3 Input Assistance
- [ ] Errors clearly identified
- [ ] Labels and instructions provided
- [ ] Error suggestions offered
- [ ] Error prevention for important actions

\`\`\`html
<!-- Good: Error handling -->
<label for="email">Email address (required)</label>
<input type="email" id="email" aria-describedby="email-error" aria-invalid="true">
<p id="email-error" class="error">Please enter a valid email address</p>
\`\`\`

### Principle 4: Robust

#### 4.1 Compatible
- [ ] Valid HTML
- [ ] Complete start/end tags
- [ ] No duplicate attributes
- [ ] ARIA used correctly

## ARIA Patterns

### Buttons
\`\`\`html
<!-- Standard button -->
<button type="button">Click me</button>

<!-- Custom button -->
<div role="button" tabindex="0" aria-pressed="false">Toggle</div>
\`\`\`

### Modals/Dialogs
\`\`\`html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Action</h2>
  <p>Are you sure you want to proceed?</p>
  <button>Cancel</button>
  <button>Confirm</button>
</div>
\`\`\`

### Tabs
\`\`\`html
<div role="tablist" aria-label="Settings">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
    General
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">
    Security
  </button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  General settings content
</div>
\`\`\`

### Live Regions
\`\`\`html
<!-- Polite: Wait for user to finish -->
<div aria-live="polite">Items loaded</div>

<!-- Assertive: Interrupt immediately -->
<div aria-live="assertive" role="alert">Error: Form submission failed</div>
\`\`\`

## Color Contrast

### Minimum Ratios
- Normal text: 4.5:1
- Large text (18pt or 14pt bold): 3:1
- UI components: 3:1
- AAA (enhanced): 7:1 / 4.5:1

### Testing Tools
- Chrome DevTools color picker
- axe DevTools
- WAVE browser extension
- Contrast ratio calculators

## Keyboard Navigation

### Focus Management
\`\`\`javascript
// Trap focus in modal
const modal = document.getElementById('modal');
const focusableElements = modal.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);
const firstFocusable = focusableElements[0];
const lastFocusable = focusableElements[focusableElements.length - 1];

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
});
\`\`\`

### Focus Styles
\`\`\`css
/* Never just hide focus */
:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Focus-visible for keyboard only */
:focus:not(:focus-visible) {
  outline: none;
}
:focus-visible {
  outline: 2px solid #0066cc;
}
\`\`\`

## Testing Checklist

- [ ] Keyboard-only navigation test
- [ ] Screen reader test (NVDA, VoiceOver)
- [ ] High contrast mode test
- [ ] 200% zoom test
- [ ] Automated scan (axe, WAVE)
- [ ] Color contrast check
`
  },

  'ux-reviewer': {
    name: 'ux-reviewer',
    description: 'Review UI/UX for usability',
    content: `---
name: ux-reviewer
description: Review UI/UX for usability. Use for interface design, user flows, forms, navigation.
---

# UX Reviewer Skill

You are an expert UX designer. Apply this skill when reviewing interface design, user flows, forms, or navigation.

## Nielsen's 10 Usability Heuristics

### 1. Visibility of System Status
Users should always know what's happening.

**Checkpoints:**
- [ ] Loading indicators for async operations
- [ ] Progress bars for multi-step processes
- [ ] Success/error feedback for actions
- [ ] Current state clearly shown (selected, active, etc.)
- [ ] Real-time validation feedback

\`\`\`
Good: "Saving..." → "Saved ✓"
Bad: Form submits with no feedback
\`\`\`

### 2. Match Between System and Real World
Speak the user's language.

**Checkpoints:**
- [ ] Plain language, not jargon
- [ ] Familiar icons and metaphors
- [ ] Logical information order
- [ ] Natural naming conventions

\`\`\`
Good: "Delete" with trash icon
Bad: "Expunge record from database"
\`\`\`

### 3. User Control and Freedom
Easy way to undo and exit.

**Checkpoints:**
- [ ] Clear cancel/close buttons
- [ ] Undo functionality for destructive actions
- [ ] Easy navigation back
- [ ] No forced paths

\`\`\`
Good: "Undo" after delete with 5-second window
Bad: "Are you sure?" without undo option
\`\`\`

### 4. Consistency and Standards
Follow platform conventions.

**Checkpoints:**
- [ ] Consistent terminology
- [ ] Standard UI patterns
- [ ] Predictable interactions
- [ ] Consistent visual design

\`\`\`
Good: Links are blue and underlined
Bad: Links look like plain text
\`\`\`

### 5. Error Prevention
Prevent problems before they occur.

**Checkpoints:**
- [ ] Confirmation for destructive actions
- [ ] Inline validation before submission
- [ ] Reasonable defaults
- [ ] Constraints that prevent errors

\`\`\`
Good: Date picker instead of free text
Bad: "Enter date (DD/MM/YYYY)" with no validation
\`\`\`

### 6. Recognition Rather Than Recall
Minimize memory load.

**Checkpoints:**
- [ ] Visible options rather than hidden
- [ ] Context-sensitive help
- [ ] Recent items and suggestions
- [ ] Clear labels on all elements

\`\`\`
Good: Dropdown with searchable options
Bad: Text field requiring memorized codes
\`\`\`

### 7. Flexibility and Efficiency
Cater to both novices and experts.

**Checkpoints:**
- [ ] Keyboard shortcuts for power users
- [ ] Customizable preferences
- [ ] Quick actions and bulk operations
- [ ] Progressive disclosure

\`\`\`
Good: Both click and keyboard shortcut (Ctrl+S)
Bad: Mouse-only interface with many clicks
\`\`\`

### 8. Aesthetic and Minimalist Design
Remove unnecessary elements.

**Checkpoints:**
- [ ] No visual clutter
- [ ] Clear visual hierarchy
- [ ] Whitespace used effectively
- [ ] Essential content prioritized

\`\`\`
Good: Clean form with essential fields
Bad: Dense page with every possible option
\`\`\`

### 9. Help Users Recognize, Diagnose, and Recover from Errors
Clear, helpful error messages.

**Checkpoints:**
- [ ] Plain language errors (not codes)
- [ ] Specific problem identification
- [ ] Constructive suggestions
- [ ] No blame on user

\`\`\`
Good: "Password must be at least 8 characters"
Bad: "Error 422: Validation failed"
\`\`\`

### 10. Help and Documentation
Easy access when needed.

**Checkpoints:**
- [ ] Searchable help system
- [ ] Contextual help (tooltips)
- [ ] Onboarding for new users
- [ ] Task-focused documentation

## UX Laws

### Fitts's Law
**Principle:** Time to reach a target depends on distance and size.

**Application:**
- Make clickable areas large enough
- Place important actions where they're easy to reach
- Consider edge/corner positions for primary actions

### Hick's Law
**Principle:** Decision time increases with number of choices.

**Application:**
- Limit options (ideal: 5-7)
- Use progressive disclosure
- Provide smart defaults
- Group related options

### Jakob's Law
**Principle:** Users prefer familiar patterns.

**Application:**
- Use standard UI conventions
- Follow platform guidelines
- Don't innovate unnecessarily

### Miller's Law
**Principle:** People can hold ~7 items in working memory.

**Application:**
- Chunk information
- Limit form fields per page
- Use progressive disclosure

## Common UX Issues

### Forms
- [ ] Labels above or beside fields (not placeholder-only)
- [ ] Logical field grouping
- [ ] Clear required field indicators
- [ ] Inline validation with helpful messages
- [ ] Appropriate input types (email, tel, etc.)
- [ ] Submit button clearly visible
- [ ] Form length appropriate for task

### Navigation
- [ ] Current location clearly indicated
- [ ] Breadcrumbs for deep hierarchies
- [ ] Consistent navigation across pages
- [ ] Mobile-friendly navigation
- [ ] Search functionality for large sites

### Mobile
- [ ] Touch targets at least 44x44px
- [ ] No hover-dependent interactions
- [ ] Responsive layouts
- [ ] Content readable without zooming
- [ ] Forms optimized for mobile

### Performance Perception
- [ ] Skeleton screens during loading
- [ ] Optimistic updates for fast feedback
- [ ] Progress indicators for long operations
- [ ] Prioritized content loading

## UX Review Checklist

### Before Development
- [ ] User flows documented
- [ ] Edge cases considered
- [ ] Error states designed
- [ ] Empty states designed
- [ ] Loading states designed

### During Review
- [ ] Clear visual hierarchy
- [ ] Consistent patterns
- [ ] Appropriate feedback
- [ ] Error prevention and recovery
- [ ] Mobile responsiveness

### Usability Testing
- [ ] Key tasks identified
- [ ] Success criteria defined
- [ ] Real users tested
- [ ] Findings documented
- [ ] Iterations planned
`
  },

  'performance-analyzer': {
    name: 'performance-analyzer',
    description: 'Identify performance bottlenecks and optimization opportunities',
    content: `---
name: performance-analyzer
description: Identify performance bottlenecks and optimization opportunities.
---

# Performance Analyzer Skill

You are an expert performance engineer. Apply this skill when analyzing performance issues or optimizing applications.

## Frontend Performance

### Core Web Vitals

#### LCP (Largest Contentful Paint) - Target: <2.5s
- [ ] Optimize largest image (hero, banner)
- [ ] Use modern image formats (WebP, AVIF)
- [ ] Implement lazy loading
- [ ] Preload critical resources
- [ ] Use CDN for assets

#### FID (First Input Delay) - Target: <100ms
- [ ] Break up long JavaScript tasks
- [ ] Use web workers for heavy computation
- [ ] Defer non-critical JavaScript
- [ ] Minimize main thread work

#### CLS (Cumulative Layout Shift) - Target: <0.1
- [ ] Set dimensions on images/videos
- [ ] Reserve space for dynamic content
- [ ] Avoid inserting content above existing content
- [ ] Use CSS transforms for animations

### JavaScript Optimization

\`\`\`javascript
// Bad: Blocking the main thread
function processLargeArray(items) {
  for (const item of items) {
    heavyComputation(item);
  }
}

// Good: Chunked processing
async function processLargeArray(items, chunkSize = 100) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await new Promise(resolve => setTimeout(resolve, 0));
    chunk.forEach(item => heavyComputation(item));
  }
}
\`\`\`

### Bundle Optimization
- [ ] Code splitting by route
- [ ] Dynamic imports for heavy components
- [ ] Tree shaking enabled
- [ ] Minification in production
- [ ] Compression (gzip/brotli)

\`\`\`javascript
// Dynamic import
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
\`\`\`

### Image Optimization
- [ ] Responsive images with srcset
- [ ] Modern formats (WebP, AVIF)
- [ ] Lazy loading below fold
- [ ] Proper sizing (no oversized images)
- [ ] Image CDN with transformations

\`\`\`html
<img
  src="image-800.webp"
  srcset="image-400.webp 400w,
          image-800.webp 800w,
          image-1200.webp 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  loading="lazy"
  alt="Description">
\`\`\`

### Caching Strategy
\`\`\`
# Cache-Control headers
Static assets: max-age=31536000, immutable
HTML: no-cache (or short max-age)
API: max-age=0, must-revalidate
\`\`\`

## Backend Performance

### Database Optimization
- [ ] Proper indexes on query columns
- [ ] No N+1 queries
- [ ] Query analysis (EXPLAIN)
- [ ] Connection pooling
- [ ] Read replicas for heavy reads

### Caching Layers
\`\`\`
Request → CDN Cache → Application Cache → Database Cache → Database
\`\`\`

- [ ] HTTP caching (CDN, browser)
- [ ] Application cache (Redis, Memcached)
- [ ] Query result caching
- [ ] Computed value caching

### API Optimization
- [ ] Pagination for large datasets
- [ ] Field selection to reduce payload
- [ ] Response compression
- [ ] Batch endpoints for multiple operations
- [ ] GraphQL for flexible querying

\`\`\`javascript
// Batch endpoint
POST /api/batch
{
  "operations": [
    { "method": "GET", "path": "/users/1" },
    { "method": "GET", "path": "/users/2" }
  ]
}
\`\`\`

## Common Bottleneck Patterns

### Synchronous Operations
\`\`\`javascript
// Bad: Sequential async calls
const user = await getUser(id);
const orders = await getOrders(id);
const recommendations = await getRecommendations(id);

// Good: Parallel execution
const [user, orders, recommendations] = await Promise.all([
  getUser(id),
  getOrders(id),
  getRecommendations(id)
]);
\`\`\`

### Memory Leaks
\`\`\`javascript
// Bad: Event listener not cleaned up
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  // Missing cleanup!
});

// Good: Cleanup on unmount
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
\`\`\`

### Unnecessary Re-renders
\`\`\`javascript
// Bad: Object created on every render
<Component style={{ color: 'red' }} />

// Good: Memoized or static
const style = useMemo(() => ({ color: 'red' }), []);
<Component style={style} />
\`\`\`

## Optimization Strategies

### Lazy Loading
- Images below the fold
- Non-critical JavaScript
- Heavy components
- Routes

### Prefetching
- Next page data
- Hover-triggered resources
- Predicted user paths

### Debounce/Throttle
\`\`\`javascript
// Debounce: Execute after pause
const debouncedSearch = debounce(search, 300);

// Throttle: Execute at most every N ms
const throttledScroll = throttle(handleScroll, 100);
\`\`\`

## Performance Monitoring

### Key Metrics
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)

### Tools
- Lighthouse
- WebPageTest
- Chrome DevTools Performance tab
- Core Web Vitals field data
- APM tools (New Relic, Datadog)

## Performance Checklist

### Frontend
- [ ] Bundle size analyzed and optimized
- [ ] Images optimized and lazy loaded
- [ ] JavaScript deferred/async
- [ ] Critical CSS inlined
- [ ] Service worker for offline
- [ ] Core Web Vitals meeting targets

### Backend
- [ ] Database queries optimized
- [ ] Caching implemented
- [ ] Connection pooling configured
- [ ] Response compression enabled
- [ ] Load testing performed
- [ ] Monitoring and alerting set up
`
  },

  'dependency-auditor': {
    name: 'dependency-auditor',
    description: 'Audit dependencies for vulnerabilities, outdated packages, license conflicts',
    content: `---
name: dependency-auditor
description: Audit dependencies for vulnerabilities, outdated packages, license conflicts.
---

# Dependency Auditor Skill

You are an expert at managing dependencies securely. Apply this skill when reviewing dependencies for vulnerabilities, updates, or license issues.

## Security Audit Commands

### Node.js (npm)
\`\`\`bash
# Run security audit
npm audit

# Fix automatically where possible
npm audit fix

# Fix with breaking changes
npm audit fix --force

# Generate report
npm audit --json > audit-report.json
\`\`\`

### Python (pip)
\`\`\`bash
# Using safety
pip install safety
safety check

# Using pip-audit
pip install pip-audit
pip-audit

# Check specific requirements file
safety check -r requirements.txt
\`\`\`

### .NET
\`\`\`bash
# NuGet vulnerability check
dotnet list package --vulnerable

# Include transitive dependencies
dotnet list package --vulnerable --include-transitive
\`\`\`

### Ruby (bundler)
\`\`\`bash
# Using bundler-audit
gem install bundler-audit
bundler-audit check --update
\`\`\`

### Go
\`\`\`bash
# Using govulncheck
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...
\`\`\`

## License Compatibility

### Permissive Licenses (Generally Safe)
| License | Commercial Use | Modification | Distribution |
|---------|---------------|--------------|--------------|
| MIT | ✓ | ✓ | ✓ |
| Apache 2.0 | ✓ | ✓ | ✓ |
| BSD 2/3-Clause | ✓ | ✓ | ✓ |
| ISC | ✓ | ✓ | ✓ |

### Copyleft Licenses (Requires Review)
| License | Implication |
|---------|-------------|
| GPL v2/v3 | Must open source your code if distributed |
| LGPL | OK if dynamically linked, not statically |
| AGPL | Must open source even for SaaS use |
| MPL 2.0 | File-level copyleft |

### License Check Tools
\`\`\`bash
# npm
npx license-checker --summary

# Python
pip install pip-licenses
pip-licenses

# Go
go install github.com/google/go-licenses@latest
go-licenses csv ./...
\`\`\`

## Outdated Dependency Check

### npm
\`\`\`bash
# Check outdated
npm outdated

# Interactive update
npx npm-check -u
\`\`\`

### Python
\`\`\`bash
# Using pip-review
pip install pip-review
pip-review --local

# Interactive update
pip-review --local --interactive
\`\`\`

### .NET
\`\`\`bash
dotnet list package --outdated
\`\`\`

## Best Practices

### 1. Lock File Discipline
- [ ] Lock file committed to version control
- [ ] Exact versions in lock file
- [ ] Regular lock file updates
- [ ] CI validates lock file matches

### 2. Version Pinning
\`\`\`json
// package.json - Pin major versions at minimum
{
  "dependencies": {
    "lodash": "^4.17.21",  // Allows 4.x updates
    "express": "~4.18.2"   // Allows 4.18.x updates
  }
}
\`\`\`

### 3. Automated Updates
- [ ] Dependabot or Renovate configured
- [ ] Security updates auto-merged
- [ ] Minor updates require review
- [ ] Major updates require testing

### 4. Minimal Dependencies
- [ ] Each dependency justified
- [ ] Prefer native/standard library solutions
- [ ] Audit transitive dependencies
- [ ] Remove unused dependencies

### 5. Regular Audits
- [ ] Weekly automated scans in CI
- [ ] Monthly manual review
- [ ] Quarterly full audit

## SBOM (Software Bill of Materials)

### Generate SBOM
\`\`\`bash
# CycloneDX format (npm)
npx @cyclonedx/cyclonedx-npm --output-file sbom.json

# SPDX format
npx spdx-sbom-generator
\`\`\`

### SBOM Uses
- Track all components
- License compliance
- Vulnerability correlation
- Supply chain transparency

## Vulnerability Response

### Severity Levels
| Level | Response Time | Example |
|-------|---------------|---------|
| Critical | 24-48 hours | RCE vulnerability |
| High | 1 week | Auth bypass |
| Medium | 2-4 weeks | XSS vulnerability |
| Low | Next release | Information disclosure |

### Response Steps
1. Assess impact in your context
2. Check for patches
3. Update or mitigate
4. Test thoroughly
5. Document decision

## Dependency Review Checklist

### New Dependencies
- [ ] Actively maintained (recent commits)
- [ ] Reasonable issue response time
- [ ] Good test coverage
- [ ] No known vulnerabilities
- [ ] Acceptable license
- [ ] Reasonable download count
- [ ] Minimal transitive dependencies

### Existing Dependencies
- [ ] No critical vulnerabilities
- [ ] Not significantly outdated
- [ ] Still actively maintained
- [ ] License still compatible
- [ ] Still actually used

## Audit Report Template

\`\`\`markdown
## Dependency Audit Report

**Date:** YYYY-MM-DD
**Scope:** [Project name]

### Summary
- Total dependencies: X
- Direct: Y
- Transitive: Z

### Vulnerabilities Found
| Package | Severity | CVE | Status |
|---------|----------|-----|--------|
| example | High | CVE-2024-1234 | Fixed |

### Outdated Packages
| Package | Current | Latest | Risk |
|---------|---------|--------|------|
| lodash | 4.17.15 | 4.17.21 | Low |

### License Issues
| Package | License | Issue |
|---------|---------|-------|
| gpl-pkg | GPL-3.0 | Copyleft |

### Recommendations
1. Immediate: Update security-critical packages
2. Short-term: Update outdated packages
3. Long-term: Replace problematic dependencies
\`\`\`
`
  },

  'naming-conventions': {
    name: 'naming-conventions',
    description: 'Enforce consistent naming conventions across codebase',
    content: `---
name: naming-conventions
description: Enforce consistent naming conventions across codebase.
---

# Naming Conventions Skill

You are an expert at clean code naming. Apply this skill when reviewing or writing code to ensure consistent, meaningful names.

## General Principles

### 1. Be Descriptive
Names should clearly communicate purpose.

\`\`\`javascript
// Bad
const d = new Date();
const list = getUsers();
const temp = calculateTotal();

// Good
const currentDate = new Date();
const activeUsers = getActiveUsers();
const orderTotal = calculateOrderTotal();
\`\`\`

### 2. Use Pronounceable Names
Names should be easy to discuss.

\`\`\`javascript
// Bad
const genymdhms = generateYearMonthDayHourMinuteSecond();
const modymdhms = modifyYearMonthDayHourMinuteSecond();

// Good
const generatedTimestamp = generateTimestamp();
const modifiedTimestamp = modifyTimestamp();
\`\`\`

### 3. Use Searchable Names
Avoid single-letter names except for short loops.

\`\`\`javascript
// Bad
const e = document.getElementById('email');
const n = users.length;

// Good
const emailInput = document.getElementById('email');
const userCount = users.length;
\`\`\`

### 4. Avoid Mental Mapping
Don't make readers translate names.

\`\`\`javascript
// Bad
locations.forEach(l => {
  // what is l?
  doSomething(l);
});

// Good
locations.forEach(location => {
  doSomething(location);
});
\`\`\`

## JavaScript/TypeScript Conventions

### Variables and Functions
\`\`\`javascript
// camelCase for variables and functions
const userName = 'John';
const isActive = true;
function getUserById(userId) { }
function calculateTotalPrice() { }

// SCREAMING_SNAKE_CASE for constants
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;
\`\`\`

### Classes and Types
\`\`\`typescript
// PascalCase for classes and types
class UserService { }
class HttpClient { }
interface UserProfile { }
type OrderStatus = 'pending' | 'completed';

// Same for React components
function UserCard({ user }) { }
const ProfilePage = () => { };
\`\`\`

### Booleans
\`\`\`javascript
// Use is/has/can/should prefixes
const isLoading = true;
const hasPermission = false;
const canEdit = true;
const shouldRefresh = false;

// Or use adjective/past participle
const visible = true;
const enabled = false;
const authenticated = true;
\`\`\`

### Arrays and Collections
\`\`\`javascript
// Use plural nouns
const users = [];
const orderItems = [];
const selectedIds = new Set();

// Not
const userList = [];  // redundant 'list'
const userArray = []; // redundant 'array'
\`\`\`

### Functions
\`\`\`javascript
// Verb + noun for actions
function fetchUser(id) { }
function createOrder(items) { }
function updateProfile(data) { }
function deleteComment(id) { }

// get/set for accessors
function getUserName() { }
function setUserName(name) { }

// is/has/can for boolean returns
function isValid() { }
function hasAccess() { }
function canSubmit() { }
\`\`\`

### Event Handlers
\`\`\`javascript
// handle + event name
function handleClick() { }
function handleSubmit(event) { }
function handleUserLogin(user) { }

// on + event name (for props)
<Button onClick={handleClick} onHover={handleHover} />
\`\`\`

## C# Conventions

### General
\`\`\`csharp
// PascalCase for public members
public class UserService { }
public void ProcessOrder() { }
public string FirstName { get; set; }

// camelCase for private fields with underscore
private readonly ILogger _logger;
private int _retryCount;

// PascalCase for constants
public const int MaxRetryCount = 3;
\`\`\`

### Interfaces
\`\`\`csharp
// I prefix
public interface IUserRepository { }
public interface IOrderService { }
\`\`\`

### Async Methods
\`\`\`csharp
// Async suffix
public async Task<User> GetUserAsync(int id) { }
public async Task ProcessOrderAsync(Order order) { }
\`\`\`

## Python Conventions

### Variables and Functions
\`\`\`python
# snake_case for variables and functions
user_name = "John"
is_active = True

def get_user_by_id(user_id):
    pass

def calculate_total_price(items):
    pass
\`\`\`

### Classes
\`\`\`python
# PascalCase for classes
class UserService:
    pass

class HttpClient:
    pass
\`\`\`

### Constants
\`\`\`python
# SCREAMING_SNAKE_CASE for constants
MAX_RETRY_COUNT = 3
API_BASE_URL = "https://api.example.com"
\`\`\`

### Protected/Private
\`\`\`python
# Single underscore for protected
def _internal_method(self):
    pass

# Double underscore for private (name mangling)
def __private_method(self):
    pass
\`\`\`

## File and Directory Naming

### Files
\`\`\`
# JavaScript/TypeScript
userService.js
UserProfile.tsx (React component)
user.types.ts
user.test.ts
user.spec.ts

# Python
user_service.py
test_user_service.py

# C#
UserService.cs
IUserRepository.cs
\`\`\`

### Directories
\`\`\`
# kebab-case or snake_case
user-management/
user_management/

# By feature (recommended)
src/
  users/
    UserList.tsx
    UserCard.tsx
    userService.ts
  orders/
    OrderList.tsx
    orderService.ts
\`\`\`

## Anti-Patterns

### 1. Meaningless Names
\`\`\`javascript
// Bad
const data = fetchData();
const result = process(data);
const temp = calculate(result);

// Good
const userProfiles = fetchUserProfiles();
const validatedProfiles = validateProfiles(userProfiles);
const profileSummary = summarizeProfiles(validatedProfiles);
\`\`\`

### 2. Type in Name
\`\`\`javascript
// Bad (Hungarian notation)
const strName = "John";
const arrUsers = [];
const objConfig = {};

// Good
const name = "John";
const users = [];
const config = {};
\`\`\`

### 3. Abbreviations
\`\`\`javascript
// Bad
const usrMgr = new UserManager();
const cfgSvc = new ConfigService();
const genTmstmp = generateTimestamp();

// Good
const userManager = new UserManager();
const configService = new ConfigService();
const generatedTimestamp = generateTimestamp();
\`\`\`

### 4. Misleading Names
\`\`\`javascript
// Bad
const userList = {}; // It's an object, not a list!
function getUser() {
  return [user1, user2]; // Returns array, not single user
}

// Good
const usersById = {};
function getUsers() {
  return [user1, user2];
}
\`\`\`
`
  },

  'error-handling-patterns': {
    name: 'error-handling-patterns',
    description: 'Implement consistent error handling patterns',
    content: `---
name: error-handling-patterns
description: Implement consistent error handling patterns.
---

# Error Handling Patterns Skill

You are an expert at error handling. Apply this skill when implementing error handling, validation, and failure recovery.

## Core Principles

### 1. Fail Fast
Detect and report errors as early as possible.

\`\`\`javascript
// Good: Validate early
function processOrder(order) {
  if (!order) throw new ValidationError('Order is required');
  if (!order.items?.length) throw new ValidationError('Order must have items');

  // Process validated order
  return calculateTotal(order);
}
\`\`\`

### 2. Be Specific
Use specific error types for different failure modes.

\`\`\`javascript
// Bad: Generic error
throw new Error('Something went wrong');

// Good: Specific error
throw new NotFoundError('User', userId);
throw new ValidationError('Email format is invalid');
throw new AuthorizationError('Insufficient permissions');
\`\`\`

### 3. Include Context
Provide actionable information in errors.

\`\`\`javascript
// Bad: No context
throw new Error('Validation failed');

// Good: Full context
throw new ValidationError({
  message: 'Order validation failed',
  field: 'quantity',
  value: -5,
  constraint: 'must be positive'
});
\`\`\`

## Custom Error Classes

### JavaScript/TypeScript
\`\`\`typescript
// Base application error
class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string | number) {
    super(\`\${resource} with id '\${id}' not found\`, 'NOT_FOUND', 404);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Permission denied') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}
\`\`\`

### C#
\`\`\`csharp
public abstract class AppException : Exception
{
    public string Code { get; }
    public int StatusCode { get; }

    protected AppException(string message, string code, int statusCode)
        : base(message)
    {
        Code = code;
        StatusCode = statusCode;
    }
}

public class ValidationException : AppException
{
    public string Field { get; }

    public ValidationException(string message, string field = null)
        : base(message, "VALIDATION_ERROR", 400)
    {
        Field = field;
    }
}

public class NotFoundException : AppException
{
    public NotFoundException(string resource, object id)
        : base($"{resource} with id '{id}' not found", "NOT_FOUND", 404)
    { }
}
\`\`\`

## Async Error Handling

### Promises
\`\`\`javascript
// Always handle rejections
async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) {
      throw new ApiError('Failed to fetch user', response.status);
    }
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new NetworkError('Unable to reach server', error);
  }
}

// With error boundaries in React
<ErrorBoundary fallback={<ErrorMessage />}>
  <UserProfile userId={id} />
</ErrorBoundary>
\`\`\`

### Promise.allSettled for Partial Failures
\`\`\`javascript
// When some failures are acceptable
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
]);

const users = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);

const errors = results
  .filter(r => r.status === 'rejected')
  .map(r => r.reason);
\`\`\`

## Retry Patterns

### Exponential Backoff
\`\`\`javascript
async function withRetry(fn, options = {}) {
  const { maxRetries = 3, baseDelay = 1000 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      if (!isRetryable(error)) throw error;

      const delay = baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
}

function isRetryable(error) {
  return error.statusCode >= 500 ||
         error.code === 'ECONNRESET' ||
         error.code === 'ETIMEDOUT';
}

// Usage
const data = await withRetry(() => fetchData(url), { maxRetries: 3 });
\`\`\`

### Circuit Breaker
\`\`\`javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000;
    this.failures = 0;
    this.state = 'CLOSED';
    this.nextAttempt = null;
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is open');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }
}
\`\`\`

## Error Logging Best Practices

### What to Log
\`\`\`javascript
logger.error({
  message: error.message,
  code: error.code,
  stack: error.stack,
  context: {
    userId: request.userId,
    action: 'createOrder',
    orderId: order.id
  },
  // Don't log sensitive data!
  // password, creditCard, etc.
});
\`\`\`

### Correlation IDs
\`\`\`javascript
// Attach correlation ID to all logs in a request
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || uuid();
  res.setHeader('x-correlation-id', req.correlationId);
  next();
});

// Include in error logs
logger.error({
  correlationId: req.correlationId,
  message: error.message
});
\`\`\`

## Global Error Handler

### Express.js
\`\`\`javascript
// Error handling middleware (must have 4 params)
app.use((error, req, res, next) => {
  logger.error({
    correlationId: req.correlationId,
    error: error.message,
    stack: error.stack
  });

  // Operational errors - safe to send details
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  // Programming errors - don't leak details
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong'
    }
  });
});
\`\`\`

## Error Response Format

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "not-an-email"
      },
      {
        "field": "age",
        "message": "Must be at least 18",
        "value": 16
      }
    ],
    "correlationId": "abc-123-def"
  }
}
\`\`\`

## Error Handling Checklist

- [ ] Custom error classes for different scenarios
- [ ] Errors include actionable context
- [ ] Async errors properly caught
- [ ] Retry logic for transient failures
- [ ] Circuit breaker for external services
- [ ] Correlation IDs for tracing
- [ ] Sensitive data not in error messages
- [ ] Global error handler catches unhandled errors
- [ ] Consistent error response format
`
  },

  'logging-standards': {
    name: 'logging-standards',
    description: 'Implement consistent logging for observability',
    content: `---
name: logging-standards
description: Implement consistent logging for observability.
---

# Logging Standards Skill

You are an expert at implementing observability. Apply this skill when adding logging, setting up monitoring, or debugging issues.

## Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| ERROR | Failures requiring action | Database connection failed |
| WARN | Potential problems | Deprecated API used |
| INFO | Key business events | User registered, Order placed |
| DEBUG | Development details | Function entry/exit, variable values |
| TRACE | Very detailed tracing | Every iteration, all data |

### When to Use Each Level

\`\`\`javascript
// ERROR - Something broke, needs attention
logger.error('Payment processing failed', {
  orderId: order.id,
  error: error.message,
  customerId: order.customerId
});

// WARN - Concerning but not breaking
logger.warn('Rate limit approaching', {
  current: rateLimitCount,
  max: maxRateLimit,
  userId: user.id
});

// INFO - Business-significant events
logger.info('Order completed', {
  orderId: order.id,
  amount: order.total,
  itemCount: order.items.length
});

// DEBUG - Development troubleshooting
logger.debug('Processing order items', {
  itemCount: items.length,
  validItems: validItems.length
});

// TRACE - Deep debugging
logger.trace('Validating item', {
  item: JSON.stringify(item),
  validationRules: rules
});
\`\`\`

## Structured Logging Format

### JSON Format (Recommended)
\`\`\`json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "message": "Order completed",
  "service": "order-service",
  "version": "1.2.3",
  "correlationId": "abc-123-def",
  "context": {
    "orderId": "ord_12345",
    "customerId": "cust_67890",
    "amount": 99.99,
    "itemCount": 3
  }
}
\`\`\`

### Required Fields
- timestamp (ISO 8601)
- level
- message
- service name
- correlation/request ID

### Implementation
\`\`\`javascript
// Using pino (Node.js)
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: 'order-service',
    version: process.env.APP_VERSION,
  },
});

// Child logger with request context
app.use((req, res, next) => {
  req.logger = logger.child({
    correlationId: req.headers['x-correlation-id'] || uuid(),
    path: req.path,
    method: req.method,
  });
  next();
});
\`\`\`

## Correlation IDs

### Implementation
\`\`\`javascript
// Generate or extract correlation ID
function getCorrelationId(req) {
  return req.headers['x-correlation-id'] ||
         req.headers['x-request-id'] ||
         uuid();
}

// Propagate to downstream services
async function callDownstreamService(req, data) {
  return fetch(serviceUrl, {
    method: 'POST',
    headers: {
      'x-correlation-id': req.correlationId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

// Include in all logs
logger.info('Processing request', {
  correlationId: req.correlationId,
  action: 'processOrder',
});
\`\`\`

## PII Masking

### What to Mask
- Passwords
- Credit card numbers
- Social security numbers
- Email addresses (partial)
- Phone numbers (partial)
- API keys and tokens
- Personal health information

### Implementation
\`\`\`javascript
const sensitiveFields = ['password', 'creditCard', 'ssn', 'token', 'apiKey'];

function maskSensitive(obj, fields = sensitiveFields) {
  if (!obj || typeof obj !== 'object') return obj;

  const masked = { ...obj };
  for (const key of Object.keys(masked)) {
    if (fields.includes(key.toLowerCase())) {
      masked[key] = '***REDACTED***';
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitive(masked[key], fields);
    }
  }
  return masked;
}

// Auto-mask in logger
const logger = pino({
  hooks: {
    logMethod(inputArgs, method) {
      const [msg, context] = inputArgs;
      return method.apply(this, [msg, maskSensitive(context)]);
    },
  },
});

// Email masking
function maskEmail(email) {
  const [local, domain] = email.split('@');
  return \`\${local[0]}***@\${domain}\`;
}
// john.doe@example.com → j***@example.com
\`\`\`

## What to Log

### Always Log
- Application startup/shutdown
- Authentication events (login, logout, failures)
- Authorization failures
- Input validation failures
- External service calls (request/response time)
- Critical business events
- Errors and exceptions

### Log with Caution
- Request/response bodies (size limits)
- User actions (privacy considerations)
- Performance metrics (volume)

### Never Log
- Passwords or credentials
- Full credit card numbers
- Social security numbers
- Session tokens or API keys
- Personal health information
- Unmasked PII

## Performance Logging

### Request Duration
\`\`\`javascript
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e6;

    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
    });
  });

  next();
});
\`\`\`

### External Call Timing
\`\`\`javascript
async function callExternalApi(url, options) {
  const start = Date.now();
  try {
    const response = await fetch(url, options);
    const duration = Date.now() - start;

    logger.info('External API call', {
      url,
      statusCode: response.status,
      durationMs: duration,
    });

    return response;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('External API call failed', {
      url,
      error: error.message,
      durationMs: duration,
    });
    throw error;
  }
}
\`\`\`

## Log Aggregation Patterns

### Log Levels by Environment
\`\`\`javascript
const logLevel = {
  development: 'debug',
  test: 'warn',
  staging: 'info',
  production: 'info',
}[process.env.NODE_ENV] || 'info';
\`\`\`

### Sampling High-Volume Logs
\`\`\`javascript
// Log every Nth occurrence
let requestCount = 0;
const SAMPLE_RATE = 100;

function shouldLog() {
  requestCount++;
  return requestCount % SAMPLE_RATE === 0;
}

if (shouldLog()) {
  logger.debug('Sampled request', { sampleRate: SAMPLE_RATE });
}
\`\`\`

## Logging Checklist

- [ ] Structured JSON format
- [ ] Consistent field naming
- [ ] Correlation IDs propagated
- [ ] PII properly masked
- [ ] Appropriate log levels used
- [ ] Request timing captured
- [ ] External calls logged
- [ ] Errors include stack traces
- [ ] Log aggregation configured
- [ ] Alerts on error patterns
`
  },

  'git-workflow': {
    name: 'git-workflow',
    description: 'Follow Git workflow best practices',
    content: `---
name: git-workflow
description: Follow Git workflow best practices.
---

# Git Workflow Skill

You are an expert at Git workflows. Apply this skill when working with branches, commits, pull requests, and releases.

## Branch Naming

### Format
\`\`\`
<type>/<ticket>-<short-description>
\`\`\`

### Types
| Type | Purpose | Example |
|------|---------|---------|
| feature/ | New functionality | feature/PROJ-123-user-auth |
| bugfix/ | Bug fixes | bugfix/PROJ-456-login-crash |
| hotfix/ | Production fixes | hotfix/PROJ-789-critical-fix |
| release/ | Release preparation | release/v1.2.0 |
| chore/ | Maintenance | chore/update-dependencies |

### Examples
\`\`\`bash
git checkout -b feature/PROJ-123-add-user-registration
git checkout -b bugfix/PROJ-456-fix-email-validation
git checkout -b hotfix/PROJ-789-patch-security-vuln
\`\`\`

## Commit Message Format

### Structure
\`\`\`
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
\`\`\`

### Types
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- perf: Performance
- test: Tests
- build: Build system
- ci: CI/CD
- chore: Maintenance

### Examples
\`\`\`
feat(auth): add password reset via email

Implements password reset functionality:
- Send reset email with secure token
- Token expires after 1 hour
- Rate limit: 3 requests per hour

Closes #123
\`\`\`

\`\`\`
fix(cart): prevent negative item quantities

Users could enter negative quantities causing incorrect totals.
Added validation to ensure minimum quantity of 1.

Fixes #456
\`\`\`

## Git Commands Cheat Sheet

### Daily Workflow
\`\`\`bash
# Start new work
git checkout main
git pull origin main
git checkout -b feature/PROJ-123-description

# Save work
git add .
git commit -m "feat: add feature description"

# Stay up to date
git fetch origin
git rebase origin/main

# Push for review
git push -u origin feature/PROJ-123-description
\`\`\`

### Useful Commands
\`\`\`bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo changes to file
git checkout -- filename

# Stash changes
git stash
git stash pop

# Interactive rebase (squash commits)
git rebase -i HEAD~3

# Cherry-pick a commit
git cherry-pick <commit-hash>

# Find who changed a line
git blame filename

# Search commit history
git log --grep="search term"
git log -S "code snippet"
\`\`\`

## Pull Request Template

\`\`\`markdown
## Summary
Brief description of changes.

## Changes
- Change 1
- Change 2
- Change 3

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Testing
Describe how you tested these changes:
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Closes #123
\`\`\`

## Protected Branch Rules

### Main/Master Branch
- [ ] Require pull request reviews (1-2 approvals)
- [ ] Require status checks to pass
- [ ] Require branches to be up to date
- [ ] Require signed commits (optional)
- [ ] Restrict push access
- [ ] No force pushes
- [ ] No deletions

### Recommended Checks
- [ ] CI build passes
- [ ] All tests pass
- [ ] Code coverage meets threshold
- [ ] Linting passes
- [ ] Security scan passes

## Git Flow

### Main Branches
- \`main\` - Production-ready code
- \`develop\` - Integration branch

### Supporting Branches
- \`feature/*\` - New features (from develop)
- \`release/*\` - Release preparation
- \`hotfix/*\` - Production fixes

### Flow
\`\`\`
main ─────────────────────────●─────────●────────
                              ↑         ↑
                        (merge)   (hotfix)
                              │         │
develop ──●────●────●────●────●─────────●────────
          │    │    │    │    ↑
          │ feature/x    │   (merge)
          │    └────────┘    │
          │                  │
    feature/y ───────────────┘
\`\`\`

## Trunk-Based Development (Alternative)

### Principles
- Small, frequent commits to main
- Feature flags for incomplete work
- Short-lived branches (<1 day)
- Automated testing and deployment

### Flow
\`\`\`bash
# Quick feature branch
git checkout -b feature/small-change
# ... make changes ...
git push -u origin feature/small-change
# Create PR, get review, merge same day
\`\`\`

## Release Process

### Semantic Versioning
\`\`\`
MAJOR.MINOR.PATCH
  │     │     └── Bug fixes (1.2.3 → 1.2.4)
  │     └──────── New features (1.2.3 → 1.3.0)
  └────────────── Breaking changes (1.2.3 → 2.0.0)
\`\`\`

### Creating a Release
\`\`\`bash
# Create release branch
git checkout -b release/v1.2.0 develop

# Update version numbers
npm version 1.2.0

# Merge to main
git checkout main
git merge --no-ff release/v1.2.0

# Tag the release
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0

# Back-merge to develop
git checkout develop
git merge --no-ff release/v1.2.0
\`\`\`

## Conflict Resolution

\`\`\`bash
# During rebase
git rebase main
# ... fix conflicts ...
git add .
git rebase --continue

# Abort if needed
git rebase --abort

# During merge
git merge feature-branch
# ... fix conflicts ...
git add .
git commit
\`\`\`

## Git Workflow Checklist

- [ ] Branch naming follows convention
- [ ] Commits are atomic and well-described
- [ ] Main branch is protected
- [ ] PRs require review
- [ ] CI runs on all PRs
- [ ] Commits are signed (if required)
- [ ] History is kept clean (squash/rebase)
- [ ] Releases are tagged
`
  }
};

/**
 * Get skill template by name
 */
export function getSkill(name) {
  return skills[name];
}

/**
 * Get all skill names
 */
export function getSkillNames() {
  return Object.keys(skills);
}

/**
 * Get skill list with metadata
 */
export function getSkillList() {
  return Object.values(skills).map(skill => ({
    name: skill.name,
    description: skill.description
  }));
}

export default skills;
