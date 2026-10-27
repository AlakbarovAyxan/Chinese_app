# Component Specs

## Button
- **Variants**: primary (accent), secondary (surface), ghost (transparent), danger (danger)
- **Sizes**: sm (32px), md (40px), lg (48px)
- **States**: default, hover, active, focus-visible (2px ring, accent), disabled, loading
- **Tokens**: bg accent, text on-accent, radius pill, font sm/600
- **A11y**: real `<button>`, visible focus, loading state keeps label for screen readers
- **Used on**: S02, S05, S06

## SkillNode (SnakePath)
- **Variants**: locked (muted), active (accent), mastered (success), cracked (warning)
- **Sizes**: md (64px), lg (80px)
- **States**: default, hover (scale-105), active (scale-95)
- **Tokens**: bg surface, radius pill, shadow card
- **A11y**: accessible via keyboard focus, aria-label indicating status
- **Used on**: S01

## QuestionCard
- **Variants**: mcq (default), stroke (canvas-based), tone (audio-based)
- **Sizes**: md (full width max-2xl)
- **States**: default, selected (correct/incorrect), disabled
- **Tokens**: bg bg, border border, radius lg, shadow card
- **A11y**: semantic heading for prompt, buttons for options, audio controls accessible
- **Used on**: S02

## HeartCounter
- **Variants**: normal, depleting (shake)
- **Sizes**: md
- **States**: default, out-of-lives
- **Tokens**: text danger, font lg/bold
- **A11y**: visually indicate status with icons
- **Used on**: S02
