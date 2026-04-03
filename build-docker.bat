@echo off
REM Production Docker Build and Push Script for Windows

setlocal enabledelayedexpansion

REM Configuration
set REGISTRY_URL=%1
if "!REGISTRY_URL!"=="" set REGISTRY_URL=docker.io

set NAMESPACE=%2
if "!NAMESPACE!"=="" set NAMESPACE=gw

set VERSION=%3
if "!VERSION!"=="" set VERSION=latest

set BACKEND_IMAGE=gw-dashboard-backend
set FRONTEND_IMAGE=gw-dashboard-frontend

echo.
echo === GW Dashboard Docker Build Script ===
echo Registry: !REGISTRY_URL!
echo Namespace: !NAMESPACE!
echo Version: !VERSION!
echo.

REM Build backend
echo Building backend...
docker build -t !BACKEND_IMAGE!:!VERSION! .\backend
if errorlevel 1 (
    echo Failed to build backend
    exit /b 1
)
echo Backend built successfully
echo.

REM Build frontend
echo Building frontend...
docker build -t !FRONTEND_IMAGE!:!VERSION! .\frontend
if errorlevel 1 (
    echo Failed to build frontend
    exit /b 1
)
echo Frontend built successfully
echo.

REM Tag and push if needed
if not "!REGISTRY_URL!"=="docker.io" (
    echo.
    echo Tagging images for registry...
    set BACKEND_REGISTRY=!REGISTRY_URL!/!NAMESPACE!/!BACKEND_IMAGE!
    set FRONTEND_REGISTRY=!REGISTRY_URL!/!NAMESPACE!/!FRONTEND_IMAGE!
    
    docker tag !BACKEND_IMAGE!:!VERSION! !BACKEND_REGISTRY!:!VERSION!
    docker tag !BACKEND_IMAGE!:!VERSION! !BACKEND_REGISTRY!:latest
    
    docker tag !FRONTEND_IMAGE!:!VERSION! !FRONTEND_REGISTRY!:!VERSION!
    docker tag !FRONTEND_IMAGE!:!VERSION! !FRONTEND_REGISTRY!:latest
    
    echo.
    echo Images tagged. You can now push them:
    echo docker push !BACKEND_REGISTRY!:!VERSION!
    echo docker push !FRONTEND_REGISTRY!:!VERSION!
)

echo.
echo === Build Complete ===
echo.
echo Next steps:
echo 1. Verify images: docker images ^| findstr gw-dashboard
echo 2. Test locally: docker-compose up -d
echo 3. Check health: docker-compose ps
echo 4. View logs: docker-compose logs -f
echo.

endlocal
