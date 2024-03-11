# kons-count
Counter project for Konsulatet

# Running

## Static
The static files are built as a release to this repository. They should be available under /counter, and any requests to this url that are do not match, should be sent to /counter/index.js. Note our clientid is used in the build.

## Server
The server is built as a docker container package to this repository. It requires a .env file mounted (see .env_template), and a service_account_auth_file.json for authentication to google in the same folder.
