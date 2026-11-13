import { useState } from 'react'
import UploadSection from './components/UploadSection'
import DocumentList from './components/DocumentList'
import QASection from './components/QASection'
import { styles } from './styles/styles'

function App() {
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)

  const handleUploadSuccess = (result) => {
    const newDoc = {
      doc_id: result.doc_id,
      filename: result.filename,
      pages: result.pages,
      chunks: result.chunks
    }
    setDocuments(prev => [...prev, newDoc])
    setSelectedDoc(newDoc)  // auto select uploaded doc!
  }

  // some comments about the app structure and state management

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>
          📄 Document Q&A App
        </h1>
        <p style={styles.headerSubtitle}>
          Upload any PDF and ask questions about it!
          Powered by RAG + Groq AI
        </p>
      </div>

      {/* Upload Section */}
      <UploadSection onUploadSuccess={handleUploadSuccess} />

      {/* Document List */}
      <DocumentList
        documents={documents}
        selectedDoc={selectedDoc}
        onSelectDoc={setSelectedDoc}
      />

      {/* Q&A Section */}
      <QASection selectedDoc={selectedDoc} />
    </div>
  )
}

export default App