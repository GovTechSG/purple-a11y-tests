# Check if the container is running and remove it if necessary
if [ "$(docker ps -a | grep purple-a11y-instances)" ]; then
  docker rm -f purple-a11y-instances
fi

# Build the Docker container
docker build -t purple-a11y-tests .

# Add hostname mappings and run the container
docker run -it --name purple-a11y-instances --add-host=main.purplea11y.com:0.0.0.0 --add-host=diffHostname.purplea11y.com:0.0.0.0 purple-a11y-tests

# Access the container's bash shell
docker exec -it purple-a11y-instances /bin/bash