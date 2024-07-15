# Use Python 3.9 slim image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /root

# Copy the current directory contents into the container at /
COPY . .

# Make sure the shell scripts are executable
RUN chmod +x /root/shell_scripts/host_websites_and_run_cypress.sh

# Install any dependencies specified in requirements.txt
# Uncomment the following line if you have a requirements.txt file
# RUN pip install --no-cache-dir -r requirements.txt

# Add hostname mappings
# RUN echo "127.0.0.1 myhost1.local" >> /etc/hosts
# RUN echo "127.0.0.1 myhost2.local" >> /etc/hosts

# Command to run the shell script and print the port link
CMD ["sh", "-c", "/root/shell_scripts/host_websites_and_run_cypress.sh"]
