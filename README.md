# Personal Finance Assistant

A comprehensive personal finance management platform built with React, Spring Boot, and Python AI.

## Project Structure

```
personal-finance-assistant/
├── frontend/                 # React frontend application
├── backend/
│   ├── user-service/        # User management microservice
│   ├── transaction-service/ # Transaction management microservice
│   └── analytics-service/   # Analytics and reporting microservice
├── ai-agent/               # Python AI agent for financial insights
├── docker/                 # Docker configuration files
└── docs/                   # Project documentation
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Chart.js/Recharts

### Backend
- Spring Boot 3
- Spring Security 6
- Spring Data JPA
- PostgreSQL
- JWT Authentication
- OAuth2

### AI Agent
- Python 3.11
- FastAPI
- OpenAI API
- SQLAlchemy
- Pandas
- NumPy

### Infrastructure
- Docker
- PostgreSQL
- Nginx

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Python 3.11+
- Docker
- PostgreSQL

### Development Setup
1. Clone the repository
2. Set up environment variables
3. Start the development environment using Docker Compose
4. Access the application at http://localhost:3000

## Services

### User Service (Port 8081)
- User registration and authentication
- OAuth2 integration
- User profile management
- Account management

### Transaction Service (Port 8082)
- Transaction CRUD operations
- Category management
- Search and filtering
- Data export

### Analytics Service (Port 8083)
- Budget management
- Financial reports
- Spending analysis
- Trend analysis

### AI Agent (Port 8000)
- Natural language processing
- Financial insights
- Budget recommendations
- Spending pattern analysis

## License
MIT 