#!/bin/sh

echo "Waiting for database to be ready..."
sleep 5

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting the application..."
npm run start:dev 