# User Management System

A comprehensive web application for managing employees, departments, EPF (Employee Provident Fund), and administrative tasks.  
Built with modern web technologies including React and Express.js with MongoDB as the database.

<img width="1898" height="1007" alt="u1" src="https://github.com/user-attachments/assets/448fe31f-9964-4e1d-aa3b-21f0c87860f8" />

---

## 🚀 Features

### Core Functionality
- **Employee Management**: Complete CRUD operations for employee data including personal information, employment details, and family information  
  ↳ `employee.model.js:3-99`
- **Department Management**: Create and manage organizational departments  
  ↳ `department.model.js:3-13`
- **EPF Management**: Handle Employee Provident Fund calculations and settings  
  ↳ `epf.model.js:3-8`
- **Admin Management**: Secure admin user authentication and management  
  ↳ `admin.model.js:3-17`
- **Dashboard Overview**: Real-time statistics and analytics for employees, departments, EPF, and admins  
  ↳ `index.jsx:14-51`
- **Reporting System**: Generate comprehensive reports for organizational insights

### Employee Features
- Personal information (Name, Address, DOB, NIC, Gender, Email)
- Employment details (EPF No, Department, Join Date, Basic Salary, Employment Type)
- Family information (Marital Status, Spouse, Children, Parents/Guardians)
- Profile picture support
- Contact information management

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.0  
- **Vite** 7.0.4  
- **Tailwind CSS** 4.1.11  
- **React Router DOM** 7.7.1  
- **Lucide React** 0.534.0  

> Refer: `package.json:14-18, 29`

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**  
  ↳ `employee.model.js:1`

### Development Tools
- **ESLint** (Code linting and formatting)  
- **TypeScript Types** (for enhanced development experience)  
  ↳ `package.json:21-27`

---

## 📁 Project Structure

```
user_management_system/
├── express_backend/          # Backend API server
│   └── src/
│       └── models/
│           ├── employee.model.js
│           ├── department.model.js
│           ├── admin.model.js
│           ├── epf.model.js
│           └── employeeEpf.model.js
└── react_frontend/           # Frontend React application
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── layout/           # Layout components
    │   ├── pages/            # Application pages
    │   │   └── dashboard/
    │   │       ├── employees/
    │   │       ├── departments/
    │   │       ├── admins/
    │   │       ├── epf/
    │   │       ├── reports/
    │   │       └── settings/
    │   ├── App.jsx           # Main app component
    │   └── main.jsx          # App entry point
    ├── package.json
    └── vite.config.js
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or remote)

### Installation

**Clone the repository:**

```bash
git clone https://github.com/sadeeshasathsara/user_management_system.git
cd user_management_system
```

**Setup Frontend:**

```bash
cd react_frontend
npm install
```

**Setup Backend:**

```bash
cd ../express_backend
npm install
```

### Environment Configuration

Create `.env` files in both `react_frontend/` and `express_backend/`.

**Backend `.env`:**

```
MONGODB_URI=mongodb://localhost:27017/user_management
PORT=5000
JWT_SECRET=your_jwt_secret
```

---

## 👨‍💻 Development

### Start Backend Server:

```bash
cd express_backend
npm run dev
```

### Start Frontend Dev Server:

```bash
cd react_frontend
npm run dev
```

> Frontend: [http://localhost:5173](http://localhost:5173)  
> Backend API: [http://localhost:5000](http://localhost:5000)

---

## 📱 Application Routes

`App.jsx:72-104`

- `/dashboard` – Overview with statistics  
- `/employees` – Manage employee records  
- `/departments` – Manage departments  
- `/epf` – Manage EPF data  
- `/admins` – Admin user settings  
- `/reports` – Generate/view reports  
- `/settings/epf` – EPF configuration settings

---

## 🗃️ Database Models

### Employee Schema
Includes personal, employment, and family data with support for multiple employment types and marital status options.

### Department Schema
Simple department structure with name and description.

### Admin Schema
Secure login with email/password for admin users.

### EPF Schema
Manage Provident Fund limits and configurations.

---

## 🔧 Development Scripts

From `package.json:6-11`:

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch  
   `git checkout -b feature/amazing-feature`
3. Commit your changes  
   `git commit -m 'Add amazing feature'`
4. Push to GitHub  
   `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Sadeesha Sathsara**  
GitHub: [@sadeeshasathsara](https://github.com/sadeeshasathsara)
