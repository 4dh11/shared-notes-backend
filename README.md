# 📝 Shared Notes Backend

A robust RESTful API backend for a collaborative note-taking application built with Node.js, Express.js, and MongoDB. This backend provides secure JWT authentication, comprehensive note management with trash functionality, customizable settings, and wallpaper upload capabilities.

## 🌟 Features

- **🔐 JWT Authentication** - Secure login system with token-based authentication
- **📝 Complete Note Management** - Create, read, update, delete, and search notes
- **📌 Note Organization** - Pin important notes and manage them separately
- **🗑️ Smart Trash System** - Soft delete with restore functionality and auto-cleanup
- **🎨 Wallpaper Management** - Upload custom wallpapers and manage presets
- **⚙️ User Settings** - Customizable user preferences and password management
- **🔍 Search Functionality** - Full-text search across note titles and content
- **🌐 CORS Configuration** - Secure cross-origin requests handling
- **📱 RESTful API Design** - Clean, intuitive API endpoints

## 🚀 Live Demo

**API Base URL:** `https://your-deployed-backend-url.com/api`

## 🛠️ Tech Stack

- **Runtime:** Node.js with ES6 Modules
- **Framework:** Express.js ^4.18.2
- **Database:** MongoDB with Mongoose ^8.14.3
- **Authentication:** JWT (jsonwebtoken ^9.0.2)
- **Password Hashing:** bcrypt ^6.0.0
- **File Upload:** Multer ^2.0.2
- **CORS:** cors ^2.8.5
- **Environment Management:** dotenv ^16.5.0
- **Development:** nodemon ^3.1.10

## 📁 Project Structure

```
shared-notes-backend/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic (login)
│   │   ├── notesController.js       # Notes CRUD + trash management
│   │   └── settingsController.js    # Settings & wallpaper management
│   ├── middleware/
│   │   ├── uploadWallpaper.js       # Multer file upload configuration
│   │   └── verifyJWT.js            # JWT token verification middleware
│   ├── models/
│   │   ├── Note.js                 # Note schema with trash functionality
│   │   └── settingsModel.js        # User settings data model
│   ├── routes/
│   │   ├── authRoutes.js           # Authentication endpoints
│   │   ├── notesRoutes.js          # Notes API routes
│   │   └── settingsRoutes.js       # Settings & wallpaper routes
│   └── server.js                   # Main application entry point
├── uploads/
│   └── wallpapers/                 # Uploaded wallpaper files storage
├── .env                           # Environment variables
├── package.json                   # Dependencies and scripts
└── package-lock.json
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/4dh11/shared-notes-backend.git
cd shared-notes-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5001

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/shared-notes
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shared-notes

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Frontend URLs (for CORS)
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://your-frontend-domain.com
```

### 4. Start MongoDB
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, ensure your connection string is correct in .env
```

### 5. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5001`

## 📚 API Documentation

### Authentication Endpoints

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

### Notes Management Endpoints

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer your_jwt_token

# With search
GET /api/notes?q=search_term
```

#### Get Pinned Notes Only
```http
GET /api/notes/pinned
Authorization: Bearer your_jwt_token
```

#### Get Single Note
```http
GET /api/notes/:id
Authorization: Bearer your_jwt_token
```

#### Create New Note
```http
POST /api/notes
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "title": "My Note Title",
  "content": "Note content here...",
  "pinned": false,
  "alignment": "left"
}
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "pinned": true,
  "alignment": "center"
}
```

#### Move Note to Trash
```http
DELETE /api/notes/:id
Authorization: Bearer your_jwt_token

Response:
{
  "message": "Note moved to trash"
}
```

### Trash Management Endpoints

#### Get Trashed Notes
```http
GET /api/settings/trash
Authorization: Bearer your_jwt_token
```

#### Restore Note from Trash
```http
PUT /api/settings/trash/restore/:id
Authorization: Bearer your_jwt_token

Response:
{
  "message": "Note restored",
  "note": { ... }
}
```

#### Permanently Delete Note
```http
DELETE /api/settings/trash/delete/:id
Authorization: Bearer your_jwt_token

Response:
{
  "message": "Note permanently deleted"
}
```

#### Cleanup Old Trashed Notes
```http
DELETE /api/settings/trash/cleanup
Authorization: Bearer your_jwt_token
```

### Settings Endpoints

#### Get User Settings
```http
GET /api/settings
Authorization: Bearer your_jwt_token
```

#### Update Settings
```http
PUT /api/settings
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "theme": "dark",
  "defaultAlignment": "left",
  "autoSave": true
}
```

#### Change Password
```http
PUT /api/settings/change-password
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### Wallpaper Management

#### Upload Custom Wallpaper
```http
POST /api/settings/upload-wallpaper
Authorization: Bearer your_jwt_token
Content-Type: multipart/form-data

Form Data:
- wallpaper: [image file - jpg, png, gif]
```

#### Get Wallpaper Presets
```http
GET /api/settings/wallpapers
```

#### Get Current Wallpaper
```http
GET /api/settings/current-wallpaper
Authorization: Bearer your_jwt_token
```

#### Access Uploaded Files
```http
GET /uploads/wallpapers/filename.jpg
```

## 🗄️ Database Schema

