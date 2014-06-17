singpr
======

This script scrapes available PR appointment dates from https://eappointment.ica.gov.sg/ibook/index.do
The result is a json string of the following format :

  [
    {
      "available": 0,
      "availableDates": [
      ],
      "booked": 25,
      "holidays": 5,
      "month": "November 2014"
    },
    {
      "available": 11,
      "availableDates": [
        "18",
        "19",
        "20",
        "22",
        "23",
        "24",
        "26",
        "27",
        "29",
        "30",
        "31"
      ],
      "booked": 15,
      "holidays": 5,
      "month": "December 2014"
    }
  ]

Setup
=====
You need CasperJs to run this script

1. Install Python 2.6 ( or greater )
2. Install phantomJS - http://phantomjs.org/download.html
3. Install CasperJS  - http://casperjs.readthedocs.org/en/latest/installation.html


Usage :

   casperjs pr.js

