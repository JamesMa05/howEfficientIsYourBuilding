import pandas as pd
import requests
import sqlite3

url = "https://data.cityofnewyork.us/resource/5zyy-y8am.json"
offset = 0
data = []
limit = 1000

while True:
    response = requests.get(f"{url}?$offset={offset}&$limit={limit}")
    if not response.json():
        break
    data.extend(response.json())
    offset +=limit 

df = pd.DataFrame(data)


df['BIN'] = df.get('nyc_building_identification', pd.Series(dtype=str)).astype(str)
df['Property_ID'] = df.get('property_id', pd.Series(dtype=str)).astype(str)
df['City'] = df.get('city', pd.Series(dtype=str)).astype(str)
df['Address_1'] = df.get('address_1', pd.Series(dtype=str)).astype(str)
df['Postal_Code'] = df.get('postal_code', pd.Series(dtype=str)).astype(str)
df['Borough'] = df.get('borough', pd.Series(dtype=str)).astype(str)
df['Year_Built'] = pd.to_numeric(df.get('year_built', pd.Series(dtype='Int64')), errors='coerce').astype('Int64')
df['Primary_Property_Type'] = df.get('primary_property_type', pd.Series(dtype=str)).astype(str)
df['Natural_Gas_Use'] = pd.to_numeric(df.get('natural_gas_use_kbtu', pd.Series(dtype=float)), errors='coerce')
df['Electricity_Use'] = pd.to_numeric(df.get('electricity_use_grid_purchase_1', pd.Series(dtype=float)), errors='coerce')
df['Site_EUI'] = pd.to_numeric(df.get('site_eui_kbtu_ft', pd.Series(dtype=float)), errors='coerce')
df['Water_Use'] = pd.to_numeric(df.get('water_use_all_water_sources', pd.Series(dtype=float)), errors='coerce')
df['ENERGY_STAR_Score'] = pd.to_numeric(df.get('energy_star_score', pd.Series(dtype='Int64')), errors='coerce').astype('Int64')

df = df[['BIN', 'Property_ID', 'City', 'Address_1', 'Postal_Code', 'Borough',
         'Year_Built', 'Primary_Property_Type', 'Natural_Gas_Use', 'Electricity_Use',
         'Site_EUI', 'Water_Use', 'ENERGY_STAR_Score']]


df = df.sort_values(by="ENERGY_STAR_Score", ascending=False,na_position='last')
connect = sqlite3.connect("nyc_energy_water.db")
df.to_sql('nyc_energy_water', connect, if_exists='replace', index=False)
connect.close()



