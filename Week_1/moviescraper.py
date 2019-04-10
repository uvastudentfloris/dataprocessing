#!/usr/bin/env python
# Name: Floris van Lith
# Student number: 10793917
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'

class Movie():

    def __init__(self, title, rating, release, actors, runtime):
        self.title = title
        self.rating = rating
        self.release = release
        self.actors = actors
        self.runtime = runtime

def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    # Create movielist
    movies = []

    # Add information about all movies to variable
    movielist = dom.find_all("div",{"class":"lister-item-content"})

    # Loop through movies in the list of movies
    for movie in movielist:

        # Find title
        title = movie.h3.a.text
        # Find rating
        rating = movie.div.div.strong.text
        # Find movie release year
        release = movie.find("span",{"class":"lister-item-year text-muted unbold"}).text
        release = release[len(release)-5:len(release)-1]
        # Find actors
        stars = movie.find("p",{"class":""}).text
        # Remove directors from string
        for i in range(len(stars)):
            if stars[i] == "|":
                actor_index = stars[i+1 :len(stars)]
        # Create a variable with only actors
        for i in range(0, len(actor_index)):
            if actor_index[i] == ":":
                actors = actor_index[i+1: len(actor_index)]
                actors = actors.replace("\n","")
        # Find movielenght
        runtime = movie.find("span",{"class":"runtime"}).text
        for i in range(len(runtime)):
            if runtime[i] == " ":
                index = i
                break
        runtime = runtime[0:i]
        # Add required movie information to Movie object
        movie = Movie(title,rating,release,actors,runtime)
        # Append movie objects to list of objects
        movies.append(movie)

    return(movies)

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # Write objects to csv file
    for movie in movies:
        writer.writerow([movie.title, movie.rating, movie.release, movie.actors, movie.runtime])

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
