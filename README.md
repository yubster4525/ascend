# Guide to Life - Personal Development Platform

A comprehensive MERN stack application for tracking every aspect of your personal development journey.

## Features

- **Dashboard**: Get an overview of your progress across all aspects of your life
- **Habit Tracker**: Track daily habits with comprehensive insights and streak monitoring
- **Body Metrics Tracker**: Log and visualize physical metrics like weight, body fat, and muscle mass
- **Journal**: Record your thoughts with mood tracking and guided prompts
- **Goals & Achievements**: Set goals with milestone tracking and category organization

## Setup Instructions

### Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
guide_to_life/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Module Details

### Dashboard
- Consolidated view of all life metrics
- Progress indicators for habits, body metrics, and goals
- Daily focus items
- Weekly insights based on trends

### Habit Tracker
- Daily habit tracking with customizable schedules
- Streak counting and visualization
- Performance insights
- Filter by frequency and category

### Body Metrics
- Track weight, body fat, muscle mass, and more
- Calculate BMI and ideal weight ranges
- Historical data visualization
- Progress insights and recommendations

### Journal
- Daily journaling with mood tracking
- Searchable entries with tags
- Random writing prompts for inspiration
- Journal insights and trends

### Goals & Achievements
- Goal setting with deadline tracking
- Milestone creation for each goal
- Progress visualization
- Category-based organization

## Future Enhancements

1. User authentication and profiles
2. Data visualization with charts and graphs
3. Mobile app version with offline support
4. Social sharing and accountability features
5. Expanded modules (nutrition, finance, learning, etc.)
6. AI-powered insights and recommendations
7. Email/notification reminders