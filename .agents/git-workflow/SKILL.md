---
name: git-workflow
description: Standardized Git and GitHub CLI (gh) workflow for all agents and skills, ensuring proper issue tracking, branching, and pull requests.
---

# Git Workflow Skill

## Objective
To enforce a strict version control and issue-tracking workflow using `git` and `gh` (GitHub CLI) for all tasks. This skill should be utilized alongside other skills.

## Rules & Guidelines

All agents must follow this exact sequence when handling a task:

1. **Issue Tracking (GitHub)**:
   - For every request, bug, or feature, create a new GitHub Issue using `gh issue create`.
   - Use a standardized Markdown format for the issue body (include Context, Acceptance Criteria, and Tasks).

2. **Task Assignment & Execution**:
   - Read the issue details or the specific GitHub issue link provided by the user.
   - Execute the code changes and implementation based on the active issue being discussed.

3. **Branching**:
   - Once implementation is done, create and checkout a new branch corresponding to the issue.
   - You MUST use standard branch naming conventions: `feat/issue-[number]-[short-desc]`, `bugfix/issue-[number]-[short-desc]`, or `chore/issue-[number]-[short-desc]`.
   - Push the new sub-branch to the remote repository (`git push -u origin branch-name`).

4. **Automated Test Execution (Mandatory)**:
   - Before committing changes or creating a Pull Request, run the automated test scripts (`php artisan test`) created/updated according to the `fullstack-convention` guidelines.
   - All unit and feature tests MUST pass with 100% success (0 failed / 0 errors). NEVER commit or push code with failing test suites.

5. **Commit & Pull Request**:
   - Commit the changes using **Conventional Commits** (e.g., `feat: add registration form`, `fix: resolve race condition in booking`, `docs: update ui specifications`).
   - Create a Pull Request (PR) targeting the `main` branch using `gh pr create`.
   - Link the PR to the original issue to automatically close it upon merge (e.g., "Closes #12").