### Note Model
```javascript
{
  title: String (required),
  content: String (required),
  pinned: Boolean (default: false),
  isTrashed: Boolean (default: false),
  trashedAt: Date (default: null),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Key Features:
- **Soft Delete System**: Notes are marked as `isTrashed` instead of being permanently deleted
- **Auto-timestamps**: MongoDB automatically manages `createdAt` and `updatedAt`
- **Pinning System**: Important notes can be pinned for quick access
- **Trash Management**: Trashed notes can be restored or permanently deleted

## 🔒 Authentication & Security

### JWT Authentication
- **Token Expiration**: Configurable (default: 7 days)
- **Secure Headers**: All protected routes require `Authorization: Bearer <token>`
- **Password Hashing**: bcrypt with salt rounds for secure password storage

### CORS Configuration
```javascript
// Allowed origins for cross-origin requests
const allowedOrigins = [
  "http://localhost:5173",  // Vite dev server
  "http://localhost:3000",  // React dev server
  "https://your-frontend-domain.com"  // Production frontend
];
```

## 🔍 Search Functionality

The API supports full-text search across note titles and content:

```http
GET /api/notes?q=search_term
```

- **Case-insensitive** search using MongoDB regex
- Searches both **title** and **content** fields
- Returns only **non-trashed** notes
- Results sorted by **most recently updated**

## 🗑️ Trash System Details

### Soft Delete Process
1. **Delete**: Note is marked `isTrashed: true` and `trashedAt: Date`
2. **Restore**: Flags are reset to `isTrashed: false, trashedAt: null`
3. **Permanent Delete**: Note is completely removed from database

### Auto-Cleanup Feature
- Automatically deletes trashed notes older than 30 days
- Can be manually triggered via API endpoint
- Runs in background (implementation can be added with cron jobs)

## 🧪 Testing the API

### Using cURL
```bash
# Test server health
curl http://localhost:5001/api/notes

# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected route
curl -X GET http://localhost:5001/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman or Thunder Client
Import these endpoints into your API client:
- Base URL: `http://localhost:5001/api`
- Set up environment variables for `{{baseUrl}}` and `{{token}}`

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shared-notes
JWT_SECRET=your_production_jwt_secret_key
```

### Deployment Platforms

#### Render (Recommended)
1. Connect your GitHub repository to Render
2. Choose "Web Service" 
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard
6. Deploy automatically on git push

#### Railway
```bash
railway login
railway init
railway add
railway deploy
```

#### Heroku
```bash
heroku create shared-notes-backend
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### CORS Configuration for Production
Update the `allowedOrigins` array in `server.js`:
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://your-actual-frontend-domain.com"  // Add your real frontend URL
];
```

## 📦 Dependencies

### Production Dependencies
```json
{
  "bcrypt": "^6.0.0",           // Password hashing
  "cors": "^2.8.5",             // Cross-origin requests
  "dotenv": "^16.5.0",          // Environment variables
  "express": "^4.18.2",         // Web framework
  "jsonwebtoken": "^9.0.2",     // JWT authentication
  "mongoose": "^8.14.3",        // MongoDB ODM
  "multer": "^2.0.2"            // File upload handling
}
```

### Development Dependencies
```json
{
  "nodemon": "^3.1.10"          // Auto-restart development server
}
```

## ⚙️ Configuration Details

### File Upload Configuration
- **Supported formats**: JPG, PNG, GIF
- **Storage location**: `uploads/wallpapers/`
- **File size limit**: Configurable in multer settings
- **Static file serving**: Express serves files at `/uploads/*`

### Database Connection
- Uses Mongoose for MongoDB interaction
- Automatic connection retry on failure
- Connection string configurable via environment variables

## 🐛 Error Handling

### Consistent Error Response Format
```json
{
  "message": "Error description",
  "error": "Additional error details"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created successfully
- `400` - Bad request / Validation error
- `401` - Unauthorized / Invalid token
- `404` - Resource not found
- `500` - Internal server error

## 🔄 API Response Examples

### Successful Note Creation
```json
{
  "message": "Note created successfully",
  "note": {
    "_id": "note_id",
    "title": "My Note",
    "content": "Note content",
    "pinned": false,
    "isTrashed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Search Results
```json
[
  {
    "_id": "note_id_1",
    "title": "Meeting Notes",
    "content": "Important discussion points...",
    "pinned": true,
    "isTrashed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Use ES6 modules (`import`/`export`)
- Follow RESTful API conventions
- Add proper error handling for all endpoints
- Include input validation where necessary
- Update this README for new features

## 📋 Future Enhancements

- [ ] **User Registration** - Complete user management system
- [ ] **Real-time Sync** - WebSocket integration for live updates
- [ ] **Note Categories/Tags** - Organize notes with custom tags
- [ ] **Rich Text Support** - Markdown or WYSIWYG editor support
- [ ] **Note Templates** - Pre-defined note templates
- [ ] **Export Features** - Export notes to PDF, Word, etc.
- [ ] **API Rate Limiting** - Implement request rate limiting
- [ ] **Backup System** - Automatic data backup functionality

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**SS Adityaa** - [4dh11](https://github.com/4dh11)

- GitHub: [@4dh11](https://github.com/4dh11)
- LinkedIn: [Adityaa SS](https://www.linkedin.com/in/adityaa-ss-30233b2b3/)
- Email: adityaa.sureshbabu@gmail.com

## 🙏 Acknowledgments

- MongoDB team for excellent documentation
- Express.js community for robust web framework
- JWT.io for authentication implementation guidance
- Mongoose team for seamless MongoDB integration

## 📞 Support

If you encounter any issues or have questions:

1. **Check the API documentation** above
2. **Review common error codes** and their meanings
3. **Search existing issues** on GitHub
4. **Create a new issue** with detailed description
5. **Contact the maintainer** for urgent matters

---

⭐ **Star this repository if you find it helpful!**

🔗 **Frontend Repository:** [shared-notes-frontend](https://github.com/4dh11/shared-notes-frontend)

Made with ❤️ by [4dh11](https://github.com/4dh11)
