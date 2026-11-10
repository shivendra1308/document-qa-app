const BASE_URL = "http://localhost:8000"

export const qaAPI = {
  // Upload PDF
  uploadPDF: async (file) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${BASE_URL}/qa/upload`, {
      method: "POST",
      body: formData  // No Content-Type header for file upload!
    })
    return response.json()
  },

  // Ask question
  askQuestion: async (docId, question) => {
    const response = await fetch(`${BASE_URL}/qa/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doc_id: docId,
        question: question
      })
    })
    return response.json()
  },

  // Get documents
  getDocuments: async () => {
    const response = await fetch(`${BASE_URL}/qa/documents`)
    return response.json()
  }
}