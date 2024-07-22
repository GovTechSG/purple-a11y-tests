# purple-a11y-tests
#### Functional tests for [Purple A11y](https://github.com/govtechsg/purple-a11y)

#### Limitations
 - Docker can only run chromium in headless mode, using chrome and edge for Purple A11y will not be tested

## How to run locally
```
npm install
npm run build
npx cypress run
```
- After `npx cypress run`, find generated cypress report under /cypress/reports/index.html from project root directory.  

- To see more detailed loggings, you can use `npx cypress open` instead of `npx cypress run`

- Live hosted urls: 
  - https://leeyixuan21.github.io/
  - https://lrperzus.github.io/purple-a11y-strategy-test/
- Docker hosted urls: 
  - http://main.purplea11y.local:8000
  - http://diffHostname.purplea11y.local:8000

#### How to change the branch of Purple A11y you want to test
1) Uninstall Purple A11y by running `npm uninstall @govtechsg` then install the desired branch of Purple A11y by running `npm install git+https://github.com/GovTechSG/purple-a11y.git#your-branch-here`. (Replace "your-branch-here" with your branch name)
2) Next, set up PurpleA11y accordingly:
```
cd node_modules/@govtechsg/purple-hats
npm install
npx playwright install chromium 
npm run build
cd ../../../
```

## How to run using docker container via colima

#### Prerequisites: 
Ensure that you have these installed:
- [Colima](https://github.com/abiosoft/colima)
- Docker (install via `brew install docker`)

#### Step 1: Start colima
```
colima start
```

#### Step 2: Build docker image and run it by running `start_docker.sh`
- `start_docker.sh` is found in ./shell_scripts

#### Step 3: Stop running container and remove image by running `stop_docker.sh` from a new terminal
- `stop_docker.sh` is found in ./shell_scripts
- Cypress tests report will then be copied over from inside the container to your local repo at ./cypress/reports

#### Step 4: Stop colima
```
colima stop
```

