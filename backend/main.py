#With A star
from fastapi import Depends
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_absolute_error
from collections import defaultdict
from queue import PriorityQueue
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import bcrypt
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Database Configuration
DATABASE_URL = DATABASE_URL = "mysql+pymysql://root:@localhost/recommandation de film"
  # Replace with your MySQL credentials
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# User Model
class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))

Base.metadata.create_all(bind=engine)
# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        



# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development). Replace with specific domains in production.
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Charger les fichiers
movies_file_path = 'movies_reduced_to_500.xlsx'
ratings_file_path = 'ratings_reduced_to_500.xlsx'

movies_data = pd.read_excel(movies_file_path, engine="openpyxl")
ratings_data = pd.read_excel(ratings_file_path, engine="openpyxl")

# ### Prétraitement ###
def create_movie_user_matrix(ratings_data):
    return ratings_data.pivot(index='movieId', columns='userId', values='rating').fillna(0)

def create_movie_index_mapping(movie_user_matrix):
    return {movie_id: idx for idx, movie_id in enumerate(movie_user_matrix.index)}

def calculer_similarite_films(movie_user_matrix):
    return cosine_similarity(movie_user_matrix)

def construire_graphe_collaboratif(movies_data, similarity_matrix):
    graphe = defaultdict(list)
    for i, movie1 in enumerate(movies_data['movieId']):
        for j, movie2 in enumerate(movies_data['movieId']):
            if i != j:
                similarity = similarity_matrix[i, j]
                distance = 1 - similarity
                graphe[movie1].append((movie2, distance))
    return graphe

def predict_rating(user_id, target_movie_id, movie_user_matrix, similarity_matrix):
    movie_indices = create_movie_index_mapping(movie_user_matrix)
    if target_movie_id not in movie_indices:
        return 0
    if user_id not in movie_user_matrix.columns:
        return 0

    user_ratings = movie_user_matrix[user_id]
    rated_items = user_ratings[user_ratings > 0].index
    numerator = 0
    denominator = 0

    for rated_movie_id in rated_items:
        if rated_movie_id in movie_indices:
            similarity = similarity_matrix[movie_indices[target_movie_id], movie_indices[rated_movie_id]]
            rating = user_ratings[rated_movie_id]
            numerator += similarity * rating
            denominator += abs(similarity)

    return numerator / denominator if denominator != 0 else 0

def a_star_recommendations(graphe, film_ids, movies_seen_ids, max_depth=3):
    visite = set()
    file = PriorityQueue()

    for film_id in film_ids:
        file.put((0, film_id, 0))
    recommendations = []

    while not file.empty():
        priority, film_courant, depth = file.get()
        if depth > max_depth:
            break
        if film_courant not in visite:
            visite.add(film_courant)
            if film_courant not in movies_seen_ids:
                recommendations.append((film_courant, -priority))  # Save similarity as a positive value
            for voisin, poids in graphe[film_courant]:
                if voisin not in visite:
                    heuristique = poids
                    file.put((depth + heuristique, voisin, depth + 1))

    # Sort by similarity (second element in tuple)
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return [movie[0] for movie in recommendations]  # Return only movie IDs



# Préparer les données globales
movie_user_matrix = create_movie_user_matrix(ratings_data)
similarity_matrix = calculer_similarite_films(movie_user_matrix)
graphe = construire_graphe_collaboratif(movies_data, similarity_matrix)

# ### Modèles de données pour les requêtes ###
class RatingPredictionRequest(BaseModel):
    user_id: int
    movie_id: int

# ### Endpoints ###

@app.get("/")
def root():
    return {"message": "Bienvenue dans l'API de Recommandation de Films !"}

@app.get("/recommend/{user_id}")
def recommend_movies(user_id: int, max_depth: int = 3):
    if user_id not in ratings_data['userId'].unique():
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé.")
    
    user_ratings = ratings_data[ratings_data['userId'] == user_id]
    movies_seen_ids = set(user_ratings['movieId'])
    recommendations = a_star_recommendations(graphe, user_ratings['movieId'], movies_seen_ids, max_depth)
    recommended_movies = movies_data[movies_data['movieId'].isin(recommendations)]

    return {
        "movies_seen": movies_data[movies_data['movieId'].isin(movies_seen_ids)]['title'].tolist(),
        "recommended_movies": recommended_movies['title'].tolist()
    }

