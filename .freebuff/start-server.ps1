# Starts the Vite frontend dev server (frontend/, port 3000).
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $dir
$frontend = Join-Path $root 'frontend'
$out = Join-Path $dir 'preview.log'
$err = Join-Path $dir 'preview.log.err'
# cmd /c resolves npm.cmd; working dir is applied via cmd's /d flag so the
# spaced path is never split into separate node arguments.
$p = Start-Process -FilePath 'cmd.exe' -ArgumentList '/d','/c','npm run dev' -WorkingDirectory $frontend -RedirectStandardOutput $out -RedirectStandardError $err -WindowStyle Hidden -PassThru
Write-Output $p.Id