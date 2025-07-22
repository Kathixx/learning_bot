# Learboost Small App

This is my version of the frontend with the specific requirements of the learnboost App.

## Features
- Login/Logout authentication with [Supabase](https://supabase.com/)
- Setup for multilingualism (german/english) with [Next-Intl](https://next-intl.dev/), easy adaption for other languages
- Sensible use of [ShadCN components](https://ui.shadcn.com/)
- Dark/light mode: You can switch between dark and light modes within the app. It's optimised for the light mode
- This layout is not yet responsive, but it is optimised for a 13" display

## Workflow
1. Familiarised myself with the required packages
2. Set up the Next.js app with Supabase login
3. Created a navbar and added the following features: mode selector, theme switcher, profile button with profile settings and logout button
4. Implemented PDF viewer
5. Implemented chat functionality
6. Added/adjusted design (+ dark mode)
7. Added multilingual options _(this step would normally be taken earlier)_


## Used additionally Packages/Modules
- styling with [TailwindCSS](https://tailwindcss.com/)
- showing the pdf with [React PDF Viewer](https://react-pdf-viewer.dev/)
- creating random id's for the message list with [UUID npm package](https://www.npmjs.com/package/uuid)
- pretty icons with [Tabler Icons](https://tabler.io/icons)


## Setup: Supabase 
create a local `.env.local` file in the root folder with the following credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://bpqgzypanbeypftfrxnj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwcWd6eXBhbmJleXBmdGZyeG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzE5ODUsImV4cCI6MjA2NzcwNzk4NX0.DSscv7Z1WJ9mHppVpVfqgfgb3MLePP8aSGe0uQn4fgo
```

## Error handling
### Module not found: Can't resolve 'canvas'

This is due a problem with installation on Apple M1.
If the installed version of `pdfjs-dist` requires the canvas package which has issues with Apple M1. You can fix it by installing the canvas dependencies manually.
The following lines show how to do it with Brew:

```$ brew install pkg-config cairo pango```

