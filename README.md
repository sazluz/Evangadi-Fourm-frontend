🚀 Features

✅ User Authentication

Secure login and registration system.

JWT-based authentication for persistent sessions.

✅ Ask & Answer Questions

Post your own questions on any topic.

View all questions posted by users on the homepage.

Submit answers to any question you’re interested in.

✅ User Personalization

Each question displays the username of the person who asked it.

Users can edit or delete their own questions or answers.

✅ Dynamic Routing with React Router

Click any question to navigate to its dedicated Answer Page.

Clean, seamless transitions between pages.

✅ Database Integration (MySQL)

All users, questions, and answers are stored securely in a MySQL database.

✅ Modern UI

Built with HTML, CSS, and React for a responsive, modern, and clean design.

🧩 Tech Stack
Category	Technology
Frontend	 React, HTML5, CSS3
Backend	  Node.js, Express.js
Database	MySQL
Authentication	JSON Web Token (JWT)
API Testing	Postman
Version Control	Git & GitHub

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/Dese-1216/Evangadi-Fourm-frontend.git
cd Evangadi-Fourm-frontend

2️⃣ Backend setup
cd server
npm install
node --watch app.js

3️⃣ Frontend setup
cd client
npm install
npm run dev

4️⃣ Database setup

Create a MySQL database (e.g., evangadi_db).

Import your SQL schema and connect it in the backend .env file:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=evangadi_qa_db
JWT_SECRET=your_secret_key

🌍 App Flow

1️⃣ User visits the homepage → sees all questions from existing users.
2️⃣ User can log in or register → access all features.
3️⃣ Click “Ask a Question” → redirect to the question creation page.
4️⃣ Click on any question → navigate to the answer page to add or view answers.
5️⃣ Users can edit or delete only their own questions and answers.

Page	Preview
Login Page	

Home Page	

Question Page	
🤝 Contributing

Contributions are welcome!
If you’d like to add new features or fix bugs:

Fork this repository

Create a new branch: git checkout -b feature-name

Commit your changes: git commit -m "Add feature"

Push and create a Pull Request 🚀
