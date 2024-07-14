#!/bin/bash

# Counter starts at 1
counter=1

# Loop through each PDF file in the directory
for file in *.pdf; do
  # Rename the file to the counter value followed by .pdf
  mv "$file" "$counter.pdf"
  
  # Increment the counter
  counter=$((counter + 1))
done

