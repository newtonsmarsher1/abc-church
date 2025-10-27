# ABC Church Information System - Architecture

## System Overview

This is a full-stack web application with a **clean separation** between frontend and backend:

- **Backend**: Node.js + Express + SQLite REST API
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Database**: SQLite (file-based, easy to deploy)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  index.html  │  │  styles.css  │  │   app.js     │       │
│  │  (UI)        │  │  (Styling)   │  │  (Logic)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST
                             │ Fetch API
┌────────────────────────────┴────────────────────────────────┐
│                         Backend Layer                        │
│  ┌────────────────────────────────────────────────────┐     │
│  │              server.js (Express Server)            │     │
│  │  - Serves static files from /frontend             │     │
│  │  - Handles API requests                          │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Members  │  │Contribs │  │ Pledges │  │Ceremonies│      │
│  │  Routes  │  │  Routes  │  │  Routes │  │  Routes  │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │             │             │            │
│       └─────────────┴─────────────┴─────────────┘            │
│                         │                                     │
│                    ┌──────────┐                              │
│                    │ Models   │                              │
│                    │  Layer   │                              │
│                    └────┬─────┘                              │
└─────────────────────────┼────────────────────────────────────┘
                          │
                  ┌───────┴────────┐
                  │  SQLite        │
                  │  Database      │
                  │  (church.db)   │
                  └────────────────┘
```

## Database Schema

### Members Table
- **Primary Key**: `id` (AUTOINCREMENT)
- **Fields**: fullName, email, householdSize, sponsor, createdAt
- **Relationships**: One-to-many with contributions, pledges, ceremonies

### Contributions Table
- **Primary Key**: `id`
- **Foreign Key**: memberId → members(id)
- **Fields**: amount, type, date
- **Purpose**: Track weekly giving

### Pledges Table
- **Primary Key**: `id`
- **Foreign Key**: memberId → members(id)
- **Fields**: monthly, months, createdAt
- **Purpose**: Track capital campaign commitments

### Ceremonies Table
- **Primary Key**: `id`
- **Foreign Key**: memberId → members(id)
- **Fields**: type, date
- **Purpose**: Record baptisms, weddings, funerals

## API Design

### RESTful Endpoints

**Base URL**: `http://localhost:3000/api`

#### Members
- `GET /members` - List all members
- `GET /members/:id` - Get specific member
- `POST /members` - Create member
- `PUT /members/:id` - Update member
- `DELETE /members/:id` - Delete member

#### Contributions
- `GET /contributions` - List all contributions
- `POST /contributions` - Create contribution
- `GET /contributions/monthly-total` - Get current month total
- `DELETE /contributions/:id` - Delete contribution

#### Pledges
- `GET /pledges` - List all pledges
- `POST /pledges` - Create pledge
- `GET /pledges/total` - Get total pledged amount
- `DELETE /pledges/:id` - Delete pledge

#### Ceremonies
- `GET /ceremonies` - List all ceremonies
- `POST /ceremonies` - Create ceremony
- `GET /ceremonies/month/:month/:year` - Filter by month
- `DELETE /ceremonies/:id` - Delete ceremony

#### Reports
- `GET /reports/monthly` - Generate monthly report

## Data Flow

### Creating a Member

1. User fills form in `index.html`
2. `app.js` captures submit event
3. `fetchAPI()` sends POST to `/api/members`
4. Express routes to `members.js` handler
5. Handler calls `Member.create()` model method
6. Model inserts into SQLite database
7. Response returns to frontend
8. Frontend updates UI

### Viewing Members

1. `app.js` calls `getMembers()` on page load
2. Fetches from `/api/members`
3. Backend queries all rows from members table
4. Returns JSON array
5. Frontend renders to `<tbody>`
6. Repeats for contributions, pledges, ceremonies

## Security Considerations

### Current State (Development)
- No authentication
- No authorization
- CORS enabled for all origins
- SQL injection protected by parameterized queries

### Production Enhancements Needed
- Add authentication (JWT tokens)
- Implement role-based access control
- Add input validation middleware
- Use environment variables for secrets
- Enable HTTPS
- Add rate limiting
- Sanitize user inputs
- Migrate to PostgreSQL/MySQL

## Scalability

### Current Limits
- Single SQLite database
- File-based storage
- Suitable for ~10,000 records

### Scaling Options
1. **Horizontal Scaling**: Add load balancer, multiple Node instances
2. **Database**: Migrate to PostgreSQL for better concurrency
3. **Caching**: Add Redis for frequently accessed data
4. **CDN**: Serve static assets through CDN
5. **API Gateway**: Add API gateway for request routing

## Performance Optimizations

### Implemented
- Async/await for non-blocking I/O
- Single database connection pattern
- Frontend caching of member list

### Future Enhancements
- Database connection pooling
- Query optimization with indexes
- Pagination for large datasets
- Lazy loading of UI components
- Background job processing for reports

## Deployment Strategy

### Development
- Local SQLite database
- Hot reload with nodemon
- CORS enabled

### Production
1. Set NODE_ENV=production
2. Configure proper database (PostgreSQL)
3. Use environment variables
4. Set up reverse proxy (nginx)
5. Enable SSL/TLS
6. Implement monitoring (PM2, New Relic)
7. Set up backup strategy

## Technology Choices

### Why Node.js?
- Single language (JavaScript) for frontend and backend
- Fast I/O for database operations
- Rich ecosystem (npm packages)
- Easy deployment

### Why SQLite?
- No separate database server needed
- File-based storage
- Simple backups (copy file)
- Great for small to medium applications
- Can migrate to PostgreSQL later

### Why Vanilla JavaScript?
- No build step required
- Fast development
- Good performance
- Easy to understand and maintain

## Testing Strategy

### Manual Testing
- Use browser DevTools Network tab
- Test with various data scenarios
- Verify error handling

### Future: Automated Testing
- Unit tests for models (Jest)
- Integration tests for routes (Supertest)
- E2E tests for frontend (Playwright)
- API contract testing

---

**Note**: This system is production-ready for small congregations. For larger deployments, consider the security and scalability enhancements listed above.

