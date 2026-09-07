# Starts the Flora Alchemy API server detached (backend/server.js, port 4000).
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $dir
$backend = Join-Path $root 'backend'
$proc = Start-Process -FilePath 'node.exe' -ArgumentList @('server.js') `
  -WorkingDirectory $backend `
  -RedirectStandardOutput (Join-Path $dir 'backend.log') `
  -RedirectStandardError (Join-Path $dir 'backend.log.err') `
  -WindowStyle Hidden -PassThru
Write-Output $proc.Id
