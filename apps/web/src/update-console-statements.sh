#!/bin/bash

# Script to update console statements with proper logging

# Files that need to be updated (excluding logger.ts and test files)
FILES=$(find /home/he_reat/Desktop/Projects/job-board-platform/apps/web/src -name "*.ts" -o -name "*.tsx" | xargs grep -l "console\.\(log\|error\|warn\|info\|debug\)" | grep -v logger.ts | grep -v test)

for file in $FILES; do
    echo "Processing: $file"
    
    # Check if file already has logger import
    if ! grep -q "import.*logger\|logComponentError\|logApiError" "$file"; then
        # Determine if it's a component or API file
        if [[ "$file" == *"/components/"* ]]; then
            # Add component logging import
            sed -i '1a import { logComponentError } from '\''@/lib/logger'\''' "$file"
        elif [[ "$file" == *"/api/"* ]]; then
            # Add API logging import
            sed -i '1a import { logger } from '\''@/lib/logger'\''' "$file"
        else
            # Add general logging import
            sed -i '1a import { logger } from '\''@/lib/logger'\''' "$file"
        fi
    fi
    
    # Replace console.error patterns
    sed -i 's/console\.error(\([^,]*\),\s*error)/logger.error(\1, {}, error)/g' "$file"
    sed -i 's/console\.error(\([^,]*\),\s*\([^)]*\))/logger.error(\1, { context: \2 })/g' "$file"
    sed -i 's/console\.error(\([^)]*\))/logger.error(\1)/g' "$file"
    
    # Replace console.warn patterns
    sed -i 's/console\.warn(\([^,]*\),\s*\([^)]*\))/logger.warn(\1, { context: \2 })/g' "$file"
    sed -i 's/console\.warn(\([^)]*\))/logger.warn(\1)/g' "$file"
    
    # Replace console.log patterns  
    sed -i 's/console\.log(\([^,]*\),\s*\([^)]*\))/logger.info(\1, { context: \2 })/g' "$file"
    sed -i 's/console\.log(\([^)]*\))/logger.info(\1)/g' "$file"
    
    # Replace console.info patterns
    sed -i 's/console\.info(\([^,]*\),\s*\([^)]*\))/logger.info(\1, { context: \2 })/g' "$file"
    sed -i 's/console\.info(\([^)]*\))/logger.info(\1)/g' "$file"
    
    # Replace console.debug patterns
    sed -i 's/console\.debug(\([^,]*\),\s*\([^)]*\))/logger.debug(\1, { context: \2 })/g' "$file"
    sed -i 's/console\.debug(\([^)]*\))/logger.debug(\1)/g' "$file"
    
done

echo "Console statement replacement completed!"