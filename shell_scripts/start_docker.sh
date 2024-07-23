# Check if the container is running and remove it if necessary
if [ "$(docker ps -a | grep purple-a11y-tests-instance)" ]; then
  docker rm -f purple-a11y-tests-instance
fi

# Build the Docker container
docker build -t purple-a11y-tests .

# Add hostname mappings and run the container
docker run -dit --name purple-a11y-tests-instance --add-host=main.purplea11y.local:0.0.0.0 --add-host=diffHostname.purplea11y.local:0.0.0.0 purple-a11y-tests

# Copy the Cypress tests into the docker container
if [[ "$(uname)" == "Darwin" ]]; then
  tar --no-xattrs --no-mac-metadata --exclude='./node_modules' --exclude='./ms-playwright' --exclude='docker-cypress-test.tar.gz' -czf docker-cypress-test.tar.gz .
else
  tar --warning=no-file-changed --exclude='./node_modules' --exclude='./ms-playwright' --exclude='./docker-cypress-test.tar.gz' --exclude='./.git' -czf docker-cypress-test.tar.gz .
fi

docker cp docker-cypress-test.tar.gz purple-a11y-tests-instance:/tmp
docker exec purple-a11y-tests-instance tar -xzf /tmp/docker-cypress-test.tar.gz -C /app --warning=no-unknown-keyword

# List the directory contents
docker exec purple-a11y-tests-instance ls -al

# Run the tests
docker exec purple-a11y-tests-instance ./shell_scripts/host_websites_and_run_cypress.sh "$@"

# For debugging: Access the container's bash shell
# docker exec -it purple-a11y-tests-instance /bin/bash