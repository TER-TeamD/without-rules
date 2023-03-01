#!/bin/bash



echo "Enter :"
echo "1 if you want to build and run"
echo "2 if you want to run"
echo "3 if you want to stop"
read value

if [ $value -eq 1 ]
then
  docker-compose --project-name ter --file ./docker-compose-prod.yml --file ./docker-compose-prod-smartphone-1.yml --file ./docker-compose-prod-smartphone-2.yml build --parallel
  docker-compose --project-name ter --file ./docker-compose-prod.yml --file ./docker-compose-prod-smartphone-1.yml --file ./docker-compose-prod-smartphone-2.yml up -d
fi

if [ $value -eq 2 ]
then
  docker-compose --project-name ter --file ./docker-compose-prod.yml --file ./docker-compose-prod-smartphone-1.yml --file ./docker-compose-prod-smartphone-2.yml up -d
fi

if [ $value -eq 3 ]
then
  docker-compose --project-name ter --file ./docker-compose-prod.yml --file ./docker-compose-prod-smartphone-1.yml --file ./docker-compose-prod-smartphone-2.yml down -v
fi
