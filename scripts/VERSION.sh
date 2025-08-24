#!/usr/bin/env bash
set -eu

info()    { echo -e "\033[32m$1\033[0m"; }
error()   { echo -e "\033[31m$1\033[0m"; exit 1; }

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" == "main" ]]; then
  exit 0
fi

if [[ -n "$(git status --porcelain)" ]]; then
  error "Commit changes first"
fi

LATEST_COMMIT_MSG=$(git log -1 --pretty=%B)
if [[ "$LATEST_COMMIT_MSG" == *"up version"* ]]; then
  info "Latest commit already bumps version"
  exit 0
fi

CURRENT_VERSION=$(node -p "require('./package.json').version")
VERSION=${1:-}

if [[ -z "$VERSION" ]]; then
  VERSION=$(npx semver "$CURRENT_VERSION" -i patch)
else
  if ! npx semver -r ">$CURRENT_VERSION" "$VERSION" >/dev/null 2>&1; then
    error "Version $VERSION must be greater than current $CURRENT_VERSION"
  fi
fi

if npm version "$VERSION" --no-git-tag-version && npm install --package-lock-only; then
  git add package.json package-lock.json
  git commit -m "up version to $VERSION"
  info "Updated version to $VERSION"
else
  error "Failed to update version or package-lock"
fi