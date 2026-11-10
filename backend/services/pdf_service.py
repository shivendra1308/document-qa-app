# services/pdf_service.py
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

def load_pdf(file_path: str):
    loader = PyPDFLoader(file_path)
    pages = loader.load()
    print(f"Loaded {len(pages)} pages from PDF")
    return pages

def split_into_chunks(pages):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = splitter.split_documents(pages)
    print(f"Split into {len(chunks)} chunks")
    return chunks