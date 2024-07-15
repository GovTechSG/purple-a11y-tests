#!/bin/bash
# host_websites_and_run_cypress.sh
# This script hosts websites using Python HTTP server and runs Cypress tests concurrently

echo "Starting the script..."

# Clone the second repository (replace with your repository URL)
echo "Cloning the repository..."
git clone https://github.com/LeeYiXuan21/leeyixuan21.github.io.git

# Check if the repository was cloned successfully
if [ $? -ne 0 ]; then
    echo "Failed to clone leeyixuan21.github.io repository"
    exit 1
fi

# Navigate to the cloned leeyixuan21.github.io repository
cd leeyixuan21.github.io || { echo "Failed to navigate to leeyixuan21.github.io directory"; exit 1; }

echo "Cloned leeyixuan21.github.io repository. Starting Python HTTP server..."

# Run Python HTTP server in the leeyixuan21.github.io directory
python3 http_server_auth.py --bind 0.0.0.0 --port 8000 &

# Check if the server started successfully
if [ $? -ne 0 ]; then
    echo "Failed to start Python HTTP server"
    exit 1
fi

# Give some time for the server to start
sleep 10

# Check if the server is running
curl -I http://localhost:8000
if [ $? -ne 0 ]; then
    echo "Python HTTP server is not running"
    exit 1
fi

# Navigate back to the root directory
cd ..

echo "Starting Cypress tests..."

# Run Cypress tests concurrently in the purple-a11y-tests directory
npx cypress open

# Check if Cypress tests were successful
if [ $? -ne 0 ]; then
    echo "Cypress tests failed"
    exit 1
fi

echo "Cypress tests completed successfully"
