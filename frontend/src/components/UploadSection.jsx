import { useState, useRef } from 'react'
import { styles } from '../styles/styles'
import { qaAPI } from '../services/api'

function UploadSection({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.endsWith('.pdf')) {
      setError("Please upload a PDF file only!")
      return
    }
    await uploadFile(file)
  }

  const uploadFile = async (file) => {
    setUploading(true)
    setError("")
    try {
      const result = await qaAPI.uploadPDF(file)
      if (result.doc_id) {
        onUploadSuccess(result)
      } else {
        setError("Upload failed! Please try again.")
      }
    } catch (err) {
      setError("Error uploading file!")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>📁 Upload Document</h2>

      <div
        style={styles.uploadArea}
        onClick={() => fileInputRef.current.click()}
      >
        <div style={styles.uploadIcon}>📄</div>
        <p style={styles.uploadText}>
          {uploading ? "Processing..." : "Click to upload PDF"}
        </p>
        <p style={styles.uploadSubtext}>
          Only PDF files supported
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {error && (
        <div style={styles.errorBox}>
          ❌ {error}
        </div>
      )}

      {uploading && (
        <div style={{
          textAlign: "center",
          marginTop: "16px",
          color: "#4f46e5"
        }}>
          ⏳ Processing your document...
        </div>
      )}
    </div>
  )
}

export default UploadSection