---
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
```
# SQL Injection
"SELECT.*FROM.*WHERE.*" + variable
"INSERT INTO.*VALUES.*" + variable
query(.*${.*}.*) # Template literals in queries

# Command Injection
exec(userInput)
spawn(command + userInput)
system(userInput)
```

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
```
console.log(.*password
console.log(.*token
console.log(.*secret
console.log(.*apiKey
```

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
```
innerHTML =
document.write(
dangerouslySetInnerHTML
v-html=
[innerHTML]
```

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

```
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
```

## Common Vulnerability Patterns

### Authentication Bypass
```javascript
// VULNERABLE
if (user.role == 'admin') { // Type coercion
if (token) { // Truthy check insufficient

// SECURE
if (user.role === 'admin') { // Strict equality
if (await validateToken(token)) { // Proper validation
```

### Path Traversal
```javascript
// VULNERABLE
const file = path.join(uploadDir, req.params.filename);

// SECURE
const filename = path.basename(req.params.filename);
const file = path.join(uploadDir, filename);
```

### Mass Assignment
```javascript
// VULNERABLE
User.update(req.body); // Attacker can set isAdmin: true

// SECURE
const { name, email } = req.body;
User.update({ name, email }); // Whitelist fields
```
