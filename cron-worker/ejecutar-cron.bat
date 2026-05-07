@echo off
echo [%date% %time%] Ejecutando cron-worker... >> C:\cron-worker\logs.txt
docker run --rm --env-file "C:\cron-worker\.env" cron-worker >> C:\cron-worker\logs.txt 2>&1
echo [%date% %time%] Cron finalizado. >> C:\cron-worker\logs.txt