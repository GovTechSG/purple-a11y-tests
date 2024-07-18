# purple-a11y-tests
Functional tests for Purple A11y

## How to run
```
npm install
npm run build
npx cypress run
```
After `npx cypress run`, find generated cypress report under /cypress/reports/index.html from project root directory.  

To see more detailed loggings, you can use `npx cypress open` instead of `npx cypress run`

## How to change the branch of Purple A11y you want to test
1) Uninstall Purple A11y by running `npm uninstall @govtechsg` then install the desired branch of Purple A11y by running `npm install git+https://github.com/GovTechSG/purple-a11y.git#your-branch-here`. (Replace "your-branch-here" with your branch name)
2) Next, set up PurpleA11y accordingly:
```
cd node_modules/@govtechsg/purple-hats
npm install
npx install chromium 
npm run build
cd ../../../
```

## TODO
1) In functional test website home page, add anchor tag to download .exe file. (just uncomment it, its temporarily commented out) - do this when this bug is fixed
2) Fix this bug in Purple A11y backend: when scanning a meta redirected page, the final url should be in the scanData.pagesScanned in `report.html`. Currently, the page containing the meta redirect in the <head> is in the scanData.pagesScanned instead. After this bug is fixed, then add the test case in the `checkReportHtmlScanData()` function. (search for "TODO" comment in repo)