# purple-a11y-tests
Functional tests for Purple A11y

## How to run locally
```
npm install
npm run build
RUNNING_TESTS_OUTSIDE_DOCKER=true npx cypress run
```
- `RUNNING_TESTS_OUTSIDE_DOCKER` environment variable is to set the urls to scan to be the live hosted urls, not the urls that is hosted only in docker
  - Live hosted urls: 
    - https://leeyixuan21.github.io/
    - https://lrperzus.github.io/purple-a11y-strategy-test/
  - Docker hosted urls: 
    - http://main.purplea11y.com:8000
    - http://diffHostname.purplea11y.com:8000

- After `npx cypress run`, find generated cypress report under /cypress/reports/index.html from project root directory.  

- To see more detailed loggings, you can use `npx cypress open` instead of `npx cypress run`

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
Install colima & docker then do `colima start`

#### To begin, build docker image and run it by running `start_docker.sh`:
- `start_docker.sh` is found in ./shell_scripts

#### To end, stop running container and remove image by running `stop_docker.sh`:
- `stop_docker.sh` is found in ./shell_scripts

## TODO
1) In functional test website home page, add anchor tag to download .exe file. (just uncomment it, its temporarily commented out) - do this when this bug is fixed
2) Fix this bug in Purple A11y backend: when scanning a meta redirected page, the final url should be in the scanData.pagesScanned in `report.html`. Currently, the page containing the meta redirect in the <head> is in the scanData.pagesScanned instead. After this bug is fixed, then add the test case in the `checkReportHtmlScanData()` function. (search for "TODO" comment in repo)