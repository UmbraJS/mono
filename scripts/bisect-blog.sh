#!/usr/bin/env zsh
set -euo pipefail

# Step through commits after a known-good commit and build apps/blog.
# For each commit, we run install (to keep deps consistent) and measure build time.
# Logs are written to logs/build-<shortsha>.log and a summary to logs/summary.tsv
#
# Usage:
#   scripts/bisect-blog.sh [--limit N] [--target <ref>] [--good <sha>] [--clean]
#
# Defaults:
#   --good   bd86259466be7a15730e60f992f5789edc94d5de
#   --target origin/main
#   --limit  1 (advance one commit)
#   --clean  if set, runs git clean -fdx between commits (slower, but less cache noise)

GOOD="bd86259466be7a15730e60f992f5789edc94d5de"
TARGET="origin/main"
LIMIT=1
CLEAN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --good)
      GOOD="$2"; shift 2;;
    --target)
      TARGET="$2"; shift 2;;
    --limit)
      LIMIT="$2"; shift 2;;
    --clean)
      CLEAN=true; shift 1;;
    *)
      echo "Unknown arg: $1" >&2; exit 1;;
  esac
done

ROOT_DIR=$(git rev-parse --show-toplevel)
cd "$ROOT_DIR"

mkdir -p logs
SUMMARY_FILE="logs/summary.tsv"
if [[ ! -f "$SUMMARY_FILE" ]]; then
  echo -e "date\tcommit\tshort\tsubject\treal_seconds\tstatus" > "$SUMMARY_FILE"
fi

echo "Fetching latest..." >&2
git fetch --prune

echo "Enumerating commits after $GOOD up to $TARGET..." >&2

# Reverse helper compatible with macOS (no tac by default)
reverse_lines() {
  if command -v tac >/dev/null 2>&1; then
    tac
  elif command -v tail >/dev/null 2>&1; then
    tail -r
  else
    awk '{a[NR]=$0} END{for(i=NR;i>=1;i--) print a[i]}'
  fi
}

COMMITS=( $(git rev-list --ancestry-path ${GOOD}..${TARGET} | reverse_lines) )

if (( ${#COMMITS[@]} == 0 )); then
  echo "No commits to process. You're at target or ahead." >&2
  exit 0
fi

COUNT=$LIMIT
for COMMIT in ${COMMITS[@]}; do
  if (( COUNT <= 0 )); then
    break
  fi
  SHORT=$(git rev-parse --short "$COMMIT")
  SUBJECT=$(git show -s --format=%s "$COMMIT")
  LOGFILE="logs/build-${SHORT}.log"

  echo "\n--- Checking out $COMMIT ($SHORT) — $SUBJECT" | tee -a "$LOGFILE"
  # Discard any tracked changes (e.g., pnpm-lock.yaml) from the previous step
  # to avoid checkout interruptions.
  git reset --hard -q || true
  git checkout -q "$COMMIT"

  if [[ "$CLEAN" = true ]]; then
    echo "Cleaning workspace (git clean -fdx)..." | tee -a "$LOGFILE"
    git clean -fdx -e .vscode -e .idea | tee -a "$LOGFILE" || true
  fi

  echo "Installing deps (pnpm -w install)..." | tee -a "$LOGFILE"
  pnpm -w install |& tee -a "$LOGFILE"

  echo "Building blog (apps/blog)..." | tee -a "$LOGFILE"
  START=$(date +%s)
  if pnpm -C apps/blog build |& tee -a "$LOGFILE"; then
    STATUS=OK
  else
    STATUS=FAIL
  fi
  END=$(date +%s)
  REAL=$(( END - START ))

  echo "Result: $STATUS in ${REAL}s for $SHORT — $SUBJECT" | tee -a "$LOGFILE"
  printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$COMMIT" "$SHORT" "$SUBJECT" "$REAL" "$STATUS" >> "$SUMMARY_FILE"

  COUNT=$(( COUNT - 1 ))
done

echo "\nDone. See $SUMMARY_FILE and logs/build-*.log for details." >&2
