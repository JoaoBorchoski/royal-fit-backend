// build.sh
#!/usr/bin/env bash
# exit on error
set -o errexit

yarn
yarn build
cat package.json
yarn typeorm migration:run -- -d dist/shared/infra/http/app.js
yarn seed:seeder