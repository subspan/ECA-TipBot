@echo off

echo "Installing wallet configuration file..."

mkdir %appdata%\Electra

copy %1\Electra.conf %appdata%\Electra

REM Just wait 2 seconds
ping -n 2 127.0.0.1 >nul 2> nul

echo "Installing latest blockchain database..."

xcopy %1\Electra_Blockchain %appdata%\Electra /S /Y >nul 2>nul
echo "All done!"

REM Just wait 3 seconds
ping -n 2 127.0.0.1 >nul 2> nul

exit