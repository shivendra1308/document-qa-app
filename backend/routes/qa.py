# routes/qa.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from services.rag_service import process_document, get_relevant_chunks
import os
import uuid
import json

load_dotenv()

router = APIRouter(prefix="/qa", tags=["qa"])
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Track uploaded documents
documents = {}

class QuestionRequest(BaseModel):
    doc_id: str
    question: str

# ===== UPLOAD PDF =====
@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files allowed!"
        )

    doc_id = str(uuid.uuid4())[:8]
    file_path = f"./uploads/{doc_id}_{file.filename}"

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    result = process_document(file_path, doc_id)

    documents[doc_id] = {
        "filename": file.filename,
        "file_path": file_path,
        "pages": result["pages"],
        "chunks": result["chunks"]
    }

    return {
        "doc_id": doc_id,
        "filename": file.filename,
        "pages": result["pages"],
        "chunks": result["chunks"],
        "message": "Document processed successfully!"
    }

# ===== ASK QUESTION =====
@router.post("/ask")
async def ask_question(request: QuestionRequest):
    if request.doc_id not in documents:
        raise HTTPException(
            status_code=404,
            detail="Document not found!"
        )

    relevant_chunks = get_relevant_chunks(
        doc_id=request.doc_id,
        question=request.question
    )

    context = "\n\n".join([
        chunk.page_content
        for chunk in relevant_chunks
    ])

    prompt = f"""You are a helpful assistant that answers
questions based on the provided document context.

DOCUMENT CONTEXT:
{context}

USER QUESTION:
{request.question}

Instructions:
- Answer ONLY from the document context above
- If answer not in context, say "I couldn't find that in the document"
- Be concise and accurate
- Mention page numbers if available
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000,
        temperature=0.3
    )

    answer = response.choices[0].message.content

    return {
        "question": request.question,
        "answer": answer,
        "doc_id": request.doc_id,
        "filename": documents[request.doc_id]["filename"],
        "chunks_used": len(relevant_chunks)
    }

# ===== GET DOCUMENTS =====
@router.get("/documents")
def get_documents():
    return {"documents": documents}