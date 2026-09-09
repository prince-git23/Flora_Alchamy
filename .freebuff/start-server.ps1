# Derive project root from this script's location (handles spaces and any path).
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$work = Split-Path -Parent $dir
$out = Join-Path $dir 'preview.log'
$err = Join-Path $dir 'preview.log.err'
# cmd /c resolves npm.cmd; working dir is applied via cmd's /d flag so the
# spaced path is never split into separate node arguments.
$p = Start-Process -FilePath 'cmd.exe' -ArgumentList '/d','/c','npm run dev' -WorkingDirectory $work -RedirectStandardOutput $out -RedirectStandardError $err -WindowStyle Hidden -PassThru
Write-Output $p.Id