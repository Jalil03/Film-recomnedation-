import pandas as pd
import json

# Load the full dataset
movies_file = "movies_reduced_to_500.json"  # Ensure the file is in the same directory
try:
    # Read the JSON file
    movies_data = pd.read_json(movies_file)

    # Select 20 movies with non-empty IMDb IDs
    subset = movies_data[movies_data['imdbId'].notnull()].head(20)

    # Save to a new JSON file
    subset.to_json("movies_subset.json", orient="records", indent=4)
    print("Subset saved to movies_subset.json")

except FileNotFoundError:
    print(f"Error: File '{movies_file}' not found in the current directory.")
except ValueError as e:
    print(f"Error: Failed to load JSON file. {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
