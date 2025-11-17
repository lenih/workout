# Workout Tracker

Interactive workout tracker with calendar, weights logging, and Supabase integration.

## Features

- Calendar view with marked workout days
- Weight tracking
- Supabase database integration
- Authentication support
- Responsive design

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js / Express
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth

## Getting Started

### Prerequisites

- Node.js installed
- Supabase account
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/lenih/workout.git
cd workout
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with your Supabase credentials

4. Run the development server
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

```
workout/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── calendar.js
│   └── main.js
├── config/
│   └── supabase-init.js
└── README.md
```

## License

MIT
