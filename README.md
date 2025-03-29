# LinkedIn Profile to Website Generator

A cutting-edge platform that transforms LinkedIn profiles into dynamic, AI-powered personal websites with seamless customization and professional presentation.

## Features

- **AI-Enhanced Content**: Convert your LinkedIn profile into impressive website content with customizable tone and style
- **LinkedIn Data Integration**: Import your professional data directly from your LinkedIn profile URL
- **Customizable Enhancement Options**: Choose your preferred tone, focus, and content length
- **Responsive Design**: Professionally designed website templates that look great on all devices
- **Modern React Frontend**: Built with the latest React technologies

## Tech Stack

- **Frontend**: React with Tailwind CSS, shadcn/ui components
- **Backend**: Node.js with Express
- **AI Integration**: OpenAI API (GPT-4o)
- **Storage**: MongoDB with in-memory fallback
- **Type Safety**: TypeScript throughout the codebase

## Getting Started

### Prerequisites

- Node.js 20+ installed
- OpenAI API key

### Installation

1. Clone this repository
   ```
   git clone https://github.com/yourusername/linkedin-website-generator.git
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   USE_MONGODB=false  # Set to true if you have MongoDB available
   # MONGODB_URI=mongodb://localhost:27017/linkedin-website-generator  # Uncomment if using MongoDB
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Usage

1. Navigate to the application in your browser
2. Join the waitlist or login
3. Enter your LinkedIn profile URL 
4. Customize enhancement settings (tone, focus, length)
5. Generate your enhanced profile
6. Select a website template
7. Customize and publish your personal website

## Project Structure

- `/client` - React frontend
- `/server` - Express backend
- `/shared` - Shared TypeScript types and utilities
- `/server/services` - Business logic services
- `/server/db` - Database models and configuration

## Roadmap

- Additional website templates
- Custom domain support
- Portfolio showcasing
- Advanced analytics