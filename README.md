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

## This branch uses the Purple A11y `improv/customflow-cypress`

When installing the Purple A11y module, use the following command specific to the branch:

`npm install git+https://github.com/GovTechSG/purple-a11y.git#improv/customflow-cypress`

2. Next, set up PurpleA11y accordingly:

```
cd node_modules/@govtechsg/purple-hats
npm install
npm run build
cd ../../../
```

## How to change the branch of Purple A11y you want to test

1. Uninstall Purple A11y by running `npm uninstall @govtechsg` then install the desired branch of Purple A11y by running `npm install git+https://github.com/GovTechSG/purple-a11y.git#your-branch-here`. (Replace "your-branch-here" with your branch name)
2. Next, set up PurpleA11y accordingly:

```
cd node_modules/@govtechsg/purple-hats
npm install
npm run build
cd ../../../
```
