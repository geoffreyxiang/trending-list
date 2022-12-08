# How to Run 
## Set Up and Potential Issues
- I use several packages in the Node Package Manager, namely react, express, axios, cors, body-parser, random-words
    - These will likely need to be reinstalled when running this project on a new device
    - In order to initialize NPM, first type `npm init` to set up the Node Package Manager (then spam `Enter` or `return` key on device until it begins to install)
    - To install the packages, type `npm i react express axios cors body-parser random-words`
    - I believe this can be done in the main project directory, but if there are issues, run the two steps listed above in both the `frontend` and `backend` directory
- I also use MongoDB as my backend database. There may be a need to initialize the database within the terminal (Since I've been told Snackpass's engineering team uses MongoDB, I'm assuming that the device will be able to access and use the mongo shell through the method below)
    - Open the mongo CLI shell by typing `mongo`
    - Initialize or switch into the database (named 'trending') by typing `use trending`
    - Exit the shell by typing `exit`

## Running the Project (Important to do first step FIRST)
1. Run Backend Server
    - `cd` into `backend` directory
    - Type `node index.js` into terminal to run backend server
        - "CORS-enabled web server listening on port 3030" and "Connected to DB" should appear in terminal output
2. Run Frontend Server
    - In another terminal window (the current terminal window will be busy running the backend server), `cd` into `frontend` directory
    - Type `npm start` into terminal (this should automatically open a tab on Chrome at localhost:3000)
    - A blank page with the words 'Trending at Snakpass' should be shown if there is no test data (I am also aware that it's spelled "Snackpass")
    - Refreshing the page a few times after test data is finished populating may be necessary (details about this given in next step)
3. Populate Database with Randomized Test Data
    - In new terminal window, `cd` into `backend` directory
    - Type `node randomizedTesting.js` into terminal to populate test data 
        - If the file is not modified, the default test will be used
        - Instructions/details/expected behavior for the default test is given on line 155 in './backend/randomizedTesting.js' (open it in a code editor to view)
    - Instructions to run all customized tests are listed within './backend/randomizedTesting.js' starting on line 109
