# Floris van Lith
# 10793917

import pandas as pd
import json
import csv

INPUT_CSV = "employment_data.csv"
columns = ['LOCATION', 'SUBJECT', 'FREQUENCY', 'TIME', 'Value']

def dataframe(INPUT_CSV, columns):
    """
    Creates dataframe from csv file
    """

    # Reads csv into panda dataframe
    df = pd.read_csv(INPUT_CSV)

    # Selects columns of interest in the dataframe
    df = df[columns]

    print(len(df))

    # Drops rows that include NaNs from the dataframe
    df = df.dropna()

    print(len(df))

    indices_interest = []
    for index, row in df.iterrows():
            if row.FREQUENCY == 'A':
                if row.TIME == '2015':
                    indices_interest.append(index)

    df = df.iloc[indices_interest]
    df = df.reset_index(drop=True)

    print(len(df))

    # Reads csv into panda dataframe
    df_codes = pd.read_csv('slim-3.csv')

    # Selects columns of interest in the dataframe
    df_codes = df_codes[['Country', 'Alpha3']]
    # print(df_codes)

    codes_df = []
    for index, row in df.iterrows():
        for code in df_codes.Alpha3:
            if (row.LOCATION == code):
                codes_df.append(index)
    df = df.iloc[codes_df]
    df = df.sort_values('LOCATION')
    df = df.reset_index(drop=True)

    codes = []
    for index, row in df_codes.iterrows():
        for code in df.LOCATION:
            if (row.Alpha3 == code):
                codes.append(index)

    df_codes = df_codes.iloc[codes]
    df_codes = df_codes.sort_values('Alpha3')
    df_codes = df_codes.reset_index(drop=True)
    # print(df_codes)
    df['Country'] = df_codes['Country']
    print(df)

    # Write the json file
    df.to_json('employment_map.json', orient='index')

if __name__ == "__main__":

    df = dataframe(INPUT_CSV, columns)
