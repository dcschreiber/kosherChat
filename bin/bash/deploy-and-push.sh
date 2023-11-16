#!/bin/bash

# Assign the first script argument as the commit message
COMMIT_MESSAGE=$1

if [ -z "$COMMIT_MESSAGE" ]; then
    echo "Please provide a commit message."
    exit 1
fi

# Set Git username and email for this repository
git config user.name "dcschreiber"
git config user.email "daniel1schreiber@gmail.com"

# Add all changes to git
git add .

# Commit the changes with the provided message
git commit -m "$COMMIT_MESSAGE"

# Get the current branch name
CURRENT_BRANCH=$(git branch --show-current)

# Push the current branch to Git
git push origin "$CURRENT_BRANCH"

# Run the deploy script
./deploy.sh
