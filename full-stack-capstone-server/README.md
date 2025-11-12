# educationELLy Server

![Node.js](https://img.shields.io/badge/Node.js-v10.11.0+-2873b4?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.17.1-fb9438?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5.x-86c64e?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-2873b4?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![License: GPL v3](https://img.shields.io/badge/License-GPLv3-fb9438?style=for-the-badge)

## <span style="color: #fb9438">📖 Overview</span>

**educationELLy Server** is the backend API for the educationELLy application - a comprehensive platform designed to support English Language Learning (ELL) students and their teachers. This Express.js server provides secure authentication, RESTful API endpoints, and data persistence for managing ELL student information.

> <span style="color: #2873b4">**🎯 Mission:**</span> Bridging the gap between ELL specialists and mainstream classroom teachers through technology.

> <span style="color: #86c64e">**✨ Key Benefits:**</span>
> - Centralized access to student language proficiency data
> - Enhanced collaboration between ELL specialists and teachers
> - Streamlined student data management
> - Real-time access to critical learning information

## <span style="color: #2873b4">✨ Features</span>

- <span style="color: #2873b4">🔐 **Secure Authentication**</span> - JWT-based authentication with Passport.js
- <span style="color: #86c64e">📊 **Student Management**</span> - Full CRUD operations for ELL student profiles
- <span style="color: #fb9438">🔒 **Protected Routes**</span> - Role-based access control for sensitive data
- <span style="color: #2873b4">📱 **RESTful API**</span> - Clean, intuitive API design following REST principles
- <span style="color: #86c64e">🚀 **Production Ready**</span> - Deployed on Heroku with MongoDB Atlas
- <span style="color: #fb9438">✅ **Validation**</span> - Input validation and error handling

## <span style="color: #86c64e">🎯 Demo Account</span>

> <span style="color: #2873b4">**ℹ️ Info:**</span> To explore the application, you can use the following demo credentials:

```bash
# Demo Credentials
Email: demo@example.com
Password: demopassword
```

> <span style="color: #fb9438">**⚠️ Note:**</span> These are demo credentials for testing purposes only.

## <span style="color: #fb9438">🚀 Getting Started</span>

### <span style="color: #2873b4">📋 Prerequisites</span>

- <span style="color: #2873b4">**Node.js**</span> (v10.11.0 or higher)
- <span style="color: #fb9438">**npm**</span> or yarn
- <span style="color: #86c64e">**MongoDB**</span> (local or Atlas)
- <span style="color: #2873b4">**Git**</span>

### <span style="color: #86c64e">⚙️ Installation</span>

1. Clone the repository:
   ```bash
   git clone https://github.com/maxjeffwell/full-stack-capstone-server.git
   cd full-stack-capstone-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost/educationelly
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   PORT=8080
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:8080` with automatic reloading via nodemon.

> <span style="color: #86c64e">**✅ Success:**</span> Your server is now running and ready for development!

## <span style="color: #fb9438">📚 API Documentation</span>

### <span style="color: #2873b4">🔐 Authentication Endpoints</span>

| <span style="color: #2873b4">**Method**</span> | <span style="color: #2873b4">**Endpoint**</span> | <span style="color: #2873b4">**Description**</span> | <span style="color: #2873b4">**Auth Required**</span> |
|--------|----------|-------------|---------------|
| <span style="background-color: #86c64e; color: white; padding: 2px 6px; border-radius: 3px;">**POST**</span> | `/signup` | Register a new user | <span style="color: #e74c3c">❌ No</span> |
| <span style="background-color: #86c64e; color: white; padding: 2px 6px; border-radius: 3px;">**POST**</span> | `/signin` | Login user (returns JWT) | <span style="color: #e74c3c">❌ No</span> |
| <span style="background-color: #2873b4; color: white; padding: 2px 6px; border-radius: 3px;">**GET**</span> | `/logout` | Logout current user | <span style="color: #27ae60">✅ Yes</span> |
| <span style="background-color: #2873b4; color: white; padding: 2px 6px; border-radius: 3px;">**GET**</span> | `/whoami` | Get current user info | <span style="color: #27ae60">✅ Yes</span> |

### <span style="color: #86c64e">👥 Student Management Endpoints</span>

| <span style="color: #86c64e">**Method**</span> | <span style="color: #86c64e">**Endpoint**</span> | <span style="color: #86c64e">**Description**</span> | <span style="color: #86c64e">**Auth Required**</span> |
|--------|----------|-------------|---------------|
| <span style="background-color: #2873b4; color: white; padding: 2px 6px; border-radius: 3px;">**GET**</span> | `/students` | Get all students | <span style="color: #27ae60">✅ Yes</span> |
| <span style="background-color: #2873b4; color: white; padding: 2px 6px; border-radius: 3px;">**GET**</span> | `/students/:id` | Get student by ID | <span style="color: #27ae60">✅ Yes</span> |
| <span style="background-color: #86c64e; color: white; padding: 2px 6px; border-radius: 3px;">**POST**</span> | `/students` | Create new student | <span style="color: #27ae60">✅ Yes</span> |
| <span style="background-color: #fb9438; color: white; padding: 2px 6px; border-radius: 3px;">**PUT**</span> | `/students/:id` | Update student | <span style="color: #27ae60">✅ Yes</span> |
| <span style="background-color: #e74c3c; color: white; padding: 2px 6px; border-radius: 3px;">**DELETE**</span> | `/students/:id` | Delete student | <span style="color: #27ae60">✅ Yes</span> |

### <span style="color: #fb9438">💬 Request/Response Examples</span>

#### <span style="color: #2873b4">👤 Register User</span>
```bash
POST /signup
Content-Type: application/json

{
  "email": "teacher@school.edu",
  "password": "securepassword123"
}

Response: 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### <span style="color: #86c64e">🎓 Create Student</span>
```bash
POST /students
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "school": "Lincoln Elementary",
  "teacher": "Ms. Smith",
  "gradeLevel": 5,
  "nativeLanguage": "Spanish",
  "ellStatus": "Intermediate",
  "designation": "ELL"
}
```

## <span style="color: #fb9438">🏗️ Project Structure</span>

```
educationELLy-server/
├── controllers/
│   └── authentication.js    # Auth logic (signup/signin)
├── models/
│   ├── student.js          # Student schema
│   └── user.js             # User schema with password hashing
├── services/
│   └── passport.js         # JWT & Local strategies
├── test/
│   ├── server.test.js      # Server tests
│   └── user.test.js        # Auth tests
├── index.js                # Express server setup
├── router.js               # Route definitions
├── .env                    # Environment variables
├── .babelrc                # Babel configuration
├── .eslintrc.js            # ESLint rules
├── package.json            # Dependencies & scripts
└── Procfile                # Heroku deployment
```

## <span style="color: #2873b4">🔒 Authentication & Security</span>

### <span style="color: #86c64e">🎫 JWT Authentication Strategy</span>

The server implements a stateless JWT (JSON Web Token) authentication system using Passport.js:

- **Token Generation**: JWTs are created upon successful login/signup containing user ID and timestamp
- **Token Expiration**: Tokens expire after 7 days for security
- **Token Validation**: Every protected route validates the JWT from the Authorization header
- **Stateless Design**: No server-side session storage - tokens contain all necessary auth information
- **Bearer Token Format**: Clients must send tokens as `Authorization: Bearer <token>`

The JWT strategy extracts tokens from request headers, verifies signatures using the `JWT_SECRET`, and validates token expiration. Invalid or expired tokens are automatically rejected.

## <span style="color: #fb9438">🛠️ Technologies</span>

### <span style="color: #2873b4">⚡ Core</span>
- <span style="color: #fb9438">**Express.js**</span> - Web application framework
- <span style="color: #86c64e">**MongoDB**</span> - NoSQL database
- <span style="color: #2873b4">**Mongoose**</span> - MongoDB object modeling
- <span style="color: #fb9438">**Passport.js**</span> - Authentication middleware
- <span style="color: #86c64e">**JWT**</span> - Secure token-based auth

### <span style="color: #86c64e">🛡️ Security</span>
- <span style="color: #2873b4">**bcryptjs**</span> - Password hashing
- <span style="color: #fb9438">**CORS**</span> - Cross-origin resource sharing
- <span style="color: #86c64e">**dotenv**</span> - Environment variable management

### <span style="color: #fb9438">🔧 Development</span>
- <span style="color: #86c64e">**Nodemon**</span> - Auto-restart on file changes
- <span style="color: #2873b4">**Babel**</span> - ES6+ transpilation
- <span style="color: #fb9438">**ESLint**</span> - Code linting
- <span style="color: #86c64e">**Mocha/Chai**</span> - Testing framework

## <span style="color: #2873b4">🧪 Testing</span>

Run the test suite:
```bash
npm run test2
```

> <span style="color: #2873b4">**🧪 Test Coverage:**</span>
> - <span style="color: #27ae60">✅</span> Server connection tests
> - <span style="color: #27ae60">✅</span> Authentication flow tests
> - <span style="color: #27ae60">✅</span> API endpoint tests
> - <span style="color: #27ae60">✅</span> Error handling tests

## <span style="color: #86c64e">🚀 Deployment</span>

### <span style="color: #fb9438">☁️ Heroku Deployment</span>

1. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_production_secret
   ```

