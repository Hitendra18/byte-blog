# ByteBlog - Full Stack Blog Application

## Introduction

Welcome to ByteBlog! This web application enables you to effortlessly create and share blogs with others. On the homepage, you will find a collection of blogs, and you can use the search input to find specific ones. To get started, create a new account using your email, or log in if you already have an account. Once logged in, you can set your profile picture and edit your information from the profile page. If you are an admin, you will have access to the admin dashboard. From the admin dashboard, you can create new blogs, manage users, create new categories, approve, unapprove, or delete comments, and much more.

## Try it yourself
Live website: https://byte-blog.onrender.com/

Admin User: 
- Email: `batman@email.com`
- Password: `123456`

Normal User:
- Email: `roronoa@email.com`
- Password: `123456`

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, Redux, Tanstack Query, axios, react-router-dom, Tiptap Editor, react-hook-form, react-easy-crop, react-hot-toast
- **Backend**: Express.js, MongoDB, mongoose, multer, bcryptjs, jsonwebtoken

## Features

- Responsive and visually appealing design.
- Blog search functionality.
- Update profile picture and account details.
- Protected admin panel (accessible to admins only).
- Ability to create dynamic custom blogs.
- Comment section for discussions about blogs.
- Edit functionality for previously created blogs.
- User management within the admin dashboard.
- Post management options within the admin dashboard.
- Comment approval and review features within the admin dashboard.
- Create new categories and attach to blogs.

## How to run it locally on your machine

1. Clone this repository
2. Navigate to backend directory using `cd backend`
3. Now install dependencies: `npm install`
4. Rename `.env.example` to `.env`
5. Fill in the required environment variables in `.env`:
   - `MONGO_URI`: Your MongoDB connection URI
   - `JWT_SECRET`: your `jsonwebtoken` custom key
   - `NODE_ENV`: `development`
   - `PORT`: `5000`
6. Now start the server: `npm run dev`
7. Open new terminal window and navigate to frontend directory using `cd frontend`
8. Install dependencies: `npm install`
9. Rename `.env.example` to `.env
10. Fill in the required environment variables in `.env`:
    -  `REACT_APP_BACKEND_BASE_URL`: Your backend url
    -  `REACT_APP_UPLOAD_FOLDER_BASE_URL`: URL to upload folder of your backend
11.  Start the frontend: `npm start`
12.  Now you should be able to use it 😊

### Thank you❤️
