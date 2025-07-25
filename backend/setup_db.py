import pandas as pd
import sqlite3

# Load cleaned CSV
df = pd.read_csv('../data/cleaned_ingredients.csv')

# Create SQLite database
conn = sqlite3.connect('../data/ingredients.db')
df.to_sql('ingredients', conn, if_exists='replace', index=False)
conn.close()
print("Database created at '../data/ingredients.db'")