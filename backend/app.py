from flask import Flask, jsonify, request
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


#  embeddings = SpacyEmbeddings(model_name="en_core_web_sm")


# def vector_store(text_chunks):
#     vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
#     vector_store.save_local("faiss_db")


def create_embedding_vector_db(chunks, db_name, target_directory=f"../vector_databases"):
    """
    this function uses the open-source embedding model HuggingFaceEmbeddings 
    to create embeddings and store those in a vector database called FAISS, 
    which allows for efficient similarity search
    """
    # instantiate embedding model
    # todo: embeddings = SpacyEmbeddings(model_name="en_core_web_sm")
    embedding = OpenAIEmbeddings(
        model='text-embedding-3-small'
    )
    # create the vector store 
    vectorstore = FAISS.from_documents(
        documents=chunks,
        embedding=embedding
    )
    # save vector database locally
    if not os.path.exists(target_directory):
        os.makedirs(target_directory)
    vectorstore.save_local(f"{target_directory}/{db_name}_vector_db")

def retrieve_from_vector_db(vector_db_path):
    """
    this function splits out a retriever object from a local vector database
    """
    # instantiate embedding model
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
    """
    this function connects stuff_documents_chain with retrieval_chain
    """
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
    # text = ""
    # documents = load_pdf_data(pdf_path = "documents/test_document.pdf")
    # for pdf in documents:
    #     pdf_reader = PdfReader(pdf)
    #     for page in pdf_reader.pages:
    #         text += page.extract_text()
    doc = load_pdf_data(pdf_path = filename)
    doc_chunks = get_chunks(doc)
    create_embedding_vector_db(chunks=doc_chunks, db_name="deepr")
    # vector_store(text_chunks)
    print("PDF reading done.")


# def get_conversational_chain_question(tools):
#     load_dotenv()
#     #os.environ["ANTHROPIC_API_KEY"]=os.getenv["ANTHROPIC_API_KEY"]
#     #llm = ChatAnthropic(model="claude-3-sonnet-20240229", temperature=0, api_key=os.getenv("ANTHROPIC_API_KEY"),verbose=True)
#     llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
#     prompt = ChatPromptTemplate.from_messages(
#     [
#         (
#             "system",
#             """You are a teacher who wants to test the students. Generate from the provided context a question for the students. Make sure to provide all the details.""",
#         ),
#         ("placeholder", "{chat_history}"),
#         ("placeholder", "{agent_scratchpad}"),
#     ]
# )
#     tool=[tools]
#     agent = create_tool_calling_agent(llm, tool, prompt)
#     agent_executor = AgentExecutor(agent=agent, tools=tool, verbose=True)
#     response=agent_executor.invoke()
#     print(response)
#     return (response['output'])

# def generate_question():
#     if not os.path.exists("faiss_db/index.faiss"):
#         print("FAISS index not found. Please process your PDF first.")
#         return
#     new_db = FAISS.load_local("faiss_db", embeddings,allow_dangerous_deserialization=True)
#     retriever=new_db.as_retriever()
#     retrieval_chain= create_retriever_tool(retriever,"pdf_extractor","This tool is to generate questions from the pdf")
#     question = get_conversational_chain_question(retrieval_chain)
#     return question

def generate_question():

    # laod credentials
    load_dotenv()
    # define LLM
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=3
    )
    # query_en = "You are a teacher who wants to test the students. Generate a question for the students from the give context {information}, which activates deep learning for them. Make sure to provide all the details."
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
    # define LLM
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

# def get_conversational_chain(tools,ques):
#     load_dotenv()
#     #os.environ["ANTHROPIC_API_KEY"]=os.getenv["ANTHROPIC_API_KEY"]
#     #llm = ChatAnthropic(model="claude-3-sonnet-20240229", temperature=0, api_key=os.getenv("ANTHROPIC_API_KEY"),verbose=True)
#     llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
#     prompt = ChatPromptTemplate.from_messages(
#     [
#         (
#             "system",
#             """You are a helpful assistant. Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
#     provided context just say, "answer is not available in the context", don't provide the wrong answer""",
#         ),
#         ("placeholder", "{chat_history}"),
#         ("human", "{input}"),
#         ("placeholder", "{agent_scratchpad}"),
#     ]
# )
#     tool=[tools]
#     agent = create_tool_calling_agent(llm, tool, prompt)

#     agent_executor = AgentExecutor(agent=agent, tools=tool, verbose=True)
#     response=agent_executor.invoke({"input": ques})
#     print(response)
#     st.write("Reply: ", response['output'])

# def user_input(user_question):
#     if not os.path.exists("faiss_db/index.faiss"):
#         print("FAISS index not found. Please process your PDF first.")
#         return
    
#     new_db = FAISS.load_local("faiss_db", embeddings,allow_dangerous_deserialization=True)
    
#     retriever=new_db.as_retriever()
#     retrieval_chain= create_retriever_tool(retriever,"pdf_extractor","This tool is to give answer to queries from the pdf")
#     get_conversational_chain(retrieval_chain,user_question)



@app.after_request
def after_request(response):
    # Add CORS headers for every response
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'  # Replace with your client domain
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

@app.route('/checkAnswer', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def check_answer():
    try:
        data = request.get_json()
        check_result = getResult(data['Question'], data['Answer'])
        return jsonify({'Check': check_result })
    except Exception as e:
        return jsonify({'error': str(e)})
    
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

    # You can now read the file and feed it into your RAG logic
    return jsonify({'message': 'File uploaded successfully', 'Filepath': filepath})


if __name__ == "__main__":
    app.run(debug=True, port=5002)