# Environment Setup

## Backend API Integration

To connect this e-commerce frontend to your backend API, create a `.env` file in the root directory:

### Step 1: Create `.env` file
Create a file named `.env` in the root of your project (C:\Users\user\Downloads\E-commerce\.env)

### Step 2: Add the following configuration:

```env
# Backend API Configuration
# Replace this with your actual backend API URL
VITE_API_BASE_URL=http://localhost:5000/api

# Optional: Add authentication token if needed
# VITE_API_TOKEN=your_token_here
```

### Step 3: Update the API URL
Replace `http://localhost:5000/api` with your actual backend API URL. Examples:
- Local development: `http://localhost:5000/api`
- Production: `https://api.yourwebsite.com/api`
- Custom port: `http://localhost:3000/api`

### Step 4: Restart the development server
After creating the `.env` file, restart your development server:
```bash
npm run dev
```

## Important Notes:
- `.env` file is gitignored by default and won't be committed to version control
- Never commit sensitive information like API tokens or keys
- Each developer should have their own `.env` file with their local configuration


