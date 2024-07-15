#!/bin/bash
# run_all.sh
# This script clones the purple-a11y-tests and another repository, and then starts the HTTP server and Cypress tests concurrently

# Clone the purple-a11y-tests repository
git clone https://github.com/GovTechSG/purple-a11y-tests.git

# Navigate to the cloned repository
cd purple-a11y-tests || { echo "Failed to navigate to purple-a11y-tests directory"; exit 1; }

# Run any scripts needed in the purple-a11y-tests repository
# Example: ./scripts/your_script.sh

echo "Cloned purple-a11y-tests repository. Starting the HTTP server and Cypress tests..."

# Navigate back to the root directory
cd ..

# Clone the second repository (replace with your repository URL)
git clone https://github.com/LeeYiXuan21/leeyixuan21.github.io.git

# Navigate to the cloned repository
cd leeyixuan21.github.io || { echo "Failed to navigate to leeyixuan21.github.io directory"; exit 1; }

# Run any scripts needed in the second repository
# Example: ./shell_scripts/your_script.sh

echo "Cloned leeyixuan21.github.io repository. Starting the HTTP server and Cypress tests..."

# Navigate back to the root directory
cd ..

# Run the Python HTTP server and Cypress tests concurrently
npx concurrently \
  "python3 purple-a11y-tests/http_server_auth.py --bind 0.0.0.0 --port 8000" \
  "npx cypress run"
