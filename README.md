<div align="center">

# Alive AI
### Your Health, Predicted Before It Happens

A Patient-First Web Application That Uses Artificial Intelligence To Predict And Prevent 8 Major Health Conditions — Because The Best Treatment Is The One You Never Need.

**React 18** · **React Router 6** · **D3.js** · **Bootstrap 5** · **SweetAlert2**

[Get Started](#getting-started) · [Features](#features) · [Architecture](#architecture) · [Design System](#design-system)

---

</div>

## About

Too Many People Find Out They're Sick When It's Already Late. Alive AI Was Built To Change That.

This Platform Puts The Power Of Predictive Health Analysis Directly Into Patients' Hands. Instead Of Waiting For Symptoms To Show Up, Users Can Input Simple Health Metrics — Things Like Age, Weight, Fasting Glucose, And Lifestyle Habits — And Receive AI-Driven Predictions Across 8 Major Health Conditions. No Appointments. No Waiting Rooms. Just Answers.

Behind The Scenes, It's An Application With Interactive D3.js Visualizations That Make Complex Health Data Easy To Understand. A Personal Dashboard Tracks Everything In One Place — From Diabetes Risk Percentages To Cholesterol Trends — So Patients Can See Their Health Story Unfold Over Time.

> **7 Pages · 5 Dashboard Modules · 3 Chart Types · 8 Health Predictions · 1 Mission — Keep People Healthy**

## The 8 Health Predictions

These Aren't Just Numbers On A Screen. Each Prediction Is Designed To Give Patients A Clear, Honest Picture Of Where They Stand — And What They Can Do About It.

| Condition                     | What Patients Learn                                                                     |
| :---------------------------- | :-------------------------------------------------------------------------------------- |
| **Diabetes**                  | Risk Percentage Based On BMI, Fasting Glucose, HbA1c, And Lifestyle Factors             |
| **Asthma**                    | Susceptibility Assessment From Environmental And Genetic Indicators                     |
| **Cardiovascular Disease**    | Heart Health Score Using Blood Pressure, Cholesterol, And Activity Levels                |
| **Arthritis**                 | Joint Health Risk From Age, Weight, Physical Activity, And Family History                |
| **Heart & Stroke**            | Stroke Probability Based On Blood Pressure Trends And Lifestyle Markers                 |
| **Migraine**                  | Frequency And Severity Prediction Using Stress, Sleep, And Dietary Patterns              |
| **Bronchitis**                | Respiratory Risk Assessment From Smoking Status, Environment, And Medical History        |
| **Liver Condition**           | Liver Health Evaluation Based On Diet, Alcohol Intake, And Metabolic Indicators          |

## Features

| Feature                                  | The Business Problem It Solves                                                                                     |
| :--------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Early Risk Detection Across 8 Conditions** | Chronic Diseases Cost Healthcare Systems Billions In Late-Stage Treatment — This Catches Risks When Intervention Is Cheap And Outcomes Are Better |
| **Visual Health Dashboard**              | Patients Struggle To Understand Raw Medical Data — Interactive Charts Turn Complex Numbers Into Actionable Insights They Can Discuss With Their Doctor |
| **Verified Patient Profiles**            | Fraudulent Or Duplicate Accounts Erode Data Integrity — OTP-Verified Email And Phone Ensure Every Profile Is A Real Person |
| **Comprehensive Diabetes Analysis**      | Diabetes Affects 537 Million Adults Globally — A Dedicated 18-Field Analysis Module Addresses The Most Widespread Chronic Condition Head-On |
| **Secure Patient Data Handling**         | Healthcare Data Breaches Are Among The Costliest — JWT Sessions, Protected Routes, And No External Data Transmission Keep Patient Information Safe |
| **Device-Agnostic Access**               | 60% Of Health Searches Happen On Mobile — Responsive Layouts Ensure Patients Get The Same Quality Experience Whether They're On A Phone, Tablet, Or Desktop |
| **Content Managed Without Developers**   | Clinical Teams Need To Update Health Thresholds And Messaging Fast — A Centralized JSON File Means Zero Developer Dependency For Content Changes |
| **Reducing Unnecessary Clinic Visits**   | Not Every Concern Needs An Appointment — Patients Can Self-Screen At Home, Freeing Up Clinic Capacity For Those Who Truly Need It |
| **Physical Touchpoint When It Matters**  | Digital-Only Healthcare Loses Trust — Embedded Google Maps And Office Info Bridge The Gap Between Online Screening And In-Person Care |

## Dependencies

### Production

| Package                         | Version    | Purpose                                    |
| :------------------------------ | :--------- | :----------------------------------------- |
| `react`                         | `^18.3.1`  | UI Component Library                       |
| `react-dom`                     | `^18.3.1`  | DOM Rendering Engine                       |
| `react-router-dom`              | `^6.23.1`  | Client-Side Routing                        |
| `react-bootstrap`               | `^2.10.2`  | Bootstrap React Components                 |
| `bootstrap`                     | `^5.3.3`   | CSS Framework                              |
| `d3`                            | `^7.9.0`   | Data Visualization Library                 |
| `sweetalert2`                   | `^11.12.1` | Beautiful Alert Dialogs                    |
| `@fortawesome/react-fontawesome`| `^0.2.2`   | Icon Components                            |
| `@fortawesome/free-solid-svg-icons` | `^6.5.2` | Solid Icon Pack                          |
| `@fortawesome/free-brands-svg-icons` | `^6.6.0` | Brand Icon Pack                          |
| `@react-google-maps/api`        | `^2.20.3`  | Google Maps React Integration              |
| `@mui/material`                 | `^5.16.4`  | Material UI Components                     |
| `@emotion/react`                | `^11.12.0` | CSS-In-JS Engine                           |
| `@emotion/styled`               | `^11.12.0` | Styled Components For Emotion              |
| `jwt-decode`                    | `^4.0.0`   | JWT Token Decoder                          |
| `react-icons`                   | `^5.2.1`   | Icon Library                               |

### Development

| Package                         | Version    | Purpose                                    |
| :------------------------------ | :--------- | :----------------------------------------- |
| `react-scripts`                 | `5.0.1`    | Create React App Build Tools               |
| `@testing-library/react`        | `^13.4.0`  | React Component Testing                    |
| `@testing-library/jest-dom`     | `^5.17.0`  | Jest DOM Matchers                          |
| `@testing-library/user-event`   | `^13.5.0`  | User Event Simulation                      |
| `web-vitals`                    | `^2.1.4`   | Core Web Vitals Reporting                  |

## Getting Started

### Prerequisites

- **Node.js** 16+
- **npm** 8+

### Installation

Clone The Repository
```bash
git clone https://github.com/Arko-Sengupta/Alive-AI.git
```

Navigate To The Project
```bash
cd Alive-AI
```

Install Dependencies
```bash
npm install
```

### Development

```bash
npm start
```

Opens At `http://localhost:3000`

### Production Build

```bash
npm run build
```

### Testing

```bash
npm test
```

## Architecture

No Over-Engineering. No Unnecessary Abstractions. Just Clean Components Powered By Data — Because A Healthcare App Should Be As Reliable As The Predictions It Makes.

```
src/
├── Components/              Page And UI Components
│   ├── Home.js              Landing Page — First Impression Matters
│   ├── About.js             The Mission, The Services, The Team
│   ├── Contact.js           Reach Out — Forms, Maps, Office Info
│   ├── Dashboard.js         The Patient's Personal Health Hub
│   ├── Login.js             Secure Entry Point
│   ├── SignUp.js             Join The Platform — Verified And Safe
│   ├── Navbar.js            Responsive Navigation (Web + Mobile)
│   ├── Footer.js            Responsive Footer (Web + Mobile)
│   ├── Feature.js           8 Health Categories At A Glance
│   ├── MenuDashboard.js     Health Overview With D3 Visualizations
│   ├── MenuGeneralInfo.js   Patient Profile Management
│   ├── MenuDiabetes.js      Diabetes Prediction — 18 Health Inputs
│   ├── MenuChatbot.js       AI Health Assistant (Coming Soon)
│   ├── MenuAppointment.js   Doctor Appointments (Coming Soon)
│   ├── Animations/
│   │   └── SlideUp.js       Scroll-Triggered Reveal Animation
│   ├── Routes/
│   │   ├── AuthContext.js    JWT Auth State + Context Provider
│   │   └── PrivateRoute.js  Protected Route Wrapper
│   └── Utils/
│       ├── BarChart.js       D3 Bar Chart — Age Distribution
│       ├── LineChart.js      D3 Line Chart — Health Trends
│       ├── DonutChart.js     D3 Donut Chart — Risk Percentages
│       ├── ECGAnimation.js   The Heartbeat That Runs Through It All
│       ├── CustomButton.js   Reusable Styled Button
│       ├── ComingSoon.js     Patience — Good Things Are Coming
│       └── ComingSoon2.js    Alternative Coming Soon Page
├── StyleSheets/             One Stylesheet Per Page — No Conflicts
│   ├── Home.css             Home Page Sections
│   ├── About.css            About Page Styles
│   ├── Contact.css          Contact Page Styles
│   ├── Navbar.css           Navigation Styles
│   ├── Footer.css           Footer Styles
│   ├── Dashboard.css        Dashboard + Auth Forms
│   ├── DashboardMenu.css    Dashboard Content Modules
│   └── Animations.css       Scroll Animation Keyframes
├── Static/
│   └── StaticData.json      Every Label, Every Message — One File
├── Utils/
│   └── Images/              Organized By Page — Easy To Find
├── App.js                   Route Definitions + Layout Shell
└── index.js                 Where It All Begins
```

## Design System

### Color Palette

| Token                          | Value     | Usage                          |
| :----------------------------- | :-------- | :----------------------------- |
| Primary Cyan                   | `#1D9BCE` | Buttons, Links, Accents        |
| Light Cyan                     | `#3DD5F3` | Hover States, Highlights       |
| Dark Background                | `#212529` | Section Backgrounds             |
| Teal                           | `#176581` | Counter Sections               |
| Deep Teal                      | `#10a6c9` | Gradient Accents               |
| White                          | `#FFFFFF` | Primary Text On Dark           |
| Gray                           | `#889996` | Secondary Text                 |

### Typography

| Role     | Font               | Weight                          |
| :------- | :----------------- | :------------------------------ |
| Headings | Cinzel Decorative  | 400, 700, 900                   |
| Body     | Lora               | 100 — 700                       |
| UI       | Quicksand / Roboto | 300 — 700                       |

### Responsive Breakpoints

```
310px → 480px → 576px → 768px → 992px → 1200px → 1495px
```

Dedicated Web And Mobile Components For Navigation And Footer. Every Breakpoint Was Tested — Because A Patient Checking Their Results On A Phone At 2 AM Deserves The Same Experience As Someone On A Desktop.

## Pages

| Route              | Page             | What Patients Find There                                                |
| :----------------- | :--------------- | :---------------------------------------------------------------------- |
| `/`                | Home             | The Big Picture — What Alive AI Does And Why It Matters                 |
| `/about`           | About            | The Mission, The Medical AI Services, The Team Behind It                |
| `/contact`         | Contact          | Office Locations, Feedback Forms, Google Maps — When Digital Isn't Enough |
| `/features`        | Features         | All 8 Health Prediction Categories In One View                          |
| `/login`           | Login            | Secure Entry — Email, Password, Forgot Password With OTP               |
| `/signup`          | Sign Up          | Join In 60 Seconds — Validated, Verified, Protected                    |
| `/dashboard/*`     | Dashboard        | The Patient's Personal Health Command Center                           |

### Dashboard — Where Health Meets Clarity

| Sub-Route                          | Module            | What It Does For Patients                                         |
| :--------------------------------- | :---------------- | :---------------------------------------------------------------- |
| `/dashboard/menuDashboard`         | Health Overview   | See All 8 Health Scores At Once With Interactive Charts           |
| `/dashboard/general-info`          | My Profile        | Update Personal Info, Verify Contact Details, Manage Account      |
| `/dashboard/health-analysis/diabetes-analysis` | Diabetes Analysis | Input 18 Health Metrics, Get A Detailed AI Prediction Report |
| `/dashboard/chatbot`               | Health Assistant  | AI-Powered Chat For Health Questions (Coming Soon)                |
| `/dashboard/appointments`          | Appointments      | Book Time With A Specialist (Coming Soon)                         |

---

<div align="center">

**Built With React** · **Powered By AI** · **Made For The People Who Need It Most**

</div>
