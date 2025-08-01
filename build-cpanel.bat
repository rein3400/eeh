@echo off
echo Building Express English Hub for cPanel Deployment...
echo.

REM Build frontend
echo Building frontend...
call npm run build

REM Create deployment directory structure
if not exist "cpanel-deployment" mkdir cpanel-deployment
if not exist "cpanel-deployment\api" mkdir cpanel-deployment\api
if not exist "cpanel-deployment\articles" mkdir cpanel-deployment\articles

REM Copy frontend build files
echo Copying frontend files...
xcopy /E /Y "dist\*" "cpanel-deployment\"

REM Copy backend PHP files and ensure proper configuration
echo Copying and configuring backend files...
xcopy /E /Y "api\*" "cpanel-deployment\api\"

REM Create or update .htaccess for API routing
echo Creating .htaccess configuration...
echo ^<IfModule mod_rewrite.c^> > "cpanel-deployment\.htaccess"
echo RewriteEngine On >> "cpanel-deployment\.htaccess"
echo RewriteCond %%{REQUEST_FILENAME} !-f >> "cpanel-deployment\.htaccess"
echo RewriteCond %%{REQUEST_FILENAME} !-d >> "cpanel-deployment\.htaccess"
echo RewriteRule ^api/(.*)$ api/$1.php [L,QSA] >> "cpanel-deployment\.htaccess"
echo ^</IfModule^> >> "cpanel-deployment\.htaccess"

REM Copy articles
echo Copying articles...
xcopy /E /Y "articles\*" "cpanel-deployment\articles\"

REM Copy other necessary files
echo Copying configuration files...
copy "robots.txt" "cpanel-deployment\"
copy "_redirects" "cpanel-deployment\"
copy "sitemap.xml" "cpanel-deployment\"

REM Copy assets
copy "logo.jpg" "cpanel-deployment\"
copy "bg.jpg" "cpanel-deployment\"

echo.
echo Build completed! Files are ready in the 'cpanel-deployment' folder.
echo.
echo To deploy to cPanel:
echo 1. Zip the contents of 'cpanel-deployment' folder
echo 2. Upload the zip file to your cPanel File Manager
echo 3. Extract the zip file in your public_html directory
echo.
pause
