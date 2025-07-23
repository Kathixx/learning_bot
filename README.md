# Motivation
RAGs are everywhere, so I wanted to jump into this topic and create a platform for students, where they can learn and test themselves during chatting with a bot. Therefore they have to upload a pdf: a study, their study script or any other pdf file. 

In the **learning mode** the bot answers the questions with the given information (pdf) - without halluzinations. This is how the students can learn the material in a easy dialog.

In the **testing mode** the bot generates questions, which are suppose to encourage deeper reflexion and understanding. Answering in-depth questions is a proven method for sustainable and good learning ([see this study here]()).

More about Chatbots & Learning [here](https://www.clearinghouse.edu.tum.de/lehrstrategien/chatbots-im-unterricht-welche-lernergebnisse-werden-unterstuetzt/).

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


# Initial Setup

## 1. Backend

### 1.1. Install Virtuell Environment and Flask

```bash 
# in your backend folder

pyenv local 3.11.3
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip

pip install Flask
pip install flask-cors
```

### 1.2. Create minimal application
- create a `app.py` file in your backend folder

```python 
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```
- switch to your terminal & run the app
```bash
flask --app app run
#or
python app.py
```

### 1.3. Install packages

```bash
pip install PyPDF2
pip install langchain
pip install langchain-openai
pip install langchain-anthropic
pip install langchain-core
pip install langchain-community
pip install faiss-cpu
pip install -U pip setuptools wheel
pip install -U spacy
python -m spacy download en_core_web_sm
pip install -U langchain-community pypdf
```


## 2. Frontend

### 2.1. Install Next.js App with [Supabase Auth](https://supabase.com/docs/guides/auth/quickstarts/nextjs)

Supabase will automatically setup your Next.js app with _`Cookie-based Auth`, `TypeScript`_ and _`Tailwind CSS`_

```bash
npx create-next-app -e with-supabase
```
As name of your application type `frontend`, so that you have a backend and a frontend folder

__Don't forget to set your supabase db and copy your credentials in a `.env.local` file__

### 2.2. Install Multilinguality with [Next-Intl](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing)

```bash
npm install next-intl
```


 

