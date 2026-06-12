export type Example = {
  before: string;
  after: string;
  why: string;
};

export type TemplateExample = Example & {
  formula: string;
};

export type PracticeTopic = {
  label: string;
  brief: string;
  weakPrompt: string;
  hint: string;
};

export type Lesson = {
  id: string;
  tier: 1 | 2 | 3;
  technique: string;
  title: string;
  icon: string;
  xp: number;
  summary: string;
  explanation: string;
  examples: {
    simple: Example;
    template: TemplateExample;
    impact: Example;
  };
  practice: {
    topics: PracticeTopic[];
  };
};

export const LESSONS: Lesson[] = [
  {
    id: "specific",
    tier: 1,
    technique: "Be Specific",
    title: "Be Specific",
    icon: "🎯",
    xp: 100,
    summary: "Vague prompts get vague answers. Pin down exactly what you want.",
    explanation:
      "An AI cannot read your mind. When a prompt is broad, the model has to guess what you meant — and it usually guesses generic. The fix is to add concrete details: the topic, the length, the angle, the thing you actually care about. Specific in, specific out.",
    examples: {
      simple: {
        before: "Write something about dogs.",
        after:
          "Write a 150-word beginner guide on how to crate-train a 10-week-old Labrador puppy, focused on the first three days.",
        why: "Five vague words became a target: length, reader level, task, breed, age, and time window. The model has nothing left to guess.",
      },
      template: {
        formula:
          "Write a [length] [format] for [audience] about [specific topic], focusing on [angle or constraint].",
        before: "Give me content about coffee.",
        after:
          "Write a 200-word explainer for someone who just bought their first espresso machine, about why grind size matters, covering the difference between too fine and too coarse.",
        why: "Filling in the formula slots — length, audience, topic, angle — removes every assumption the model would otherwise make.",
      },
      impact: {
        before: "Help me write a speech.",
        after:
          "Write a 3-minute best-man speech for my brother's wedding. He and his partner met hiking, they're both engineers, tone should be warm and funny — two jokes maximum, one heartfelt closing line, no roasting.",
        why: "Without specifics you get a fill-in-the-blank template anyone could have written. With them the output is nearly usable on the day.",
      },
    },
    practice: {
      topics: [
        {
          label: "Study Tips",
          brief: "Make this study advice actually useful.",
          weakPrompt: "Give me tips for studying.",
          hint: "Name the subject, the student's level, available time, and what 'good' looks like to them.",
        },
        {
          label: "Recipe Help",
          brief: "Turn a vague food request into a precise one.",
          weakPrompt: "Suggest something to cook for dinner.",
          hint: "Name dietary restrictions, skill level, time available, and how many people you're cooking for.",
        },
        {
          label: "Fitness Advice",
          brief: "Sharpen a generic fitness ask.",
          weakPrompt: "Tell me how to get in shape.",
          hint: "Name the goal (strength? endurance?), current fitness level, equipment access, and available days per week.",
        },
        {
          label: "Travel Rec",
          brief: "Turn a broad travel question into a targeted one.",
          weakPrompt: "Recommend somewhere to travel.",
          hint: "Name budget, travel style, trip length, who is going, and the kind of experience you're after.",
        },
      ],
    },
  },

  {
    id: "context",
    tier: 1,
    technique: "Give Context",
    title: "Give Context",
    icon: "🧩",
    xp: 100,
    summary: "Tell the AI the situation around the task, not just the task.",
    explanation:
      "The same request can have completely different right answers depending on the situation. Context is the background the model needs: who you are, what you already tried, what the output is for, and any constraints. Good context removes wrong assumptions before they happen.",
    examples: {
      simple: {
        before: "Fix my email.",
        after:
          "I'm a junior developer emailing my manager to ask for a deadline extension. Here is my draft: [paste]. Keep it polite and under 80 words, and don't sound like I'm making excuses.",
        why: "The model now knows the relationship, the goal, the tone constraint, and the length limit. It can edit for the real situation.",
      },
      template: {
        formula:
          "I am [who you are]. I am trying to [goal]. The constraint is [constraint]. Here is my situation/draft: [paste]. Please [specific ask].",
        before: "Write a LinkedIn post about my promotion.",
        after:
          "I'm a marketing manager who just got promoted to Director. I want a LinkedIn post — professional but not braggy, around 80 words, ending with something that invites connection rather than just announcing news. My audience is other marketers.",
        why: "The template forces you to define who, goal, constraint, and situation — four things that completely change what 'good' looks like.",
      },
      impact: {
        before: "How do I negotiate a raise?",
        after:
          "I've been a software engineer at this startup for 2 years. I've shipped 3 major features, I'm underpaid vs. market by about 20%, and my review is in 2 weeks. I'm nervous. Give me a 5-step script for how to bring it up with my manager, including how to open the conversation.",
        why: "Generic negotiation advice is useless. Context about your timeline, leverage, and emotional state gets you something you can actually say.",
      },
    },
    practice: {
      topics: [
        {
          label: "Trip Planning",
          brief: "Add context so the AI can plan your actual trip.",
          weakPrompt: "Help me plan a trip.",
          hint: "Who's going, when, budget, trip style, and any constraints like mobility issues or fixed dates.",
        },
        {
          label: "Cover Letter",
          brief: "Give the AI what it needs to write for your specific role.",
          weakPrompt: "Write me a cover letter.",
          hint: "Your background, the specific role and company, and what one thing you most want to highlight.",
        },
        {
          label: "Product Launch",
          brief: "Set up the context for a meaningful launch post.",
          weakPrompt: "Write a post about my product launch.",
          hint: "What the product does, who it's for, what makes it different, the tone you want, and where it will be posted.",
        },
        {
          label: "Ask for Feedback",
          brief: "Give context so you get useful, not generic, feedback.",
          weakPrompt: "Can you give me feedback on my work?",
          hint: "What the work is, what stage it's at, what kind of feedback is most useful right now, and what you're not looking for.",
        },
      ],
    },
  },

  {
    id: "role",
    tier: 2,
    technique: "Assign a Role",
    title: "Assign a Role",
    icon: "🎭",
    xp: 150,
    summary: "Tell the AI who it should act as. It changes the whole answer.",
    explanation:
      "Asking the model to take on a role steers its vocabulary, depth, and priorities. 'Explain like a doctor' and 'explain like a kindergarten teacher' produce very different answers to the same question. The role is a shortcut for a whole bundle of expectations about tone and expertise.",
    examples: {
      simple: {
        before: "Explain how vaccines work.",
        after:
          "You are a pediatrician talking to a nervous first-time parent. Explain how vaccines work in plain, reassuring language, no jargon, about 100 words.",
        why: "The role sets the expertise level, the audience's emotional state, and the register — three things that change everything about the answer.",
      },
      template: {
        formula:
          "You are a [expert role] speaking to [specific audience]. [Task] in [tone], [length or constraint].",
        before: "Tell me about compound interest.",
        after:
          "You are a high-school math teacher introducing compound interest to 16-year-olds for the first time. Explain it using a relatable example (not stocks), keep it under 150 words, and include a concrete number to show the math.",
        why: "The template pre-answers who is talking, who is listening, and what register to use — three decisions the model would otherwise make arbitrarily.",
      },
      impact: {
        before: "Give me feedback on my business idea.",
        after:
          "You are a skeptical VC who has seen 500 pitches and immediately spots weak market-fit arguments. I'm pitching: [idea in 2 sentences]. Give me the 3 hardest questions you'd ask and explain why each one could kill the deal.",
        why: "Without the role you get polite, generic encouragement. The VC role unlocks adversarial, high-value critique — the kind you'd only get from a real investor.",
      },
    },
    practice: {
      topics: [
        {
          label: "Loan Interest",
          brief: "Assign the right expert to explain interest rates.",
          weakPrompt: "Explain how a loan interest rate works.",
          hint: "Who should the AI be, and who is it talking to? Match the expertise level and tone to the real audience.",
        },
        {
          label: "Explain AI",
          brief: "Get the AI to explain itself through the right persona.",
          weakPrompt: "Explain what AI is.",
          hint: "Think about your real audience — a grandparent? A 10-year-old? A sceptical executive? — then pick a role that fits.",
        },
        {
          label: "Health Advice",
          brief: "Use a role to get appropriately toned health information.",
          weakPrompt: "Tell me about high blood pressure.",
          hint: "A cardiologist? A GP doing a routine check-in? Choose a role that sets the right technical depth and emotional tone.",
        },
        {
          label: "Code Review",
          brief: "Get targeted code feedback through a defined expert role.",
          weakPrompt: "Review my code.",
          hint: "A senior engineer? A security auditor? A performance expert? The role determines what the reviewer prioritises.",
        },
      ],
    },
  },

  {
    id: "format",
    tier: 2,
    technique: "Set the Format",
    title: "Set the Format",
    icon: "📐",
    xp: 150,
    summary: "Say how you want the answer shaped: a table, steps, bullets, JSON.",
    explanation:
      "If you don't specify a format, you get a wall of prose. Stating the structure up front makes the output immediately usable: a numbered checklist you can follow, a table you can scan, JSON your code can parse. Format is part of the request, not an afterthought.",
    examples: {
      simple: {
        before: "Give me ideas for a birthday party.",
        after:
          "Give me 5 birthday party themes for a 7-year-old. Return a table with columns: Theme, Key Activity, Rough Budget. Keep each cell under 10 words.",
        why: "Specifying a table, the exact columns, the count, and a cell-length cap turns a paragraph of prose into something you can scan and act on immediately.",
      },
      template: {
        formula:
          "[Task]. Return [format: table / numbered list / JSON / bullet points] with [columns / fields / structure]. [Count or length constraint per item].",
        before: "What tools should I use for a React project?",
        after:
          "List 6 essential tools for a mid-size React project. Return a table with columns: Tool, What it does (1 sentence max), When to add it (project phase). Sort by when in the project timeline you'd typically introduce it.",
        why: "The format instruction turns an essay into a decision-ready reference — same information, zero untangling required.",
      },
      impact: {
        before: "How do I run a 1:1 meeting?",
        after:
          "Give me a 30-minute 1:1 meeting template for an engineering manager. Format: numbered sections with time allocations. Sections: warm-up (2 min), their updates (8 min), blockers (8 min), career/growth (7 min), manager's items (5 min). For each section include 2 sample questions.",
        why: "A paragraph answer is impossible to follow mid-meeting. A structured template with time slots and ready-to-use questions is immediately actionable.",
      },
    },
    practice: {
      topics: [
        {
          label: "Hike Packing",
          brief: "Ask for packing advice in a clear, structured format.",
          weakPrompt: "What should I pack for a weekend hike?",
          hint: "A checklist? Grouped by category? How many items max? Decide the structure before you ask for it.",
        },
        {
          label: "Book Recs",
          brief: "Get book recommendations in a format you can actually use.",
          weakPrompt: "Recommend some books for me.",
          hint: "Table with columns? Bullet list with one-sentence summaries? Genre groupings? Specify the shape and count.",
        },
        {
          label: "Weekly Plan",
          brief: "Request a structured weekly schedule.",
          weakPrompt: "Help me plan my week.",
          hint: "Daily breakdown? Time blocks? Priority tiers? Name the format and the constraints before asking.",
        },
        {
          label: "Tech Compare",
          brief: "Compare two technologies in a scannable format.",
          weakPrompt: "Compare React and Vue.",
          hint: "A comparison table? Bullet pros/cons per option? Numbered ranking? Pick the format that fits how you'll use it.",
        },
      ],
    },
  },

  {
    id: "examples",
    tier: 3,
    technique: "Show Examples",
    title: "Show Examples (Few-Shot)",
    icon: "🪞",
    xp: 200,
    summary: "Show one or two examples of what you want, then ask for more.",
    explanation:
      "Sometimes the easiest way to explain a task is to demonstrate it. Giving the model a couple of input–output examples (called few-shot prompting) locks in the pattern, style, and labels you want far better than describing them in words. Show, then ask.",
    examples: {
      simple: {
        before: "Classify these product reviews as positive or negative.",
        after:
          'Classify reviews as POSITIVE or NEGATIVE.\nExample: "Broke after one day." → NEGATIVE\nExample: "Works great, would buy again." → POSITIVE\nNow classify: "Shipping was slow but the product is fine."',
        why: "The two examples lock in the exact label format and show how to handle a mixed case — the model copies the pattern instead of inventing its own.",
      },
      template: {
        formula:
          "[Task]. Examples:\nInput: [sample] → Output: [expected output]\nInput: [sample] → Output: [expected output]\nNow do: [real input]",
        before: "Rewrite these sentences to be more formal.",
        after:
          'Rewrite sentences to be more formal.\nExample: "Hey, can we chat?" → "I would welcome the opportunity to discuss this further."\nExample: "This is kinda hard to explain." → "This concept requires some elaboration."\nNow rewrite: "I think maybe we should change the plan a bit."',
        why: "The template transmits vocabulary level, sentence structure, and tone in a way a description alone never could — the model sees the transformation, not a rule.",
      },
      impact: {
        before: "Write a tweet about this article.",
        after:
          'Write a tweet about this article. Match this style:\nEx 1: "Most teams optimise for speed. The fastest teams optimise for reversibility."\nEx 2: "Meetings aren\'t the problem. Back-to-back meetings with no buffer are."\nArticle summary: [paste]. Write one tweet in that voice.',
        why: "Examples transmit rhythm, voice, and structural pattern in a way instructions cannot. The AI copies the cadence — the output feels like it belongs to a real person's account.",
      },
    },
    practice: {
      topics: [
        {
          label: "Formal English",
          brief: "Show the exact formality level you want before asking.",
          weakPrompt: "Turn these phrases into formal English.",
          hint: "Give one sample input and the exact formal output you'd consider correct, then ask for the real one.",
        },
        {
          label: "Feedback Tags",
          brief: "Show a tagged example before asking for more tagging.",
          weakPrompt: "Categorise this customer feedback.",
          hint: "Show one tagged example with your category labels, then ask it to tag the real feedback the same way.",
        },
        {
          label: "Tone Detection",
          brief: "Define what 'tone' means to you with one example.",
          weakPrompt: "Detect the tone of these messages.",
          hint: "Give one example with your tone labels (frustrated, neutral, enthusiastic) so the model knows your exact scale.",
        },
        {
          label: "Style Match",
          brief: "Show 2 examples of your writing style, then ask for more.",
          weakPrompt: "Write a social media caption for my brand.",
          hint: "Paste 2 captions you've written that you're happy with, then ask for a new one in the same voice.",
        },
      ],
    },
  },

  {
    id: "reasoning",
    tier: 3,
    technique: "Think Step by Step",
    title: "Think Step by Step",
    icon: "🪜",
    xp: 200,
    summary: "For anything with logic or math, ask the AI to work it out in steps.",
    explanation:
      "On problems that need reasoning, models do better when asked to show their work before giving the answer. The phrase 'think step by step' (called chain-of-thought) makes the model lay out intermediate steps, which catches mistakes it would otherwise rush past.",
    examples: {
      simple: {
        before: "What's a 17% tip on an $84 bill split between 3 people?",
        after:
          "Calculate a 17% tip on an $84 bill split between 3 people. Think step by step: first the tip amount, then the total bill, then divide by 3. Show each step before giving the final per-person amount.",
        why: "Forcing the steps — tip, total, split — makes the math reliable and lets you pinpoint exactly where a wrong number came from.",
      },
      template: {
        formula:
          "[Problem]. Think step by step in this order: [step 1], [step 2], [step 3]. Show each step, then give the final answer.",
        before: "Should I accept this job offer?",
        after:
          "I have a job offer: $120k, fully remote, Series A startup. My current job pays $105k with more stability. Help me decide. Think step by step: first list what I'd gain, then what I'd lose, then evaluate the financial risk, then give a recommendation with a one-sentence rationale.",
        why: "Specifying the reasoning steps in order prevents the model from jumping to a conclusion. Each step must be explicit before the next one begins.",
      },
      impact: {
        before: "Which cloud provider should I pick?",
        after:
          "I'm building a SaaS app: Node backend, Postgres DB, ~10k users in year 1, team of 2, tight budget. Choose a cloud provider. Think step by step: evaluate AWS, GCP, and Vercel on cost, setup complexity, and ecosystem fit for my stack. Show your reasoning for each, then give a final recommendation with a one-sentence justification.",
        why: "Without chain-of-thought, the model defaults to AWS. Forcing the steps surfaces trade-offs you'd never see otherwise — and often changes the final answer.",
      },
    },
    practice: {
      topics: [
        {
          label: "Price Calc",
          brief: "Ask for a multi-step price calculation with shown work.",
          weakPrompt:
            "If a shirt is $40 with 25% off, then 10% off the sale price, what's the final price?",
          hint: "Ask it to show the steps in order — first discount, then second discount — before stating the final number.",
        },
        {
          label: "Life Decision",
          brief: "Use chain-of-thought to reason through a real decision.",
          weakPrompt: "Should I move to a new city for a job?",
          hint: "Name the dimensions to reason through (finances, career, personal life) and ask the model to work through each before concluding.",
        },
        {
          label: "Debug Logic",
          brief: "Make the AI trace through a logic problem step by step.",
          weakPrompt: "Why is my code printing the wrong total?",
          hint: "Describe the code behaviour and ask the model to trace execution step by step before suggesting a fix.",
        },
        {
          label: "Plan a Project",
          brief: "Break down a project using ordered reasoning steps.",
          weakPrompt: "How do I launch a newsletter?",
          hint: "Ask it to reason through phases in order — audience first, then content, then tools, then launch — before giving a final plan.",
        },
      ],
    },
  },
];

export const TIERS: { tier: 1 | 2 | 3; name: string }[] = [
  { tier: 1, name: "Foundations" },
  { tier: 2, name: "Shaping Output" },
  { tier: 3, name: "Advanced Moves" },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function lessonsByTier(tier: number): Lesson[] {
  return LESSONS.filter((l) => l.tier === tier);
}
