#!/bin/bash
# this script is to create a xml sitemap

# Output file
rootdir="../"
sitemap="$rootdir/sitemap.xml"

# Begin the XML structure
cat <<EOL > $sitemap
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
EOL

# Loop to add URLs for HTML files
for i in {1..100}
do
  echo "    <url>" >> $sitemap
  echo "        <loc>https://leeyixuan21.github.io/${i}.html</loc>" >> $sitemap
  echo "    </url>" >> $sitemap
done

# Loop to add URLs for PDF files
# for i in {1..22}
# do
#   echo "    <url>" >> $sitemap
#   echo "        <loc>http://localhost:8000/${i}.pdf</loc>" >> $sitemap
#   echo "    </url>" >> $sitemap
# done

# End the XML structure
