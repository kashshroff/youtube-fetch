### Fampay Test

Objective:
To make an API to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

Setup:
1. Clone the repo
2. Rename .env-ex to .env
3. Update database details in env
4. Create database "fampay_test" in mysql
5. Run -> make build
6. Run -> make up

Alternate (Without Docker):
1. Do step 1 to 4
2. Run -> db-migrate up
3. Run -> npm run dev

NOTE: Please make sure you have db-migrate package and db-migrate-mysql driver installed globally

npm i -g db-migrate db-migrate-mysql

Documentation: https://db-migrate.readthedocs.io/en/latest/


Server Endpoints:
GET Request - localhost:5000/api/search?query=<SEARCH_QUERY>