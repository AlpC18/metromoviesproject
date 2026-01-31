# MetroMoviesProject

🎬 Metro Movies - Next Gen Streaming Platform
Metro Movies is a premium movie and TV show streaming platform built with modern web technologies, inspired by top-tier streaming services like Netflix. It delivers a seamless user experience with a dynamic interface, a powerful admin dashboard, and interactive video previews.
🚀 About the Project
This project encompasses both the user-facing interface (Frontend) and the content management system (Admin Dashboard). Users can explore content through an aesthetic and fluid interface, create personalized watchlists, and enjoy uninterrupted video playback.
✨ Key Features
🎥 Advanced User Interface (Frontend)
* Dynamic Hero Slider: Features auto-playing background videos with smart mute/unmute controls and smooth audio transitions between slides.
* Smart Video Preview (Hover Preview): Interactive cards that expand on hover (Netflix-style) to play a designated preview clip automatically.
* Detailed Content Pages: Dynamic information sections tailored for Movies and TV Series (Season & Episode listings).
* My List & Favorites: Functions to "Add to My List" and "Like" content, creating a personalized library.
* Profile Switcher: A sophisticated "Who's Watching" screen simulating multi-user profile support.
* Responsive Design: Fully responsive layout optimized for Mobile, Tablet, and Desktop devices.
🛠️ Powerful Management Dashboard (Admin Panel)
* Content Management (CRUD): Easily add, edit, and delete Movies and TV Shows.
* Rich Metadata Entry: Manage cast details, genres, age ratings, quality (4K/HD), IMDB scores, and mood tags.
* Episode Management System: Dynamically add seasons and episodes for TV series (Season #, Episode #, Title, Link).
* Dual Video Support: Define separate YouTube links for the Main Video and the Hover Preview clip.
* Dark Mode UI: A professional dark-themed interface for comfortable administration.
💻 Tech Stack
* Frontend: HTML5, CSS3 (Modern Flexbox/Grid, Animations), JavaScript (ES6+ Vanilla).
* Backend: PHP (API-based architecture).
* Database/Services: MySQL / Supabase integration.
* Media: YouTube Iframe API (Custom player controls via postMessage integration).


📂 Project Structure & Pages (13 Core Modules)
This project consists of 13 fully functional pages, covering the entire user journey from authentication and profile selection to streaming and content management.

🔐 Authentication & Security
1. Landing Page (
index.html
): The introductory page welcoming new users with "Unlimited Movies, TV Shows, and More".
2. Login Page (LoginForm): Secure user login form with input validation and error handling.
3. Sign Up Page (SignupForm): Registration page integrated with Google reCAPTCHA to prevent bot attacks.
4. Password Reset / Forgot Password: (If available or integrated into Login/Signup flows).
👤 User Profile Management
5. Who's Watching (WhosWatching): Iconic profile selection screen where multiple users can choose their avatars.
6. Manage Profiles (ManageProfile): Interface for editing profile names, avatars, and settings.
🎬 Main Streaming Interface
7. Home / Dashboard (Interface MainPage): The core of the application. Features the dynamic Hero Slider, multiple content rows (Netflix-style horizontal scroll), and hover video previews.
8. Content Player: Custom video player modal overlay for streaming content directly on the page.
📂 Content Discovery
9. TV Shows Page (TVShows): Dedicated section filtering only TV Series content.
10. Movies Page (
Movies
): Dedicated section filtering only Movie content.
11. Latest / New & Popular (Latest): Page displaying the most recently added content.
12. My List (
MyList
): Personalized library where users save their favorite content to watch later.
13. More Info (MoreInfo): Detailed view for specific titles, showing extended metadata, cast info, and episode lists.
🛠️ Administration
Admin Dashboard (AdminPanel): A comprehensive CMS (Content Management System) to:
Add/Edit/Delete Movies & TV Shows.
Manage detailed metadata (Cast, Year, Quality, IMDB).
Upload Poster Images & Video Links.
Manage Seasons & Episodes for TV Series.
