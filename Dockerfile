# Use Microsoft Playwright distribution
FROM mcr.microsoft.com/playwright:v1.47.0-jammy

# Set the working directory in the container
WORKDIR /app

# Installation of packages for purple-a11y
RUN apt-get update && apt-get install -y zip git tree openjdk-11-jdk xvfb libgbm-dev libgtk2.0-0 libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth dbus-x11 python-is-python3 libcurl4-openssl-dev build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Installation of VeraPDF
COPY verapdf-auto-install-docker.xml /opt/verapdf-auto-install-docker.xml

# Install VeraPDF
RUN wget "https://github.com/GovTechSG/purple-a11y/releases/download/cache/verapdf-installer.zip" -P /opt
RUN unzip /opt/verapdf-installer.zip -d /opt
RUN latest_version=$(ls -d /opt/verapdf-greenfield-* | sort -V | tail -n 1) && [ -n "$latest_version" ] && \
    "$latest_version/verapdf-install" "/opt/verapdf-auto-install-docker.xml"
RUN rm -rf /opt/verapdf-installer.zip /opt/verapdf-greenfield-*

# Copy package.json to working directory, perform npm install before copying the remaining files
COPY package*.json ./

# deletes the line containing "@govtechsg/purple-hats" from the package.json, if present
RUN sed -i '/"@govtechsg\/purple-hats":/d' package.json

# For Alpine
# RUN addgroup -S purple && adduser -S -G purple purple

# For Debian
RUN addgroup --system purple && adduser --system --ingroup purple purple

# Environment variables for node and Playwright
ENV NODE_ENV=dev
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD="true"
ENV PLAYWRIGHT_BROWSERS_PATH="/opt/ms-playwright"
ENV PATH="/opt/verapdf:${PATH}"

# Give the current dir ownership to purple
RUN chown -R purple:purple /app

# Create the directory for Playwright browsers
RUN mkdir -p "$PLAYWRIGHT_BROWSERS_PATH"
# Give the dir ownership to purple
RUN chown -R purple:purple "$PLAYWRIGHT_BROWSERS_PATH"

# Similarly for /nonexistent
RUN mkdir -p /nonexistent
RUN chown -R purple:purple /nonexistent

# Run everything after as non-privileged user for security
USER purple

# Install dependencies first to speed things up
RUN npm ci --include=dev
RUN npx playwright install chromium
