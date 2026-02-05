/**
 * Swagger/OpenAPI Configuration
 * Documentation available at /api-docs
 *
 * Server URLs are dynamically configured:
 * - Development: http://localhost:PORT
 * - Production: Set via API_URL environment variable
 */

// Build servers array based on environment
const buildServers = () => {
  const servers = [];
  const port = process.env.PORT || 8080;

  if (process.env.NODE_ENV === 'production') {
    // In production, use API_URL env var or default to relative path
    const apiUrl = process.env.API_URL || '';
    servers.push({
      url: apiUrl,
      description: 'Production server',
    });
  } else {
    // In development, show localhost
    servers.push({
      url: `http://localhost:${port}`,
      description: 'Development server',
    });
  }

  return servers;
};

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'educationELLy API',
      version: '1.0.0',
      description:
        'API for ELL (English Language Learner) Student Management System. Provides endpoints for authentication, student management, and AI-powered educational features.',
      contact: {
        name: 'educationELLy Support',
        email: 'support@educationelly.com',
      },
      license: {
        name: 'GNU GPLv3',
        url: 'https://www.gnu.org/licenses/gpl-3.0.en.html',
      },
    },
    servers: buildServers(),
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and session management',
      },
      {
        name: 'Students',
        description: 'Student CRUD operations with pagination',
      },
      {
        name: 'AI Features',
        description: 'AI-powered educational tools',
      },
      {
        name: 'Utility',
        description: 'Helper endpoints',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in httpOnly cookie',
        },
      },
      schemas: {
        Student: {
          type: 'object',
          required: ['fullName', 'ellStatus', 'designation'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011',
            },
            fullName: {
              type: 'string',
              description: 'Student full name',
              example: 'Maria Garcia',
            },
            school: {
              type: 'string',
              description: 'School name',
              example: 'Lincoln Elementary',
            },
            studentId: {
              type: 'integer',
              description: 'Student ID number',
              example: 12345,
            },
            teacher: {
              type: 'string',
              description: 'Teacher name',
              example: 'Ms. Johnson',
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth',
              example: '2015-03-15',
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
              example: 'Female',
            },
            race: {
              type: 'string',
              example: 'Hispanic/Latino',
            },
            gradeLevel: {
              type: 'integer',
              minimum: 1,
              maximum: 12,
              example: 3,
            },
            nativeLanguage: {
              type: 'string',
              example: 'Spanish',
            },
            cityOfBirth: {
              type: 'string',
              example: 'Mexico City',
            },
            countryOfBirth: {
              type: 'string',
              example: 'Mexico',
            },
            ellStatus: {
              type: 'string',
              enum: ['Active', 'Former', 'Never', 'Monitored', 'Exited', 'Waived'],
              example: 'Active',
            },
            compositeLevel: {
              type: 'string',
              enum: [
                'Beginning',
                'Early Intermediate',
                'Intermediate',
                'Early Advanced',
                'Advanced',
                'N/A',
              ],
              example: 'Intermediate',
            },
            active: {
              type: 'boolean',
              default: true,
              example: true,
            },
            designation: {
              type: 'string',
              enum: ['ELL', 'RFEP', 'IFEP', 'EO', 'TBD'],
              example: 'ELL',
            },
          },
        },
        StudentInput: {
          type: 'object',
          required: ['fullName', 'ellStatus', 'designation'],
          properties: {
            fullName: { type: 'string', example: 'Maria Garcia' },
            school: { type: 'string', example: 'Lincoln Elementary' },
            studentId: { type: 'integer', example: 12345 },
            teacher: { type: 'string', example: 'Ms. Johnson' },
            dateOfBirth: { type: 'string', format: 'date', example: '2015-03-15' },
            gender: { type: 'string', example: 'Female' },
            race: { type: 'string', example: 'Hispanic/Latino' },
            gradeLevel: { type: 'integer', example: 3 },
            nativeLanguage: { type: 'string', example: 'Spanish' },
            cityOfBirth: { type: 'string', example: 'Mexico City' },
            countryOfBirth: { type: 'string', example: 'Mexico' },
            ellStatus: { type: 'string', example: 'Active' },
            compositeLevel: { type: 'string', example: 'Intermediate' },
            active: { type: 'boolean', example: true },
            designation: { type: 'string', example: 'ELL' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 25 },
            total: { type: 'integer', example: 150 },
            totalPages: { type: 'integer', example: 6 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false },
          },
        },
        PaginatedStudents: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Student' },
            },
            pagination: { $ref: '#/components/schemas/Pagination' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', format: 'email', example: 'teacher@school.edu' },
          },
        },
        SigninRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'teacher@school.edu' },
            password: { type: 'string', format: 'password', example: 'securePassword123' },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['email', 'password', 'passwordConfirmation'],
          properties: {
            email: { type: 'string', format: 'email', example: 'newteacher@school.edu' },
            password: { type: 'string', format: 'password', minLength: 8 },
            passwordConfirmation: { type: 'string', format: 'password' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            message: { type: 'string', example: 'Authentication successful' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Validation failed' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Please provide a valid email' },
                },
              },
            },
          },
        },
        ValidValues: {
          type: 'object',
          properties: {
            ellStatuses: { type: 'array', items: { type: 'string' } },
            designations: { type: 'array', items: { type: 'string' } },
            compositeLevels: { type: 'array', items: { type: 'string' } },
            genders: { type: 'array', items: { type: 'string' } },
            sortFields: { type: 'array', items: { type: 'string' } },
          },
        },
        StudyRecommendationsRequest: {
          type: 'object',
          required: ['gradeLevel'],
          properties: {
            gradeLevel: { type: 'integer', minimum: 1, maximum: 12, example: 5 },
            compositeLevel: { type: 'string', example: 'Intermediate' },
            ellStatus: { type: 'string', example: 'Active' },
            nativeLanguage: { type: 'string', example: 'Spanish' },
          },
        },
        FlashcardRequest: {
          type: 'object',
          required: ['topic', 'content'],
          properties: {
            topic: { type: 'string', example: 'Vocabulary - Weather' },
            content: { type: 'string', example: 'Words related to weather conditions' },
            gradeLevel: { type: 'integer', example: 3 },
          },
        },
        QuizRequest: {
          type: 'object',
          required: ['topic'],
          properties: {
            topic: { type: 'string', example: 'Reading Comprehension' },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'], example: 'medium' },
            count: { type: 'integer', minimum: 1, maximum: 10, example: 5 },
            gradeLevel: { type: 'integer', example: 4 },
          },
        },
        ChatRequest: {
          type: 'object',
          required: ['messages'],
          properties: {
            messages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role: { type: 'string', enum: ['user', 'assistant', 'system'] },
                  content: { type: 'string' },
                },
              },
            },
            context: {
              type: 'object',
              properties: {
                userRole: { type: 'string', enum: ['teacher', 'student', 'admin'] },
                gradeLevel: { type: 'integer' },
                ellStatus: { type: 'string' },
                nativeLanguage: { type: 'string' },
              },
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'healthy' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./router.js', './routes/*.js'],
};

export default swaggerOptions;
