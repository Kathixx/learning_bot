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