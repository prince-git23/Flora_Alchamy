$work = 'C:\Users\Prince yadav\OneDrive\Desktop\FloraAlchamy\Project_Source\Flora_Alchamy'
$out = Join-Path $work '.freebuff\preview-b9de382e-8dfd-447c-a85b-344f066eee67.log'
$err = Join-Path $work '.freebuff\preview-b9de382e-8dfd-447c-a85b-344f066eee67.log.err'
# cmd /c resolves npm.cmd; working dir is applied via cmd's /d flag so the
# spaced path is never split into separate node arguments.
$p = Start-Process -FilePath 'cmd.exe' -ArgumentList '/d','/c','npm run dev' -WorkingDirectory $work -RedirectStandardOutput $out -RedirectStandardError $err -WindowStyle Hidden -PassThru
Write-Output $p.Id