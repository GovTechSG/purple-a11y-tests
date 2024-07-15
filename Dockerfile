# Use Python 3.9 slim image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /root

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

# Copy the current directory contents into the container
COPY . .

# Install Cypress
RUN npm install cypress --save-dev

# Run Cypress install to download the binary
RUN npx cypress install

# Verify Cypress installation
RUN npx cypress verify

# Make sure the shell scripts are executable
RUN chmod +x /root/shell_scripts/host_websites_and_run_cypress.sh

# Install any dependencies specified in requirements.txt 
# Uncomment the following line if you have a requirements.txt file
# RUN pip install --no-cache-dir -r requirements.txt

# Ensure /usr/local/bin is in the PATH
ENV PATH /usr/local/bin:$PATH

# Command to run the shell script and print the port link
CMD ["sh", "-c", "/root/shell_scripts/host_websites_and_run_cypress.sh"]
