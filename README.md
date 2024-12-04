
```markdown
# 🎥 Film Recommendation System

This project is a **Film Recommendation System** designed to suggest movies based on user preferences. It leverages modern web technologies and a robust backend for delivering personalized recommendations.

---

## 🌟 Features
- User authentication and secure login.
- Personalized movie recommendations.
- A sleek and user-friendly interface.
- Real-time updates from an external movie database API.
- Here is the link of the googlecollab project that contains the algorithms without api ,
    you will find the data files movies_reduced_to_500.xlsx(ou bien csv) & ratings_reduced_to_500.xlsx(ou bien csv) din the backend file 
The link ( read only ) : https://colab.research.google.com/drive/19vNwUj_G41fK0gIVzBGq6iV-xIZTAM6H?usp=sharing 
---

## 🛠️ Technologies Used
- **Frontend**: React.js
- **Backend**: FastAPI
- **Database**: MySQL (managed via phpMyAdmin)
- **Styling**: CSS (Tailored for a responsive design)

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.7+ installed on your machine.
- Node.js and npm installed.
- MySQL server running with phpMyAdmin for database management.

### 1. Clone the Repository
```bash
git config --global http.postBuffer 524288000 
git clone https://github.com/Jalil03/Film-recomnedation-.git
cd Film-recomnedation-
```

### 2. Install Backend Dependencies
Navigate to the backend folder and install the required Python packages:
```bash
cd backend
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
Navigate to the frontend folder and install the required npm packages:
```bash
cd ../frontend
npm install
```

### 4. Set Up the Database
1. Import the SQL file `recommandation_de_film.sql` into your MySQL server using phpMyAdmin.
2. Update the database connection details in your backend settings.
3. This project is on phpmyadmin , so u should have xamp already installed and run Mysql from there , also create the database under the name of recommendation de film
4. After , import the file recommandation_de_film.sql in ur database 

### 5. Run the Application
#### Start the Backend Server:
```bash
cd ../backend
uvicorn main:app --reload
```

#### Start the Frontend Server:
```bash
cd ../frontend
npm start
```

- The backend will be accessible at [http://127.0.0.1:8000](http://127.0.0.1:8000).
- The frontend will be accessible at [http://127.0.0.1:3000](http://127.0.0.1:3000).

---

## 🚀 API Endpoints
- **GET** `/`: Welcome message.
- **GET** `/movies`: Fetch movie recommendations.
- **POST** `/login`: User authentication.

---

Happy coding! 🎬
```

### Instructions:
1. Save this content into a file named `README.md` at the root of your repository.
2. Commit and push it to your repository:
   ```bash
   git add README.md
   git commit -m "Add README file"
   git push origin main
   ```

![1](https://github.com/user-attachments/assets/7babb47d-6f9a-445b-b584-7d2d4969d99a)
![2](https://github.com/user-attachments/assets/b5faf6b2-62cb-44fb-835d-017f93c6cd25)
![3](https://github.com/user-attachments/assets/29ea7a45-7076-4629-8d16-410b0c02e8ad)
![4](https://github.com/user-attachments/assets/26bed995-01dc-4051-94a0-5a9e629316a0)
![5](https://github.com/user-attachments/assets/9f077960-66ee-42a8-a7c3-e1b47f83a600)
![6](https://github.com/user-attachments/assets/e3cdd174-22e2-4ce3-b14a-5899362b32fa)
![7](https://github.com/user-attachments/assets/efc5af9c-f2d5-4864-9cd0-16ac93bf879d)
![8](https://github.com/user-attachments/assets/9c43c5d2-c8fd-477a-b5ea-cc4b1f128f39)
![9](https://github.com/user-attachments/assets/6276e458-0ad9-4775-849b-266e0e87075b)






