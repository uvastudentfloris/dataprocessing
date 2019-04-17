#!/usr/bin/env python
# Name: Floris van Lith
# Student number: 10793917
"""
This script analyses a datafile in an exploratory way, visualizes the data and creates a json
"""

import csv
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import json

INPUT_CSV = "input.csv"
columns = ['Country', 'Region', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars']

def dataframe(INPUT_CSV, columns):
    """
    Creates dataframe from csv file
    """

    # Reads csv into panda dataframe
    df = pd.read_csv(INPUT_CSV)

    # Selects columns of interest in the dataframe
    df = df[columns]

    # Replaces values labeled 'unknown' as NaN
    df['Pop. Density (per sq. mi.)'] = df['Pop. Density (per sq. mi.)'].replace(['unknown'], float('NaN'))
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].replace(['unknown'], float('NaN'))

    # Removes useless information for analysis from the input values
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.split(' ').str[0]

    # Replaces commas by points
    df = df.apply(lambda x: x.str.replace(',','.'))

    # Drops rows that include NaNs from the dataframe
    df = df.dropna()

    # Change columns to correct datatype
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].astype(int)
    df['Infant mortality (per 1000 births)'] = df['Infant mortality (per 1000 births)'].astype(float)
    df['Pop. Density (per sq. mi.)'] = df['Pop. Density (per sq. mi.)'].astype(float)

    # Removes outliers from columns (by 2 standard deviation theorem)
    P = np.percentile(df['GDP ($ per capita) dollars'], [2.5, 97.5])
    df = df[(df['GDP ($ per capita) dollars'] > P[0]) & (df['GDP ($ per capita) dollars'] < P[1])]
    P = np.percentile(df['Infant mortality (per 1000 births)'], [2.5, 97.5])
    df = df[(df['Infant mortality (per 1000 births)'] > P[0]) & (df['Infant mortality (per 1000 births)'] < P[1])]

    return df

def central_tendency(df, column):
    """
    Calculates central tendency parameters and visualizes column of interest by histogram
    """

    # Calculates mean
    mean = round(df[column].mean(),1)

    # Calculates median
    median = round(df[column].median(),1)

    # Calculates mode
    mode = round(df[column].mode()[0],1)

    # Calculates standard deviation
    std = round(df[column].std(),1)

    # Print central tendency values
    print('Mean = {}, Median = {}, Mode = {}, Standard deviation = {}'.format(mean, median, mode, std))

    # Plot histogram of input column
    plt.hist(df[column], 35, color='skyblue', zorder=1, rwidth=0.9)
    plt.xlabel('GDP ($ per capita) dollars')
    plt.ylabel('Percentages')
    plt.title('Distribution of GDP')
    plt.grid(linewidth=0.1)
    plt.show()

def five_number(df, column):
    """
    Calculates five number of summary and visualizes column of interest by boxplot
    """

    # Calculate minimum
    min = round(df[column].min(),1)

    # Calculate maximum
    max = round(df[column].max(),1)

    # Calculate first quartile
    Q1 = round(df[column].quantile(.25),1)

    # Calculate median
    median = round(df[column].quantile(.5),1)

    # Calculate third quartile
    Q3 = round(df[column].quantile(.75),1)

    # Print five number summary
    print('Minimum = {}, Maximum = {}, First Quartile = {}, Third Quartile = {}, Median = {}'.format(min, max, Q1, Q3, median))

    # Create boxplot
    plt.boxplot(df[column])
    plt.ylabel('Infant mortality (per 1000 births)')
    plt.title('Infant mortality boxplot')
    plt.show()

def json(df):
    """
    Creates a json file from the dataframe
    """

    # Set index to country
    df = df.set_index('Country')

    # Write the json file
    df.to_json('output.json', orient='index')

if __name__ == "__main__":

    df = dataframe(INPUT_CSV, columns)
    tendency = central_tendency(df, 'GDP ($ per capita) dollars')
    summary = five_number(df, 'Infant mortality (per 1000 births)')
    json = json(df)
