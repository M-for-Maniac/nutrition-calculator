import pandas as pd

# Load CSV
df = pd.read_csv('../data/ingredients.csv')

# Clean data
df = df.replace(',', '', regex=True)  # Remove commas (e.g., "1,254.000" -> 1254.0)
df = df.fillna(0)  # Replace empty values with 0
numeric_cols = [col for col in df.columns if col not in ['ingredient_name', 'persian_name']]
df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce')
df = df.fillna(0)  # Ensure any conversion errors are set to 0

# Save cleaned CSV
df.to_csv('../data/cleaned_ingredients.csv', index=False)
print("Data cleaned and saved as 'cleaned_ingredients.csv'")