# Test Plan: Hybrid Mandarin Learning App

## F01: Daily Lesson Completion
- **F01-H1 (Happy Path)**: User opens snake map, clicks unlocked node, completes 3 MCQ questions, streak updates, XP updates, progress saved.
- **F01-E1 (Heart Depletion)**: User answers 5 questions incorrectly, hearts reach 0, player redirected to "Out of Lives" screen.
- **F01-N1 (RLS Check)**: Second user attempts to access first user's `user_lesson_progress` — should return empty list or error.

## F02: Character Mastery Deep-Dive
- **F02-H1 (Happy Path)**: User opens Review Mode, traces character in `<HanziCanvas />`, visual validation shows success, progress increments.
- **F02-N1 (Permission)**: User attempts to update progress for a character they haven't encountered yet — should fail.

## Bugs
None currently reported.

## Summary
- **Automation**: Playwright setup needed.
- **Manual**: Connectivity, RLS policies, and Hook integration tests.
