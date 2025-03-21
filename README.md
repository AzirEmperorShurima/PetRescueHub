# Pet Rescue Hub

## Overview
The Pet Rescue Hub is a web application designed to connect users, volunteers, and administrators in a seamless platform for pet rescue and adoption. The application allows users to request rescue services, volunteers to respond to these requests, and administrators to manage users and volunteers effectively.

## Project Structure
The project is structured into three main parts: backend, frontend, and database.

### Backend
The backend is implemented using both Node.js and Django, providing flexibility and scalability.

- **Node.js**: 
  - Located in the `backend/nodejs` directory.
  - Uses Express for handling HTTP requests and MongoDB for data storage.
  - Contains controllers for managing admin, user, and volunteer functionalities.
  - Routes are defined for each type of user.

- **Django**: 
  - Located in the `backend/django` directory.
  - Provides an alternative backend option using Django's robust framework.
  - Contains models, views, and URL routing for admin, user, and volunteer functionalities.

### Frontend
The frontend is developed using both React and Flutter, catering to web and mobile users.

- **React**: 
  - Located in the `frontend/react` directory.
  - Provides a responsive web interface for users, volunteers, and admins.
  - Components include dashboards for each user type.

- **Flutter**: 
  - Located in the `frontend/flutter` directory.
  - Provides a mobile application interface for users and volunteers.
  - Screens include dashboards for each user type.

### Database
The database is managed using MongoDB, with scripts for initialization and seeding located in the `database/mongo` directory.

## Features
- **User Features**:
  - Register and log in to the platform.
  - Request pet rescue services.
  - View available pets for adoption.

- **Volunteer Features**:
  - Register as a volunteer.
  - Respond to rescue requests.
  - Manage their availability.

- **Admin Features**:
  - Manage users and volunteers.
  - Oversee rescue requests and adoption processes.
  - Generate reports on activities.

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd pet-rescue-hub
   ```

2. **Backend Setup**:
   - For Node.js:
     - Navigate to `backend/nodejs`.
     - Install dependencies:
       ```
       npm install
       ```
     - Start the server:
       ```
       node app.js
       ```

   - For Django:
     - Navigate to `backend/django`.
     - Install dependencies:
       ```
       pip install -r requirements.txt
       ```
     - Run migrations and start the server:
       ```
       python manage.py migrate
       python manage.py runserver
       ```

3. **Frontend Setup**:
   - For React:
     - Navigate to `frontend/react`.
     - Install dependencies:
       ```
       npm install
       ```
     - Start the React application:
       ```
       npm start
       ```

   - For Flutter:
     - Navigate to `frontend/flutter`.
     - Get dependencies:
       ```
       flutter pub get
       ```
     - Run the Flutter application:
       ```
       flutter run
       ```

## Conclusion
The Pet Rescue Hub aims to create a community-driven platform for pet rescue and adoption, leveraging modern web technologies to provide a user-friendly experience.
