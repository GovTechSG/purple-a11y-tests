#!/bin/bash
# run_all.sh
# This script runs shell_scripts/create_100_html.sh and shell_scripts/create_100_html_basic_auth.sh and then starts the HTTP server

# Navigate to the shell_scripts directory
cd shell_scripts

# Run the shell_scripts/create_100_html.sh script
bash create_100_html.sh

# Run the shell_scripts/create_100_html_basic_auth.sh script
bash create_100_html_basic_auth.sh

# Check if HTML creation scripts executed successfully
if [ $? -eq 0 ]; then
  echo "HTML files created successfully. Starting the HTTP server..."

  # Navigate back to the root directory
  cd ..

  # Run the Python HTTP server script in the foreground
  python3 http_server_auth.py --bind 0.0.0.0 --port 8000
  echo "Starting the HTTP server..."

else
  echo "Failed to create HTML files. Exiting..."
  exit 1
fi
