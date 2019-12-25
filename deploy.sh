#!/bin/bash

# Intended to be called as a cron to deploy from git master
cd "$(dirname "$0")"
git fetch --all 
diffs=$(git diff master origin/master)
if [ -z "$diffs" ]
then
    exit 0 
else
    git reset --hard origin/master
    rm -rf public/*
    /usr/bin/hugo -D -d public/
    echo $(date +"%Y-%m-%d_%H-%M-%S")" Rebuilt website" >> /var/log/kearanky_com
fi