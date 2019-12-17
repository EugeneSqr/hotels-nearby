### Overview
The project can be used to show hotels near you on a map. When project webpage is opened a geo IP lookup is performed to determine your approximate location and display it on the map. After than you can click on the map to move this location to any place you want. Each time the location is changed a set of nearby hotels is displayed on the map. You can click the hotel markers to see some details about the selected hotel.

### Setup development environment
1. Make sure docker (19.03.5) and docker-compose (1.25.0) are up and running.
2. Make a copy of the .env_exmple file located in the root directory of the repository; place it into the same forlder and name it '.env'.
3. Fill in all the missing data:
HERE_JS_API_KEY - your JS api key obtained at developers.here.com. This key is used to display all the map related data
HERE_REST_API_KEY - your REST api key obtained at developers.here.com. This key is uses to search for hotels and get hotel details.
4. docker-compose up

### Service layer API docs
Access the documentation at http://localhost:8081/api-docs
