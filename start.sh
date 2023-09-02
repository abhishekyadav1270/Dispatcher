#!/bin/bash



set -m



knex migrate:latest --knexfile ./common/knexfile.js --env production

knex seed:run --knexfile ./common/knexfile.js --env production

#node scripts/start.js 

HTTPS=true npm start

#yarn start