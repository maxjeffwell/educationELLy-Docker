# AGENTS.md - educationELLy Project Documentation

> Comprehensive documentation for AI agents to understand and contribute to the educationELLy project

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Coding Standards](#coding-standards)
4. [Project Structure](#project-structure)
5. [External Resources](#external-resources)
6. [Additional Context](#additional-context)
7. [Testing Instructions](#testing-instructions)
8. [Build Steps](#build-steps)

---

## Project Overview

### Purpose
educationELLy is a full-stack web application designed to help mainstream classroom teachers engage with and manage English Language Learning (ELL) students. It provides a centralized platform for teachers to access student information, track English language proficiency levels, and facilitate integrated curriculum development.

### Target Audience
- **Primary**: Mainstream classroom teachers working with ELL students
- **Secondary**: School administrators managing ELL programs

### Business Domain
- **Domain**: Education Technology (EdTech)
- **Subdomain**: English Language Learning (ELL) Management
- **Focus Area**: Student information management and proficiency tracking

### Core Features

#### 1. Secure Authentication
- **Description**: JWT-based user authentication with localStorage persistence
- **Implementation**: Passport.js with Local and JWT strategies
- **Security**: bcrypt password hashing with 10 salt rounds

#### 2. Student Management
- **Description**: Full CRUD operations for ELL student records
- **Capabilities**:
  - Create new student profiles
  - View student lists and details
  - Update student information
  - Delete student records

#### 3. ELL Tracking
- **Description**: Track and manage English language proficiency levels
- **Data Points**:
  - ELL Status
  - Composite Level
  - Native Language
  - Country/City of Birth
  - Grade Level

#### 4. Responsive Design
- **Description**: Mobile-friendly interface using Semantic UI React
- **Approach**: CSS-in-JS with Styled Components

### Key Architectural Decisions

#### Full-Stack JavaScript
- **Rationale**: Unified language across frontend and backend for consistency and maintainability
- **Technologies**: React, Express, Node.js

#### Redux Toolkit for State Management
- **Rationale**: Centralized state management with modern Redux patterns
- **Migration**: Migrated from Redux 4.x to Redux Toolkit 2.5

#### JWT Authentication
- **Rationale**: Stateless authentication suitable for RESTful APIs and scalable architecture
- **Storage**: LocalStorage for client-side token persistence

#### MongoDB with Mongoose
- **Rationale**: Flexible NoSQL database suitable for evolving student data schemas
- **Hosting**: MongoDB Atlas cloud service

#### Docker Containerization
- **Rationale**: Consistent deployment across environments, easy scaling, production-ready
- **Configuration**: Multi-stage builds with development and production targets

#### Nginx Reverse Proxy
- **Rationale**: Production-grade load balancing, SSL termination, and rate limiting
- **Features**: Gzip compression, security headers, health checks

#### Component Library
- **Rationale**: Semantic UI React for rapid UI development with consistent design
- **Customization**: Styled Components for custom styling needs

---

## Technology Stack

### Languages
- **JavaScript (ES2021)**: Primary language for both frontend and backend

### Frontend Frameworks & Libraries

#### Core Framework
- **React 18.3.1**: Component-based UI library
- **Redux Toolkit 2.5.0**: State management with modern Redux patterns
- **React Router DOM 6.28.1**: Client-side routing

#### UI & Styling
- **Semantic UI React 2.1.5**: UI component library
- **Styled Components 6.1.13**: CSS-in-JS styling solution
- **React Modal 3.16.1**: Modal dialog components

#### Forms & Validation
- **React Hook Form 7.54.2**: Performant, flexible forms with easy validation

#### HTTP Client
- **Axios 1.7.9**: HTTP client for API requests

#### Other Frontend Tools
- **React Helmet Async 2.0.5**: Document head management
- **Web Vitals 5.0.3**: Performance metrics
- **WebFontLoader 1.6.28**: Font loading optimization

### Backend Frameworks & Libraries

#### Core Framework
- **Express 4.18.2**: Web application framework for Node.js
- **Mongoose 8.16.3**: MongoDB ODM for Node.js

#### Authentication
- **Passport.js 0.7.0**: Authentication middleware with JWT and Local strategies
- **passport-jwt 4.0.1**: JWT strategy for Passport
- **passport-local 1.0.0**: Local strategy for Passport

#### Security
- **bcryptjs 3.0.2**: Password hashing with salt rounds
- **jsonwebtoken 9.0.2**: JWT token generation and verification
- **helmet 8.1.0**: Security headers middleware
- **cors 2.8.5**: Cross-origin resource sharing
- **express-rate-limit 7.5.1**: Rate limiting middleware

#### Validation & Middleware
- **express-validator 7.2.1**: Request validation middleware
- **body-parser 2.2.0**: Request body parsing middleware
- **morgan 1.10.0**: HTTP request logging

### Runtime & Build Tools
- **Node.js 20 LTS**: JavaScript runtime environment
- **react-scripts 5.0.1**: Create React App build tooling
- **Babel 7.28.0**: JavaScript transpilation with ES6+ support

### Database
- **MongoDB 8.x**: NoSQL database via MongoDB Atlas cloud service

### Testing Frameworks

#### Frontend Testing
- **Jest**: Testing framework (included with react-scripts)
- **React Testing Library 16.1.0**: Testing utilities for React components
- **@testing-library/jest-dom 6.6.3**: Custom Jest matchers
- **@testing-library/user-event 14.6.0**: User event simulation
- **MSW 2.10.4**: API mocking for tests

#### Backend Testing
- **Mocha 11.7.1**: Backend testing framework
- **Chai 5.2.1**: Assertion library
- **Supertest 7.1.3**: HTTP assertion library

### Development Tools

#### Code Quality
- **ESLint 8.57.1**: JavaScript linting with Airbnb and React configs
- **Prettier 3.6.2**: Code formatting
- **eslint-config-airbnb-base 15.0.0**: Airbnb ESLint configuration
- **eslint-config-prettier 10.1.5**: Prettier integration with ESLint
- **eslint-plugin-react 7.37.2**: React-specific linting rules
- **eslint-plugin-react-hooks 5.1.0**: React Hooks linting rules

#### Git Workflow
- **Husky 9.1.7**: Git hooks management
- **lint-staged 16.1.2**: Run linters on staged files
- **Commitizen 4.3.1**: Conventional commit messages
- **commitlint 19.8.1**: Commit message linting

#### Development Utilities
- **nodemon 3.1.10**: Development server auto-reload
- **depcheck 1.4.7**: Dependency checker
- **npm-check-updates 18.0.1**: Dependency update checker

### Infrastructure & DevOps

#### Containerization
- **Docker 20.10+**: Containerization platform
- **Docker Compose 2.0+**: Multi-container orchestration

#### Production Infrastructure
- **Nginx**: Reverse proxy and load balancer for production
- **GitHub Actions**: CI/CD pipeline for automated builds and testing

---

## Coding Standards

### Client-Side Coding Standards

#### ESLint Configuration

**Extended Configurations**:
- `react-app`: React app base configuration
- `react-app/jest`: Jest testing configuration
- `eslint:recommended`: ESLint recommended rules
- `prettier`: Prettier integration

**Key Rules**:

- `prettier/prettier: error` - Enforce Prettier formatting as ESLint errors
- `react/jsx-filename-extension: off` - Allow JSX in .js files
- `react/prop-types: off` - PropTypes validation disabled
- `jsx-a11y/anchor-is-valid: off` - Accessibility anchor validation disabled
- `react/react-in-jsx-scope: off` - React import not required in JSX files (React 17+)
- `no-unused-vars: warn` - Warn on unused variables, ignore args starting with underscore
- `no-console: warn` - Warn on console usage except console.warn and console.error
- `prefer-const: error` - Enforce const for variables that are never reassigned
- `no-var: error` - Disallow var, use let or const instead
- `object-shorthand: error` - Enforce ES6 object shorthand syntax
- `prefer-template: error` - Prefer template literals over string concatenation

**Environment**:
- Browser
- ES2021
- Node
- Jest

#### Prettier Configuration (Client)

- **semi**: `true` - Require semicolons
- **singleQuote**: `true` - Use single quotes instead of double quotes
- **tabWidth**: `2` - 2 spaces for indentation
- **useTabs**: `false` - Use spaces, not tabs
- **trailingComma**: `es5` - Trailing commas where valid in ES5
- **bracketSpacing**: `true` - Spaces inside object brackets
- **arrowParens**: `avoid` - Omit parens when possible in arrow functions
- **printWidth**: `80` - Line length limit of 80 characters
- **endOfLine**: `lf` - Use Unix line endings

#### Testing Standards (Client)

- **Framework**: Jest with React Testing Library
- **Environment**: jsdom
- **Location**: `src/tests/`
- **Coverage**: Enabled

### Server-Side Coding Standards

#### ESLint Configuration

**Extended Configurations**:
- `airbnb-base`: Airbnb JavaScript style guide

**Key Rules**:

- `import/extensions: off` - Allow imports without extensions
- `max-len: error` (150 chars) - Maximum line length of 150 characters, ignore URLs
- `no-console: warn` - Warn on console usage
- `func-names: warn` - Named functions when needed
- `consistent-return: error` - Require consistent return statements
- `no-shadow: error` - Disallow variable shadowing
- `prefer-default-export: off` - Allow named exports
- `no-param-reassign: error` - Disallow parameter reassignment except props
- `implicit-arrow-linebreak: off` - Allow implicit returns in arrow functions

**Test Environment**:
- **Framework**: Mocha
- **Location**: `test/`

#### Prettier Configuration (Server)

- **semi**: `true` - Require semicolons
- **singleQuote**: `true` - Use single quotes
- **trailingComma**: `all` - Trailing commas everywhere possible
- **printWidth**: `70` - Line length limit of 70 characters

#### Module System

- **Type**: ES Modules
- **Description**: Uses ES6 import/export with Babel transpilation

### Security Standards

#### Authentication
- **Method**: JWT with Passport.js
- **Strategies**:
  - Local Strategy (email/password)
  - JWT Strategy (bearer token)

#### Password Hashing
- **Library**: bcryptjs
- **Rounds**: 10 salt rounds

#### CORS
- **Enabled**: true
- **Origin Whitelist**: Configured via `ALLOWED_ORIGINS` environment variable

#### Rate Limiting
- **API**: 10 requests/second
- **General**: 100 requests/second

#### Security Headers
- **Helmet**: Enabled via Helmet.js middleware

### Docker Standards

#### Strategy
- Multi-stage builds with separate development and production targets

#### Development Target
- Hot reloading enabled
- Volume mounts for live code updates
- Development dependencies included

#### Production Target
- Optimized builds
- No development dependencies
- Minified and compressed assets

#### Security
- **Non-root user**: All containers run as non-root users
- **Health checks**: Enabled for all services

### Commit Convention

**Type**: Conventional Commits with Commitizen

**Commit Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

---

## Project Structure

```
educationELLy/
├── CICD.md                           # CI/CD documentation
├── docker-compose.prod.yml           # Production Docker Compose configuration
├── docker-compose.yml                # Development Docker Compose configuration
├── DOCKER.md                         # Docker setup and usage documentation
├── KUBERNETES.md                     # Kubernetes deployment guide (coming soon)
├── README.md                         # Main project documentation
├── AGENTS.md                         # This file - AI agent documentation
│
├── full-stack-capstone-client/       # React frontend application
│   ├── CLAUDE.md                     # Claude Code guidance for client
│   ├── DEVELOPER_README.md           # Developer-specific client documentation
│   ├── DEVELOPMENT.md                # Development workflow documentation
│   ├── REDUX_FORM_MIGRATION.md       # Redux Form to Redux Toolkit migration notes
│   ├── REDUX_TOOLKIT_MIGRATION.md    # Redux Toolkit migration guide
│   ├── SECURITY_IMPROVEMENTS.md      # Security enhancement documentation
│   ├── LICENSE                       # GNU GPLv3 license
│   ├── Dockerfile                    # Client container configuration
│   ├── Procfile                      # Heroku deployment configuration
│   ├── commitlint.config.js          # Commit message linting configuration
│   ├── package.json                  # Client dependencies and scripts
│   ├── package-lock.json             # Locked dependency versions
│   ├── server.js                     # Production server for built client
│   ├── .eslintrc.js                  # ESLint configuration
│   ├── .prettierrc                   # Prettier configuration
│   │
│   ├── public/                       # Static public assets
│   │   ├── index.html                # Main HTML template
│   │   ├── manifest.json             # PWA manifest
│   │   ├── robots.txt                # Search engine robots file
│   │   ├── sitemap.xml               # SEO sitemap
│   │   ├── sw.js                     # Service worker
│   │   ├── favicon files             # Various favicon formats
│   │   └── ...
│   │
│   ├── src/                          # Client source code
│   │   ├── actions/                  # Redux actions and async thunks
│   │   ├── components/               # React components
│   │   ├── reducers/                 # Redux reducers
│   │   ├── store/                    # Redux store configuration
│   │   ├── tests/                    # Component tests
│   │   ├── utils/                    # Utility functions
│   │   ├── validators/               # Form validation logic
│   │   ├── logo/                     # Logo assets
│   │   ├── config.js                 # API configuration
│   │   ├── history.js                # Router history
│   │   ├── index.js                  # Application entry point
│   │   ├── setupProxy.js             # Development proxy configuration
│   │   ├── setupTests.js             # Test setup and configuration
│   │   └── validators.js             # Additional validators
│   │
│   ├── scripts/                      # Utility scripts
│   │   └── check-tools.js            # Development tools checker
│   │
│   └── screenshots/                  # Application screenshots for documentation
│
├── full-stack-capstone-server/       # Express backend API
│   ├── CLAUDE.md                     # Claude Code guidance for server
│   ├── README.md                     # Server documentation
│   ├── LICENSE                       # GNU GPLv3 license
│   ├── Dockerfile                    # Server container configuration
│   ├── Procfile                      # Heroku deployment configuration
│   ├── package.json                  # Server dependencies and scripts
│   ├── package-lock.json             # Locked dependency versions
│   ├── index.js                      # Main server entry point
│   ├── router.js                     # API route definitions
│   ├── .eslintrc.cjs                 # ESLint configuration
│   ├── .prettierrc                   # Prettier configuration
│   │
│   ├── controllers/                  # Route controllers
│   │   └── authentication.js         # Auth controllers (signin/signup)
│   │
│   ├── models/                       # Mongoose data models
│   │   ├── user.js                   # User schema with password hashing
│   │   └── student.js                # Student schema for ELL data
│   │
│   ├── services/                     # Business logic services
│   │   └── passport.js               # Passport strategies (JWT/Local)
│   │
│   ├── middleware/                   # Custom Express middleware
│   │   └── validation.js             # Request validation middleware
│   │
│   ├── utils/                        # Utility functions
│   │   └── envValidation.js          # Environment variable validation
│   │
│   ├── scripts/                      # Database and utility scripts
│   │   ├── seed.js                   # Development database seeding
│   │   ├── seed-insert-only.js       # Insert-only seeding
│   │   └── seed-production.js        # Production database seeding
│   │
│   └── test/                         # Backend tests
│       ├── server.test.mjs           # Server integration tests
│       └── user.test.mjs             # User authentication tests
│
├── nginx/                            # Nginx reverse proxy configuration
│   ├── nginx.conf                    # Main nginx configuration
│   ├── README.md                     # Nginx setup documentation
│   └── ssl/                          # SSL certificates directory (not in git)
│
├── k8s/                              # Kubernetes deployment manifests
│   ├── base/                         # Base Kubernetes configurations
│   │   ├── cluster-issuer.yaml       # Cert-manager cluster issuer
│   │   ├── configmap.yaml            # Configuration maps
│   │   ├── deployment-client.yaml    # Client deployment
│   │   ├── deployment-server.yaml    # Server deployment
│   │   ├── hpa-client.yaml           # Horizontal pod autoscaling - client
│   │   ├── hpa-server.yaml           # Horizontal pod autoscaling - server
│   │   ├── ingress.yaml              # Ingress configuration
│   │   ├── kustomization.yaml        # Kustomize configuration
│   │   ├── namespace.yaml            # Namespace definition
│   │   ├── secret.example.yaml       # Secret template
│   │   ├── service-client.yaml       # Client service
│   │   └── service-server.yaml       # Server service
│   │
│   └── overlays/                     # Environment-specific overlays
│       ├── production/               # Production Kubernetes configuration
│       └── staging/                  # Staging Kubernetes configuration
│
└── scripts/                          # Deployment and utility scripts
    ├── deploy-development.sh         # Development environment startup
    └── deploy-production.sh          # Production deployment automation
```

### Key Directory Explanations

#### Client Structure (`full-stack-capstone-client/`)
- **src/actions/**: Redux action creators and async thunks for API calls
- **src/components/**: React components including Auth, Dashboard, Student management
- **src/reducers/**: Redux reducers for auth, students, modals, and UI state
- **src/store/**: Redux store configuration with middleware
- **src/tests/**: Component unit tests and integration tests
- **src/validators/**: Form validation logic for student data and authentication

#### Server Structure (`full-stack-capstone-server/`)
- **controllers/**: Handle HTTP requests and responses
- **models/**: Define MongoDB schemas using Mongoose
- **services/**: Business logic including Passport authentication strategies
- **middleware/**: Custom Express middleware for validation and authentication
- **scripts/**: Database seeding and maintenance scripts

#### Infrastructure
- **nginx/**: Production reverse proxy configuration with SSL support
- **k8s/**: Kubernetes manifests for production deployment
- **scripts/**: Automated deployment scripts for different environments

---

## External Resources

### Documentation

#### Frontend Frameworks
- **React Documentation**: https://react.dev/
  - Official React documentation for component development

- **Redux Toolkit Documentation**: https://redux-toolkit.js.org/
  - Official Redux Toolkit guide for state management

- **React Router Documentation**: https://reactrouter.com/
  - Client-side routing documentation

#### UI & Styling
- **Semantic UI React**: https://react.semantic-ui.com/
  - Official Semantic UI React component library

- **Styled Components Documentation**: https://styled-components.com/
  - CSS-in-JS library documentation

#### Backend Frameworks
- **Express.js Documentation**: https://expressjs.com/
  - Official Express.js documentation for API development

- **MongoDB Documentation**: https://docs.mongodb.com/
  - Official MongoDB documentation

- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
  - Cloud-hosted MongoDB service documentation

- **Mongoose Documentation**: https://mongoosejs.com/docs/
  - MongoDB ODM for Node.js

#### Authentication
- **Passport.js Documentation**: http://www.passportjs.org/
  - Authentication middleware for Node.js

#### Testing
- **Jest Documentation**: https://jestjs.io/
  - JavaScript testing framework

- **React Testing Library**: https://testing-library.com/react
  - Testing utilities for React components

- **Mocha Documentation**: https://mochajs.org/
  - Backend testing framework

- **Chai Documentation**: https://www.chaijs.com/
  - Assertion library

#### Infrastructure
- **Docker Documentation**: https://docs.docker.com/
  - Official Docker documentation for containerization

- **Docker Compose Documentation**: https://docs.docker.com/compose/
  - Multi-container Docker applications

- **Nginx Documentation**: https://nginx.org/en/docs/
  - Official Nginx documentation for reverse proxy setup

- **Kubernetes Documentation**: https://kubernetes.io/docs/
  - Container orchestration platform

#### DevOps
- **GitHub Actions Documentation**: https://docs.github.com/en/actions
  - CI/CD workflow automation

### Libraries

#### HTTP & API
- **axios**: https://github.com/axios/axios
  - Promise-based HTTP client for browser and Node.js

#### Security
- **bcryptjs**: https://github.com/dcodeIO/bcrypt.js
  - Password hashing library

- **jsonwebtoken**: https://github.com/auth0/node-jsonwebtoken
  - JSON Web Token implementation

- **helmet**: https://github.com/helmetjs/helmet
  - Security middleware for Express

#### Forms
- **React Hook Form**: https://github.com/react-hook-form/react-hook-form
  - Performant, flexible forms with easy validation

### Development Tools

#### Code Quality
- **ESLint**: https://eslint.org/
  - JavaScript linting utility

- **Prettier**: https://prettier.io/
  - Opinionated code formatter

#### Git Workflow
- **Husky**: https://github.com/typicode/husky
  - Git hooks made easy

- **Commitizen**: https://github.com/commitizen/cz-cli
  - Conventional commit message tool

#### Development Utilities
- **nodemon**: https://github.com/remy/nodemon
  - Development auto-reload for Node.js

### Cloud Platforms

#### Hosting Options
- **DigitalOcean**: https://www.digitalocean.com/
  - Cloud infrastructure provider for VPS and Kubernetes
  - Services: Droplets (VPS), Kubernetes (DOKS), Container Registry

- **AWS**: https://aws.amazon.com/
  - Amazon Web Services cloud platform
  - Services: EC2 (VPS), EKS (Kubernetes)

- **Heroku**: https://www.heroku.com/
  - Platform as a Service for legacy deployment
  - Status: Legacy support maintained

#### Version Control & CI/CD
- **GitHub**: https://github.com/
  - Code hosting and CI/CD platform
  - Repository: https://github.com/maxjeffwell/educationELLy-Docker

### Security Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
  - Top 10 web application security risks

- **OWASP Cheat Sheet Series**: https://cheatsheetseries.owasp.org/
  - Security best practices and cheat sheets

- **Let's Encrypt**: https://letsencrypt.org/
  - Free SSL/TLS certificates

- **Certbot**: https://certbot.eff.org/
  - Automated SSL certificate management

### Best Practices

- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices
  - Comprehensive Node.js best practices

- **Node.js Docker Best Practices**: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
  - Best practices for Node.js in Docker

- **Conventional Commits**: https://www.conventionalcommits.org/
  - Specification for commit message convention

---

## Additional Context

### Use Cases

#### 1. Teacher Registration and Login
**Actors**: Teachers

**Flow**:
1. Teacher registers with email and password
2. System hashes password and creates user account
3. Teacher logs in with credentials
4. System issues JWT token
5. Token stored in localStorage for subsequent requests

#### 2. Add New ELL Student
**Actors**: Authenticated Teachers

**Flow**:
1. Teacher navigates to student creation form
2. Teacher enters student information (name, ELL status, native language, etc.)
3. System validates required fields
4. System creates student record in MongoDB
5. Student appears in teacher's student list

#### 3. Track ELL Proficiency
**Actors**: Authenticated Teachers

**Flow**:
1. Teacher views student profile
2. Teacher updates ELL status and composite level
3. System records proficiency changes
4. Historical tracking maintained in database

#### 4. Manage Student Information
**Actors**: Authenticated Teachers

**Flow**:
1. Teacher views list of all students
2. Teacher selects student to view details
3. Teacher updates student information as needed
4. Teacher can delete students no longer in program

### Data Models

#### User Model
```javascript
{
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt)
}
```

**Features**:
- Pre-save password hashing middleware
- comparePassword() method for authentication
- Automatic email lowercase conversion

#### Student Model
```javascript
{
  fullName: String (required),
  school: String,
  studentId: Number,
  teacher: String,
  dateOfBirth: Date,
  gender: String,
  race: String,
  gradeLevel: Number,
  nativeLanguage: String,
  cityOfBirth: String,
  countryOfBirth: String,
  ellStatus: String (required),
  compositeLevel: String,
  active: Boolean,
  designation: String (required)
}
```

### Deployment Context

#### Development Environment
- **Platform**: Local development with Docker Compose
- **Features**:
  - Hot reloading for both client and server
  - Volume mounts for live code updates
  - Development dependencies included
  - Detailed logging and error messages

#### Production Options

##### Option 1: Docker Compose
- **Description**: Single VPS deployment recommended for getting started
- **Platforms**: DigitalOcean Droplet, AWS EC2, Linode, etc.
- **Features**:
  - Nginx reverse proxy
  - SSL/TLS support
  - Rate limiting (10 req/s API, 100 req/s general)
  - Health checks
  - Automated restart on failure
  - Log rotation

##### Option 2: Kubernetes
- **Description**: Recommended for production scale
- **Platforms**: DigitalOcean Kubernetes (DOKS), AWS EKS, Google GKE, Azure AKS
- **Features**:
  - Horizontal pod autoscaling
  - cert-manager for automated SSL certificates
  - Advanced monitoring with Prometheus/Grafana
  - Self-healing and rolling updates
- **Status**: Coming soon - manifests prepared in k8s/ directory

##### Option 3: Heroku (Legacy)
- **Description**: Legacy deployment option
- **Status**: Separate repos maintained for Heroku compatibility
- **URLs**:
  - Client: https://educationelly-client.herokuapp.com
  - Server: https://educationelly-server.herokuapp.com

#### CI/CD Pipeline
- **Platform**: GitHub Actions
- **Workflows**:
  1. **CI Pipeline**: Automated testing and linting on pull requests
  2. **Docker Build**: Build and push Docker images to registry
  3. **Security Scanning**: Trivy security vulnerability scanning
  4. **Automated Deployment**: Deploy to staging/production on merge

### Recent Modernization

The project has undergone significant modernization:

#### Migrations
- Migrated from Redux 4.x + Redux Form to Redux Toolkit 2.5
- Updated to React 18.3 with concurrent features support
- Upgraded to React Router DOM 6.28 with new routing patterns
- Modernized authentication flow with React Hook Form

#### Infrastructure Improvements
- Production-ready Docker setup with multi-stage builds
- Comprehensive CI/CD pipeline with GitHub Actions
- Security scanning with Trivy in CI pipeline
- Kubernetes manifests prepared for future scaling

#### Security Enhancements
- JWT-based authentication with secure token handling
- 10-round bcrypt password hashing
- CORS configuration with origin whitelisting
- Helmet.js security headers
- Rate limiting in production
- Non-root Docker containers
- Automated security scanning

#### Code Quality Improvements
- Comprehensive ESLint configuration with Airbnb style guide
- React-specific linting with Prettier integration
- Pre-commit hooks with Husky and lint-staged
- Conventional commit messages with Commitizen
- Increased test coverage

### Environment Variables

#### Required Environment Variables

**Development (.env)**:
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/students
JWT_SECRET=your-development-secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Production (.env.production)**:
```bash
MONGODB_URI=mongodb+srv://prod-user:prod-pass@cluster.mongodb.net/production-db
JWT_SECRET=your-production-secret-64-chars
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
REACT_APP_API_URL=https://yourdomain.com/api
```

#### Environment Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT token signing | Generate with `openssl rand -base64 32` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `https://example.com,https://www.example.com` |
| `REACT_APP_API_URL` | API endpoint for client | `http://localhost:8080` or `https://api.example.com` |

### License & Author

#### License
- **Type**: GNU General Public License v3.0
- **Description**: Open source software licensed under GPLv3

#### Author
- **Name**: Jeff Maxwell
- **Email**: maxjeffwell@gmail.com
- **GitHub**: @maxjeffwell

### Project Roadmap

#### Completed
- ✅ Full-stack MERN application
- ✅ Docker containerization
- ✅ Production-ready docker-compose setup
- ✅ Nginx reverse proxy
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Automated Docker builds and security scanning

#### Planned
- 🔲 Kubernetes deployment manifests
- 🔲 Horizontal pod autoscaling
- 🔲 Automated SSL certificate management (cert-manager)
- 🔲 Monitoring and logging (Prometheus/Grafana)
- 🔲 End-to-end tests
- 🔲 Performance optimization
- 🔲 Mobile app (React Native)

---

## Testing Instructions

### Frontend Testing

#### Run All Tests
```bash
cd full-stack-capstone-client
npm test
```

#### Run Tests with Coverage
```bash
npm run test:coverage
```

#### Run Tests in CI Mode
```bash
npm run test:ci
```

#### Run Specific Test
```bash
npm test -- --testNamePattern="test name pattern"
```

#### Test Files Location
- Component tests: `src/tests/`
- Test setup: `src/setupTests.js`

### Backend Testing

#### Run All Tests
```bash
cd full-stack-capstone-server
npm test
```

#### Run Specific Test File
```bash
npm run test2  # Uses Mocha with ESM support
```

#### Test Files Location
- Integration tests: `test/server.test.mjs`
- User authentication tests: `test/user.test.mjs`

### Linting

#### Client Linting
```bash
cd full-stack-capstone-client
npm run lint              # Check for linting errors
npm run lint:fix          # Auto-fix linting errors
npm run format            # Format code with Prettier
npm run format:check      # Check Prettier formatting
```

#### Server Linting
```bash
cd full-stack-capstone-server
npm run lint              # Check for linting errors
```

---

## Build Steps

### Development Setup

#### Prerequisites
- Node.js 18+ (20 LTS recommended)
- npm 9+
- Docker Engine 20.10+
- Docker Compose 2.0+
- MongoDB Atlas account (free tier available)

#### Option 1: Docker Development (Recommended)

**1. Clone the repository:**
```bash
git clone https://github.com/maxjeffwell/educationELLy-Docker.git
cd educationELLy-Docker
```

**2. Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas credentials and JWT secret
```

**3. Start all services:**
```bash
docker-compose up
```

**4. Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

#### Option 2: Local Development (Without Docker)

**Backend Setup:**
```bash
cd full-stack-capstone-server
npm install
# Configure .env file with MongoDB URI and JWT secret
npm run dev
```

**Frontend Setup:**
```bash
cd full-stack-capstone-client
npm install
# Configure API URL in src/config.js if needed
npm run dev
```

### Production Build

#### Option 1: Docker Compose Production

**1. Create production environment file:**
```bash
cp .env.production.example .env.production
# Edit .env.production with production values
```

**2. (Optional) Add SSL certificates:**
```bash
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem
```

**3. Deploy to production:**
```bash
./scripts/deploy-production.sh
```

Or manually:
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

**4. Check deployment:**
```bash
docker-compose -f docker-compose.prod.yml ps
curl http://localhost/health
```

#### Option 2: Manual Production Build

**Backend Build:**
```bash
cd full-stack-capstone-server
npm install --production
# Configure production environment variables
npm start
```

**Frontend Build:**
```bash
cd full-stack-capstone-client
npm install
npm run build
# Serve the build directory with a static file server
npm start  # Uses Express to serve the build
```

### Docker Commands Reference

#### Development Commands
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f server
docker-compose logs -f client

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Access container shell
docker-compose exec server sh
docker-compose exec client sh
```

#### Production Commands
```bash
# Start production
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps

# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Stop production
docker-compose -f docker-compose.prod.yml down
```

### Database Setup

#### Seed Development Database
```bash
cd full-stack-capstone-server
npm run seed
```

#### Reset Database
```bash
npm run db:reset
```

### Troubleshooting

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000  # Client
lsof -i :8080  # Server

# Kill the process or change ports in docker-compose.yml
```

#### Database Connection Issues
1. Verify MongoDB Atlas connection string in `.env`
2. Check Network Access whitelist in MongoDB Atlas
3. Ensure your IP address is allowed
4. Test connection with MongoDB Compass

#### Container Won't Start
```bash
# Check logs
docker-compose logs server

# Remove all containers and rebuild
docker-compose down -v
docker-compose up --build
```

#### node_modules Issues
```bash
docker-compose down
docker volume prune -f
docker-compose up --build
```

---

## API Endpoints Reference

### Authentication Endpoints

- `POST /signup` - Register new user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

- `POST /signin` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

- `GET /logout` - Logout user
  - Protected: Yes
  - Returns: Success message

- `GET /whoami` - Get current user
  - Protected: Yes
  - Returns: User object

### Student Endpoints

All student endpoints require authentication (JWT token in Authorization header).

- `GET /students` - Get all students
  - Protected: Yes
  - Returns: Array of student objects

- `GET /students/:id` - Get student by ID
  - Protected: Yes
  - Returns: Student object

- `POST /students` - Create new student
  - Protected: Yes
  - Body: Student object (fullName, ellStatus, designation required)
  - Returns: Created student object

- `PUT /students/:id` - Update student
  - Protected: Yes
  - Body: Updated student fields
  - Returns: Updated student object

- `DELETE /students/:id` - Delete student
  - Protected: Yes
  - Returns: Success message

---

## Security Considerations

### Production Security Checklist

- ✅ JWT-based authentication with secure token handling
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ CORS configuration with origin whitelist
- ✅ Rate limiting (nginx): 10 req/s API, 100 req/s general
- ✅ Environment-based secrets management
- ✅ SSL/TLS support in production
- ✅ Non-root Docker containers
- ✅ Security headers (HSTS, X-Frame-Options, etc.) via Helmet
- ✅ Automated security scanning in CI pipeline (Trivy)

### Best Practices

1. **Never commit sensitive data**
   - Use `.env` files for environment variables
   - Add `.env` to `.gitignore`
   - Use `.env.example` as template

2. **Use strong secrets**
   - Generate JWT secret: `openssl rand -base64 32`
   - Use different secrets for dev and production
   - Rotate secrets periodically

3. **Database security**
   - Use MongoDB Atlas IP whitelist
   - Enable authentication (Atlas default)
   - Use separate production database
   - Regular backups

4. **Docker security**
   - Run containers as non-root users
   - Use multi-stage builds
   - Keep images updated
   - Scan for vulnerabilities

5. **Network security**
   - Enable SSL/TLS in production
   - Use firewall rules
   - Implement rate limiting
   - Monitor logs for suspicious activity

---

## Additional Documentation

For more detailed information, refer to:

- **Docker Setup**: DOCKER.md - Complete Docker and production deployment guide
- **CI/CD Pipeline**: CICD.md - GitHub Actions workflows and deployment automation
- **Kubernetes**: KUBERNETES.md - Kubernetes deployment guide (coming soon)
- **Client Documentation**: full-stack-capstone-client/README.md
- **Server Documentation**: full-stack-capstone-server/README.md
- **Client AI Guide**: full-stack-capstone-client/CLAUDE.md
- **Server AI Guide**: full-stack-capstone-server/CLAUDE.md

---

**Last Updated**: December 2025

**Maintained by**: Jeff Maxwell (@maxjeffwell)

**License**: GNU General Public License v3.0
