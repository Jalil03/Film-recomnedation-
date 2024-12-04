import csv

# Input and output file paths
input_file = r"C:\Users\PC\Desktop\Projects\Movie2\ratings_reduced_to_500.csv"  # Update with your file path
output_file = r"C:\Users\PC\Desktop\Projects\Movie2\insert_ratings.sql"

# Open the input CSV and output SQL file
with open(input_file, 'r', encoding='utf-8') as csv_file, open(output_file, 'w') as sql_file:
    reader = csv.DictReader(csv_file)

    # Write the initial SQL insert statement
    sql_file.write("INSERT INTO ratings (user_id, movie_id, rating, timestamp) VALUES\n")
    values = []

    for row in reader:
        # Format the SQL values
        user_id = row['userId']
        movie_id = row['movieId']
        rating = row['rating']
        timestamp = row['timestamp']
        values.append(f"({user_id}, {movie_id}, {rating}, {timestamp})")

    # Join all values and write to file
    sql_file.write(",\n".join(values) + ";\n")

print(f"SQL insert statements have been written to {output_file}")
