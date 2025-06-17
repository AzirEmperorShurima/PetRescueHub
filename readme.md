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
