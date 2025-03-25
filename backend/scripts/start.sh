#!/bin/sh

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting the application..."
npm run start:dev 