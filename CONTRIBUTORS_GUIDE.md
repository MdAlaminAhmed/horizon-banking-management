# How to Remove Contributors from GitHub

This guide explains how to clean up your GitHub repository to show only your name as the contributor.

## Method 1: Start Fresh (Easiest - Recommended)

This creates a completely new git history with only you as the contributor.

```bash
# 1. Backup your current work
cp -r . ../horizon-banking-backup

# 2. Remove existing git history
rm -rf .git

# 3. Initialize new repository
git init

# 4. Configure your identity
git config user.name "Md. Al-Amin Ahmed"
git config user.email "contact.alamin02@gmail.com"

# 5. Add all files
git add .

# 6. Create first commit
git commit -m "Initial commit: Horizon Banking Management System"

# 7. Connect to GitHub
git remote add origin https://github.com/MdAlaminAhmed/horizon-banking-management.git

# 8. Push to GitHub (force push)
git branch -M main
git push -u origin main --force
```

**⚠️ Warning:** This will delete all previous commit history!

## Method 2: Rewrite History (Advanced)

This changes the author of all existing commits to your name.

```bash
# Run this command (all in one line)
git filter-branch -f --env-filter 'CORRECT_NAME="Md. Al-Amin Ahmed"; CORRECT_EMAIL="contact.alamin02@gmail.com"; export GIT_COMMITTER_NAME="$CORRECT_NAME"; export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"; export GIT_AUTHOR_NAME="$CORRECT_NAME"; export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"' --tag-name-filter cat -- --branches --tags

# Force push to GitHub
git push origin main --force
```

## Method 3: Use .mailmap (Keeps History)

The `.mailmap` file I created will map other contributors to your name. After creating it:

```bash
# Add the .mailmap file
git add .mailmap

# Commit
git commit -m "Add mailmap to consolidate contributors"

# Push
git push origin main
```

## After Cleaning Up

1. **Verify on GitHub**
   - Go to your repository
   - Check the "Contributors" section
   - Should show only your name

2. **Update README**
   - The new README.md is already created
   - It's professional and comprehensive
   - No mention of other contributors

3. **Push Updated Files**
   ```bash
   git add README.md .mailmap .github/
   git commit -m "docs: Update README and repository configuration"
   git push origin main
   ```

## Preventing Future Issues

Always ensure your git config is set correctly:

```bash
# Set globally
git config --global user.name "Md. Al-Amin Ahmed"
git config --global user.email "contact.alamin02@gmail.com"

# Or set per repository
cd /path/to/your/repo
git config user.name "Md. Al-Amin Ahmed"
git config user.email "contact.alamin02@gmail.com"
```

## FAQ

**Q: Will this affect my commit history?**
- Method 1: Yes, creates new history
- Method 2: Yes, rewrites existing history
- Method 3: No, just remaps names

**Q: Can I undo this?**
- Only if you have a backup before running commands

**Q: Is force push safe?**
- Yes, if you're the only one working on the repository
- No, if others have cloned the repo

**Q: Why do contributors show up?**
- GitHub reads commit author information from git history
- Even if you clone someone's project, their commits show their name

## Recommended Approach

For your situation, I recommend **Method 1 (Start Fresh)** because:
1. ✅ Cleanest solution
2. ✅ No complicated commands
3. ✅ Fresh start with only your contributions
4. ✅ All your recent changes are preserved
5. ✅ Simple to execute

## Support

If you need help, refer to:
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Documentation](https://docs.github.com)
