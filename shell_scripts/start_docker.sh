# start colima
colima start

#build docker container
docker build -t purple-a11y-tests .

# Add hostname mappings and run container
docker run -it --name purple-a11y-instances --add-host=main.purple.com:0.0.0.0 --add-host=diffHostname.purple.com:0.0.0.0 purple-a11y-tests

# Docker container to edit
docker exec -it purple-a11y-instances /bin/bash