@app.post("/predict")
def predict_rating_endpoint(data: RatingPredictionRequest):
    predicted_rating = predict_rating(data.user_id, data.movie_id, movie_user_matrix, similarity_matrix)
    return {"predicted_rating": predicted_rating}
@app.get("/evaluate")
def evaluate_mae_global():
    """
    Calculer la MAE globale sur toutes les données et afficher le pourcentage de précision.
    """
    actual_ratings = []
    predicted_ratings = []

    for _, row in ratings_data.iterrows():
        user_id = row['userId']
        movie_id = row['movieId']
        actual_rating = row['rating']
        predicted_rating = predict_rating(user_id, movie_id, movie_user_matrix, similarity_matrix)
        actual_ratings.append(actual_rating)
        predicted_ratings.append(predicted_rating)

    mae = mean_absolute_error(actual_ratings, predicted_ratings)
    precision_percentage = ((5 - mae) / 5) * 100

    return {
        "message": "MAE globale calculée avec succès.",
        "mae": mae,
        "precision": f"Les prédictions sont précises à {precision_percentage:.2f}% environ."
    }


@app.get("/evaluate/{user_id}")
def evaluate_mae_user(user_id: int):
    """
    Calculer la MAE et le pourcentage de précision pour un utilisateur spécifique.
    """
    if user_id not in ratings_data['userId'].unique():
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé.")

    user_ratings = ratings_data[ratings_data['userId'] == user_id]
    actual_ratings = []
    predicted_ratings = []

    for _, row in user_ratings.iterrows():
        movie_id = row['movieId']
        actual_rating = row['rating']
        predicted_rating = predict_rating(user_id, movie_id, movie_user_matrix, similarity_matrix)
        actual_ratings.append(actual_rating)
        predicted_ratings.append(predicted_rating)

    if not actual_ratings:
        raise HTTPException(status_code=404, detail="Pas de notes disponibles pour cet utilisateur.")

    mae = mean_absolute_error(actual_ratings, predicted_ratings)
    precision_percentage = ((5 - mae) / 5) * 100

    return {
        "user_id": user_id,
        "mae": mae,
        "precision": f"Les prédictions sont précises à {precision_percentage:.2f}% environ.",
        "message": f"MAE calculée avec succès pour l'utilisateur {user_id}."
    }

class UserRegister(BaseModel):
    email: str
    password: str

@app.post("/register")
def register_user(data: UserRegister, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    # Hash the password and save the user
    hashed_password = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    user = User(email=data.email, password_hash=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered successfully", "user_id": user.user_id}

class UserLogin(BaseModel):  # Moved this above the login_user function
    email: str
    password: str
    
    
@app.post("/login")
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    # Check if the email exists in the database
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")

    # Verify the password
    if not bcrypt.checkpw(data.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Return the user ID and a success message
    return {"message": "Login successful", "user_id": user.user_id}


from fastapi.security import HTTPBasicCredentials, HTTPBearer

security = HTTPBearer()

@app.get("/recommend/{user_id}")
def recommend_movies(
    user_id: int, 
    algorithm: str = "astar",  # Choix de l'algorithme
    max_depth: int = 3,
    db: Session = Depends(get_db)
):
    """
    Endpoint pour recommander des films en fonction de l'utilisateur et de l'algorithme choisi.
    """
    if user_id not in ratings_data['userId'].unique():
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé.")

    user_ratings = ratings_data[ratings_data['userId'] == user_id]
    movies_seen_ids = set(user_ratings['movieId'])
    
    # Sélection de l'algorithme
    if algorithm == "astar":
        recommendations_ids = a_star_recommendations(graphe, user_ratings['movieId'], movies_seen_ids, max_depth)
    elif algorithm == "bfs":
        recommendations_ids = bfs_recommendations(graphe, user_ratings['movieId'], movies_seen_ids, max_depth)
    else:
        raise HTTPException(status_code=400, detail="Algorithme non supporté. Choisissez 'astar' ou 'bfs'.")
    
    recommended_movies = movies_data[movies_data['movieId'].isin(recommendations_ids)]

    return {
        "algorithm": algorithm,
        "movies_seen": movies_data[movies_data['movieId'].isin(movies_seen_ids)]['title'].tolist(),
        "recommended_movies": recommended_movies['title'].tolist()
    }
