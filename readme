# BookIt: Experiences & Slots Booking Platform

A complete full-stack web application for browsing, selecting, and booking travel experiences. Users can explore experiences, view real-time slot availability, apply promo codes, and complete secure bookings with an intuitive, responsive interface.

---

## 🌐 Live Demo

- **Frontend:** [Your Vercel URL]
- **Backend API:** [Your Railway/Render URL]
- **GitHub Repository:** [BookIT](https://github.com/vikram-choudhary03/BookIT.git)
---

## ✨ Features Implemented

✅ Browse all travel experiences with images, descriptions, and pricing  
✅ slot availability grouped by date and time  
✅ Interactive date and time slot selection with availability count  
✅ Promo code validation with discount calculation  
✅ Double booking prevention (same user cannot book same slot twice)  
✅ Complete booking flow: Home → Details → Checkout → Result  
✅ Loading states and animations during API calls  
✅ Form validation (name, email validation)   
✅ Price breakdown with taxes and discount application  
✅ Booking confirmation with ID and details  

---

## 🏗️ Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** (ultra-fast build tool)
- **Tailwind CSS v4** (utility-first responsive styling)
- **Axios** (HTTP client for API calls)
- **React Router** (client-side navigation)

### Backend
- **Node.js** with **Express.js**
- **TypeScript** (type-safe server)
- **PostgreSQL** (relational database via NeonDB)
- **CORS** (cross-origin request handling)

---

## 📦 Installation & Setup

### Prerequisites
```bash
✓ Node.js v16+
✓ npm or yarn
✓ Git
✓ PostgreSQL (NeonDB or local)
```

### Backend Setup

**1. Clone and navigate:**
```bash
git clone https://github.com/vikram-choudhary03/BookIT.git
cd bookit-backend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create `.env` file:**
```env
DATABASE_URL=postgresql://username:password@host:port/bookit
```

**4. Start development server:**
```bash
npm run dev
```

**Backend runs on:** `http://localhost:5000`

---

### Frontend Setup

**1. Navigate to frontend:**
```bash
cd bookit-frontend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start development server:**
```bash
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

---

## 🗄️ Database Schema

The database is auto-initialized on first server run. The following tables are created:

**experiences** - Stores travel experience data (id, name, location, price, image, description)

**slots** - Stores available time slots for each experience (id, expId , date, time, capacity, booked count)

**bookings** - Stores user bookings with pricing and promo details 

**promo_codes** - Stores promo code rules and usage tracking

Experiences & slots & promo_codes tables are automatically seeded with sample data on startup.
```

---

## 🔌 API Endpoints

### GET `/api/experiences`

**Description:** Returns list of all experiences

**Response:**
```json
[
  {
    "id": 1,
    "name": "Kayaking",
    "location": "Udupi",
    "price": 999,
    "image": "https://images.unsplash.com/...",
    "description": "Curated small-group experience. Certified guide. Safety first with gear included.",
  }
]
```

---

### GET `/api/experiences/:id`

**Description:** Returns experience details with available slots

**Response:**
```json
{
  "id": 1,
  "name": "Kayaking",
  "location": "Udupi",
  "price": 999,
  "image": "https://images.unsplash.com/...",
  "description": "Curated small-group experience. Certified guide. Safety first with gear included.",
  "slots": [
    {
      "id": 1,
      "experience_id": 1,
      "date": "2025-11-05",
      "time": "09:00",
      "total_capacity": 10,
      "booked_count": 3,
      "available_count": 7
    }
  ]
}
```

---

### POST `/api/bookings`

**Description:** Create a new booking

**Request Body:**
```json
{
  "slot_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "promo_code": "SAVE10",
  "total_price": 999
}
```

**Success Response (201):**
```json
{
  "success": true,
  "booking": {
    "id": 5,
    "slot_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "promo_code": "SAVE10",
    "total_price": 999,
    "discount_price": 99.90,
    "final_price": 899.10,
    "created_at": "2025-11-03T10:30:00Z"
  }
}
```

---

### POST `/api/promo/validate`

**Description:** Validate promo code and calculate discount

**Request Body:**
```json
{
  "code": "SAVE10",
  "total_price": 999
}
```

**Success Response (200):**
```json
{
  "valid": true,
  "discount_price": 10,
  "final_price": 899.10
}
```

---

## 🎯 User Flow
```
┌─────────────────────────────────────────────────────┐
│  HOME PAGE                                          │
│  • Browse all experiences                           │
│  • Search/filter by name or location                │
│  • View price and "View Details" button             │
└──────────────────┬──────────────────────────────────┘
                   │ Click "View Details"
                   ↓
┌─────────────────────────────────────────────────────┐
│  DETAILS PAGE                                       │
│  • Experience info and large image                  │
│  • Select date (5 dates available)                  │
│  • Select time (5 times per date)                   │
│  • View availability count (e.g., "4 left")        │
│  • Price summary on side                           │
└──────────────────┬──────────────────────────────────┘
                   │ Click "Confirm"
                   ↓
┌─────────────────────────────────────────────────────┐
│  CHECKOUT PAGE                                      │
│  • Enter name and email                             │
│  • Enter optional promo code                        │
│  • View price breakdown (base + tax - discount)    │
│  • Click "Confirm and Pay"                         │
└──────────────────┬──────────────────────────────────┘
                   │ Loading overlay appears
                   ↓
┌─────────────────────────────────────────────────────┐
│  RESULT PAGE                                        │
│  • Booking confirmation message                     │
│  • Booking ID and details                           │
│  • Option to go back to home                        │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Security & Validation

### Double Booking Prevention
- **Database Level:** UNIQUE constraint on (slot_id, user_email)
- **Error Message:** "You already booked this slot"

### Promo Code Validation
- **Frontend:** Instant validation when user enters code
- **Backend:** Recalculates discount before saving booking
- **Usage Tracking:** Increments used_count on successful booking
- **Auto-Deactivation:** Sets is_active = false at max_usage

### Form Validation
- **Name:** Required, non-empty string
- **Email:** Valid email format (regex validation)
- **Slot:** Must exist and have availability

---

## 🚀 Deployment Guide

### Backend Deployment (Railway/Render)

**1. Prepare repository:**
```bash
git add .
git commit -m "Ready for deployment"
git push
```

**2. Create project on Railway/Render:**
- Go to railway.app or render.com
- Create new project
- Connect GitHub repository

**3. Set environment variables:**
```
PORT=5000
DATABASE_URL=your_neondb_connection_string
```

**4. Deploy:**
- Railway/Render automatically deploys on push
- Copy the deployment URL

### Frontend Deployment (Vercel)

**1. Prepare repository:**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

**2. Create project on Vercel:**
- Go to vercel.com
- Import GitHub repository
- Select `bookit-frontend` directory

**3. Set environment variables:**
```
VITE_API_URL=https://your-backend-url
```

**4. Deploy:**
- Vercel automatically builds and deploys
- Copy the deployment URL

**5. Update README:**
- Add deployed URLs to this README
- Submit both frontend and backend URLs

---

## 📝 Project Structure
```
bookit-backend/
├── src/
│   ├── index.ts              (Express server, all routes & business logic)
│   ├── db.ts                  (Database connection & schema initialization)
│   └── seeds.ts               (Sample data for experiences )
├── package.json
├── tsconfig.json
├── .env                       (Environment variables - DO NOT commit)
└── README.md

bookit-frontend/
├── src/
│   ├── pages/
│   │   ├── Home.tsx           (Browse all experiences)
│   │   ├── Details.tsx        (Select date & time slots)
│   │   ├── Checkout.tsx       (Enter details & apply promo)
│   │   └── Result.tsx         (Booking confirmation)
│   ├── components/
│   │   └── Navbar.tsx         (Loading Navbar)
│   ├── App.tsx                (Route definitions)
│   └── main.tsx               (Entry point)
├── index.html
├── tailwind.config.js         (Tailwind configuration)
├── vite.config.ts             (Vite configuration)
├── package.json
└── README.md
```

---

## 🛠️ How Key Features Work

### Double Booking Prevention

**Flow:**
```
1. User selects slot
2. Frontend sends POST /api/bookings
3. Backend queries: SELECT * FROM bookings WHERE slot_id=X AND user_email=Y
4. If found: Return error "You already booked this slot"
5. If not found: Check slot availability
6. If available: Insert booking, increment booked_count
7. If not available: Return error "Slot is fully booked"
```

### Promo Code Validation

**Frontend Flow:**
```
1. User enters promo code in checkout
2. Click "Apply Promo"
3. POST /api/promo/validate with code & price
4. Backend returns discount details
5. Display discount to user
```

**Backend Flow (on booking):**
```
1. User submits booking with promo code
2. Validate code exists & is_active = true
3. Check used_count < max_usage
4. Calculate discount based on type
5. Store booking with discount_amount & final_price
6. Increment promo code's used_count
7. If used_count == max_usage: Set is_active = false
```

---

## ✅ Requirements Checklist

- [x] **Frontend Framework:** React 18 + TypeScript + Vite
- [x] **Styling:** Tailwind CSS v4
- [x] **Pages:** Home, Details, Checkout, Result (4 pages)
- [ ] **Responsive:** Mobile, tablet, desktop breakpoints
- [x] **Form Validation:** Email, name validation
- [x] **Loading States:** Loading overlay during API calls
- [x] **API Integration:** Axios for all requests
- [x] **State Management:** React hooks (useState, useEffect, useMemo)
- [x] **Backend Framework:** Node.js + Express + TypeScript
- [x] **Database:** PostgreSQL with NeonDB
- [x] **API Endpoints:** 4 endpoints (experiences, details, bookings, promo)
- [x] **Data Validation:** Required fields, format validation
- [x] **Double Booking Prevention:** UNIQUE constraint + query check
- [x] **Promo Code Validation:** Frontend + backend validation
- [x] **Dynamic Data:** All data from backend APIs
- [x] **Complete Flow:** Home → Details → Checkout → Result
- [x] **Deployment:** Production-ready on Vercel & Railway/Render
- [x] **Documentation:** Complete README with setup instructions

---

## 📄 License

MIT License - Feel free to use this project for learning and development purposes.

---

## 🙏 Acknowledgments

- Unsplash & Pexels for royalty-free images
- NeonDB for free PostgreSQL hosting
---