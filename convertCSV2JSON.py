#!/usr/bin/env python
# Name: Floris van Lith
# Student number: 10793917
"""
This script converts csvfile to jsonfile
"""

import csv
import json

INPUT_CSV = "debilt_1718.txt"

def csvtojson(INPUT_CSV):
    
    # open the CSV
    with open(INPUT_CSV) as csvfile:
        reader = csv.DictReader(csvfile, skipinitialspace=True, fieldnames = ('STN','YYYYMMDD', 'TN', 'TX'))

        # parse csv to json
        out = json.dumps( [ row for row in reader ] )

        # Save the JSON
        json_outfile = open('KNMI.json', 'w')
        json_outfile.write(out)

if __name__ == '__main__':
    csvtojson(INPUT_CSV)
