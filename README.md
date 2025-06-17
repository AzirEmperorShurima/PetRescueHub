# 🐾 PetRescueHub

A full-stack web platform to connect pet lovers, volunteers, and rescue organizations for pet adoption and care.

---

## ✨ Features

- 🚨 **Emergency Rescue Requests**: Create and manage urgent pet rescue cases.
- 💬 **Community Forum**: Share experiences and discuss pet-related topics.
- 🐶 **Pet Profiles**: Build and manage pet profiles for adoption.
- 🏡 **Pet Adoption**: Search and apply to adopt rescued pets.
- 💸 **Donations**: Support rescue efforts with secure donations.
- 📅 **Events**: Discover pet-related events and activities.
- 🙋 **Volunteer Program**: Sign up to volunteer for pet rescue.
- 📚 **Care Guides**: Access pet care educational resources.
- 🤖 **Support Chatbot**: Get quick answers via a virtual assistant.
- ⚡ **Real-Time Updates**: Stay informed with WebSocket notifications.
- 🌐 **Multi-Language Support**: Use the platform in multiple languages.
- 👥 **User Roles**: Supports Super Admin, Admin, User, and Volunteer roles.
- 🚀 **Optimized Performance**: Uses caching for faster responses.

---

## 🛠 Tech Stack

### Frontend
- React 18
- Chakra UI
- Material-UI (MUI)
- React Router v6
- Axios
- React Bootstrap
- React Icons
- Dayjs
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication

### Chatbot
- Python 3.8+
- PyTorch
- NLTK
- Scikit-learn
- Flask
- NLP

---

## 📂 Project Structure

```
PetRescueHub/
├── frontend/    # React-based frontend
├── backend/     # Node.js/Express backend
├── chatbot/     # Python-based chatbot
└── gateway/     # API Gateway
```

---

## 📋 Requirements

- Git
- Node.js (v14+)
- npm (v6+)
- MongoDB
- Python (3.8+)

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/AzirEmperorShurima/PetRescueHub.git
cd PetRescueHub
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs at: `http://localhost:3000`

### 3. Backend Setup
```bash
cd backend
npm install
npm start
```
Runs at: `http://localhost:4000`

### 4. Chatbot Setup
```bash
cd chatbot
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
pip install -r requirements.txt
python train.py
python app.py
```
Runs at: `http://localhost:5000`

### 5. Gateway Setup
```bash
cd gateway
npm install
npm start
```

### 6. Environment Variables
Create a `.env` file in the `backend` directory:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

---

## 💾 Database Seeding

The system seeds initial data, including:
- User roles (Super Admin, Admin, User, Volunteer)
- Admin accounts
- Sample pet profiles
- Sample forum posts

---

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Secure MongoDB connection
- Rate limiting
- Safe error handling

---

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

---

## 📋 Project Details

### Overview
PetRescueHub is a scalable platform built with Node.js, Express.js, MongoDB, and WebSocket to streamline pet adoption and foster a community for animal welfare.

### Key Features
- 🔐 **Authentication**: Multi-role system with JWT and role-based access.
- 🐾 **Pet Management**: Detailed profiles, adoption tracking, and photo galleries.
- 💬 **Community**: Forum, real-time notifications, events, and volunteer opportunities.
- ⚡ **Technical Highlights**:
  - Scalable MongoDB architecture
  - Caching for performance
  - API Gateway
  - Automated testing and CI/CD readiness
- 🛠 **Infrastructure**:
  - Load balancing
  - Automated backups
  - Monitoring and logging

### Future Enhancements
- 📱 Mobile app integration
- 🤖 AI-powered pet matching
- 🌍 Expanded language support
- 💳 Payment gateway
- 📊 Analytics dashboard

---

## 📜 License

MIT License

---

## 👥 Contributors

- [C1SE.03] - [Developments/Contribution]
