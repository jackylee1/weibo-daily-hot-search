# CodexWake watcher — polls a GitHub trigger file and wakes local Codex.
# This script NEVER deletes anything. It only reads the trigger, records
# the last processed id, and runs local Codex when a new id appears.
#
# Trigger file (posted by Koda):
#   https://raw.githubusercontent.com/jackylee1/weibo-daily-hot-search/master/codex-wake/trigger.json
# Trigger format (JSON):
#   {"id": "20261025-200500", "task": "wake", "created_at": "2026-10-25T20:05:00+08:00"}
#   - task "wake"  = just make sure remote control is up, run nothing else
#   - any other task text = run it in local Codex (codex exec)

$TriggerUrl = "https://raw.githubusercontent.com/jackylee1/weibo-daily-hot-search/master/codex-wake/trigger.json"
$StateFile  = Join-Path $PSScriptRoot "last-trigger-id.txt"
$LockFile   = Join-Path $PSScriptRoot "wake-running.lock"
$LogFile    = Join-Path $PSScriptRoot "wake-log.txt"

function Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
    Add-Content -Path $LogFile -Value $line
}

# Skip if a previous run is still active (never pile up runs)
if (Test-Path $LockFile) {
    Log "skip: previous run still active"
    exit 0
}

try {
    $resp = Invoke-WebRequest -Uri $TriggerUrl -UseBasicParsing -TimeoutSec 30
    $trigger = $resp.Content | ConvertFrom-Json
} catch {
    Log "poll failed: $($_.Exception.Message)"
    exit 0
}

if (-not $trigger.id) {
    Log "poll ok: trigger has no id, ignoring"
    exit 0
}

$lastId = ""
if (Test-Path $StateFile) { $lastId = (Get-Content $StateFile -Raw).Trim() }

if ($trigger.id -eq $lastId) {
    exit 0  # nothing new
}

# New trigger: record the id FIRST so a crash never re-runs the same task
New-Item -Path $LockFile -ItemType File -Force | Out-Null
try {
    Set-Content -Path $StateFile -Value $trigger.id -NoNewline
    Log "new trigger: id=$($trigger.id) task=$($trigger.task)"

    if ($trigger.task -and $trigger.task -ne "wake") {
        Log "running codex exec"
        codex exec $trigger.task >> $LogFile 2>&1
        Log "codex exec finished (exit=$LASTEXITCODE)"
    } else {
        Log "wake-only: ensuring remote control is up"
        codex remote-control start >> $LogFile 2>&1
        Log "remote-control start finished (exit=$LASTEXITCODE)"
    }
} finally {
    Remove-Item $LockFile -Force -ErrorAction SilentlyContinue
}
