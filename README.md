# Navexa - Fleet Precision Mobile Web App

A high-fidelity, premium mobile web application optimized for all Android and mobile viewports. Navexa is engineered for luxury enterprise logistics and fleet tracking. It features an interactive, pixel-perfect replication of both the **Login** and **Dashboard** design specifications under the "Fleet Precision" design system.

---

## 🚀 Key Features

* **High-Fidelity Visual Design:** Matches both design sheets precisely. Uses Google Fonts **Inter** typography, custom shadow vectors (Material 3 ambient depth), fluid 8px grid ratios, and **Material Symbols Rounded** system icons.
* **Android-Optimized Responsiveness:** Works beautifully across all dimensions of mobile and tablet screens (e.g. 6.7-inch vertical devices). On wider desktop screens, it automatically renders a gorgeous central phone emulator container, making it a dream to demo and test.
* **Supabase Authentication & Backend:**
  - **Live Mode:** Connects to your live Supabase database for authentication (Sign In with password, Request OTP) and syncs data to database tables (`bookings`, `vehicles`).
  - **Premium Demo Mode:** Works instantly out of the box in offline demo mode if no Supabase keys are wired, utilizing local session caching and reactive memory storage.
  - **Secret Developer Setup:** Simply **click the "NX" logo badge** in the header of the Login screen to open a prompt where you can instantly link or clear your live Supabase credentials (`URL` & `Anon Key`) without touching any code files!
* **Zero-Build Architecture:** Made with pure static HTML5, Vanilla CSS3, and modern JavaScript (ES Modules). Loads in milliseconds with zero dependencies and no complex build configurations.
* **Ready-to-Deploy on Vercel:** Includes pre-written configuration schemas (`vercel.json`, `.gitignore`) for immediate continuous integration and deployment.

---

## 📁 Project Structure

```text
Navexa/
├── index.html          # Core single-page application structure & modals
├── style.css           # Premium design tokens, layout cards, bottom navigation, animations
├── app.js              # State engine, Supabase API client, and DOM interaction hooks
├── vercel.json         # Vercel deployment route settings and security headers
└── .gitignore          # Repository configuration file
```

---

## 🛠️ How to Test Locally

Since this app uses modern ES Modules, you can run it using any simple local server.

### Option A: Python Local Server (Recommended)
Open your terminal in this directory and execute:
```bash
python3 -m http.server 8000
```
Then open your browser and navigate to: `http://localhost:8000`

### Option B: Node Static Server (If installed)
```bash
npx serve .
```

---

## ☁️ Supabase Table Setup (For Live Mode)

When you decide to wire your live Supabase database, create the following two tables in your Supabase SQL Editor:

```sql
-- 1. Bookings Table
create table bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_name text not null,
  pickup_location text not null,
  dropoff_location text not null,
  vehicle_assigned text,
  status text default 'pending' -- 'done', 'live', 'wait'
);

-- 2. Vehicles Table
create table vehicles (
  id uuid default gen_random_uuid() primary key,
  model_name text not null,
  registration_number text not null,
  status text default 'available' -- 'available', 'ontrip', 'service'
);
```

---

## 📦 Deployment to Vercel via GitHub

1. Create a new repository on your GitHub account.
2. Initialize and push this folder to your repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit Navexa high-fidelity application"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
3. Connect your GitHub repository to **Vercel** (`https://vercel.com`).
4. Import the project. Vercel will automatically discover the static layout and deploy it instantly!
