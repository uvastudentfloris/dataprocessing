# Floris van Lith
# 10793917

import pandas as pd
import json
import csv

INPUT_CSV = "countrydata.csv"
columns = ['Country', 'GDP ($ per capita)']

def dataframe(INPUT_CSV, columns):
    """
    Creates dataframe from csv file
    """

    # Reads csv into panda dataframe
    df = pd.read_csv(INPUT_CSV)

    # Selects columns of interest in the dataframe
    df = df[columns]

    # Drops rows that include NaNs from the dataframe
    df = df.dropna()

    # Change columns to correct datatype
    df['GDP ($ per capita)'] = df['GDP ($ per capita)'].astype(int)

    # Reads csv into panda dataframe
    df_codes = pd.read_csv('slim-3.csv')

    # Selects columns of interest in the dataframe
    df_codes = df_codes[['Country', 'Alpha-3']]

    # Delete space in country column
    country_nospace = []
    for country in df.Country:
        length = len(country)
        country_nospace.append(country[0:length - 1])

    # Replace column of pandas with list
    n = df.columns[0]
    df.drop(n, axis = 1, inplace = True)
    df[n] = country_nospace

    # drop countries that are not present in both datasets
    countries_tokeep_codes = []
    for index, row in df_codes.iterrows():
        for country in df.Country:
            if (row.Country == country):
                countries_tokeep_codes.append(index)
    df_codes = df_codes.iloc[countries_tokeep_codes]
    df_codes = df_codes.reset_index(drop=True)

    countries_tokeep_df = []
    for index, row in df.iterrows():
        for country in df_codes.Country:
            if (row.Country == country):
                countries_tokeep_df.append(index)
    df = df.loc[countries_tokeep_df]
    df = df.reset_index(drop=True)

    # add country code to dataframe
    df['Code'] = df_codes['Alpha-3']

    # create column fillKey for colors in datamap
    fillKey = []
    for gdp in df['GDP ($ per capita)']:
        if gdp < 1006:
            fillKey.append('LOW')
        if gdp > 1006 and gdp < 12235:
            fillKey.append('MEDIUM')
        if gdp > 12235:
            fillKey.append('HIGH')

    # add fillKey column to dataset
    df['fillKey'] = fillKey

    # Set index to country
    df = df.set_index('Code')

    # Write the json file
    df.to_json('gdp_map.json', orient='index')

if __name__ == "__main__":

    df = dataframe(INPUT_CSV, columns)
