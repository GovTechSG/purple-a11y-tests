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
1) update the `purplea11y` dependency in `package.json` accordingly and run `npm install`.  
2) Next, set up PurpleA11y accordingly:
```
cd node_modules/purplea11y
npm install
npm run build
cd ../../
```
