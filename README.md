🏥 Online Health System

A simple Online Health System built with HTML, CSS, and JavaScript using a modular architecture and role-based access.

📌 Project Overview

This project simulates an online healthcare platform where:

Patients can book appointments

Doctors can manage appointments

Admin can manage the system

Reports are generated for insights

The project uses dummy data for demonstration purposes.

🧱 Project Structure
Online-Health-System/
│
├── data/
│   └── dummyData.js
│
├── modules/
│   ├── auth/
│   ├── patient/
│   ├── doctor/
│   ├── admin/
│   └── reports/
│
├── src/
│   ├── css/
│   ├── js/
│   └── assets/
│
├── index.html
└── README.md

📂 Folder Responsibilities
📁 data/

dummyData.js

Contains mock data:

Users

Appointments

Reports

Used for testing and presentation

📁 modules/auth (Wahba)

Login / Signup validation

Password checks

Role detection

Prevent invalid input

📁 modules/patient (Rehan)

View patient profile

Book appointments

View appointment history

Update appointment status

📁 modules/doctor (Dina)

View patients list

View appointments

Update examination status

Add doctor notes

📁 modules/admin (Doaa)

Admin dashboard

View all users

Review system data

Manage roles and permissions

📁 modules/reports (Ibrahim)

Calculate statistics:

Number of patients

Number of doctors

Number of appointments

Display simple reports and summaries

🔄 Application Flow

User logs in or signs up

Authentication module validates input

System detects user role

User is redirected to the Home Dashboard

Based on role:

Admin → System management

Doctor → Appointment management

Patient → Appointment booking

🎨 Design Guidelines

Glassmorphism UI

No blue colors

Primary Color: Medical Green / Navy-based palette

Consistent layout across all pages

Sidebar + Main content layout

Common UI Components

Sidebar

Header

Cards

Tables

Buttons

Forms

Badges

🎯 Naming Conventions
📁 Files & Folders

lowercase

dash-separated

patient.js
auth-ui.js

🎨 CSS Classes (BEM Methodology)
.block
.block__element
.block__element--modifier


Examples

.sidebar
.sidebar__item
.sidebar__item--active

.btn
.btn--primary
.btn--danger

🧠 JavaScript Naming

Variables & functions → camelCase

Classes → PascalCase

function loginUser() {}
class Appointment {}

🧪 Dummy Data Naming
usersData
appointmentsData
reportsData

🌿 Git Workflow

Each team member works on their own branch

No direct push to main

Use meaningful commit messages

Merge only after review

Branches

auth → Wahba

patient → Rehan

doctor → Dina

admin → Doaa

reports → Ibrahim

📊 Dashboard Responsibility

Admin Dashboard handled by Doaa

Other roles have role-based home pages

📋 Team Members
Name  Module
Doaa  Admin + Dashboard
Rehan  Patient
Dina  Doctor
Ibrahim  Reports
Wahba  Auth
✅ Rules to Follow

✔️ Follow the shared structure
✔️ Use shared CSS classes
✔️ No inline styles
✔️ No push to main branch
✔️ Communicate before major changes

🚀 Technologies Used

HTML5

CSS3

JavaScript (ES6)

Git & GitHub

📎 Notes

This project is built for learning and demonstration purposes using dummy data only.