3. Deploy:
   ```bash
   git push heroku master
   ```

### <span style="color: #2873b4">🌍 Environment Variables</span>

| <span style="color: #2873b4">**Variable**</span> | <span style="color: #2873b4">**Description**</span> | <span style="color: #2873b4">**Default**</span> |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost/local` |
| `JWT_SECRET` | Secret for JWT signing | Required |
| `NODE_ENV` | Environment (production/development) | `development` |
| `PORT` | Server port | `8080` |

## <span style="color: #86c64e">🎯 Next Steps</span>

### <span style="color: #fb9438">⚡ Immediate Priorities</span>
- [ ] **Add Comprehensive Testing** - Expand test coverage to include all endpoints and edge cases
- [ ] **Implement Rate Limiting** - Add protection against API abuse and brute force attacks
- [ ] **Add Request Validation** - Implement robust input validation using Joi or express-validator
- [ ] **Enhanced Error Handling** - Create custom error classes and centralized error handling middleware

### <span style="color: #2873b4">🌟 Feature Enhancements</span>
- [ ] **Role-Based Access Control** - Implement teacher/admin/student roles with different permissions
- [ ] **Progress Tracking API** - Add endpoints for tracking student language learning progress over time
- [ ] **Bulk Operations** - Support bulk student imports via CSV/Excel
- [ ] **Real-time Updates** - Implement WebSocket support for real-time notifications
- [ ] **File Upload** - Add support for student document/assessment uploads
- [ ] **API Versioning** - Implement versioned endpoints (e.g., /api/v1/students)

### <span style="color: #86c64e">📈 Performance & Scalability</span>
- [ ] **Database Indexing** - Add MongoDB indexes for frequently queried fields
- [ ] **Caching Layer** - Implement Redis for caching frequently accessed data
- [ ] **Pagination** - Add pagination support for student list endpoints
- [ ] **Query Optimization** - Implement field selection and populate optimization

### <span style="color: #fb9438">📖 Documentation & Developer Experience</span>
- [ ] **API Documentation** - Generate interactive API docs using Swagger/OpenAPI
- [ ] **Postman Collection** - Create and maintain a Postman collection for easy API testing
- [ ] **Docker Support** - Add Dockerfile and docker-compose for containerized development
- [ ] **CI/CD Pipeline** - Set up GitHub Actions for automated testing and deployment

### <span style="color: #2873b4">🔐 Security Enhancements</span>
- [ ] **Refresh Tokens** - Implement JWT refresh token mechanism
- [ ] **Password Reset** - Add forgot password functionality with email verification
- [ ] **Two-Factor Authentication** - Optional 2FA for enhanced security
- [ ] **Audit Logging** - Track all data modifications for compliance

### <span style="color: #86c64e">🔗 Integration Features</span>
- [ ] **Email Notifications** - Send updates about student progress
- [ ] **Export Functionality** - Generate PDF/Excel reports of student data
- [ ] **Third-party Integrations** - Connect with school management systems
- [ ] **Backup Strategy** - Implement automated database backups

## <span style="color: #fb9438">🤝 Contributing</span>

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## <span style="color: #2873b4">📄 License</span>

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## <span style="color: #86c64e">👨‍💻 Author</span>

**Jeff Maxwell**
- Email: [jeff@el-jefe.me](mailto:jeff@el-jefe.me)
- GitHub: [@maxjeffwell](https://github.com/maxjeffwell)
- Portfolio: [https://www.el-jefe.me](https://www.el-jefe.me)

## <span style="color: #fb9438">🙏 Acknowledgments</span>

- Thanks to all contributors who have helped shape educationELLy
- Special recognition to ELL teachers and specialists who provided valuable feedback
- Built with <span style="color: #e74c3c">❤️</span> for the <span style="color: #2873b4">**education community**</span>

---

<div align="center">
  <span style="color: #fb9438; font-size: 1.2em;">🌟 **Star this repository if it helped you!** 🌟</span>
</div>