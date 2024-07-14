#!/bin/bash
# This script creates 1-100 HTML pages with basic authentication

rootdir="../"

# Loop from 1 to 100 to create HTML pages
for i in {1..100}
do
  filename="$rootdir/$i.html"
  
  # Write the HTML content to the file
  cat <<EOF > "$filename"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page $i</title>
  <style>
    /* Poor color contrast */
    .low-contrast {
      color: #cccccc;
      background-color: #ffffff;
    }
  </style>
</head>
<body>
  <h1>Sample Inaccessible Page $i</h1>
  <!-- Example of an accessibility issue: poor color contrast -->
  <p class="low-contrast">This text has poor color contrast.</p>
  <!-- Example of an accessibility issue: missing form labels -->
  <form>
    <input type="text" name="username" placeholder="Username">
    <input type="password" name="password" placeholder="Password">
    <button type="submit">Submit</button>
  </form>
  <p><a href="index.html">Go back to index</a></p>
</body>
</html>
EOF
done

echo "100 HTML files with basic authentication created successfully."
