# Pet Rescue Hub

## Introduction

Pet Rescue Hub is an online platform connecting pet lovers, volunteers, and animal rescue organizations. This project aims to create a community to support pet rescue, care, and adoption.

## Key Features

- **Create Emergency Rescue Requests**: Support urgent cases needing help for pets in distress.
- **Community Forum**: Share experiences, ask questions, and exchange information.
- **Create Pet Profiles**: Create pet profiles to post and find new homes for pets, helping them avoid abandonment.
- **Pet Adoption**: Search and register to adopt rescued pets.
- **Donations**: Support rescue operations through financial contributions.
- **Events**: Discover pet-related events, exhibitions, and community activities.
- **Volunteer Program**: Register to become a rescue volunteer.
- **Care Guides**: Educational materials on pet care.
- **Support Chatbot**: A virtual assistant to automatically answer frequently asked questions.

## Project Structure

The project is divided into 3 main parts:

### Frontend
- React 18
- Chakra UI
- MUI
- React Router v6
- Axios
- React Bootstrap
- React Icons
- Dayjs
- Framer Motion

### Backend
- Node.js
- Express
- MongoDB
- Socket.io
- JWT Authentication

### Chatbot
- Python
- TensorFlow
- Natural Language Processing (NLP)
- Flask

## System Requirements

### General
- Git
- Node.js (v14+)
- npm (v6+)
- MongoDB
- Python (3.8+)

## Setup Instructions

### 1. Clone repository
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
The frontend will run at `http://localhost:3000`

### 3. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend will run at `http://localhost:4000`

### 4. Chatbot Setup
```bash
cd chatbot
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
The chatbot will run at `http://localhost:5000`

## Environment Configuration

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=27017
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

MIT License