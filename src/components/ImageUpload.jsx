import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

function ImageUpload({ onUpload, currentImage, label }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      
      reader.onload = () => {
        onUpload(reader.result)
      }
      
      reader.readAsDataURL(file)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  return (
    <div className="image-upload">
      {!currentImage ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="dropzone-icon">📁</div>
            {isDragActive ? (
              <p>วางไฟล์ที่นี่...</p>
            ) : (
              <>
                <p>{label}</p>
                <span className="dropzone-hint">ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์</span>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="image-preview">
          <img src={currentImage} alt="Preview" />
          <button
            type="button"
            onClick={() => onUpload(null)}
            className="btn-remove"
            title="ลบรูปภาพ"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageUpload