#!/bin/bash

# This hook reminds Claude to update llms.txt when site structure changes
# It checks if the modified file is relevant to site structure

# Read the tool input from stdin
INPUT=$(cat)

# Extract file path from the tool input
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Check if the file is relevant to site structure
if [[ "$FILE_PATH" =~ ^.*(docusaurus\.config|sidebars|docs/|src/pages/|blog/).*$ ]]; then
  # Return a reminder message
  echo '{"message": "Site structure may have changed. Consider updating static/llms.txt to reflect current pages and navigation."}'
fi
