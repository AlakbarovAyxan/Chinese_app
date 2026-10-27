# Parity Report

## Overall Verdict: Not Shippable
The clone currently implements pedagogical tools successfully but lacks the core gamification engine required for parity with the original's core loop.

## Metrics
- **Feature Parity Score**: 37.5%
- **Must-Haves Completed**: 3 / 6

## Feature Parity Analysis
| Feature | Priority | Original | Clone |
| --- | --- | --- | --- |
| Snake Skill Tree | must | yes | no |
| Daily Streaks | must | yes | no |
| Hearts / Lives System | must | yes | no |
| Stroke Order Trainer | must | yes | yes |
| Tone Training | must | yes | yes |
| Pinyin Breakdown | must | yes | yes |

## Top 5 Things to Build Next
1. **Snake Path Logic**: Implement dynamic Bezier curve generation for the snake navigation.
2. **Streak Engine**: Hook up daily login tracking and streak persistence in Supabase.
3. **Hearts Manager**: Implement the heart depletion and background refill timer logic.
4. **Reward System**: Connect XP and confetti feedback loops to lesson completion.
5. **Character SRS**: Build the Spaced Repetition review module.

Co-Authored-By: Claude Code <noreply@anthropic.com>