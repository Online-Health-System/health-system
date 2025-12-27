# 🏥 Online Health System

A simple Online Health System built with HTML, CSS, and JavaScript using a modular architecture and role-based access.

---

## 📌 Project Overview
This project simulates an online healthcare platform where:
* **Patients**: Can book and view appointments.
* **Doctors**: Can manage patient lists and update statuses.
* **Admins**: Can manage the entire system and users.
* **Reports**: Generated insights for system statistics.

> **Note**: The project uses dummy data for demonstration purposes.

---

## 🧱 Project Structure
```text
Online-Health-System/
├── data/
│   ├── appointments.js
│   ├── data.json
│   ├── storage.js
│   └── users.js
├── modules/
│   ├── auth/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── admin.js
│   ├── doctor.js
│   ├── patient.js
│   └── reports.js
├── src/
│   ├── css/
│   │   └── style.css
│   ├── pages/
│   │   ├── admin.html
│   │   ├── doctor.html
│   │   ├── login.html
│   │   ├── patient.html
│   │   └── register.html
│   └── assets/
├── index.html
└── README.md
📂 Folder Responsibilities
📁 data/
appointments.js / users.js: جداول البيانات الأساسية.

data.json: ملف البيانات الخام (Mock Data).

storage.js: المسؤول عن الـ LocalStorage وحفظ البيانات.

📁 modules/
auth/ (Wahba): التحقق من الدخول، التسجيل، وتحديد الأدوار (Roles).

patient.js (Rehan): بروفايل المريض، حجز المواعيد، وتاريخ الكشوفات.

doctor.js (Dina): قائمة المرضى، إدارة الكشوفات، وكتابة الملاحظات الطبية.

admin.js (Doaa): لوحة التحكم الشاملة، إدارة المستخدمين والصلاحيات.

reports.js (Ibrahim): حساب الإحصائيات (عدد المرضى، الأطباء، المواعيد).

🎨 Design Guidelines
Style: Glassmorphism UI (تأثير الزجاج الشفاف).

Colors: No blue colors. الأساس هو (Medical Green / Navy palette).

Layout: Sidebar + Main content layout.

🎯 Naming Conventions
Files: lowercase-with-dashes.js (e.g., auth-ui.js).

CSS (BEM): .block__element--modifier (e.g., .sidebar__item--active).

JS: Variables & Functions (camelCase), Classes (PascalCase).

🌿 Git Workflow & Team
Process: Work on your branch -> No direct push to main -> Review before merge.

Branches:

auth → Wahba

patient → Rehan

doctor → Dina

admin → Doaa

reports → Ibrahim

🚀 Technologies Used
HTML5 / CSS3 / JavaScript (ES6)

Git & GitHub

✅ Project Rules:

Follow the shared structure.

Use shared CSS classes (No inline styles).

Always communicate before major changes.
