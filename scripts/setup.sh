#!/bin/sh

# Ensure we're working with the correct paths regardless of where script is called from
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Get the root directory of the Git repository
GIT_ROOT=$(git rev-parse --show-toplevel)
HOOKS_DIR="$GIT_ROOT/.git/hooks"
PRE_COMMIT_FILE="$HOOKS_DIR/pre-commit"
PRE_PUSH_FILE="$HOOKS_DIR/pre-push"
POST_MERGE_FILE="$HOOKS_DIR/post-merge"

echo "Adding certain settings to Git ..."

# Set Git to handle line endings appropriately for cross-platform compatibility
git config core.autocrlf true


echo "Setting up Git hooks..."

# --- Create the pre-commit hook for Prettier ---
echo "Setting up pre-commit hook for Prettier..."
cat > "$PRE_COMMIT_FILE" << 'EOF'
#!/bin/sh

echo "Running Prettier on staged files..."

# Find staged files relevant for formatting
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|jsx|ts|tsx|mjs|cjs|json|css|md)$')

if [ -n "$STAGED_FILES" ]; then
    # Run Prettier to format the staged files
    npx prettier --write $STAGED_FILES

    # Add the potentially modified files back to the staging area
    git add $STAGED_FILES
else
    echo "No relevant files to format."
fi

exit 0
EOF

# --- Create the pre-push hook for ESLint ---
echo "Setting up pre-push hook for ESLint..."
cat > "$PRE_PUSH_FILE" << 'EOF'
#!/bin/sh

# Run ESLint on the entire project
npx eslint .

# Check the exit code of the last command
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "ESLint found errors. Push aborted."
    echo "Please fix the errors and try pushing again."
    exit 1
fi

echo "ESLint check passed. Proceeding with push."
exit 0
EOF

# --- Create the post-merge hook ---
echo "Setting up post-merge hook to run 'npm install'..."
cat > "$POST_MERGE_FILE" << 'EOF'
#!/bin/sh

# This hook runs after a successful `git pull` or `git merge`.
echo "Checking for dependency changes..."

# Check if package.json or package-lock.json has changed since the last state
if git diff --name-only HEAD@{1} HEAD | grep -qE "package(-lock)?\.json$"; then
    echo "Dependencies have changed. Running 'npm install'..."
    npm install
    echo "'npm install' finished."
else
    echo "No dependency changes detected."
fi

exit 0
EOF

# Make all hooks executable
chmod +x "$PRE_COMMIT_FILE"
chmod +x "$PRE_PUSH_FILE"
chmod +x "$POST_MERGE_FILE"

echo "Git hooks have been set up successfully."