# Campus Event and Club Management System 🎓📱
**Devi Ahilya Vishwavidyalaya (DAVV) • School of Computer Science & Information Technology (SCSIT)**

A modern, cloud-architected Android mobile application built with **React Native**, **Expo SDK 58**, **TypeScript**, **Expo Router**, and persistent storage.

---

## 🎨 Visual Identity & Color Palette

Designed specifically with a modern campus look:
* **Deep Navy (`#10152B`):** Brand authority, top header, status cards, and badges.
* **Teal (`#18C6B5`):** Primary action buttons, progress bars, active tabs, and digital pass highlights.
* **Lavender (`#A99BFF`):** Secondary accents, society tags, and role badges.
* **Light Background (`#F4F6FA`):** Clean mobile surface for readability under all lighting conditions.
* **White (`#FFFFFF`):** High-contrast cards with subtle borders (`#E5E9F2`).

---

## 🚀 Key Functional Modules

### 1. Student Portal 🎓
* **Campus Event Feed:** Browse upcoming fests, workshops, and hackathons with search and category filters (`Tech`, `Cultural`, `Sports`, `Workshop`, `Academic`).
* **1-Tap RSVP & Digital Ticket:** Instant seat reservation with capacity tracking, duplicate registration prevention, and generation of a unique digital ticket code (`TECH-2026-XXXX`).
* **Digital Event Pass Modal:** Official admission pass containing barcode, attendee details, ticket verification, and option to cancel registration.
* **Club Directory:** Discover student clubs (`Google DSC`, `Robotics & AI`, `Cultural Society`, `Athletics`), view president contacts, meeting schedules, and 1-tap join/leave.
* **My Hub:** Centralized dashboard tracking active event passes and joined club memberships.
* **Announcements & Notifications:** Real-time campus broadcasts with priority flags (`Urgent Alert`, `Important Notice`, `General Info`).
* **Student Profile:** Digital student identity card with roll number, department, and live stats.

### 2. Club Administrator Portal ⚡
* **Club Dashboard:** Dedicated view for Club Presidents (e.g. *Robotics & AI Club*) with live KPI counters (Total Events, Total RSVPs, Member count).
* **Create & Publish Event:** Comprehensive event creation form (title, category, date, time, venue location, seat capacity, banner accent color).
* **Live Attendee Roster:** Real-time attendee list showing registered students' names, roll numbers, departments, and ticket codes.
* **Edit & Cancel Events:** In-place event updates and cancellation alerts.
* **Campus Broadcast Notice:** Publish announcements to students.

### 3. System Administrator Portal 🛡️
* **Platform Analytics:** Real-time metrics overview (Total Accounts, Enrolled Students, Club Admins, Active Clubs, Issued Event Passes, Occupancy Rate).
* **Manage Users Directory:** Searchable campus roster with ability to **Suspend** or **Activate** student and administrator accounts.
* **Supervise Clubs:** Club status directory with president information and meeting schedules.
* **Global Event Enforcement:** Oversight across all campus societies with authority to cancel non-compliant events.

### 4. Demo Role Switcher ⚡
* A persistent top bar enables **one-tap switching** between **Student**, **Club Admin**, and **System Admin** during presentations and evaluations.

---

## ☁️ Cloud Computing Architecture

