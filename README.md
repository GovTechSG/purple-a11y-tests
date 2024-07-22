# purple-a11y-tests
#### [Cypress](https://www.cypress.io/) functional tests for [Purple A11y](https://github.com/govtechsg/purple-a11y) to verify the correctness of Purple A11y CLI and integration module.

## Run Locally
#### Step 1: 
- Edit the /etc/hosts file by running `sudo nano /etc/hosts` in terminal.
- At the end of the file, add these new lines with the following format:
```
127.0.0.1    main.purplea11y.local
127.0.0.1    diffHostname.purplea11y.local
```
This is needed to test the `strategy` flag in Purple A11y.

#### Step 2: 
- Install dependencies then run the `host_websites_and_run_cypress.sh` script, which hosts the functional test website on a python server then runs the cypress tests.    
Note: The `host_websites_and_run_cypress.sh` script accepts an argument that specifies the package of Purple A11y you want to test. To test your specific branch of Purple A11y, just change "master" with your preferred branch. (see below)
```
npm install
shell_scripts/host_websites_and_run_cypress.sh git+https://github.com/GovTechSG/purple-a11y.git#master
```
- After running the `shell_scripts/host_websites_and_run_cypress.sh` script, find generated cypress report under `./cypress/reports/index.html` from project root directory.  

- If you make code changes in the `src` folder, ensure you do `npm run build` to compile the typescript into the `dist` folder.

## Run via Docker Container

#### Prerequisites: 
Ensure that you have these installed:
- [Colima](https://github.com/abiosoft/colima) on MacOS, or Docker Engine on Linux or Windows (via Linux VM)
- Docker (install via `brew install docker`)

#### Step 1: Start colima
```
colima start
```

#### Step 2: Host functional test website on python server and run functional tests
Note: The `start_docker.sh` script accepts an argument that specifies the package of Purple A11y you want to test. To test your specific branch of Purple A11y, just change "master" with your preferred branch. (see below)
```
shell_scripts/start_docker.sh git+https://github.com/GovTechSG/purple-a11y.git#master
```

#### Step 3: Stop running container and remove image by running `stop_docker.sh` from a new terminal
```
shell_scripts/stop_docker.sh
```
- Cypress tests report will then be copied over from inside the container to your local repo at ./cypress/reports (view `index.html` for report)

#### Step 4: Stop colima
```
colima stop
```

## Limitations
 - Docker can only run chromium in headless mode, using chrome and edge for Purple A11y will not be tested

