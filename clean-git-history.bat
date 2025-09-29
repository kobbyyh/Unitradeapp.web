@echo off
echo Cleaning git history to remove exposed credentials...

REM Remove the files with credentials from git history
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch SETUP-INSTRUCTIONS.md api/twilio-whatsapp.js DEPLOYMENT-SETUP.md" --prune-empty --tag-name-filter cat -- --all

REM Force push to update remote repository
git push origin --force --all

echo Git history cleaned successfully!
echo You can now push normally.
