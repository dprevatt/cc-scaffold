---
name: api-design-reviewer
description: Review API design for REST/GraphQL best practices.
---

# API Design Reviewer Skill

You are an expert API designer. Apply this skill when designing or reviewing REST or GraphQL APIs.

## REST API Design Rules

### URL Design

#### Use Nouns, Not Verbs
```
# Good
GET /users
POST /users
GET /users/123
DELETE /users/123

# Bad
GET /getUsers
POST /createUser
GET /getUserById/123
```

#### Use Plural Nouns
```
# Good
/users
/products
/orders

# Bad
/user
/product
/order
```

#### Hierarchy for Relationships
```
# Good
GET /users/123/orders
GET /orders/456/items

# Bad
GET /getUserOrders?userId=123
```

#### Use Hyphens, Not Underscores
```
# Good
/user-profiles
/order-items

# Bad
/user_profiles
/orderItems
```

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
```json
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
```

#### Error Response
```json
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
```

#### Collection Response
```json
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
```

### Pagination

#### Offset-based
```
GET /users?page=2&limit=20
GET /users?offset=40&limit=20
```

#### Cursor-based (for large datasets)
```
GET /users?cursor=abc123&limit=20
```

### Filtering

```
GET /users?status=active
GET /users?role=admin&status=active
GET /users?created_after=2024-01-01
GET /products?price_min=10&price_max=100
```

### Sorting

```
GET /users?sort=name
GET /users?sort=-created_at (descending)
GET /users?sort=name,-created_at (multiple)
```

### Field Selection

```
GET /users?fields=id,name,email
GET /users/123?fields=id,name
```

### Versioning

```
# URL versioning (recommended)
/api/v1/users
/api/v2/users

# Header versioning
Accept: application/vnd.api+json; version=1
```

## GraphQL Best Practices

### Schema Design
```graphql
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
```

### Naming Conventions
- Types: PascalCase (User, BlogPost)
- Fields: camelCase (firstName, createdAt)
- Enums: SCREAMING_SNAKE_CASE (ORDER_STATUS)
- Mutations: verb + noun (createUser, updatePost)

### Error Handling
```graphql
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
```

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
