
#!/usr/bin/env bash

# Clean distribution directory.
rm -rf dist && mkdir dist && mkdir dist/js

# Bundle the main js file.

# add -d switch for sourcemapping and debugging production.
NODE_ENV=production browserify -e client.js -o dist/js/main.js \
  -t envify \
  -g yo-yoify \
  -g unassertify \
  -g es2040 \
  -g uglifyify | uglifyjs

echo 'Built dist directory'
