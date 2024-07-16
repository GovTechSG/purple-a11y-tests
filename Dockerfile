# Use Python 3.9 slim image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /root

# Copy the current directory contents into the container
COPY . .

# Install necessary dependencies and Node.js
RUN apt-get update && \
    apt-get install -y curl gnupg lsb-release && \
    curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs npm xvfb libgtk2.0-0 libgtk-3-0 libnotify-dev \
    libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth dbus-x11 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify Node.js and npm installation
RUN node -v && npm -v

# Install desired branch of Purple A11y
RUN npm install git+https://github.com/GovTechSG/purple-hats.git#master

# Navigate to purple-hats directory, install dependencies, and build
RUN cd node_modules/@govtechsg/purple-hats && \
    npm install && \
    npm run build || true && \
    cd ../../../

# Verify Cypress installation
RUN npx cypress verify

# Make sure the shell scripts are executable
RUN chmod +x /root/shell_scripts/host_websites_and_run_cypress.sh

# Command to run the shell script and keep the container running
CMD /root/shell_scripts/host_websites_and_run_cypress.sh && tail -f /dev/null