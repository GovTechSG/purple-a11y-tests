# Use Python 3.9 slim image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Installation of packages for purple-a11y and chromium in alpine
# RUN apk add build-base gcompat g++ make python3 zip bash git chromium openjdk11-jre xvfb

# Install necessary dependencies and Node.js
RUN apt-get update && \
    apt-get install -y curl gnupg lsb-release && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs wget git-all xvfb libgbm-dev libgtk2.0-0 libgtk-3-0 libnotify-dev zip\
    libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth dbus-x11 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# openjdk-17-jdk

# Installation of VeraPDF
RUN echo $'<?xml version="1.0" encoding="UTF-8" standalone="no"?> \n\
<AutomatedInstallation langpack="eng"> \n\
    <com.izforge.izpack.panels.htmlhello.HTMLHelloPanel id="welcome"/> \n\
    <com.izforge.izpack.panels.target.TargetPanel id="install_dir"> \n\
        <installpath>/opt/verapdf</installpath> \n\
    </com.izforge.izpack.panels.target.TargetPanel> \n\
    <com.izforge.izpack.panels.packs.PacksPanel id="sdk_pack_select"> \n\
        <pack index="0" name="veraPDF GUI" selected="true"/> \n\
        <pack index="1" name="veraPDF Batch files" selected="true"/> \n\
        <pack index="2" name="veraPDF Validation model" selected="false"/> \n\
        <pack index="3" name="veraPDF Documentation" selected="false"/> \n\
        <pack index="4" name="veraPDF Sample Plugins" selected="false"/> \n\
    </com.izforge.izpack.panels.packs.PacksPanel> \n\
    <com.izforge.izpack.panels.install.InstallPanel id="install"/> \n\
    <com.izforge.izpack.panels.finish.FinishPanel id="finish"/> \n\
</AutomatedInstallation> ' >> /opt/verapdf-auto-install-docker.xml

# TODO: Install OpenJDK to install VeraPDF
#RUN wget "https://github.com/GovTechSG/purple-a11y/releases/download/cache/verapdf-installer.zip" -P /opt
#RUN unzip /opt/verapdf-installer.zip -d /opt
#RUN latest_version=$(ls -d /opt/verapdf-greenfield-* | sort -V | tail -n 1) && [ -n "$latest_version" ] && \
#    "$latest_version/verapdf-install" "/opt/verapdf-auto-install-docker.xml"
# RUN rm -rf /opt/verapdf-installer.zip /opt/verapdf-greenfield-*

# Copy package.json to working directory, perform npm install before copying the remaining files
COPY package*.json ./

# deletes the line containing "@govtechsg/purple-hats" from the package.json, if present
RUN sed -i '/"@govtechsg\/purple-hats":/d' package.json

## TODO switch running of Cypress as purple user
# RUN addgroup -S purple && adduser -S -G purple purple
# RUN chown -R purple:purple ./

# Run everything after as non-privileged user.
# USER purple

# Environment variables for node and Playwright
ENV NODE_ENV=dev
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD="true"
ENV PLAYWRIGHT_BROWSERS_PATH="/opt/ms-playwright"
ENV PATH="/opt/verapdf:${PATH}"

# Install dependencies
RUN npm ci

# Copy the current directory contents into the container
COPY . .

# Compile typescript for cypress test repo
RUN npm run build || true

# Make sure the shell scripts are executable
RUN chmod +x ./shell_scripts/host_websites_and_run_cypress.sh
RUN chmod +x ./shell_scripts/start_docker.sh
RUN chmod +x ./shell_scripts/stop_docker.sh