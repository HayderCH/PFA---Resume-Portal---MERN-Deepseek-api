# PFA - Resume Portal - MERN + Deepseek API + Spring Boot

PFA project of ESPRIM Data Science and AI Engineering 2nd year.

This repository contains a comprehensive resume portal application with multiple backend implementations and AI-powered features.

## Project Structure

### 📁 **Web-app/** - MERN Stack Application
- **Frontend**: React.js client application
- **Backend**: Node.js/Express.js server with MongoDB
- **Features**: Resume management, job applications, company profiles
- **Port**: Client (3000), Server (5000)

### 📁 **New Website/** - Modern React/TypeScript Application  
- **Frontend**: React.js with TypeScript and modern UI components
- **Backend**: Supabase integration
- **Features**: Enhanced user experience, type-safe development

### 📁 **spring-boot-app/** - Java Spring Boot API ✨ *NEW*
- **Backend**: Spring Boot REST API with JPA/Hibernate
- **Database**: H2 in-memory database (development)
- **Features**: Alternative backend implementation, RESTful APIs
- **Port**: 8080

### 📁 **deepseek/** - AI Integration
- **AI Processing**: Deepseek API integration for resume analysis
- **Features**: Resume scoring, content analysis, AI-powered insights

### 📁 **json formats/** - Data Schemas
- Sample JSON formats for resume analysis and grading

## Quick Start

### 1. MERN Stack Application
```bash
# Start Node.js server
cd Web-app/server
npm install
npm start

# Start React client (in new terminal)
cd Web-app/client  
npm install
npm start
```

### 2. Spring Boot Application ✨
```bash
# Build and run Spring Boot API
cd spring-boot-app/resume-portal-api
mvn clean compile
mvn spring-boot:run
```

### 3. New Website (React/TypeScript)
```bash
cd New\ Website
npm install
npm run dev
```

## API Endpoints

### Node.js Server (Port 5000)
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID  
- `POST /api/company/register` - Register company
- `POST /api/company/login` - Company login
- `GET /api/users/applications` - Get user applications

### Spring Boot Server (Port 8080) ✨
- `GET /api/health` - Health check
- `GET /api/` - API information
- `GET /api/jobs` - Get all visible jobs
- `GET /api/jobs/{id}` - Get job by ID
- `GET /h2-console` - Database console (development)

## Architecture

This project demonstrates multiple architectural approaches:

1. **MERN Stack**: Traditional MongoDB + Express + React + Node.js
2. **Modern React**: TypeScript + Supabase + Modern UI components  
3. **Spring Boot**: Java-based REST API with JPA/Hibernate
4. **AI Integration**: Deepseek API for intelligent resume processing

## Features

- 📄 **Resume Management**: Upload, view, and manage resumes
- 🏢 **Company Profiles**: Company registration and job posting
- 🔍 **Job Search**: Browse and apply for jobs
- 🤖 **AI Analysis**: Deepseek-powered resume scoring and analysis
- 🔄 **Multi-Backend**: Choose between Node.js and Spring Boot APIs
- 💾 **Flexible Storage**: MongoDB (MERN) or H2/SQL (Spring Boot)

## Development

Each application can be developed and deployed independently:

- **MERN Stack**: Traditional web development with JavaScript/MongoDB
- **Spring Boot**: Enterprise Java development with SQL databases  
- **Modern Frontend**: TypeScript/React with Supabase backend
- **AI Services**: Python-based AI processing with Deepseek

## Technologies Used

- **Frontend**: React.js, TypeScript, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js, Spring Boot, Java 17
- **Databases**: MongoDB, H2, Supabase
- **AI/ML**: Deepseek API, Python
- **Tools**: Maven, npm, Git

## Getting Started

1. Clone the repository
2. Choose your preferred backend (Node.js or Spring Boot)
3. Follow the quick start instructions above
4. Access the applications:
   - React Client: http://localhost:3000
   - Node.js API: http://localhost:5000  
   - Spring Boot API: http://localhost:8080

## Contributors

ESPRIM Data Science and AI Engineering students - 2nd year PFA project.
