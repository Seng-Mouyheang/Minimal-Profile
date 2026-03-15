## 📄 Express.js Authentication and State Management App

A server-side web application that demonstrates authentication, session, and client-side state management in a backend application. The system allows predefined users to log in, access a protected profile page, and manage a persistent theme preference using secure signed cookies.

This project focuses on implementing authentication logic, session handling, middleware protection, and cookie-based UI state management using Express.js and Handlebars templates.

### 🛠️ Development Tools:
HTML / CSS / Tailwind CSS / Node.js / Express.js / Handlebars (HBS) / express-session / cookie-parser / VS Code 

### 📚 Course Information
Course: INF653 – Backend Web Development  
Assignment: Homework 8 - Login Page (Authentication and State Management)

### 🎯 Objective

The objective of this assignment is to develop an Express.js web application that demonstrates secure authentication and persistent state management by implementing:
- A login system that verifies user credentials from predefined data
- Session management using express-session
- Protected routes using authentication middleware
- A profile page accessible only to logged-in users
- Theme state management using signed cookies
- Secure cookie handling using httpOnly and signing mechanisms
- UI theme persistence even after logout

### 📦 Dependencies
All required dependencies must be listed in package.json. Main packages used:
- express
- express-session
- cookie-parser
- hbs

### 🔑 Security Configuration
To ensure proper session and cookie security:
- Use a strong secret key for:
  - cookie-parser
  - express-session
- Enable signed cookies
- Apply the httpOnly flag to sensitive cookies
