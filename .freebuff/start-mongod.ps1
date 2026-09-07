# Starts a project-local MongoDB single-node replica set (transactions enabled).
# Data lives in <repo>/.mongo-data (gitignored); logs in .freebuff/mongod.log(.err)
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $dir
$mongod = 'C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe'
$dbpath = Join-Path $root '.mongo-data'
$proc = Start-Process -FilePath $mongod -ArgumentList @(
  '--replSet', 'rs0',
  "--dbpath `"$dbpath`"",
  '--port', '27018',
  '--bind_ip', '127.0.0.1'
) -RedirectStandardOutput (Join-Path $dir 'mongod.log') `
  -RedirectStandardError (Join-Path $dir 'mongod.log.err') `
  -WindowStyle Hidden -PassThru
Write-Output $proc.Id
