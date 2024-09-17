@echo off
setlocal

:: Handle the "install" command to install npm dependencies
if "%1"=="install" (
    echo Installing dependencies...
    npm install
    exit /b 0
)

:: Handle the "test" command
if "%1"=="test" (
    set "URL_FILE=test_cases.txt"
    
    if not exist "%URL_FILE%" (
        echo Error: File "%URL_FILE%" does not exist.
        exit /b 1
    )

    :: Create the directory to store outputs
    set "OUTPUT_DIR=test_outputs"
    if not exist "%OUTPUT_DIR%" (
        mkdir "%OUTPUT_DIR%"
    )

    :: Initialize index
    set /a INDEX=1

    :: Read each line (URL) from the file and process it
    for /f "delims=" %%a in (%URL_FILE%) do (
        echo Processing test case #%INDEX% with URL: %%a

        :: Run the Node.js script and save output to a file
        node metrics.js "%%a" > "%OUTPUT_DIR%\output_%INDEX%.json"

        echo Output for test case #%INDEX% written to %OUTPUT_DIR%\output_%INDEX%.json

        :: Increment the index
        set /a INDEX+=1

        :: Stop after 20 test cases
        if %INDEX% gtr 20 (
            goto :done
        )
    )
    :done
    echo Completed running 20 test cases.
    exit /b 0
)

:: Handle running with a specific URL file
set "URL_FILE=%1"

if not exist "%URL_FILE%" (
    echo Error: File "%URL_FILE%" does not exist.
    exit /b 1
)

:: Create the directory to store outputs
set "OUTPUT_DIR=outputs"
if not exist "%OUTPUT_DIR%" (
    mkdir "%OUTPUT_DIR%"
)

:: Initialize index
set /a INDEX=1

:: Read each line (URL) from the file and process it
for /f "delims=" %%a in (%URL_FILE%) do (
    echo Processing URL: %%a

    :: Run the Node.js script and save output to a file
    node metrics.js "%%a" > "%OUTPUT_DIR%\output_%INDEX%.json"

    echo Output for URL %%a written to %OUTPUT_DIR%\output_%INDEX%.json

    :: Increment the index
    set /a INDEX+=1
)

echo Completed processing all URLs.
exit /b 0


::set arg1=%1
::call tsc cli.ts
::call node cli.js %arg1%