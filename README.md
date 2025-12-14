# MiniGram

A modern social media application built with Next.js 16.

## Features

- **Feed**: View posts from users you follow.
- **Create Post**: Upload photos from your computer or use image URLs.
- **Profile**: Manage your profile and view your posts.
- **Dark Mode**: Fully supported dark theme.
- **Interactions**: Like and comment on posts.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v18 or higher) installed.
- MongoDB installed and running locally (or use MongoDB Atlas).

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd assignment
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    - Create a file named `.env.local` in the root directory.
    - Add the following lines:
      ```env
      MONGODB_URI=mongodb://localhost:27017/mini-instagram
      JWT_SECRET=your-secret-key-here
      ```
    - Replace `mongodb://localhost:27017/mini-instagram` with your connection string if different.

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the app**:
    - Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1.  **Sign Up**: Create a new account.
2.  **Create Post**: Click the "+" icon to upload a photo.
3.  **Explore**: Follow users (suggestions appear if your feed is empty) and interact with posts.
4.  **Theme**: Toggle between Light and Dark mode using the icon in the navigation bar.
