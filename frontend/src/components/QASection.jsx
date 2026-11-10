import { useState } from 'react'
import { styles } from '../styles/styles'
import { qaAPI } from '../services/api'

function QASection({ selectedDoc }) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [chunksUsed, setChunksUsed] = useState(0)

  const askQuestion = async () => {
    if (!question.trim()) return
    if (!selectedDoc) {
      setError("Please select a document first!")
      return
    }

    setLoading(true)
    setError("")
    setAnswer("")

    try {
      const result = await qaAPI.askQuestion(
        selectedDoc.doc_id,
        question
      )
      setAnswer(result.answer)
      setChunksUsed(result.chunks_used)
    } catch (err) {
      setError("Error getting answer!")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") askQuestion()
  }

  if (!selectedDoc) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>💬 Ask a Question</h2>
        <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
          Please select a document first!
        </p>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>
        💬 Ask about: {selectedDoc.filename}
      </h2>

      <input
        style={styles.questionInput}
        type="text"
        placeholder="Ask anything about your document..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />

      <button
        style={{
          ...styles.button,
          opacity: loading ? 0.6 : 1
        }}
        onClick={askQuestion}
        disabled={loading}
      >
        {loading ? "⏳ Finding answer..." : "🔍 Ask Question"}
      </button>

      {error && (
        <div style={styles.errorBox}>
          ❌ {error}
        </div>
      )}

      {answer && (
        <div style={styles.answerBox}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <strong>🤖 AI Answer:</strong>
            <span style={styles.badge}>
              {chunksUsed} chunks used
            </span>
          </div>
          <p style={styles.answerText}>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default QASection