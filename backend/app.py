from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin
from datetime import timedelta

from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.embeddings.spacy_embeddings import SpacyEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain.tools.retriever import create_retriever_tool
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic
from langchain_openai import OpenAI, ChatOpenAI, OpenAIEmbeddings
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.prompts.prompt import PromptTemplate

from langchain import hub
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
import warnings
warnings.filterwarnings("ignore")

import os
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

# SECRET KEY
# TODO: SAFE IN ENVIRONMENT VARIABLE
import secrets
secret_key = secrets.token_hex(32)  # 64-character hexadecimal string


app = Flask(__name__)
app.secret_key = secret_key  # Replace with actual key
app.config.update(
    PERMANENT_SESSION_LIFETIME= timedelta(minutes=30),
    SESSION_COOKIE_SECURE=False, # only with HTTPS
    SESSION_COOKIE_SAMESITE='Lax',  # Allows cross-origin cookies
    SESSION_COOKIE_HTTPONLY=False,
    SESSION_COOKIE_PATH='/',
)

CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["POST","GET" "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True 
    }
})

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def load_pdf_data(pdf_path):
    loader = PyPDFLoader(file_path=pdf_path)
    documents = loader.load()
    return documents

def get_chunks(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, 
        chunk_overlap=200)
    chunks = text_splitter.split_documents(documents=documents)
    return chunks


def create_embedding_vector_db(chunks, db_name, target_directory=f"../vector_databases"):
    embedding = OpenAIEmbeddings(
        model='text-embedding-3-small'
    )
    vectorstore = FAISS.from_documents(
        documents=chunks,
        embedding=embedding
    )
    if not os.path.exists(target_directory):
        os.makedirs(target_directory)
    vectorstore.save_local(f"{target_directory}/{db_name}_vector_db")

def retrieve_from_vector_db(vector_db_path):
    embeddings = OpenAIEmbeddings(
        model='text-embedding-3-small'
    )
    react_vectorstore = FAISS.load_local(
        folder_path=vector_db_path,
        embeddings=embeddings,
        allow_dangerous_deserialization=True
    )
    retriever = react_vectorstore.as_retriever()
    return retriever

def connect_chains(retriever):
    stuff_documents_chain = create_stuff_documents_chain(
        llm=OpenAI(),
        prompt=hub.pull("langchain-ai/retrieval-qa-chat")
    )
    retrieval_chain = create_retrieval_chain(
        retriever=retriever,
        combine_docs_chain=stuff_documents_chain
    )
    return retrieval_chain


def readPDF(filename):
    print("reading the pdf...")
    doc = load_pdf_data(pdf_path = filename)
    doc_chunks = get_chunks(doc)
    create_embedding_vector_db(chunks=doc_chunks, db_name="deepr")
    print("PDF reading done.")




def generate_question():
    load_dotenv()
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=3
    )
    query_de = """ 
        Du bist Lehrkraft. Lies dir das folgende PDF-Dokument aufmerksam durch und fasse es zusammen. Generiere eine kurze, gut verständliche, tiefgründige Frage, die sich direkt auf deine Zusammenfassung bezieht. Die Frage soll nicht bloß Fakten abfragen, sondern dazu anregen, kritisch oder analytisch über das Thema nachzudenken.
        Berücksichtige dabei:
        – Was ist die zentrale Aussage oder These?
        – Was könnte eine Leserin zum Weiterdenken oder Diskutieren anregen?
        Gib nur die Frage als Ausgabe zurück.
        """
    retriever = retrieve_from_vector_db("../vector_databases/deepr_vector_db")
    retrieval_chain = connect_chains(retriever)
    output = retrieval_chain.invoke(
        {"input": query_de}
    )
    print ('answer: '+output['answer'])
    return output['answer']


def getResult(question, answer):
    load_dotenv()
    llm = ChatOpenAI(
        model_name="gpt-4.1-nano",
        temperature=3
    )
    query_de = f"""
    Du bist Lehrkraft. Lies dir das folgende PDF-Dokument aufmerksam durch und beantworte damit die folgende Frage {question}. Vergleiche deine generierte Antwort mit der Schüler-Antwort {answer}. 
    Erläutere kurz, was an der Schüler-Antwort gut oder schlecht ist. Gehe dabei vor allem auf fehlende Aspekte ein oder Trugschlüsse, sodass der Schüler mit deiner Hilfe eine perfekte Antwort erstellen kann.  Erstelle ein kurzes Schüler-Feedback. Gib nur das Schüler-Feedback zurück und richte dich dabei, direkt an den Schüler selbst. Lobe und motiviere zum weiter Üben.
    """
    retriever = retrieve_from_vector_db("../vector_databases/deepr_vector_db")
    retrieval_chain = connect_chains(retriever)
    output = retrieval_chain.invoke(
        {"input": query_de}
    )
    print ('checkResult: '+output['answer'])
    return output['answer']

def getAnswer(question):
    print("I will get the answer")
    print(question)
    load_dotenv()
    llm = ChatOpenAI(
        model_name="gpt-4.1-nano",
        temperature=3
    )
    query_de = f"""
    Bedanke dich für die Frage. Lese dir das PDF aufmerksam durch und beantworte die folgende Frage {question}. Achte dabei auf eine einfache, klar verständliche Sprache. Schreibe in kurzen Sätzen. Nehme nur Bezug auf das PDF. Wenn du eine Frage nicht aus dem Dokument beantworten kannst, schreibe "Diese Frage kann ich leider nicht beantworten". Gib die Seitenangaben mit an. Gib nur deine Antwort zurück.
    """
    retriever = retrieve_from_vector_db("../vector_databases/deepr_vector_db")
    retrieval_chain = connect_chains(retriever)
    output = retrieval_chain.invoke(
        {"input": query_de}
    )
    return output['answer']

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'  # Replace with your client domain
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

# TestBot
@app.route('/checkAnswer', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def check_answer():
    try:
        data = request.get_json()
        check_result = getResult(data['Question'], data['Answer'])
        return jsonify({'Check': check_result })
    except Exception as e:
        return jsonify({'error': str(e)})
    
# TestBot
@app.route('/getQuestion', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def getQuestion():
    try:
        data = request.get_json()
        print(data)
        print(data['filename'])
        question = generate_question()
        return jsonify({'Question': question})
    except Exception as e:
        return jsonify({'error': str(e)})
    
# LearnBot
@app.route('/getAnswer', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def get_answer():
    try:
        data = request.get_json()
        print(data)
        answer = getAnswer(data['question'])
        return jsonify({'Answer': answer })
    except Exception as e:
        return jsonify({'error': str(e)})

# upload component
@app.route('/upload', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    pdf = request.files['pdf']
    if pdf.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filepath = os.path.join(UPLOAD_FOLDER, pdf.filename)
    pdf.save(filepath)
    readPDF(filepath)
    return jsonify({'message': 'File uploaded successfully', 'Filepath': filepath, 'Filename': pdf.filename})

# pdf Viewer
@app.route('/pdfs/<filename>')
@cross_origin(origin='http://localhost:3000')
def serve_pdf(filename):
    return send_from_directory('uploads', filename)

if __name__ == "__main__":
    app.run(debug=True, port=5002)