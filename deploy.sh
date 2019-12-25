#!/bin/bash

# Intended to be called as a cron to deploy from git master
cd "$(dirname "$0")"
git fetch --all
if [[ $(git status --porcelain) ]]; then
    git reset --hard origin/master
    rm -rf public/*
    /usr/bin/hugo -D -d public/
    echo "$(date +\"%Y-%m-%d_%H-%M-%S\") Rebuilt website" > /var/log/"$0"
fi