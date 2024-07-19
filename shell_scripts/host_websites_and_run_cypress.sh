#!/bin/bash
# host_websites_and_run_cypress.sh
# This script hosts websites using Python HTTP server and runs Cypress tests concurrently

# Clone the second repository (replace with your repository URL)
git clone https://github.com/LeeYiXuan21/leeyixuan21.github.io.git

# Navigate to the cloned leeyixuan21.github.io repository
cd leeyixuan21.github.io || { echo "Failed to navigate to leeyixuan21.github.io directory"; exit 1; }

echo "Cloned leeyixuan21.github.io repository. Starting Python HTTP server..."

# Run Python HTTP server in the leeyixuan21.github.io directory
python3 http_server_auth.py --bind 0.0.0.0 --port 8000 &

# Navigate back to the root directory
cd ..

echo "Starting Cypress tests..."

# Run Cypress tests concurrently in the purple-a11y-tests directory
npx cypress run

# # Loop to keep the container running
# while :; do
#   sleep 3600 # Sleep for 24 days
# done