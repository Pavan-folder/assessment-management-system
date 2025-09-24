# Assessment Management System

A comprehensive assessment reporting and management platform with user authentication and PDF report generation capabilities.

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Assessment Data Processing**: Flexible configuration-driven data processing
- **PDF Report Generation**: Automated PDF generation using Puppeteer
- **Multiple Assessment Types**: Support for different assessment formats
- **RESTful API**: Clean API endpoints for all operations
- **Modern Frontend**: React-based UI with Tailwind CSS styling
- **Security**: Rate limiting, CORS protection, and input validation

## Project Structure

```
assessment-management-system/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/            # Data models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── templates/         # HTML report templates
│   │   └── types/             # TypeScript type definitions
│   ├── reports/               # Generated PDF storage
│   └── package.json
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
│   └── package.json
├── config/                    # Assessment configurations
├── data/                      # Sample assessment data
└── README.md
```

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend server:**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Usage

### Authentication

1. **Register a new user:**
   ```bash
   POST http://localhost:3001/api/auth/register
   Content-Type: application/json

   {
     "email": "user@example.com",
     "password": "password123",
     "firstName": "John",
     "lastName": "Doe"
   }
   ```

2. **Login:**
   ```bash
   POST http://localhost:3001/api/auth/login
   Content-Type: application/json

   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

### Report Generation

1. **Generate a report:**
   ```bash
   POST http://localhost:3001/api/reports/generate
   Authorization: Bearer YOUR_JWT_TOKEN
   Content-Type: application/json

   {
     "session_id": "session_001"
   }
   ```

2. **Check report status:**
   ```bash
   GET http://localhost:3001/api/reports/status/session_001
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

3. **Download report:**
   ```bash
   GET http://localhost:3001/api/reports/download/session_001
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

## Configuration System

The system uses a flexible configuration-driven approach for different assessment types. Each assessment type is defined in `config/assessmentConfig.ts`:

### Adding New Assessment Types

1. **Define the assessment configuration:**
   ```typescript
   {
     assessmentId: "new_assessment_type",
     assessmentName: "New Assessment Type",
     description: "Description of the assessment",
     templateFile: "new-assessment-template.html",
     sections: [
       {
         sectionName: "Section Name",
         displayOrder: 1,
         fields: [
           {
             fieldName: "fieldName",
             displayName: "Display Name",
             unit: "unit",
             dataPath: "path.to.data",
             classification: CLASSIFICATION_RANGES.category,
             shouldDisplay: true
           }
         ]
       }
     ]
   }
   ```

2. **Create HTML template:**
   Create a new template file in `backend/src/templates/`

3. **Add sample data:**
   Add sample assessment data to `data/data.ts`

## Available Assessment Types

### Health & Fitness Assessment (as_hr_02)
- Body vitals and composition analysis
- Heart health metrics
- Fitness level assessments
- Posture analysis

### Cardiac Assessment (as_card_01)
- Cardiovascular health evaluation
- Heart rate variability analysis
- Blood pressure monitoring
- Cardiac output measurements

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Reports
- `POST /api/reports/generate` - Generate assessment report
- `GET /api/reports/status/:session_id` - Get report generation status
- `GET /api/reports/download/:session_id` - Download generated report

### System
- `GET /health` - Health check endpoint

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without data leakage
- **Helmet Security**: HTTP security headers

## Development

### Backend Development

1. **TypeScript compilation:**
   ```bash
   npm run build
   ```

2. **Development mode:**
   ```bash
   npm run dev
   ```

3. **Testing:**
   ```bash
   npm test
   ```

### Frontend Development

The frontend uses React with Tailwind CSS for styling. All components are located in `src/components/`.

### Adding New Features

1. **Backend API**: Add new routes in `src/routes/`
2. **Business Logic**: Add services in `src/services/`
3. **Frontend Components**: Add React components in `src/components/`
4. **API Integration**: Add API services in `src/services/`

## Deployment

### Backend Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Set environment variables:**
   ```env
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your-production-secret
   FRONTEND_URL=https://yourdomain.com
   ```

### Frontend Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Serve static files:**
   The frontend server serves static files from the root directory.

## Troubleshooting

### Common Issues

1. **Backend not starting:**
   - Check if port 3001 is available
   - Verify environment variables are set
   - Check Node.js version compatibility

2. **Frontend not loading:**
   - Ensure backend is running
   - Check browser console for errors
   - Verify API endpoints are accessible

3. **Report generation failing:**
   - Check if Puppeteer is installed correctly
   - Verify template files exist
   - Check assessment data format

### Debug Mode

Enable debug logging by setting the environment variable:
```env
DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
# assessment-management-system
# assessment-management-system
