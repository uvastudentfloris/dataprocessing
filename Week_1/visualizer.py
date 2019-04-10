#!/usr/bin/env python
# Name: Floris van Lith
# Student number: 10793917
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [0,0] for key in range(START_YEAR, END_YEAR)}

# Create method to add movie rating to data_dict
def movie_total_scores(INPUT_CSV):
    with open(INPUT_CSV, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            for year in data_dict:
                if int(year) == int(row["Year"]):
                    data_dict[year][0] += float(row["Rating"])
                    data_dict[year][1] += 1
    return data_dict

if __name__ == "__main__":
    data_dict = movie_total_scores(INPUT_CSV)

    # Calculate per year the average moviescore
    for year in data_dict:
        data_dict[year][0] /= data_dict[year][1]
        data_dict[year] = round(data_dict[year][0],1)

    # Create plot
    plt.plot(data_dict.keys(), data_dict.values())
    plt.axis([-1,10,0,10])
    plt.title("Average movie ratings per year")
    plt.xlabel("Years")
    plt.ylabel("Rating")
    plt.show()
