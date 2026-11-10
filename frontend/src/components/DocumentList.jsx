import { styles } from '../styles/styles'

function DocumentList({ documents, selectedDoc, onSelectDoc }) {
  if (documents.length === 0) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📚 Your Documents</h2>
        <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
          No documents uploaded yet!
          Upload a PDF to get started.
        </p>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>
        📚 Your Documents
        <span style={{
          ...styles.badge,
          marginLeft: "8px"
        }}>
          {documents.length}
        </span>
      </h2>

      {documents.map((doc) => (
        <div
          key={doc.doc_id}
          style={{
            ...styles.documentItem,
            ...(selectedDoc?.doc_id === doc.doc_id
              ? styles.documentItemActive
              : {})
          }}
          onClick={() => onSelectDoc(doc)}
        >
          <div>
            <div style={styles.documentName}>
              📄 {doc.filename}
            </div>
            <div style={styles.documentMeta}>
              {doc.pages} pages • {doc.chunks} chunks
            </div>
          </div>
          <span style={styles.badge}>
            {selectedDoc?.doc_id === doc.doc_id
              ? "Selected ✓"
              : "Select"
            }
          </span>
        </div>
      ))}
    </div>
  )
}

export default DocumentList