# 🚀 Project Management System

Welcome to the **Ubiquitous Project Management System**! This is a modern, full-stack web application designed to help Admins and Clients collaborate seamlessly on projects.

Whether you're an Admin managing timelines or a Client tracking progress, this app provides a secure and intuitive interface to get the job done.

## 🛠️ Tech Stack

This project is built using the **MERN Stack**, chosen for its speed, scalability, and modern ecosystem.

### **Frontend (The User Interface)**
*   **React + Vite**: For a blazing fast, responsive user experience.
*   **Tailwind CSS**: For sleek, modern styling and a beautiful dark-mode aesthetic.
*   **Lucide React**: For crisp, lightweight eye-catching icons.
*   **Axios**: To communicate smoothly with our backend API.

### **Backend (The Logic Layers)**
*   **Node.js & Express**: A robust server handling all your requests and business logic.
*   **MongoDB & Mongoose**: Where your data lives – flexible, fast, and scalable.
*   **JWT (JSON Web Tokens)**: To keep your sessions secure and your data private.
*   **BcryptJS**: Ensuring your passwords are encrypted and safe.

---

## ✨ Key Functionalities

We’ve packed this system with features to make project management easy.

### **🔐 Authentication & Security**
*   **Secure Signup & Login**: Industry-standard encryption and JWT sessions.
*   **Smart Role Management**: 
    *   **Admins** have full control.
    *   **Clients** see only what they are allowed to see.
*   **Token-Based Security**: User roles are verified directly from the secure token, preventing tampering.

### **👑 For Admins**
*   **Dashboard Overview**: See all projects, users, and requests at a glance.
*   **Project Central**: Create new projects with details like timelines, contacts, and emails.
*   **Access Control**: Review access requests from clients and Approve or Deny them with a click.
*   **User Management**: create new users and view the user database.

### **👋 For Clients**
*   **My Projects**: A personalized view showing only the projects you have access to.
*   **Request Access**: Browse available projects and ask for permission to view them.
*   **Real-Time Status**: See the status of your requests (Pending, Approved, etc.) instantly.

### **🎨 Experience**
*   **Dark Mode UI**: Easy on the eyes and professional.
*   **Responsive Design**: Works great on your large monitor or your tablet.
*   **Custom Alerts**: Beautiful toast notifications instead of boring browser alerts.

---

## 🚀 How to Run It

1.  **Start the Server**:
    ```bash
    cd Server
    node server.js
    ```
    *The backend will spin up on port 5000.*

2.  **Launch the Frontend**:
    ```bash
    cd Client
    npm run dev
    ```
    *Open the link (usually http://localhost:5173) in your browser.*

Enjoy managing your projects!
