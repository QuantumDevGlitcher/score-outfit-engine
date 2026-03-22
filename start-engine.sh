#!/bin/bash

# SCORE Outfit Engine - Unified Start Script (Git Bash Wrapper)
# This script launches the PowerShell engine initializer, which is more robust on Windows.

echo "========================================"
echo "   SCORE OUTFIT ENGINE - INITIALIZER   "
echo "========================================"

# Run the PowerShell script
powershell.exe -ExecutionPolicy Bypass -Command "& { ./start-engine.ps1 }"
