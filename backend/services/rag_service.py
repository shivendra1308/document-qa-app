# services/rag_service.py
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from services.pdf_service import load_pdf, split_into_chunks
import os

vector_stores = {}

print("Loading embeddings model...")
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)
print("Embeddings model loaded!")

def process_document(file_path: str, doc_id: str):
    pages = load_pdf(file_path)
    chunks = split_into_chunks(pages)

    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=f"./chroma_db/{doc_id}"
    )

    vector_stores[doc_id] = vector_store

    print(f"Document {doc_id} processed!")
    return {
        "doc_id": doc_id,
        "pages": len(pages),
        "chunks": len(chunks)
    }

def get_relevant_chunks(doc_id: str, question: str, k: int = 4):
    if doc_id not in vector_stores:
        vector_stores[doc_id] = Chroma(
            persist_directory=f"./chroma_db/{doc_id}",
            embedding_function=embeddings
        )

    vector_store = vector_stores[doc_id]

    relevant_chunks = vector_store.similarity_search(
        question,
        k=k
    )

    return relevant_chunks