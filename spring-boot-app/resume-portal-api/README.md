# Resume Portal Spring Boot API

This is a Spring Boot backend API for the Resume Portal application. It provides REST endpoints that complement the existing Node.js/Express server.

## Features

- RESTful API endpoints for job management
- JPA/Hibernate for data persistence
- H2 in-memory database (for development)
- Cross-origin resource sharing (CORS) enabled
- Health check endpoints

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## Getting Started

### 1. Navigate to the Spring Boot application directory
```bash
cd spring-boot-app/resume-portal-api
```

### 2. Build the application
```bash
mvn clean compile
```

### 3. Run the application
```bash
mvn spring-boot:run
```

The application will start on **port 8080** (different from the Node.js server which runs on port 5000).

## API Endpoints

### Health Check
- `GET /api/health` - Health check endpoint
- `GET /api/` - Root endpoint with API information

### Jobs
- `GET /api/jobs` - Get all visible jobs
- `GET /api/jobs/{id}` - Get job by ID

### H2 Database Console
During development, you can access the H2 database console at:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:resumeportal`
- Username: `sa`
- Password: (leave empty)

## Architecture

This Spring Boot application is designed to work alongside the existing MERN stack application. It provides:

- Alternative backend implementation using Java/Spring Boot
- JPA entities that mirror the MongoDB models
- RESTful API endpoints similar to the Express.js routes
- Different port (8080) to avoid conflicts with the Node.js server (5000)

## Integration with Existing Application

The Spring Boot API can be used as:
1. An alternative backend for the React frontend
2. Additional microservice providing specific functionality
3. API for integration with other Java-based services

## Development

To modify or extend the application:

1. **Models**: Add new JPA entities in `src/main/java/com/resumeportal/model/`
2. **Repositories**: Add new repository interfaces in `src/main/java/com/resumeportal/repository/`
3. **Controllers**: Add new REST controllers in `src/main/java/com/resumeportal/controller/`
4. **Configuration**: Modify `src/main/resources/application.properties`

## Testing

Run tests with:
```bash
mvn test
```

## Building for Production

Create a JAR file:
```bash
mvn clean package
```

Run the JAR:
```bash
java -jar target/resume-portal-api-1.0-SNAPSHOT.jar
```