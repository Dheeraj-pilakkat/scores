# 🏆 Union of Malabar CET Scoreboard 2K25-26

A high-performance, real-time scoreboard application built for the Union of Malabar CET 2K25-26. This project features a competitive, engaging public display and a robust mobile-friendly admin panel for managing events and scores.

![Scoreboard Preview](https://placehold.co/1200x600/050505/ffffff?text=Competitive+Scoreboard+UI)

## ✨ Features

### 🖥️ Public Scoreboard
- **Real-Time Updates**: Auto-refreshes every 10 seconds to show the latest scores without reloading.
- **Cinematic Experience**: 
  - Custom "Orbitron" typography for a futuristic sports feel.
  - Engaging "filling text" loading animation with a minimum 10s intro sequence.
  - Glassmorphic UI elements and neon glow effects.
  - Seamless fade-out transitions.
- **Interactive 404 Page**: Includes a fully playable "Dino-style" runner game with score tracking for lost users.
- **Responsive Design**: Optimized for 4K displays, desktops, and mobile devices.

### 🛠️ Admin Panel (`/master`)
- **Secure Authentication**: Protected routes using NextAuth.js.
- **Mobile-First Design**: 
  - Collapsible sidebar navigation for mobile admins.
  - Touch-friendly tables and forms.
- **Event Management**: CRUD operations for events (Sports, Arts, Games).
- **Group Management**: Manage group details and colors.
- **Auto-Calculation**: One-click recalculation of total scores and standings based on event results.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Google Fonts](https://fonts.google.com/) (Orbitron, Inter)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/scoreboard.git
cd scoreboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/scoreboard

# Authentication (Generate a random string for production)
NEXTAUTH_SECRET=your-secure-random-secret
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials (for initial seeding)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=securepassword
```

### 4. Seed the Database
Initialize the database with default groups and an admin user:
```bash
curl http://localhost:3000/api/seed
```
*Note: You can also visit `/api/seed` in your browser.*

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the scoreboard.
Access the admin panel at [http://localhost:3000/master/login](http://localhost:3000/master/login).

## 📱 Pages Structure

| Path | Description | Access |
|------|-------------|--------|
| `/` | Public Scoreboard & Standings | Public |
| `/master/login` | Admin Login Page | Public |
| `/master` | Admin Dashboard (Overview & Stats) | Private |
| `/master/events` | Event Management | Private |
| `/master/groups` | Group Management | Private |

## 🚀 Deployment

### Deploy on Vercel
1. Push your code to a Git repository.
2. Import the project into Vercel.
3. Add the **Environment Variables** in Vercel settings (`MONGODB_URI`, `NEXTAUTH_SECRET`, etc.).
   - *Tip: Ensure your MongoDB Atlas IP Access List includes `0.0.0.0/0`.*
4. Deploy!

## 🎮 404 Game Controls
- **Desktop**: Press `Space` to jump.
- **Mobile**: Tap the screen to jump.
- *Avoid the blue obstacles!*

---
Build with  ❤️ for Union of Malabar CET 2K25-26 by Dheeraj p
