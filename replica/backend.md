# Backend Checklist

## Database
- [x] Schema defined in `replica/schema.sql`.
- [x] Row Level Security (RLS) policies implemented for `profiles`, `user_lesson_progress`, and `user_character_progress`.
- [ ] Database backup enabled (ensure in Supabase dashboard).

## Auth
- [ ] Supabase Auth configured.
- [ ] Account deletion implemented.

## Security
- [ ] Secrets (Supabase keys) handled via env vars (`.env.example` created).
- [ ] RLS policies tested (a user can only see their own progress).

## Next Steps
- [ ] Create `replica/backend.md` with full checklist.
- [ ] Implement Supabase client setup in the React app.
- [ ] Set up server-side triggers for streak/heart updates (SQL functions).
