# Recon map: Hybrid Mandarin Learning App (Web)

Scope: Merging Duolingo's gamification (Snake Tree, Streaks, Hearts) with HelloChinese's Mandarin pedagogy (Stroke Order, Tone Training, Pinyin Breakdown).
For: Chinese language learners seeking both engagement and linguistic rigor.
Date: 2026-10-18

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | Duolingo Marketing | https://www.duolingo.com | Visual style, snake path logic, streak mechanics. |
| 2 | HelloChinese Site | https://www.hellochinese.cc | Character stroke order, tone drills, HSK curriculum. |
| 3 | Duolingo Help Center | https://support.duolingo.com | Heart refill logic, league mechanics, XP details. |
| 4 | HelloChinese Help | https://www.hellochinese.cc/faq.html | Mandarin-specific tools: stroke order, tone visualization. |
| 5 | Public Walkthroughs | YouTube/App Store | UI flows for lesson completion and character review. |

## Core loop

Users follow a linear "Snake" path of lessons to earn XP and maintain Streaks, while specialized Mandarin modules (Stroke/Tone) ensure linguistic mastery through interactive validation.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Snake Map | `/path` (Main Home) | Navigation & Progression | `<SnakePath />`, `<SkillNode />`, `<StatusBar />` | Locked, unlocked, completed, review-ready |
| S02 | Lesson Player | `/lesson/:id` | Active Learning | `<QuestionCard />`, `<ProgressBar />`, `<HeartCounter />` | MCQ, Stroke Order, Tone Trainer, Correct/Incorrect |
| S03 | Stroke Trainer | Within Lesson / Review | Handwriting Mastery | `<HanziCanvas />`, `<RadicalInfo />` | Animation, tracing, validation, hint |
| S04 | Tone Trainer | Within Lesson / Review | Phonetic Precision | `<PitchVisualizer />`, `<ToneToggle />` | Listening, Recording, Comparison, Feedback |
| S05 | Completion | End of Lesson | Reward & Retention | `<RewardModal />`, `<StreakCounter />`, `<XPBar />` | Milestone, rank up, streak fire animation |
| S06 | Character Review| `/review` | SRS Character Practice| `<Flashcard />`, `<CharacterGrid />` | Front, Back, Spaced Repetition status |

## Flows

```
F01 Daily Lesson Completion (Hybrid Flow)
    S01 Path -> S02 Lesson (MCQ -> Pinyin -> Stroke -> Tone) -> S05 Completion
    happy path clicks: ~12-15 per lesson
    edge: run out of hearts (S02 -> Heart Shop), incorrect tone (Retry loop)

F02 Character Mastery Deep-Dive
    S06 Review -> S03 Stroke Trainer -> S04 Tone Trainer -> Back to S06
    happy path clicks: 3 per character
    edge: stroke direction error, radical misidentification
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| `<SkillNode />` | Unit, Bonus, Review | Locked, Active, Mastered, Cracked | S01 |
| `<HanziCanvas />` | Trace, Free-write | Empty, Drawing, Success, Error | S03 |
| `<PitchVisualizer />`| Reference, Record | Silent, Playing, Listening, Result | S04 |
| `<HeartCounter />` | Numeric, Infinite | Default, Depleting, Refilling | S02 |
| `<StreakFire />` | Mini, Large | Cold, Warm, On-fire (Milestone) | S01, S05 |

## Inferred data model

```
User        id, username, streak_count, hearts (0-5), last_active_at, xp_total
            evidence: S01, S02 headers, completion rewards
            confidence: high

LessonNode  id, title, category, position_x, position_y, status (locked|unlocked|completed)
            evidence: S01 Snake Path layout
            confidence: high

Character   id, simplified, traditional, pinyin, radical, stroke_paths (SVG), audio_url
            evidence: S03, S04 specialized Mandarin screens
            confidence: high

Progress    user_id, node_id, mastery_level (0-3), last_reviewed_at
            evidence: S01 progress rings around nodes
            confidence: high
```

Relationships: User 1-n Progress, LessonNode 1-n Character (mapped learning items).

## Feature matrix

See `replica/features.csv`. Must: 6, should: 4, could: 2, skip: 2.

## Out of scope (cannot or should not be cloned)

- **Proprietary AI Voice Recognition:** Using Web Speech API / Open models instead of Duo/HC's proprietary engines.
- **Social Network/Friends Feed:** Focus on individual core learning loop first.
- **Licensed IP:** Using custom/open-source Mandarin curriculum (HSK 3.0 based) rather than exact Duo/HC content.

## Size

Screens 6, flows 2, entities 4. Hard parts: Bezier Snake Path logic, Real-time Stroke Validation, Audio Pitch Contour Visualization. Size: M.

## Hybrid Architecture Blueprint

### Frontend (React + Vite + Tailwind)
1. **Core Learning Engine:** A state machine (`useLessonMachine`) that handles question sequencing and transitions between gamified and pedagogical modes.
2. **Mandarin Engine:**
   - **SVG Stroke Manager:** Handles Hanzi animation and point-by-point intersection tests for handwriting.
   - **Web Audio Analyzer:** Captures microphone input and extracts fundamental frequency (F0) for tone contour comparison.
3. **Gamification Layer:** Persistent storage (Local + Sync) for heart depletion, streak calculation, and XP milestones.
4. **Path Layout:** A dynamic SVG connector generator for the "Snake" UI, calculating node positioning based on a modular path definition.

### Backend (Inferred)
- **Edge Functions:** Daily streak cron jobs and heart refill timers.
- **Content Delivery:** JSON-based HSK curriculum mapping characters to lessons and review schedules.
- **SRS Engine:** Server-side calculation of next review dates based on user performance.
