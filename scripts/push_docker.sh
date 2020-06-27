#!/bin/bash -x

# Create Image
sudo docker build -t $1 ..

LOGIN=$(aws ecr get-login --no-include-email --region eu-west-1)
echo $LOGIN
LOGIN_RES=$(sudo $LOGIN)
echo $LOGIN_RES

# TAG
sudo docker tag $1 944222683591.dkr.ecr.eu-west-1.amazonaws.com/d2d-backend-stage

# PUSH
sudo docker push 944222683591.dkr.ecr.eu-west-1.amazonaws.com/d2d-backend-stage

