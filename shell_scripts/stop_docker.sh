# copy results to local
docker cp purple-a11y-instances:/app/cypress/reports cypress

# stop docker container
docker stop purple-a11y-instances

# remove docker container
docker rm purple-a11y-instances
