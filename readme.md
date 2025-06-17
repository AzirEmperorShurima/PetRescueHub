PetRescueHub
A full-stack web application designed to streamline pet rescue and adoption, connecting pet lovers, volunteers, and animal rescue organizations to build a supportive community for animal welfare.
🌟 Features

Emergency Rescue Requests: Create and manage urgent rescue requests for pets in distress.
Community Forum: Engage in discussions, share experiences, and exchange pet-related information.
Pet Profiles: Build detailed profiles for pets to facilitate adoption and prevent abandonment.
Pet Adoption: Search for and register to adopt rescued pets.
Donations: Support rescue operations through secure financial contributions.
Events: Discover and participate in pet-related events and community activities.
Volunteer Program: Register as a volunteer to assist in rescue efforts.
Care Guides: Access educational resources on pet care and well-being.
Support Chatbot: Interact with a virtual assistant for quick answers to common questions.
Real-time Updates: Stay informed with live updates via WebSocket.
Multi-language Support: Access the platform in multiple languages.
User Roles: Supports Super Admin, Admin, User, and Volunteer roles with tailored permissions.
Performance Optimization: Utilizes caching for faster response times.

🛠️ Tech Stack
Frontend

React 18
Chakra UI
Material-UI (MUI)
React Router v6
Axios
React Bootstrap
React Icons
Dayjs
Framer Motion

Backend

Node.js
Express.js
MongoDB with Mongoose
Socket.IO for real-time communication
JWT Authentication

Chatbot

Python 3.8+
PyTorch
NLTK
Scikit-learn
Flask
Natural Language Processing (NLP)

📁 Project Structure
PetRescueHub/
├── frontend/          # React-based frontend
├── backend/           # Node.js/Express backend
├── chatbot/           # Python-based chatbot
└── gateway/           # API Gateway for service routing

📋 System Requirements

Git
Node.js (v14+)
npm (v6+)
MongoDB
Python (3.8+)

🚀 Getting Started
1. Clone the Repository
git clone https://github.com/AzirEmperorShurima/PetRescueHub.git
cd PetRescueHub

2. Frontend Setup
cd frontend
npm install
npm run dev

The frontend will be available at http://localhost:3000.
3. Backend Setup
cd backend
npm install
npm start

The backend will run at http://localhost:4000.
4. Chatbot Setup
cd chatbot
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
pip install -r requirements.txt
python train.py
python app.py

The chatbot will be accessible at http://localhost:5000.
5. Gateway Setup
cd gateway
npm install
npm start

6. Environment Variables
Create a .env file in the backend directory with the following:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

💾 Database Seeding
The system automatically seeds initial data, including:

User roles (Super Admin, Admin, User, Volunteer)
Admin accounts
Sample pet profiles
Sample forum posts

🔒 Security

JWT-based authentication
Role-based access control
Secure MongoDB connection with retry mechanism
Safe database disconnection handling
Rate limiting and security headers

🧪 Testing
Run tests for the backend:
cd backend
npm test

📝 Project Details
Overview
PetRescueHub is a comprehensive platform built with Node.js, Express.js, MongoDB, and WebSocket, designed to streamline pet adoption and foster a community for animal welfare.
Key Features

Authentication & Authorization: Multi-role system with JWT-based secure authentication and role-based access control.
Pet Management: Detailed pet profiles with medical history, adoption tracking, and photo galleries.
Community Features: Interactive forum, real-time notifications, event scheduling, and volunteer opportunities.
Technical Highlights:
Scalable MongoDB architecture
Efficient caching system
API Gateway for service orchestration
Automated testing and CI/CD readiness


Infrastructure:
Load balancing
Automated backups
Monitoring and logging
Robust error handling



Future Enhancements

Mobile app integration
AI-powered pet matching
Expanded multi-language support
Payment gateway integration
Advanced analytics dashboard

📜 License
This project is licensed under the MIT License.
👥 Contributors

[C1SE.03] - [Role/Contribution]


