@echo off
set arg1=%1
call tsc cli.ts
call node cli.js %arg1%