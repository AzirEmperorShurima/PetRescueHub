# PetRescueHub

A full-stack web application for pet rescue and adoption management.

## 🌟 Features

- Pet adoption management
- Forum posts and discussions
- User roles system (Super Admin, Admin, User, Volunteer)
- Real-time updates using WebSocket
- Multi-language support
- Caching system for better performance

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Gateway**: API Gateway for service routing
- **Caching**: In-memory user caching
- **Real-time**: Socket.IO
- **Authentication**: JWT

## 📁 Project Structure

```
.
├── Gateway/           # API Gateway service
├── ProG_BE/          # Backend service
│   ├── src/
│   │   ├── Cache/    # Caching mechanisms
│   │   ├── Config/   # Configuration files
│   │   ├── Controller/# Request handlers
│   │   ├── Models/   # Database models
│   │   ├── Services/ # Business logic
│   │   └── Utils/    # Helper functions
│   └── test/         # Test files
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
```bash
cd ProG_BE
npm install

cd ../Gateway
npm install
```

3. Set up environment variables:
   - Create `.env` file in ProG_BE directory
   - Add required environment variables:
```env
MONGO_URI_RAILWAY=your_mongodb_uri
```

4. Start the services:
```bash
# Start Backend
cd ProG_BE
npm start

# Start Gateway
cd Gateway
npm start
```

## 💾 Database Seeding

The system automatically seeds initial data including:
- User roles (super_admin, admin, user, volunteer)
- Admin accounts
- Sample pets
- Sample forum posts

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Secure MongoDB connection with retry mechanism
- Safe database disconnection handling

## 🧪 Testing

Run tests using:
```bash
cd ProG_BE
npm test
```

## 📝 License


## 👥 Contributors

## Project Details
PetRescueHub Project Details
- Project Overview
   PetRescueHub - Node.js, Express.js, MongoDB, Mongoose, WebSocket, JWT Authentication

   A comprehensive pet rescue management platform that connects animal shelters, volunteers, and potential adopters. The application streamlines the pet adoption process while building a supportive community for animal welfare.

- Key Features Implementation
   - 🔐 Authentication & Authorization
   Multi-role user system (Super Admin, Admin, User, Volunteer)
   JWT-based secure authentication
   Role-based access control for different functionalities
   Secure password hashing and validation
   - 🐾 Pet Management System
   Detailed pet profiles with medical history
   Real-time updates on pet status
   Advanced search and filtering capabilities
   Adoption request tracking
   Photo gallery management
   - 📱 Community Features
   Interactive forum for pet-related discussions
   Real-time notifications using WebSocket
   Comment system on pet profiles and posts
   Volunteer opportunity postings
   Event scheduling and management
   - ⚡ Technical Highlights
   Scalable MongoDB database architecture
   Efficient data caching system
   API Gateway for service orchestration
   Automated database seeding
   Robust error handling
   Automated testing suite
   Continuous Integration/Deployment ready

- 🔧 Infrastructure
   Load balancing capability
   Automated backup systems
   Monitoring and logging
   Rate limiting and security measures
   Technical Achievements
   Performance: Implemented caching mechanisms reducing response time 
   Scalability: Microservices architecture supporting horizontal scaling
   Reliability: Automated reconnection handling 
   Security: Multi-layer security implementation with role-based access

- Development Practices
   Clean code architecture
   Comprehensive API documentation
   Unit and integration testing
   Code review processes
   Continuous Integration workflow
   Version control with Git
   Future Enhancements
   Mobile application integration
   AI-powered pet matching system
   International language support
   Payment gateway integration
   Advanced analytics dashboard
