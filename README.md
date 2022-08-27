# Summer challenge 2022

https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/wait-times.html

The Task:

Obtain a list of all such visa centers along with their processing times in a Google sheet or HTML table both of which should be viewable in the browser. [The list must be generated somehow, hardcoded values are not allowed for processing times.]

Resources:

- https://travel.state.gov/etc/designs/travel/TSGglobal_libs/data/PostsVWT.js page gives you a list
of all consulates.
- https://travel.state.gov/content/travel/resources/database/database.getVisaWaitTimes.html?cid=
P83&aid=VisaWaitTimesHomePage this API gives you waiting times for each consulate. [just change cid parameter]

### Notes:
- repeating twice {"code":"P142","value":"N Djamena"}

# Live google sheet link
https://docs.google.com/spreadsheets/d/1-HC1BQYyXGDnpgc7cVXpTXVh09D-9mQlMD41IRvJC7s/edit#gid=0

APIs
/api/response-time | raw data
/api/sheets/update | update google sheet with live data

UIs
/          | UI using custom css and JS
/bootstrap | UI made using bootstrap