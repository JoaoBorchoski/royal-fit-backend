// build.sh
#!/usr/bin/env bash
# exit on error
set -o errexit

yarn
yarn build
yarn typeorm migration:run -d dist/shared/infra/typeorm/index.ts
yarn seed:seeder