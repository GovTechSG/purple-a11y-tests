# Check if the container is running and remove it if necessary
if [ "$(docker ps -a | grep purple-a11y-tests-instance)" ]; then
  docker rm -f purple-a11y-tests-instance
fi

# Build the Docker container
docker build -t purple-a11y-tests .

# Add hostname mappings and run the container
docker run -dit --name purple-a11y-tests-instance --add-host=main.purplea11y.local:0.0.0.0 --add-host=diffHostname.purplea11y.local:0.0.0.0 purple-a11y-tests

# Access the container's bash shell
docker exec -it purple-a11y-tests-instance /bin/bash