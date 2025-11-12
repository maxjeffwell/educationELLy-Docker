# educationELLy

> A full-stack application designed to help mainstream classroom teachers engage with English Language Learning (ELL) students.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/kubernetes-ready-326CE5)]()

## Overview

educationELLy provides a centralized platform for teachers to access and manage ELL student information, track English language proficiency, and facilitate integrated curriculum development.

## Features

- 🔐 **Secure Authentication** - JWT-based user authentication
- 👥 **Student Management** - Full CRUD operations for student records
- 📊 **ELL Tracking** - Track English language proficiency levels
- 📱 **Responsive Design** - Mobile-friendly interface with Semantic UI
- 🐳 **Dockerized** - Complete Docker and docker-compose setup
- ☸️ **Kubernetes Ready** - Production-ready K8s manifests (coming soon)
- 🔒 **Production Hardened** - Nginx reverse proxy, SSL/TLS, rate limiting

## Tech Stack

### Frontend
- **React 18.3** - UI library
- **Redux Toolkit 2.5** - State management
- **React Router 6.28** - Client-side routing
- **Semantic UI React 2.1** - UI components
- **Styled Components 6.1** - CSS-in-JS
- **Axios 1.7** - HTTP client

### Backend
- **Express 4.18** - Web framework
- **MongoDB + Mongoose 8.16** - Database and ODM
- **Passport.js** - Authentication middleware (JWT & Local strategies)
- **bcryptjs 3.0** - Password hashing
- **jsonwebtoken 9.0** - JWT token generation

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy and load balancer
- **MongoDB Atlas** - Cloud database
- **Node 20 LTS** - Runtime environment

## Project Structure

```
educationELLy/
├── full-stack-capstone-client/    # React frontend application
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── actions/               # Redux actions
│   │   ├── reducers/              # Redux reducers
│   │   └── config.js              # API configuration
│   ├── Dockerfile                 # Client container
│   └── package.json
├── full-stack-capstone-server/    # Express backend API
│   ├── controllers/               # Route controllers
│   ├── models/                    # Mongoose models
│   ├── services/                  # Business logic (Passport, etc.)
│   ├── middleware/                # Custom middleware
│   ├── Dockerfile                 # Server container
│   └── package.json
├── nginx/                         # Nginx configuration
│   ├── nginx.conf                 # Main nginx config
│   └── ssl/                       # SSL certificates (not in git)
├── scripts/                       # Deployment scripts
│   ├── deploy-production.sh       # Production deployment
│   └── deploy-development.sh      # Development startup
├── docker-compose.yml             # Development orchestration
├── docker-compose.prod.yml        # Production orchestration
├── .env.example                   # Development environment template
├── .env.production.example        # Production environment template
└── DOCKER.md                      # Docker documentation
```

## Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- MongoDB Atlas account (free tier available)

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/educationELLy.git
   cd educationELLy
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your MongoDB Atlas credentials:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-secret-key
   ```

3. **Start the application:**
   ```bash
   docker-compose up
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Production Deployment

See [DOCKER.md](./DOCKER.md) for comprehensive production deployment instructions.

**Quick production start:**
```bash
cp .env.production.example .env.production
# Edit .env.production with production credentials
./scripts/deploy-production.sh
```

## Development

### Running Without Docker

**Backend:**
```bash
cd full-stack-capstone-server
npm install
npm run dev
```

**Frontend:**
```bash
cd full-stack-capstone-client
npm install
npm run dev
```

### Testing

**Backend tests:**
```bash
cd full-stack-capstone-server
npm test
```

**Frontend tests:**
```bash
cd full-stack-capstone-client
npm test
```

### Code Style

Both projects use ESLint and Prettier for code formatting:

```bash
npm run lint        # Check for linting errors
npm run lint:fix    # Auto-fix linting errors
npm run format      # Format code with Prettier
```

## Docker Commands

### Development

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down
```

### Production

```bash
# Deploy to production
./scripts/deploy-production.sh

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production
docker-compose -f docker-compose.prod.yml down
```

## API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /signin` - Login user
- `GET /logout` - Logout user
- `GET /whoami` - Get current user (protected)

### Students
- `GET /students` - Get all students (protected)
- `GET /students/:id` - Get student by ID (protected)
- `POST /students` - Create new student (protected)
- `PUT /students/:id` - Update student (protected)
- `DELETE /students/:id` - Delete student (protected)

## Environment Variables

### Development (.env)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/students
JWT_SECRET=your-development-secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Production (.env.production)
```env
MONGODB_URI=mongodb+srv://prod-user:prod-pass@cluster.mongodb.net/production-db
JWT_SECRET=your-production-secret-64-chars
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
REACT_APP_API_URL=https://yourdomain.com/api
```

## Security Features

- 🔐 JWT-based authentication with secure token storage
- 🔒 Password hashing with bcrypt (10 rounds)
- 🛡️ CORS configuration with origin whitelist
- 🚦 Rate limiting (nginx): 10 req/s API, 100 req/s general
- 🔑 Environment-based secrets management
- 🌐 SSL/TLS support (production)
- 👤 Non-root Docker containers
- 📝 Security headers (HSTS, X-Frame-Options, etc.)

## Deployment Options

### 1. Docker Compose (Recommended for getting started)
- Single VPS deployment
- DigitalOcean Droplet, AWS EC2, etc.
- See [DOCKER.md](./DOCKER.md)

### 2. Kubernetes (Recommended for production scale)
- DigitalOcean Kubernetes (DOKS)
- AWS EKS, Google GKE, Azure AKS
- See `KUBERNETES.md` (coming soon)

### 3. Heroku (Legacy - separate repos)
- Client: https://educationelly-client.herokuapp.com
- Server: https://educationelly-server.herokuapp.com
- Individual repos maintained for Heroku compatibility

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc
refactor: code restructuring
test: adding tests
chore: maintenance tasks
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Author

**Jeff Maxwell**
- Email: maxjeffwell@gmail.com
- GitHub: [@maxjeffwell](https://github.com/maxjeffwell)

## Acknowledgments

- MongoDB Atlas for database hosting
- DigitalOcean for infrastructure
- React and Express communities
- All contributors and testers

## Documentation

- [Docker Setup](./DOCKER.md) - Complete Docker and production deployment guide
- [Client Documentation](./full-stack-capstone-client/README.md) - Frontend documentation
- [Server Documentation](./full-stack-capstone-server/README.md) - Backend documentation
- [Nginx Configuration](./nginx/README.md) - Reverse proxy setup

## Roadmap

- [x] Full-stack MERN application
- [x] Docker containerization
- [x] Production-ready docker-compose setup
- [x] Nginx reverse proxy
- [ ] Kubernetes deployment manifests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Horizontal pod autoscaling
- [ ] Automated SSL certificate management
- [ ] Monitoring and logging (Prometheus/Grafana)
- [ ] End-to-end tests
- [ ] Performance optimization
- [ ] Mobile app (React Native)

## Support

For issues, questions, or contributions, please open an issue on GitHub or contact the maintainer.

---

**Made with ❤️ for ELL educators**
