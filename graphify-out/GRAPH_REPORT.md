# Graph Report - Chinese_app  (2026-10-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 174 nodes · 229 edges · 13 communities (9 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 23,714 input · 1,305 output

## Community Hubs (Navigation)
- Character Review UI
- Learning Component Library
- Build and Lint Config
- App TypeScript Configuration
- Lesson Management UI
- Development Dependencies
- Node TypeScript Configuration
- Project Dependencies
- Build Scripts
- Supabase Integration
- TypeScript Project References

## God Nodes (most connected - your core abstractions)
1. `react` - 20 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 15 edges
4. `App()` - 8 edges
5. `speak()` - 7 edges
6. `LessonScreen()` - 6 edges
7. `Lesson` - 5 edges
8. `Question` - 5 edges
9. `scripts` - 5 edges
10. `QuestionCard()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `LessonControllerProps` --references--> `Question`  [EXTRACTED]
  replica/components/LessonController.tsx → src/types/index.ts
- `LessonScreenProps` --references--> `Lesson`  [EXTRACTED]
  src/components/LessonScreen.tsx → src/types/index.ts
- `QuestionCardProps` --references--> `Question`  [EXTRACTED]
  src/components/QuestionCard.tsx → src/types/index.ts
- `App()` --calls--> `LessonScreen()`  [EXTRACTED]
  src/App.tsx → src/components/LessonScreen.tsx
- `App()` --calls--> `CharacterReviewScreen()`  [EXTRACTED]
  src/App.tsx → src/components/CharacterReviewScreen.tsx

## Import Cycles
- None detected.

## Communities (13 total, 4 thin omitted)

### Community 0 - "Character Review UI"
Cohesion: 0.11
Nodes (18): lucide-react, react-dom, App(), CharacterReviewScreen(), Flashcard, CharacterData, HanziCanvas(), HanziCanvasProps (+10 more)

### Community 1 - "Learning Component Library"
Cohesion: 0.09
Nodes (9): react, CharacterData, HanziCanvasProps, Stroke, MOCK_NODES, SkillNode, PinyinBuilderProps, TONES (+1 more)

### Community 2 - "Build and Lint Config"
Cohesion: 0.10
Nodes (22): name, private, type, version, autoprefixer, canvas-confetti, eslint, @eslint/js (+14 more)

### Community 3 - "App TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 4 - "Lesson Management UI"
Cohesion: 0.20
Nodes (11): LessonControllerProps, LessonScreen(), LessonScreenProps, ProgressBar(), ProgressBarProps, QuestionCard(), QuestionCardProps, Lesson (+3 more)

### Community 5 - "Development Dependencies"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+9 more)

### Community 6 - "Node TypeScript Configuration"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 7 - "Project Dependencies"
Cohesion: 0.29
Nodes (7): dependencies, canvas-confetti, lucide-react, react, react-dom, @supabase/auth-helpers-react, @supabase/supabase-js

### Community 8 - "Build Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

## Knowledge Gaps
- **9 isolated node(s):** `autoprefixer`, `postcss`, `@supabase/auth-helpers-react`, `tailwindcss`, `@types/canvas-confetti` (+4 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 107 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Learning Component Library` to `Character Review UI`, `Build and Lint Config`, `Lesson Management UI`?**
  _High betweenness centrality (0.360) - this node is a cross-community bridge._
- **What connects `autoprefixer`, `postcss`, `@supabase/auth-helpers-react` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Character Review UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11396011396011396 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `Development Dependencies` to `Build and Lint Config`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Should `Learning Component Library` be split into smaller, more focused modules?**
  _Cohesion score 0.08923076923076922 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Project Dependencies` to `Build and Lint Config`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `Build and Lint Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._