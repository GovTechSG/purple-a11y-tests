FROM python:3.9-slim

WORKDIR /root

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
        curl \
        gnupg \
        lsb-release \
        nodejs \
        npm \
        xvfb \
        libgtk2.0-0 \
        libgtk-3-0 \
        libnotify-dev \
        libgconf-2-4 \
        libnss3 \
        libxss1 \
        libasound2 \
        libxtst6 \
        xauth \
        dbus-x11 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js LTS version and verify
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v

# Copy project files into the container
COPY . .

# Install Cypress and other npm dependencies
RUN npm install cypress --save-dev

# Example: start Python HTTP server and then run Cypress tests
CMD ["sh", "-c", "/root/shell_scripts/host_websites_and_run_cypress.sh"]
