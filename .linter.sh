#!/bin/bash
cd /home/kavia/workspace/code-generation/webtictactoe-109618-c704f465/webtictactoe
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

