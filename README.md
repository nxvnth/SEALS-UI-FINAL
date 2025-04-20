# SEALS Video Analysis Platform

A Next.js application that connects to a Flask backend for analyzing educational videos. The platform allows users to search for videos, calculate educational scores, and manage user accounts with Google authentication.

## Features

- **Google Authentication**: Secure login with Google OAuth
- **Video Search**: Search for educational videos on various topics
- **Educational Scoring**: Analyze videos for educational value using ML models
- **Score Caching**: Store calculated scores to avoid redundant processing
- **User Management**: Admin dashboard to monitor users and activity

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google provider
- **Database**: MongoDB for score caching and user data
- **Backend**: Flask API with ML models for video analysis

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Google OAuth credentials

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd video-analysis-app
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   MONGODB_URI=mongodb+srv://username:password@seals-textbooks.1c85t.mongodb.net/TextbooksDatabase
   FLASK_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Setting Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID
5. Add authorized JavaScript origins: `http://localhost:3000`
6. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

## Usage

### Video Search and Analysis

1. Enter a search term in the search bar on the home page
2. Browse through the video results
3. Click on a video to calculate its educational score
4. The score will appear in a small box in the top-right corner of the video card
5. Scores are cached, so subsequent searches for the same video will display the score instantly

### User Management

1. Sign in with Google authentication
2. Navigate to the Dashboard page from the navigation bar
3. View statistics on active users and total registered accounts
4. Browse the user table to see all registered users

## Project Structure

```
video-analysis-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   ├── auth/
│   │   │   └── signin/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── video/
│   │   ├── dashboard/
│   │   ├── lib/
│   │   ├── models/
│   │   ├── search/
│   │   └── services/
│   ├── globals.css
│   └── layout.tsx
├── public/
├── .env.local
└── package.json
```

## Connecting to the Flask Backend

The frontend connects to the Flask backend API for video analysis. The backend processes YouTube videos and calculates educational scores based on various factors including:

- Content similarity with textbooks
- Sentiment analysis of comments
- Title-transcript relevance
- Engagement metrics (likes, views)

The frontend caches these scores in MongoDB to avoid recalculating them for previously analyzed videos.

## Monitoring Users

The dashboard provides two key metrics for user monitoring:

1. **Active Users**: Shows the number of users currently using the platform
2. **Total Users**: Displays the total number of registered accounts

The user table in the dashboard shows detailed information about each registered user, including:
- User ID
- Email address
- Name
- Account creation date

## Production Deployment

Before deploying to production:

1. Update the `.env.local` file with production values
2. Update Google OAuth credentials with production URLs
3. Build the application:
   ```bash
   npm run build
   ```
4. Deploy the built application to your hosting provider

## License

This project is licensed under the MIT License.