```
+---------------------------------------------------------------------------------+
|                               MOBILE CLIENT TIER                                |
|  React Native · Expo SDK 58 · TypeScript · Expo Router · Safe Area Management   |
+---------------------------------------------------------------------------------+
                                         |
                                         | REST / HTTPS API (Prepared)
                                         v
+---------------------------------------------------------------------------------+
|                             DATA SERVICE LAYER                                  |
|            dataService.ts (Abstraction layer for CRUD & Business Logic)         |
+---------------------------------------------------------------------------------+
                     |                                         |
                     | Current Working State                   | Future Cloud Scale
                     v                                         v
+-----------------------------------------+   +-----------------------------------+
|      LOCAL STORAGE PERSISTENCE          |   |      CLOUD DATABASE (DBaaS)       |
|  AsyncStorage Keys:                     |   |  MongoDB Atlas / Node.js API      |
|  • @campus_app_users_v1                 |   |  • Auto-scaling NoSQL collections |
|  • @campus_app_events_v1                |   |  • JWT Authentication             |
|  • @campus_app_clubs_v1                 |   |  • Real-time WebSocket Push       |
|  • @campus_app_registrations_v1         |   |  • AWS / GCP multi-region cluster |
|  • @campus_app_announcements_v1         |   |                                   |
+-----------------------------------------+   +-----------------------------------+
```

### Architecture Explanations for Evaluation:
1. **Decoupled Data Service:** All components query `dataService.ts` rather than raw storage. Replacing local `AsyncStorage` with cloud REST endpoints (e.g. Express or Cloud Functions) requires updating only this single file, keeping all UI screens untouched.
2. **Persistent Storage:** Data survives app restarts, device reboots, and role toggling.
3. **Role-Based Access Control (RBAC):** Permissions are strictly verified before administrative actions (create event, publish notice, suspend user).
4. **Honest Cloud Architecture Disclosure:** The client app is fully connected to local persistent `AsyncStorage` with an enterprise-ready cloud schema ready to connect to MongoDB Atlas upon backend deployment.

---

## 📲 How to Run on Android Phone (Expo Go)

### Prerequisites:
* Android phone connected to the same Wi-Fi network as your computer (or USB debugging).
* **Expo Go** app installed from Google Play Store.

### Steps:
1. Open terminal in the project directory:
   ```bash
   cd C:\Users\nikita\campus-event-app
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. A QR code will appear in your terminal.
4. Open the **Expo Go** app on your Android phone.
5. Tap **Scan QR code** and point your camera at the terminal QR code.
6. The app will bundle and open natively on your Android device!

*Tip: Press `a` in the terminal to launch on an Android emulator, or `w` to run on web browser.*

---

## 👨‍🏫 5-Minute Professor Demonstration Sequence

1. **Role 1: Student Walkthrough (1.5 min)**
   * Open the app (defaults to Student: *Nikita Negi - SCSIT DAVV*).
   * Notice the Deep Navy & Teal theme, category pills, and upcoming campus events.
   * Tap on **CloudCon 2026** → Click **Register for Event** → Click **Confirm Registration**.
   * Show the generated **Digital Event Pass** with barcode and unique ticket code (`TECH-2026-XXXX`).
   * Switch to **My Passes** tab to show the confirmed pass.
   * Switch to **Clubs** tab → Tap **Cultural & Music Society** → Click **Join This Club**.

2. **Role 2: Club Administrator Walkthrough (1.5 min)**
   * In the top demo bar, tap **Club Admin** (*Priya Sharma - Robotics & AI Club*).
   * Show the Club President dashboard with live counters.
   * Tap **Create New Event** → Fill Title: *"Autonomous Drone Derby"*, Venue: *"Sports Arena"*, Capacity: *120* → Click **Publish**.
   * Tap **Attendee Roster** on *RoboWars* to display the live list of registered students with roll numbers.
   * Tap **Broadcast Notice** and publish an urgent room change notice.

3. **Role 3: System Administrator Walkthrough (1 min)**
   * In the top demo bar, tap **System Admin** (*Dr. Arthur Vance*).
   * Showcase the **Platform KPI Analytics** (Total Accounts, Enrolled Students, Registered Passes).
   * Tap **Manage Users & Roles** → Locate a user and demonstrate the **Suspend / Activate** toggle.
   * Tap **Supervise Clubs** to inspect and edit club leadership details.

4. **Verify Persistence (1 min)**
   * Reload the application or restart Expo.
   * Show that all registered tickets, joined clubs, and newly published events remain saved in persistent storage!
