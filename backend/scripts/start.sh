#!/bin/sh

echo "Waiting for database to be ready..."
while ! nc -z postgres 5432; do
  echo "Waiting for postgres..."
  sleep 1
done
echo "Database is ready!"

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting the application..."
npm run start:dev 