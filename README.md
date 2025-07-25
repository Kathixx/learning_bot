# Motivation
RAGs are everywhere, so I wanted to jump into this topic and create a platform for students, where they can learn and test themselves during chatting with a bot. Therefore they have to upload a pdf: a study, their study script or any other pdf file. 

In the **learning mode** the bot answers the questions with the given information (pdf) - without halluzinations. This is how the students can learn the material in a easy dialog.

In the **testing mode** the bot generates questions, which are suppose to encourage deeper reflexion and understanding. Answering in-depth questions is a proven method for sustainable and good learning.

More about Chatbots & Learning [here](https://www.clearinghouse.edu.tum.de/lehrstrategien/chatbots-im-unterricht-welche-lernergebnisse-werden-unterstuetzt/).

![Testbot](/testbot_fast.mp4)

# Technical Infos
### TechStack

`TypeScript`, `Next.js`, `React`, `TailwindCSS`, `Python`, `Flask`, `LLM`, `RAG`

### Features & Packages
- login authentication with [Supabase](https://supabase.com/)
- setup for multilingualism (german/english) with [Next-Intl](https://next-intl.dev/), currently supported: german, english (easy adaption for other languages)
- use of [ShadCN components](https://ui.shadcn.com/)
- pdf rendering with [React PDF Viewer](https://react-pdf-viewer.dev/)
- random ID generation with [UUID npm package](https://www.npmjs.com/package/uuid)
- pretty icons with [Tabler Icons](https://tabler.io/icons)
- dark/light mode
- This layout is not yet responsive, but it is optimised for a 13" display








 

