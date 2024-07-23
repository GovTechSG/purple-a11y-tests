# copy results to local
docker cp purple-a11y-tests-instance:/app/cypress/reports cypress

# stop docker container
docker stop purple-a11y-tests-instance

# remove docker container
docker rm purple-a11y-tests-instance
