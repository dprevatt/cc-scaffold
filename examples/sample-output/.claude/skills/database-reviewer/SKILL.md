---
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
```javascript
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
```

### Index Usage
```sql
-- Check if query uses indexes
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Create index for slow queries
CREATE INDEX idx_users_email ON users(email);

-- Composite index for multi-column queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

### Query Patterns

#### Use LIMIT for pagination
```sql
-- Bad: Fetch all then slice
SELECT * FROM users;

-- Good: Limit at database level
SELECT * FROM users ORDER BY id LIMIT 20 OFFSET 40;
```

#### Avoid SELECT *
```sql
-- Bad: Fetches unnecessary columns
SELECT * FROM users;

-- Good: Specific columns
SELECT id, name, email FROM users;
```

#### Use JOINs efficiently
```sql
-- Bad: Multiple queries
SELECT * FROM orders WHERE user_id = 123;
SELECT * FROM users WHERE id = 123;

-- Good: Single JOIN
SELECT o.*, u.name
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.id = 123;
```

### Slow Query Patterns

| Pattern | Problem | Solution |
|---------|---------|----------|
| `LIKE '%value'` | Can't use index | Full-text search |
| `ORDER BY RAND()` | Scans entire table | Application-side random |
| `SELECT COUNT(*)` on large tables | Full table scan | Estimated counts |
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
```sql
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
```

### Zero-Downtime Migrations
1. New code must work with old and new schema
2. Deploy new code
3. Run migration
4. Clean up old code references

## Query Security

### SQL Injection Prevention
```javascript
// Bad: String concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Good: Parameterized queries
const query = 'SELECT * FROM users WHERE id = $1';
await client.query(query, [userId]);

// Good: ORM with parameterization
await User.findOne({ where: { id: userId } });
```

### Access Control
```sql
-- Row-level security
CREATE POLICY user_policy ON documents
  USING (user_id = current_user_id());

-- Grant minimal permissions
GRANT SELECT, INSERT ON users TO app_user;
REVOKE DELETE ON users FROM app_user;
```

## Performance Checklist

- [ ] Queries use indexes (check EXPLAIN)
- [ ] No N+1 query problems
- [ ] Pagination implemented
- [ ] Proper connection pooling
- [ ] Read replicas for heavy reads
- [ ] Caching for hot data
- [ ] Batch operations for bulk changes
- [ ] Transactions used appropriately
