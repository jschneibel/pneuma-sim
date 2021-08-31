# Development Setup
1.	Install the latest version of node.js, which includes npm.
2.	Save the root folder (“pneuma-sim”) in an accessible location.
3.	Open a terminal and navigate to the folder `frontend` inside the root folder.
4.	Run `npm install` in the terminal to download and install the project dependencies.
5.	Run the file `frontend/index.html` in a local server and access it from a web browser for testing. For example, use the “Live Server” extension in Visual Studio Code.
6.	The following scripts are available from `frontend/package.json`:
    - `npm run lint` for linting Javascript files.
    - `npm run docs` to generate HTML documentation files in the `frontend/docs` folder.
    - `npm run format` to format Javascript files.
    - `npm run test` to run test cases without coverage.
    - `npm run test:coverage` and `npm run test:totalcoverage` to run test cases with coverage information.
