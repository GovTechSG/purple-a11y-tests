#!/bin/bash
# host_websites_and_run_cypress.sh
# This script hosts websites using Python HTTP server and runs Cypress tests concurrently

# Build Cypress Tests
npm run build

## Change to www
cd ./www

# Run Python HTTP server in the www directory
python3 http_server_auth.py --bind 0.0.0.0 --port 8000 &

# Save the PID of the background process
python_pid=$!

# Function to kill the Python server
cleanup() {
  echo "Killing the Python server with PID $python_pid"
  kill $python_pid
}

# Trap the EXIT signal to run the cleanup function
trap cleanup EXIT

echo "Python HTTP Server running at pid $pid"

# Navigate back to the root directory
cd ..

echo "Clone Purple A11y and install dependencies"
npm install git+https://github.com/GovTechSG/purple-hats.git#master

# Navigate to purple-hats directory, install dependencies, and build
cd node_modules/@govtechsg/purple-hats && \
    npm install && \
    npx playwright install chromium && \
    npm run build || true && \
    cd ../../../

echo "Starting Cypress tests..."

# Run Cypress tests concurrently in the purple-a11y-tests directory
npx cypress run
