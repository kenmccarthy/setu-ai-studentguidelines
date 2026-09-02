/* =====================================================================
   content.js — all course text for "Using Gen AI at SETU"

   EVERY word a student reads lives in this file. app.js contains no
   course copy. To reword a question, add a card, fix a citation example
   or add a module, edit here and reload the page. See README.md.

   Guidelines reviewed against: [[CONFIRM: version and review date of the
   SETU Student Guidelines on the use of Gen AI that this course is based on]]
   Content review date: 2026-09-02

   ---------------------------------------------------------------------
   SCHEMA
   ---------------------------------------------------------------------
   COURSE = {
     title, subtitle, intro {...}, modules [...], completion {...},
     ui {...}, footer {...}, confirms [...]
   }

   A module:
     {
       id: "risks",            // used in the URL hash: #module-risks
       number: 2,              // shown in the U-shape device
       title: "What Gen AI gets wrong",
       summary: "One sentence shown in the contents list.",
       minutes: 4,
       blocks: [ ... ]         // rendered in order
     }

   Block types. `type` decides how app.js renders it. An unknown type
   renders nothing and logs a console warning — it never breaks the course.

     prose    { heading?, paragraphs: ["..."] }
              Inline HTML allowed in paragraphs: <strong> <em> <a> only.
              Anything else is stripped to plain text by app.js.

     list     { heading?, lead?, ordered: true|false, items: ["..."] }

     callout  { tone: "note" | "warning" | "quote", title?, paragraphs?,
                items?, ordered?, attribution? }

     check    { id, title?, intro?, scored?: false, questions: [
                  { id, prompt, multi?: false, options: [
                      { id, text, correct: true|false, feedback: "why" }
                  ]}
              ]}
              EVERY option carries feedback, correct ones included.
              No scoring outside the final check.

     sort     { id, title, intro?, buckets: [{id,label,hint}],
                cards: [{id, text, correctBucket, explain}], summary }

     slider   { id, title, intro?, stops: [{id,label,sub,may:[],declare,unsure}],
                closing }

     builder  { id, title, intro?, purposes: [...], formats {...},
                sample {...}, note }

     reflect  { id, title, note, prompts: [{id, label, placeholder}] }

     hotspot  }  v2. Carries only a `stub` object and renders as a short
     branch   }  prose note plus an HTML comment. Not partially built.
                 { stub: { heading, paragraphs: [], v2: "note for v2" } }

   [[CONFIRM: ...]] markers are literal text. app.js styles them so they
   are visible on the page and lists them in the footer. Remove the marker
   text once the real value is supplied.
   ===================================================================== */

