import sqlite3

connect = sqlite3.connect("nyc_energy_water.db")
cur = connect.cursor()

cur.execute('''CREATE TABLE IF NOT EXISTS nyc_energy_water(
    BIN TEXT NOT NULL,
    Property_ID TEXT NOT NULL,
    City TEXT NOT NULL,
    Address_1 TEXT NOT NULL,
    Postal_Code TEXT NOT NULL,
    Borough TEXT NOT NULL,
    Year_Built INTEGER,
    Primary_Property_Type TEXT NOT NULL,
    Natural_Gas_Use REAL,
    Electricity_Use REAL,
    Site_EUI REAL,
    Water_Use REAL,
    ENERGY_STAR_Score INTEGER
)''')
connect.commit()