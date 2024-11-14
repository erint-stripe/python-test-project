# Getting Started

## Starting the servers
`cd ~/stripe/python-test-project/src/server && flask --app app --debug run`
`cd ~/stripe/python-test-project/src/server && npm start`
`pay tunnel --local app:3000 --local api:5000`

- if you encounter `Invalid Host Header` trying to access the react app, add a `.env` variable in the `./src/frontend` folder with `