const COURSE = {
  title: "Using Gen AI at SETU",
  subtitle: "The student guidelines, in about 20 minutes",

  intro: {
    lead: "A self-paced walk through South East Technological University's guidelines for students on the use of generative AI in your studies.",
    resumeTitle: "You have been here before",
    resumeBody: "Your progress is saved in this browser. You can pick up where you left off, or start again from the beginning.",
    startLabel: "Start the course",
    noStorageNotice: "This browser is not saving anything for this site, which usually means private browsing or blocked storage. The course works normally — your progress just will not be there when you come back."
  },

  /* =================================================================== */
  modules: [

    /* ---------------- 0. Start here ---------------- */
    {
      id: "start",
      number: 0,
      title: "Start here",
      summary: "What this covers, how long it takes, and where your answers are stored.",
      minutes: 1,
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "This course walks you through SETU's guidelines for students on the use of generative artificial intelligence — <strong>Gen AI</strong> — in your studies. It takes about 20 minutes and you can stop and come back.",
            "Gen AI means a tool that produces new text, images, code or audio in response to something you type. Most of these tools are built on a <strong>large language model</strong>, or LLM: a system trained on very large amounts of text that works by predicting what word is likely to come next. The rules here apply to any tool that works this way, including features built into software you already use."
          ]
        },
        {
          type: "prose",
          paragraphs: [
            "The aim is not to catch you out. Most students who run into difficulty with these tools did not set out to cheat. They used something that seemed helpful without knowing they had to check first, or they did check and then had no idea how to say what they had done."
          ]
        },
        {
          type: "list",
          lead: "By the end you will know three things:",
          ordered: true,
          items: [
            "How permission to use Gen AI is set, and who sets it.",
            "How to declare your use, in a form you can copy into your work.",
            "What happens if a concern is raised about a piece of your work, and what protects you."
          ]
        },
        {
          type: "callout",
          tone: "note",
          title: "How this works",
          items: [
            "Eight short modules, one on screen at a time. Roughly 20 minutes in total.",
            "Each module teaches through an activity, then asks you a couple of questions about it.",
            "Getting a question wrong does not hold you up. Nothing is scored until the final check at the end.",
            "A module counts as complete when you reach the end of it."
          ]
        },
        {
          type: "callout",
          tone: "note",
          title: "Nothing you type here leaves this device",
          paragraphs: [
            "This is a course about using tools responsibly, so it does not do the thing it warns you about. There is no account, no analytics, no server and no network request of any kind. Your progress, your answers, your reflections and anything you type into the declaration builder are stored in this browser only, and you can clear all of it at any time using the link in the footer."
          ]
        }
      ]
    },

    /* ---------------- 1. Where SETU stands ---------------- */
    {
      id: "position",
      number: 1,
      title: "Where SETU stands",
      summary: "Six points that set the university's position, and why there is no single rule.",
      minutes: 2,
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "SETU's position is neither a ban nor a free pass. It rests on six points. [[CONFIRM: check the six position points below word for word against the current SETU Student Guidelines before this course is published]]"
          ]
        },
        {
          type: "list",
          ordered: true,
          items: [
            "<strong>Gen AI is part of study and of professional practice.</strong> The university does not prohibit it across the board, and expects you to build the judgement to use it well.",
            "<strong>Permission is set locally.</strong> What is allowed is decided by your lecturer, for each module and each assessment. There is no single university-wide answer.",
            "<strong>Permitted use still has to be declared.</strong> Being allowed to use a tool and saying that you used it are two separate requirements.",
            "<strong>You are responsible for what you submit.</strong> If a tool invents a source or gets a fact wrong, it becomes your error the moment it is in your work.",
            "<strong>Use that is not permitted, or not declared, is academic misconduct.</strong> It is handled under the university's existing academic integrity policy. There is no separate AI rulebook.",
            "<strong>Staff will tell you what is permitted</strong> and support you in learning to use these tools critically. If a brief does not say, you are entitled to ask."
          ]
        },
        {
          type: "prose",
          paragraphs: [
            "If you remember one sentence from this course, make it this one: <strong>permission is set per module, per assessment, by the lecturer.</strong> Almost every question students ask about Gen AI comes back to it."
          ]
        },
        {
          type: "check",
          id: "check-position",
          title: "Check your understanding",
          questions: [
            {
              id: "p1",
              prompt: "You are taking four modules this semester. Where do you find out whether you can use Gen AI in each of them?",
              multi: false,
              options: [
                {
                  id: "a",
                  text: "In each module's assessment brief, and from the lecturer who set it",
                  correct: true,
                  feedback: "Yes. Permission is set locally, module by module and assessment by assessment. Four modules can give four different answers, and a single module can have different rules for different pieces of work."
                },
                {
                  id: "b",
                  text: "In one university-wide rule that applies across every module",
                  correct: false,
                  feedback: "There is no such rule, and that is deliberate. What counts as fair help depends on what the assessment is testing, so the decision sits with the person who set it."
                },
                {
                  id: "c",
                  text: "In whatever you were told about AI when you started at SETU",
                  correct: false,
                  feedback: "That will not hold. The rules are set per assessment and the tools change quickly, so a briefing from a previous year tells you nothing reliable about this semester's work."
                },
                {
                  id: "d",
                  text: "You can assume it is allowed unless the brief says otherwise",
                  correct: false,
                  feedback: "This assumption is the most common route into difficulty. Silence in a brief is not permission. Ask before you start."
                }
              ]
            },
            {
              id: "p2",
              prompt: "Which of these does SETU's position make you responsible for? Select all that apply.",
              multi: true,
              options: [
                {
                  id: "a",
                  text: "The accuracy of every fact and source in your submitted work, whatever produced it",
                  correct: true,
                  feedback: "Yes. Once it is in your submission it is your claim. A fabricated citation is your error, not the tool's."
                },
                {
                  id: "b",
                  text: "Declaring Gen AI use in work where you were permitted to use it",
                  correct: true,
                  feedback: "Yes. Permission and declaration are separate requirements. Being allowed to use a tool does not remove the need to say that you did."
                },
                {
                  id: "c",
                  text: "Knowing the rules for each module you are taking",
                  correct: true,
                  feedback: "Yes. You are expected to read the brief, and to ask when it does not say."
                },
                {
                  id: "d",
                  text: "Making sure nobody else in your group project uses Gen AI",
                  correct: false,
                  feedback: "No. You are not policing your classmates. In group work you are responsible for your own contribution, and for being straight with your group about what you used. That is not the same as monitoring them."
                }
              ]
            }
          ]
        }
      ]
    },

    /* ---------------- 2. What Gen AI gets wrong ---------------- */
    {
      id: "risks",
      number: 2,
      title: "What Gen AI gets wrong",
      summary: "Where these tools fail, and the quieter problem of always taking the obvious route.",
      minutes: 4,
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "A large language model is not looking anything up. It is producing the words that are statistically likely to follow the words you gave it. That single fact explains most of what follows."
          ]
        },
        {
          type: "prose",
          heading: "It invents things, fluently",
          paragraphs: [
            "The confident tone is a feature of the writing style, not a signal of accuracy. These tools produce references to articles that were never written, quotations nobody said, page numbers that do not exist and identifiers that look exactly like real ones. This is usually called hallucination, and it is not a bug that is being fixed — it follows from how the tool works.",
            "The practical rule is simple: if you have not read it, do not cite it. Check every source in the library catalogue before it goes anywhere near your reference list."
          ]
        },
        {
          type: "prose",
          heading: "It carries the bias of what it was trained on",
          paragraphs: [
            "The training text over-represents some parts of the world, some languages and some kinds of writer, and under-represents others. The output inherits that. In a discipline where whose voice counts is part of the subject — health, education, social care, law, business — an answer that sounds balanced can quietly reproduce a narrow view."
          ]
        },
        {
          type: "prose",
          heading: "What you paste in may not stay yours",
          paragraphs: [
            "Text you put into a commercial tool leaves your control, and in many cases it may be retained or used to improve the service. Do not paste in personal data about anyone, a classmate's unpublished draft, material from a placement or work setting, patient or client information, or anything covered by a confidentiality agreement. That is a data protection obligation and it applies whether or not the assessment allows AI use."
          ]
        },
        {
          type: "prose",
          heading: "It has a horizon",
          paragraphs: [
            "Every model is trained up to a point in time and then stops. It does not know your module, your reading list, what your lecturer said last week, or a development from the past few months. It does not know the Irish context of your subject unless that happened to be well covered in the text it learned from — and it will not say so. It will answer anyway."
          ]
        },
        {
          type: "prose",
          heading: "It takes the most likely path — and that is the real cost",
          paragraphs: [
            "This is the point that is easiest to miss and it matters more than the accuracy warning. Because the model is built to choose the highest-probability next word, it gives you the most typical version of an answer. The most typical structure. The most typical three arguments. The reading everyone else on the module has also been handed.",
            "So the risk is not only that it is sometimes wrong. It is that it steers you away from the less obvious approach — the one that might have been more interesting, and the one that tends to earn the higher marks. If you ask it to plan your essay before you have done any thinking of your own, you get the plan most people would write.",
            "Sometimes the right response is to use it <em>less</em>. Do the thinking first, commit to an angle, and bring the tool in afterwards to argue with what you came up with."
          ]
        },
        {
          type: "callout",
          tone: "note",
          title: "A question worth asking every time",
          paragraphs: [
            "What is this assessment actually testing? If it is testing whether you can build an argument, handing the structure to a tool removes the thing you were meant to practise — even in a module where using the tool is permitted."
          ]
        },
        {
          type: "check",
          id: "check-risks",
          title: "Check your understanding",
          questions: [
            {
              id: "r1",
              prompt: "A tool gives you three journal references. Two check out. The third returns nothing in the library, nothing in a general search and nothing under its identifier. What is the most likely explanation?",
              multi: false,
              options: [
                {
                  id: "a",
                  text: "The reference was generated to look plausible and does not exist",
                  correct: true,
                  feedback: "Yes. A reference that returns nothing anywhere is almost always fabricated. The model produced something shaped like a citation, because that is what followed your prompt. Delete it."
                },
                {
                  id: "b",
                  text: "The library does not subscribe to that journal",
                  correct: false,
                  feedback: "Worth ruling out, but a missing subscription still leaves a trace — the article exists in the catalogue or in a search even when you cannot open it. Nothing at all points to fabrication."
                },
                {
                  id: "c",
                  text: "The article is too recent for the library to have it",
                  correct: false,
                  feedback: "This points the wrong way. A model's training data has a cut-off, so it is far more likely to miss recent work than to know about something too new to be catalogued."
                },
                {
                  id: "d",
                  text: "It does not matter much — you can cite it and move on",
                  correct: false,
                  feedback: "Citing a source you have not read and cannot find is a serious problem in its own right, quite apart from the AI question. If you cannot verify it, it does not go in."
                }
              ]
            },
            {
              id: "r2",
              prompt: "Why does the 'most likely next word' design matter for the quality of your work?",
              multi: false,
              options: [
                {
                  id: "a",
                  text: "It produces the most conventional version of an answer, steering you away from the less obvious approach",
                  correct: true,
                  feedback: "Yes, and this is the argument for using it less in some places. The pull is towards the average. If you start with the tool, you start with everyone else's answer."
                },
                {
                  id: "b",
                  text: "It means the tool is always factually wrong",
                  correct: false,
                  feedback: "Too strong — it is often right, which is exactly why the errors are hard to spot. The point here is different: it defaults to the typical, and typical rarely earns the higher marks."
                },
                {
                  id: "c",
                  text: "It means the output is random, so no two answers are ever alike",
                  correct: false,
                  feedback: "There is some variation between runs, but that is not the issue. The tendency is towards the middle of the distribution, not away from it."
                },
                {
                  id: "d",
                  text: "It means the tool has a position it is arguing for",
                  correct: false,
                  feedback: "It holds no position. What reads like a view is the most common pattern in its training text, which is precisely why it can flatten the more interesting argument you might have made yourself."
                }
              ]
            }
          ]
        },
        {
          type: "hotspot",
          id: "hotspot-flawed-output",
          stub: {
            heading: "Coming in the full course: spot the problem",
            paragraphs: [
              "The full version of this module includes a short activity where you are shown a piece of AI-generated coursework and asked to click the parts that would not survive checking — the invented citation, the confident claim with nothing behind it, the quotation attributed to the wrong person.",
              "It is not in this preview. Everything it teaches is covered by the sections above."
            ],
            v2: "hotspot — click-the-problem activity over a sample AI output. Highest build cost of the interaction types; module 2 teaches adequately without it in a proof of concept. Needs: sample output text, hit regions, per-region explanation, keyboard route (numbered list of candidate spans as an equal alternative to clicking)."
          }
        }
      ]
    },

    /* ---------------- 3. Using it well ---------------- */
    {
      id: "using",
      number: 3,
      title: "Using it well",
      summary: "Where these tools genuinely help, and a sorting activity on what is allowed.",
      minutes: 3,
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "There is a set of uses that help you learn without doing the assessed work for you. They have something in common: the tool works on material you already have, or produces something you then have to do something with."
          ]
        },
        {
          type: "list",
          lead: "Uses that are generally sound, subject to your brief:",
          ordered: false,
          items: [
            "Having a concept explained a second and a third way, when the lecture version did not land.",
            "Summarising a long reading so you can find the parts worth reading properly — then reading those parts.",
            "Generating practice questions and testing yourself before an exam.",
            "Using it as a debate partner: state your argument, ask it for the strongest objection, then answer the objection yourself.",
            "Asking what an error message means when you are stuck on a piece of code and do not understand the failure."
          ]
        },
        {
          type: "prose",
          paragraphs: [
            "Notice what none of these do: none of them produce the words or the thinking you are going to be marked on."
          ]
        },
        {
          type: "sort",
          id: "sort-allowed",
          title: "Is this allowed?",
          intro: "Place each of these into the column you think it belongs in. Select a card, then choose a column — or use the arrow keys to move between cards and 1, 2 and 3 to place the selected one.",
          buckets: [
            { id: "fine", label: "Generally fine", hint: "Ordinary study support. Still worth a glance at the brief." },
            { id: "ask", label: "Ask your lecturer first", hint: "Not wrong in itself. Whether it is permitted depends on the assessment." },
            { id: "no", label: "Not acceptable", hint: "A problem in any module, whatever the brief says." }
          ],
          cards: [
            {
              id: "c1",
              text: "Asking an AI tool to explain a concept from a lecture you did not follow",
              correctBucket: "fine",
              explain: "Ordinary study support. You are having something explained, which is what you would do by asking a classmate or reading another textbook. Check the explanation against your notes, since it can be confidently wrong."
            },
            {
              id: "c2",
              text: "Asking it to summarise a 40-page reading so you can find the key points",
              correctBucket: "fine",
              explain: "Generally fine as a way in. The summary is a map, not a substitute for the reading — quote and cite from the source itself, never from the summary, because the summary may have dropped the qualification that mattered."
            },
            {
              id: "c3",
              text: "Generating practice questions before an exam",
              correctBucket: "fine",
              explain: "Useful, and nothing you submit comes out of it. The questions may not match the style of your actual paper, so treat past papers and your lecturer's guidance as the better guide."
            },
            {
              id: "c4",
              text: "Using it as a debate partner to test your own argument",
              correctBucket: "fine",
              explain: "One of the better uses, because the thinking stays yours. You bring an argument, it pushes back, you answer the objection. Compare that with asking it for the argument in the first place."
            },
            {
              id: "c5",
              text: "Pasting your draft in and asking for feedback on your writing",
              correctBucket: "ask",
              explain: "Common, often permitted, and not automatically allowed. If the assessment is partly testing your written expression, feedback on your writing is closer to the assessed skill than it looks. Ask, and be aware you are also uploading your own unpublished work."
            },
            {
              id: "c6",
              text: "Using AI to translate your notes into English before writing up",
              correctBucket: "ask",
              explain: "Reasonable and widely used, particularly if you study through more than one language, but the answer depends on the module. Some assessments test writing in English directly. Ask, and if the answer is yes, declare it."
            },
            {
              id: "c7",
              text: "Using an AI rewrite feature built into your word processor",
              correctBucket: "ask",
              explain: "This is the one people get wrong. A tool built into software you already use is still a Gen AI tool. It does not become exempt because it arrived with the software, is free, or only changed a sentence."
            },
            {
              id: "c8",
              text: "Submitting AI-generated text as your own writing",
              correctBucket: "no",
              explain: "Presenting work as yours when it is not is the definition of the problem, in any module and under any brief. This one does not depend on permission."
            },
            {
              id: "c9",
              text: "Using AI where the brief permits it, but not declaring it",
              correctBucket: "no",
              explain: "Permission and declaration are separate requirements, and this is the trap that catches honest students. You did the allowed thing and then failed to say so, which puts a permitted piece of work into the misconduct process for no reason."
            },
            {
              id: "c10",
              text: "Pasting a classmate's unpublished draft into a chatbot",
              correctBucket: "no",
              explain: "Two problems at once. It is their work, and it is not yours to hand over, which is a data protection matter as well as an integrity one. The same applies to placement material and anything about an identifiable person."
            },
            {
              id: "c11",
              text: "Using AI in an assessment where the brief says no AI",
              correctBucket: "no",
              explain: "The brief is the rule for that assessment. There is no threshold below which it stops applying, and no version of 'only for the grammar' that gets around a clear instruction."
            }
          ],
          summary: "Look at how many of these landed in the middle column. That is the shape of the whole thing: most real uses are not right or wrong in themselves, and permission is set per module, per assessment, by your lecturer."
        },
        {
          type: "check",
          id: "check-using",
          title: "Check your understanding",
          questions: [
            {
              id: "u1",
              prompt: "Your word processor offers to rewrite a paragraph for you. Do the guidelines apply to it?",
              multi: false,
              options: [
                {
                  id: "a",
                  text: "Yes — a tool built into software you already use is still a Gen AI tool, so check the brief",
                  correct: true,
                  feedback: "Yes. Where the tool lives makes no difference. If it generated or rewrote text in your submission, it counts, and it needs the same permission and the same declaration as anything else."
                },
                {
                  id: "b",
                  text: "No — only separate chatbots count",
                  correct: false,
                  feedback: "There is no such distinction. The guidelines are written about what the tool does, not about whether you opened a separate window to use it."
                },
                {
                  id: "c",
                  text: "Only if you are paying for it",
                  correct: false,
                  feedback: "Cost has nothing to do with it. A free feature and a paid subscription are the same thing as far as your assessment is concerned."
                },
                {
                  id: "d",
                  text: "Only if it changed more than a sentence or two",
                  correct: false,
                  feedback: "There is no size threshold in the guidelines. The brief sets what is permitted, and if you are in doubt about a small change, declaring it costs you nothing."
                }
              ]
            },
            {
              id: "u2",
              prompt: "Why do so many of those cards belong in 'ask your lecturer first'?",
              multi: false,
              options: [
                {
                  id: "a",
                  text: "Because permission is set per module and per assessment, so the same action can be fine in one and not in another",
                  correct: true,
                  feedback: "Yes. The middle column is the whole point of the activity. Proofreading support might be encouraged in one module and prohibited in the next, because the two assessments are testing different things."
                },
                {
                  id: "b",
                  text: "Because the guidelines are vague about them",
                  correct: false,
                  feedback: "They are local rather than vague. The guidelines are quite clear that the decision belongs to the person who set the assessment, since only they know what it is testing."
                },
                {
                  id: "c",
                  text: "Because those uses are all a bit dishonest",
                  correct: false,
                  feedback: "None of them is dishonest in itself. Getting feedback on your writing is ordinary academic practice. It sits in the middle because permission depends on the assessment, not because there is something shady about it."
                },
                {
                  id: "d",
                  text: "Because the university has not decided about them yet",
                  correct: false,
                  feedback: "The decision has been made — it has been delegated. Leaving it with the lecturer is the position, not a gap waiting to be filled."
                }
              ]
            }
          ]
        }
      ]
    },

    /* ---------------- 4. Your lecturer decides ---------------- */
    {
      id: "permission",
      number: 4,
      title: "Your lecturer decides",
      summary: "The four things an assignment brief might say, and what each one asks of you.",
      minutes: 3,
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Assignment briefs tend to sit at one of four points. Move along the scale to see what each one means in practice."
          ]
        },
        {
          type: "slider",
          id: "spectrum",
          title: "The permission spectrum",
          intro: "Four settings an assignment brief might use. Use the arrow keys, or select a stop.",
          stops: [
            {
              id: "none",
              label: "No AI use permitted",
              sub: "Usually because the assessment is testing the thing the tool would do for you.",
              may: [
                "Use the library, your notes, the reading list, the writing centre and academic support in the ordinary way.",
                "Ask staff or a study group to explain something you did not follow.",
                "Use assistive technology you rely on — but talk to your lecturer or the disability service rather than assuming, so it is agreed in advance and in writing."
              ],
              declare: "Nothing, because you have not used a Gen AI tool. If you used one earlier in the process — to find your way into the topic, say — do not leave it unmentioned. Tell your lecturer and ask.",
              unsure: "Ask whether features built into your word processor or browser count. They usually do."
            },
            {
              id: "limited",
              label: "Limited use",
              sub: "Specific named tasks only, such as proofreading or generating ideas at the start.",
              may: [
                "Exactly the tasks the brief names, and nothing beyond them.",
                "Typically use it on words you have already written, rather than to produce the words in the first place — unless the brief says otherwise."
              ],
              declare: "The tool and version, the dates, and which of the named tasks you used it for. Say which parts of the work it touched.",
              unsure: "If you cannot tell whether what you want to do is one of the named tasks, treat it as though it is not, and ask."
            },
            {
              id: "declared",
              label: "Use permitted with declaration",
              sub: "The most common setting where AI is allowed at all.",
              may: [
                "Use it across the work where it genuinely helps, and say so.",
                "Still check every fact, quotation and source yourself, because the responsibility does not move."
              ],
              declare: "Tool and version, dates, what you used it for, and what you did with the output. Your lecturer may want a particular form or a full prompt log — check the brief. Module 5 builds this text for you.",
              unsure: "Declaring more than you had to has never caused anyone a problem. Declaring less has."
            },
            {
              id: "required",
              label: "AI use required",
              sub: "You are asked to work with a tool and critique what it produces.",
              may: [
                "Use it as instructed, and keep everything it produced — the output is part of the evidence, not a rough draft to throw away.",
                "Disagree with it. In this kind of assessment the marks are usually in the quality of your critique, not in the output."
              ],
              declare: "Whatever the brief asks for, which usually includes the prompts you used and the raw output, kept as an appendix.",
              unsure: "Ask what format the prompts and output should be submitted in, and whether there is a word count attached to the appendix."
            }
          ],
          closing: "If the brief does not say, ask before you start, not after you submit."
        },
        {
          type: "reflect",
          id: "reflect-permission",
          title: "Worth two minutes",
          note: "This is not submitted and not marked. It is saved in this browser only, and it appears in your completion record at the end so you can take it away.",
          prompts: [
            {
              id: "modules-checked",
              label: "Which of your current modules have you actually checked the AI rules for, and which are you guessing about?",
              placeholder: "List the modules you are sure about, then the ones you would have to guess at."
            }
          ]
        },
        {
          type: "check",
          id: "check-permission",
          title: "Check your understanding",
          questions: [
            {
              id: "m1",
              prompt: "A brief says you may use Gen AI for proofreading only. You also use it to generate an outline before you start writing. Where does that leave you?",
              multi: false,
              options: [
                {
                  id: "a",
                  text: "Outside what was permitted — it is treated as unpermitted use, even though some AI use was allowed",
                  correct: true,
                  feedback: "Yes. Limited permission is limited to the named tasks. The outline is not proofreading, so it falls outside the permission, and declaring it afterwards does not make it permitted."
                },
                {
                  id: "b",
                  text: "Fine, because AI use was permitted in that assessment",
                  correct: false,
                  feedback: "The permission was for a specific task. 'Some AI is allowed' and 'this use is allowed' are different statements, and the brief made the narrower one."
                },
                {
                  id: "c",
                  text: "Fine as long as you declare the outline as well",
                  correct: false,
                  feedback: "A declaration describes what you did — it does not create permission you did not have. Declaring an unpermitted use is better than hiding it, but the use is still unpermitted."
                },
                {
                  id: "d",
                  text: "Fine, because an outline is not part of the submitted text",
                  correct: false,
                  feedback: "The outline shapes the argument, which is very much part of what is assessed. In any case the brief named one permitted task, and this was not it."
                }
              ]
            },
            {
              id: "m2",
              prompt: "A brief says nothing at all about AI. What is the right move?",
              multi: false,
              options: [
                {
                  id: "a",
                  text: "Ask the lecturer before you start, and keep their answer",
                  correct: true,
                  feedback: "Yes. Silence is not permission and it is not prohibition — it is a question that has not been answered yet. Ask in class or by email, and keep the reply, because a written answer is useful evidence later."
                },
                {
                  id: "b",
                  text: "Assume it is not allowed and avoid it entirely",
                  correct: false,
                  feedback: "You will not get into trouble this way, so it is the safer error. But you may be denying yourself help your lecturer would happily have permitted. Asking takes a minute."
                },
                {
                  id: "c",
                  text: "Use it and declare it, since declaring covers you",
                  correct: false,
                  feedback: "Declaring is honest, and honesty helps, but it does not answer the question of whether the use was permitted. You would be finding out the answer after submission, which is the wrong order."
                },
                {
                  id: "d",
                  text: "Check what other students on the module are doing",
                  correct: false,
                  feedback: "Your classmates are guessing from the same silent brief. If they have the answer it is because somebody asked — so ask, or ask them who they asked."
                }
              ]
            }
          ]
        }
      ]
    },

    /* ---------------- 5. Declaring your use ---------------- */
    {
      id: "declaring",
      number: 5,
      title: "Declaring your use",
      summary: "Build a declaration you can paste into your work, and keep the evidence behind it.",
      minutes: 3,
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "A declaration is not a confession. It is the same move as a citation: you are showing your reader where something came from. Work that is open about a permitted tool is stronger than work that is quiet about it, and a marker who can see what you did has no reason to wonder."
          ]
        },
        {
          type: "list",
          lead: "A declaration needs to answer four questions:",
          ordered: true,
          items: [
            "<strong>What tool</strong>, including the version if you can see it, and including anything built into software you were already using.",
            "<strong>When</strong> you used it.",
            "<strong>What for</strong> — the specific task, not just 'for help'.",
            "<strong>What you did with the output</strong>, and what remains your own work."
          ]
        },
        {
          type: "builder",
          id: "declaration-builder",
          title: "Build your declaration",
          intro: "Fill in what applies. Nothing you type here is sent anywhere or saved outside this browser.",
          fields: {
            toolsLabel: "Tool or tools you used",
            toolsPlaceholder: "For example: ChatGPT (GPT-4o)",
            addToolLabel: "Add another tool",
            removeToolLabel: "Remove this tool",
            builtInLabel: "Including AI features built into software I was already using",
            datesLabel: "Date or dates of use",
            datesPlaceholder: "For example: 3 to 7 November 2026",
            purposesLabel: "What you used it for",
            purposesOtherLabel: "Something else — describe it",
            nameLabel: "Your name",
            namePlaceholder: "As it appears on your submission",
            moduleLabel: "Module code",
            modulePlaceholder: "For example: COMP1234",
            assignmentLabel: "Assignment title",
            assignmentPlaceholder: "As given on the brief",
            promptLabel: "One prompt you used (optional)",
            promptPlaceholder: "Paste a prompt here if your brief asks for an example",
            yearLabel: "Year",
            outputLabel: "Your declaration",
            copyLabel: "Copy declaration",
            copiedLabel: "Copied to the clipboard",
            copyFailedLabel: "Copying was blocked by the browser. Select the text above and copy it manually.",
            formatLabel: "Output style"
          },
          purposes: [
            { id: "understand", text: "understanding a concept" },
            { id: "sources", text: "finding sources" },
            { id: "structure", text: "structuring my work" },
            { id: "draft", text: "drafting text" },
            { id: "edit", text: "editing and proofreading" },
            { id: "code", text: "generating code" },
            { id: "translate", text: "translating" },
            { id: "other", text: "something else" }
          ],
          formats: [
            { id: "reference", label: "Reference style", hint: "Matches the citation format in the SETU guidelines. Put it in your reference list." },
            { id: "paragraph", label: "Short declaration", hint: "A sentence or two for the start or end of your submission." }
          ],
          sample: {
            tool: "ChatGPT (GPT-4o)",
            date: "14 February 2026",
            name: "your name",
            purpose: "understanding a concept"
          },
          note: "Your lecturer may require a specific declaration form, or a full log of every prompt you used. Check the brief — this builder gives you a sound default, not a substitute for what you were asked for. [[CONFIRM: whether SETU has a standard declaration form students should use instead of this builder output]]"
        },
        {
          type: "prose",
          heading: "Keep your working",
          paragraphs: [
            "Almost everything that protects you in a difficult conversation is something you would have had anyway, if you had not deleted it. None of this takes extra effort — it takes not tidying up."
          ]
        },
        {
          type: "list",
          ordered: false,
          items: [
            "<strong>Version history.</strong> If you write in a cloud document, the history is kept automatically. Do not compose in one place and paste the finished thing into a fresh file — that throws away the record of how it was written.",
            "<strong>Drafts.</strong> Keep the messy ones. A first draft with the argument in the wrong order is better evidence than a clean final copy.",
            "<strong>Your notes.</strong> Reading notes, lecture notes, the photograph of the whiteboard.",
            "<strong>Prompt logs.</strong> If you used a tool, keep what you typed and what came back, in a document alongside your work. Some briefs require this, and it is worth doing even when they do not.",
            "<strong>Anything you were told.</strong> The email where your lecturer answered your question about what was permitted."
          ]
        },
        {
          type: "check",
          id: "check-declaring",
          title: "Check your understanding",
          questions: [
            {
              id: "d1",
              prompt: "A brief permits AI use with declaration. You used a tool once, to fix punctuation in one paragraph, and did not mention it because so little changed. Is that a problem?",
              multi: false,
              options: [
                {
                  id: "a",
                  text: "Yes — the brief set the threshold, and the brief said declare",
                  correct: true,
                  feedback: "Yes. There is no minimum amount of AI use below which declaration stops applying. A single line in your declaration would have covered it, and undeclared use of a permitted tool is exactly the avoidable case the guidelines are trying to prevent."
                },
                {
                  id: "b",
                  text: "No — it was permitted, so there is nothing to answer for",
                  correct: false,
                  feedback: "Permission and declaration are two separate requirements. You met the first and not the second, and it is the second that is visible to a marker."
                },
                {
                  id: "c",
                  text: "No — punctuation is not content",
                  correct: false,
                  feedback: "It is a reasonable instinct, and the guidelines do not work that way. The brief asked you to declare use of the tool, not to judge whether the change was substantial enough to count."
                },
                {
                  id: "d",
                  text: "Only if the marker notices",
                  correct: false,
                  feedback: "Whether something is declared is not a question of whether you expect to be caught. That framing is what turns a small thing into a serious one."
                }
              ]
            },
            {
              id: "d2",
              prompt: "Which of these are worth keeping while you work on an assignment? Select all that apply.",
              multi: true,
              options: [
                {
                  id: "a",
                  text: "Your rough early drafts, including the ones you are not proud of",
                  correct: true,
                  feedback: "Yes. A messy draft showing an argument being worked out is some of the strongest evidence there is that the work is yours."
                },
                {
                  id: "b",
                  text: "The version history of the document",
                  correct: true,
                  feedback: "Yes, and it usually costs you nothing because cloud documents keep it by default. Composing elsewhere and pasting in a finished piece destroys it."
                },
                {
                  id: "c",
                  text: "A log of the prompts you used and what came back",
                  correct: true,
                  feedback: "Yes. Some briefs require it. Even when they do not, it turns a vague memory of what you did into something you can show."
                },
                {
                  id: "d",
                  text: "Only the final PDF, once everything else is deleted for tidiness",
                  correct: false,
                  feedback: "This is the one habit to break. A single final file shows the destination and nothing about the journey, which is precisely what you would want to be able to show."
                }
              ]
            }
          ]
        }
      ]
    },

    /* ---------------- 6. If a concern is raised ---------------- */
    {
      id: "concern",
      number: 6,
      title: "If a concern is raised",
      summary: "What triggers a query, what to bring, and the principles that govern how it is handled.",
      minutes: 2,
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "This is the part students are most anxious about, so it is worth saying plainly: a concern is a question, not a verdict. Most are resolved by a conversation in which you explain how you produced the work."
          ]
        },
        {
          type: "prose",
          heading: "What can trigger a concern",
          paragraphs: [
            "Usually it is a mismatch. The submitted work does not sound like your other work, or does not match how you talk about the subject in class. Sources do not check out. The text contradicts itself, or answers a slightly different question than the one set. A similarity report or an AI-detection score flags something and a marker goes to look.",
            "A flag is a prompt to look, not a finding. That distinction matters and it is written into the principles below."
          ]
        },
        {
          type: "prose",
          heading: "What happens next",
          paragraphs: [
            "You will be told what the concern is and what it is based on, in terms specific enough for you to respond to. In many cases the first step is an informal conversation with the module lecturer, and it goes no further. Where it does go further it is handled under the university's Student Academic Misconduct Policy and Disciplinary Procedure, alongside the Academic Integrity Policy. [[CONFIRM: links to the SETU Academic Integrity Policy and the Student Academic Misconduct Policy and Disciplinary Procedure]]"
          ]
        },
        {
          type: "list",
          lead: "What to bring:",
          ordered: false,
          items: [
            "Your drafts, in the order you wrote them.",
            "The version history of the document.",
            "Your reading and lecture notes.",
            "Any prompt logs, if you used a tool.",
            "Any correspondence about what was permitted in that assessment.",
            "Yourself, able to talk about the argument. Being able to explain why you took the line you took is worth more than any single document."
          ]
        },
        {
          type: "prose",
          heading: "What you are entitled to",
          paragraphs: [
            "You are entitled to understand the concern in specific terms rather than in general suspicion, to know what it rests on, to respond before any decision is made, and to be supported through the process. You do not have to go into a meeting cold or on your own — you can bring someone with you, and the students' union can advise you. [[CONFIRM: the SETU support contact and students' union route for a student facing an academic integrity concern]]"
          ]
        },
        {
          type: "callout",
          tone: "quote",
          title: "The five key principles",
          attribution: "SETU Student Guidelines on the use of Gen AI [[CONFIRM: replace the five principles below with the verbatim wording from the guidelines, and add the section reference]]",
          ordered: true,
          items: [
            "Academic integrity applies to generative AI exactly as it applies to any other source of assistance.",
            "Permission for Gen AI use is set at module and assessment level, and must be communicated clearly to students.",
            "Students are responsible for the accuracy, integrity and originality of everything they submit.",
            "Where Gen AI use is permitted, it must be declared and appropriately acknowledged.",
            "AI detection scores alone are not sufficient evidence of academic misconduct. A concern must be considered on the full range of available evidence, and the student must be given the opportunity to respond."
          ]
        },
        {
          type: "reflect",
          id: "reflect-concern",
          title: "Worth two minutes",
          note: "Not submitted, not marked, saved in this browser only. It appears in your completion record at the end.",
          prompts: [
            {
              id: "could-show",
              label: "If you were asked tomorrow to show how you produced your last assignment, what could you actually show?",
              placeholder: "Drafts, version history, notes, prompt logs — or be honest about what you no longer have."
            }
          ]
        },
        {
          type: "branch",
          id: "branch-concern-walkthrough",
          stub: {
            heading: "Coming in the full course: a walkthrough",
            paragraphs: [
              "The full version of this module includes a step-by-step scenario in which a concern is raised about a piece of your work and you choose what to do at each stage, seeing where each route leads.",
              "It is not in this preview, because the detail depends on procedure that is still being confirmed. The prose above covers the substance."
            ],
            v2: "branch — scenario walkthrough of a raised concern. Blocked on confirmed policy detail: the informal-resolution stage, who convenes it, timescales, the point at which the Student Academic Misconduct Policy and Disciplinary Procedure formally engages, and the support and accompaniment route. See the [[CONFIRM]] items in this module. Do not build until those are answered."
          }
        }
      ]
    },

    /* ---------------- 7. Wrap-up ---------------- */
    {
      id: "wrap",
      number: 7,
      title: "Wrap-up",
      summary: "Five points to take away, then a final check and your completion record.",
      minutes: 3,
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Five points carry almost all of it."
          ]
        },
        {
          type: "list",
          ordered: true,
          items: [
            "<strong>Permission is set per module and per assessment, by your lecturer.</strong> Read the brief. If it does not say, ask before you start.",
            "<strong>Being allowed to use it and declaring that you used it are two separate requirements.</strong> Undeclared use of a permitted tool is the avoidable case that catches honest students.",
            "<strong>You own everything you submit</strong>, including anything a tool got wrong. If you have not read it, do not cite it.",
            "<strong>These tools take the most likely path.</strong> Do your own thinking first and bring the tool in to argue with it. Starting with the tool gets you the answer everyone else got.",
            "<strong>Keep your working.</strong> Drafts, version history, notes, prompt logs. It costs nothing and it is the best protection you have if a question is ever asked."
          ]
        },
        {
          type: "check",
          id: "final-check",
          scored: true,
          passMark: 6,
          title: "Final check",
          intro: "Eight questions drawn from the whole course. You need six correct to complete. You can retry as often as you like, and every answer explains itself either way.",
          questions: [
            {
              id: "f1",
              prompt: "Who decides whether you may use Gen AI in a particular assessment?",
              multi: false,
              options: [
                { id: "a", text: "The lecturer who set that assessment", correct: true, feedback: "Correct. Permission is set per module and per assessment by the lecturer, because only they know what the assessment is testing." },
                { id: "b", text: "The university, through a single policy that applies everywhere", correct: false, feedback: "No. There is a university position, but it delegates the decision to module and assessment level rather than setting one rule for all work." },
                { id: "c", text: "The student, provided the use is declared", correct: false, feedback: "No. Declaring describes what you did; it does not grant permission you did not have." },
                { id: "d", text: "The examinations office", correct: false, feedback: "No. This is not an administrative decision — it depends on what the assessment is designed to test, which is the lecturer's call." }
              ]
            },
            {
              id: "f2",
              prompt: "An assignment brief says nothing about AI. What should you do?",
              multi: false,
              options: [
                { id: "a", text: "Ask the lecturer before you start, and keep the answer", correct: true, feedback: "Correct. Silence is an unanswered question, not permission. A written answer is also useful evidence if anything is ever queried." },
                { id: "b", text: "Treat silence as permission, and declare afterwards", correct: false, feedback: "No. This is the single most common route into difficulty. Declaring after the fact does not make an unpermitted use permitted." },
                { id: "c", text: "Follow whatever another module allowed", correct: false, feedback: "No. Permission does not carry across modules. Two assessments in the same week can have opposite rules." },
                { id: "d", text: "Use it only for small things, which do not count", correct: false, feedback: "No. There is no threshold below which the guidelines stop applying, and inventing one for yourself is a poor position to be in later." }
              ]
            },
            {
              id: "f3",
              prompt: "A tool gives you a reference you cannot find anywhere. What do you do with it?",
              multi: false,
              options: [
                { id: "a", text: "Leave it out — if you have not read it, it does not go in your work", correct: true, feedback: "Correct. It is very likely fabricated, and in any case citing something you have not read is a problem in its own right." },
                { id: "b", text: "Include it and note that you could not access it", correct: false, feedback: "No. A note does not rescue a source that may not exist. Find a real source that makes the point instead." },
                { id: "c", text: "Include it, since the tool must have got it from somewhere", correct: false, feedback: "No. The model produces text shaped like a citation. There is no retrieved document behind it unless the tool explicitly searched and showed you the source." },
                { id: "d", text: "Ask the tool to confirm whether the reference is real", correct: false, feedback: "No. It will often confirm it, confidently, and that tells you nothing. Verification has to happen outside the tool — in the library catalogue or the publisher's record." }
              ]
            },
            {
              id: "f4",
              prompt: "Does an AI rewrite feature built into your word processor fall under these guidelines?",
              multi: false,
              options: [
                { id: "a", text: "Yes — where the tool lives makes no difference", correct: true, feedback: "Correct. A tool built into software you already use is still a Gen AI tool, and it needs the same permission and the same declaration." },
                { id: "b", text: "No — it is part of the software, not a separate AI tool", correct: false, feedback: "No, and this is a common misreading. The guidelines describe what the tool does, not which window it opened in." },
                { id: "c", text: "Only in modules that mention that specific software", correct: false, feedback: "No. A brief does not have to name every product for its rule about AI use to apply." },
                { id: "d", text: "Only if you accept more than half its suggestions", correct: false, feedback: "No. There is no proportion test anywhere in the guidelines." }
              ]
            },
            {
              id: "f5",
              prompt: "You used a permitted tool and did not declare it. How is that treated?",
              multi: false,
              options: [
                { id: "a", text: "As a breach — declaration is a separate requirement from permission", correct: true, feedback: "Correct, and this is the case worth avoiding hardest, because you did the allowed thing and then failed to say so. One sentence would have prevented it." },
                { id: "b", text: "As fine, because the use itself was permitted", correct: false, feedback: "No. Permission covers what you did; declaration is how your marker knows what you did. Both are required." },
                { id: "c", text: "As fine, provided you can prove the work is yours", correct: false, feedback: "No. Being able to evidence your work helps a great deal if a concern arises, but it does not retrospectively satisfy a declaration requirement." },
                { id: "d", text: "As a minor formatting issue", correct: false, feedback: "No. It is treated as an integrity matter rather than a presentation one, which is why it is worth a line in every submission where you used a tool." }
              ]
            },
            {
              id: "f6",
              prompt: "Which of these should you keep while you work? Select all that apply.",
              multi: true,
              options: [
                { id: "a", text: "Drafts, including early messy ones", correct: true, feedback: "Yes. A draft with the argument half-formed is strong evidence that the thinking was yours." },
                { id: "b", text: "The document's version history", correct: true, feedback: "Yes, and cloud documents keep it for you. Pasting a finished piece into a new file destroys it." },
                { id: "c", text: "Prompt logs, where you used a tool", correct: true, feedback: "Yes. Some briefs require them, and they turn a vague recollection into something you can show." },
                { id: "d", text: "Nothing — a single clean final file is tidier", correct: false, feedback: "No. Tidying away the evidence is the one habit worth breaking. Keep the working." }
              ]
            },
            {
              id: "f7",
              prompt: "A piece of your work returns a high AI-detection score. What follows from that on its own?",
              multi: false,
              options: [
                { id: "a", text: "Nothing on its own — a score is not sufficient evidence, and any concern is considered on the full evidence with an opportunity for you to respond", correct: true, feedback: "Correct, and this is one of the five key principles. Detection scores are unreliable, and are treated as a prompt to look rather than as a finding." },
                { id: "b", text: "The work is treated as AI-generated", correct: false, feedback: "No. The principles are explicit that a detection score alone is not sufficient evidence of misconduct." },
                { id: "c", text: "The work is failed automatically", correct: false, feedback: "No. No outcome follows automatically from a score. There is a process, and you are part of it." },
                { id: "d", text: "You have to prove the work is your own before anything else happens", correct: false, feedback: "Not quite, and the difference matters. The concern must be put to you with what it rests on, and you respond to that. Being able to show your drafts helps, but the starting point is not that you are presumed responsible." }
              ]
            },
            {
              id: "f8",
              prompt: "Why is starting an essay by asking a tool for the structure a risk to your mark, even where AI use is permitted?",
              multi: false,
              options: [
                { id: "a", text: "Because it returns the most conventional answer, and steers you away from the more interesting approach", correct: true, feedback: "Correct. The model takes the highest-probability path, so you get the plan most people would write. The less obvious angle is usually where the higher marks are." },
                { id: "b", text: "Because structuring work is always prohibited", correct: false, feedback: "No — it is on the list of things to ask about, not a blanket prohibition. This question is about the quality of the result, not permission." },
                { id: "c", text: "Because the structure it gives you is usually incoherent", correct: false, feedback: "No, and that is the trap. The structure is normally perfectly coherent. It is also perfectly ordinary." },
                { id: "d", text: "Because you would have to declare it", correct: false, feedback: "You would, where the brief requires it, but declaring is not the risk here. The risk is that you have handed over the thinking the assessment was there to develop." }
              ]
            }
          ]
        }
      ]
    }
  ],

  /* =================================================================== */
  completion: {
    title: "Your completion record",
    intro: "This is a record you can keep, not an award. It is generated on this device from what you entered, and printing it is the only way it leaves the browser.",
    nameLabel: "Your name for this record (optional)",
    namePlaceholder: "Leave blank if you would rather not",
    printLabel: "Print or save as PDF",
    courseLabel: "Course",
    dateLabel: "Completed",
    scoreLabel: "Final check",
    reflectionsLabel: "Your reflections",
    declarationLabel: "The declaration you built",
    noReflection: "Not answered.",
    noDeclaration: "You did not build a declaration in module 5.",
    footnote: "Not a formal certificate and not held by the university. If you need evidence that you completed this course, tell your lecturer or the module team. [[CONFIRM: whether completion of this course needs to be recorded anywhere, and by what route]]"
  },

  /* Interface strings. Buttons say what happens (brand voice, §9.7). */
  ui: {
    contentsTitle: "Contents",
    contentsToggle: "Contents",
    progressLabel: "Course progress",
    progressOf: "modules complete",
    previousLabel: "Previous",
    continueLabel: "Continue to module",
    finishLabel: "Finish the course",
    startAgainLabel: "Start again",
    resumeLabel: "Resume at module",
    moduleLabel: "Module",
    minutesLabel: "min",
    completeLabel: "Complete",
    inProgressLabel: "In progress",
    notStartedLabel: "Not started",
    checkAnswersLabel: "Check my answers",
    tryAgainLabel: "Clear and try again",
    checkDefaultTitle: "Check your understanding",
    singleHint: "Select one answer.",
    multiHint: "Select all that apply.",
    notAnsweredLabel: "You have not answered this one yet.",
    youChoseRight: "You chose this, and it is right",
    youChoseWrong: "You chose this, and it is not right",
    missedRight: "This one was right",
    answerAllLabel: "Answer the remaining questions to see your score. {n} still to go.",
    checkSortLabel: "Check my sorting",
    resetSortLabel: "Clear and start the sorting again",
    unplacedLabel: "Cards still to place",
    placeInLabel: "Place in",
    selectedLabel: "Selected:",
    selectFirstLabel: "Select a card first, then choose a column.",
    selectedAnnounce: "Selected: {card}. Choose a column, or press 1, 2 or 3.",
    deselectedAnnounce: "No card selected.",
    placedAnnounce: "Placed in {bucket}: {card}",
    returnedAnnounce: "Moved back to the cards still to place: {card}",
    moveBackLabel: "Move back",
    emptyBucketLabel: "Nothing here yet.",
    allPlacedLabel: "Every card is placed. Check your sorting when you are ready.",
    allCheckedLabel: "Every card is placed and marked below.",
    notPlacedLabel: "You did not place this one. It belongs in {bucket}",
    belongsInLabel: "Not there — it belongs in {bucket}",
    sortScoreLabel: "You placed {right} of {total} where the guidelines would put them.",
    sortResetLabel: "Cleared. All the cards are back in the list.",
    spectrumLabel: "What the assignment brief says",
    mayLabel: "What you may do",
    declareLabel: "What you must declare",
    unsureLabel: "If you are unsure",
    scoreYouGot: "You answered",
    scoreOutOf: "of {total} correctly.",
    passedLabel: "You have completed the course.",
    failedLabel: "Not quite. Read the feedback under each question, then try again — there is no limit on attempts and nothing is recorded.",
    retryFinalLabel: "Try the final check again",
    savedLabel: "Saved on this device",
    correctLabel: "Correct",
    incorrectLabel: "Not correct",
    partialLabel: "Partly correct"
  },

  footer: {
    privacy: "This course sends nothing anywhere. No analytics, no accounts, no network requests. Everything you type stays in this browser.",
    resetLabel: "Reset all my data",
    resetConfirm: "This clears your progress, your answers, your reflections and anything you typed into the declaration builder, on this device. It cannot be undone. Continue?",
    resetDone: "Cleared. The course has restarted from the beginning.",
    reviewNote: "Course content review date: 2026-09-02. Both the SETU Student Guidelines on Gen AI and the SETU Brand Guidelines are versioned documents — see README.md.",
    confirmsTitle: "Build notes: items awaiting confirmation"
  },

  /* Listed in the footer and in the build report. Every one of these is a
     value that must come from SETU rather than be invented here. */
  confirms: [
    "SETU logo asset files (master, reverse, mono) from SETU marketing. A labelled placeholder is used in the header until they are supplied.",
    "Brand sign-off for a student-facing course built outside the standard templates — contact the SETU brand manager.",
    "Whether a version of the brand guidelines later than V1 (May 2022) now applies. That document said fuller guidelines were due the following September.",
    "SETU support contact, and the students' union route, for a student facing an academic integrity concern.",
    "Links to the SETU Academic Integrity Policy and the Student Academic Misconduct Policy and Disciplinary Procedure.",
    "Whether SETU has a standard declaration form students should use instead of the builder output.",
    "Version and review date for the AI guidelines this course is based on.",
    "The six position points in module 1, checked word for word against the guidelines.",
    "The five key principles in module 6, which must be reproduced verbatim from the guidelines rather than paraphrased as they are here.",
    "The official 'U' shape asset and its correct proportions. The module number device is drawn from a plain geometric placeholder, since the crest must not be traced.",
    "Whether completion of this course should be recorded anywhere in SETU systems."
  ]
};
