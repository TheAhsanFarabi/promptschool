# PromptSchool

A gamified way for beginners to learn prompt engineering. Climb a skill tree of
six real techniques, rewrite weak prompts, get live AI feedback from Gemini, earn
XP, and unlock the next skill. Plus a "Free Refine" mode that asks you questions
and sharpens your own prompt.

Built with Next.js (App Router), Tailwind CSS, and the Gemini API. The API key
stays server-side and is never exposed to the browser.

## Run it locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your key. Copy the example env file and paste in your Gemini key:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local`:

   ```
   GEMINI_API_KEY=your_real_key
   GEMINI_MODEL=gemini-2.5-flash
   ```

   Get a key at https://aistudio.google.com/apikey

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000

## How it works

- **Skill tree** (`/`): six lessons across three tiers. A tier unlocks when you
  master the one before it. Progress, XP, levels, and badges are saved in your
  browser's `localStorage`, so there is no login or database.
- **Lesson** (`/lesson/[id]`): read the technique, see a weak vs strong example,
  rewrite a weak prompt, and Gemini grades how well you applied that one
  technique. Pass to master it and earn XP.
- **Free Refine** (`/refine`): paste any rough prompt. The coach asks up to four
  clarifying questions, then writes a refined prompt and labels each change with
  the technique behind it.

## Where things live

```
app/
  page.tsx              skill tree home
  lesson/[id]/page.tsx  lesson + practice flow
  refine/page.tsx       free refine mode
  api/gemini/route.ts   server proxy that hides the key
lib/
  lessons.ts            the 6 lessons + practice prompts
  prompts.ts            Gemini system prompts for eval + socratic
  progress.ts           localStorage XP / levels / badges
components/
  SkillTree, LessonCard, PracticeBox, FeedbackPanel, Header
```

## Change the model

Set `GEMINI_MODEL` in `.env.local`. Cheap options that work well here:

- `gemini-2.5-flash` (default, good balance)
- `gemini-2.5-flash-lite` (cheapest)

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it at https://vercel.com/new
3. In the project settings, add two Environment Variables:
   `GEMINI_API_KEY` and `GEMINI_MODEL`.
4. Deploy. That's it.

## Add more lessons

Open `lib/lessons.ts` and add an object to the `LESSONS` array with a new `id`,
`tier`, `technique`, example, and practice prompt. The tree, unlock logic, and
grading all pick it up automatically.

## Notes

- The API route has a simple in-memory rate limit (20 requests/min per IP) to
  protect your quota. On Vercel's serverless functions this resets per instance,
  so add a real rate limiter if you expose this publicly.
# promptschool
