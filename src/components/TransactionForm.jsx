import { useState, useEffect } from 'react'
import { calculateProfit } from '../utils/calculations'
import '../styles/Form.css'

function TransactionForm({ onSubmit, editingTransaction, onCancelEdit }) {
  const [formData, setFormData] = useState({
    purchaseDate: new Date().toISOString().split('T')[0],
    model: '',
    costPrice: '',
    saleDate: '',
    salePrice: '',
    purchaseSlip: null,
    saleSlip: null
  })

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        purchaseDate: editingTransaction.purchaseDate ? 
          new Date(editingTransaction.purchaseDate).toISOString().split('T')[0] : '',
        model: editingTransaction.model,
        costPrice: editingTransaction.costPrice,
        saleDate: editingTransaction.saleDate ? 
          new Date(editingTransaction.saleDate).toISOString().split('T')[0] : '',
        salePrice: editingTransaction.salePrice || '',
        purchaseSlip: editingTransaction.purchaseSlip || null,
        saleSlip: editingTransaction.saleSlip || null
      })
    }
  }, [editingTransaction])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ฟังก์ชันบีบอัดรูปภาพ
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // ปรับขนาดถ้ารูปใหญ่เกินไป
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          // แปลงเป็น base64 พร้อมบีบอัด
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          
          // เช็คขนาด
          const sizeInKB = (compressedBase64.length * 3) / 4 / 1024
          console.log(`รูปภาพบีบอัดแล้ว: ${sizeInKB.toFixed(2)} KB`)
          
          resolve(compressedBase64)
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      // เช็คขนาดไฟล์
      const fileSizeInMB = file.size / (1024 * 1024)
      console.log(`ขนาดไฟล์ต้นฉบับ: ${fileSizeInMB.toFixed(2)} MB`)

      if (fileSizeInMB > 5) {
        alert('⚠️ ไฟล์มีขนาดใหญ่เกิน 5 MB\nกรุณาเลือกไฟล์ที่มีขนาดเล็กกว่า')
        e.target.value = '' // ล้างค่า input
        return
      }

      try {
        // บีบอัดรูปภาพก่อนบันทึก
        const compressedImage = await compressImage(file)
        setFormData(prev => ({
          ...prev,
          [fieldName]: compressedImage
        }))
      } catch (error) {
        console.error('Error compressing image:', error)
        alert('❌ เกิดข้อผิดพลาดในการประมวลผลรูปภาพ')
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const transaction = {
      ...formData,
      id: editingTransaction?.id || Date.now(),
      purchaseDate: new Date(formData.purchaseDate).toISOString(),
      saleDate: formData.saleDate ? new Date(formData.saleDate).toISOString() : null,
      ...calculateProfit(parseFloat(formData.costPrice), parseFloat(formData.salePrice))
    }

    onSubmit(transaction)
    
    // Reset form
    setFormData({
      purchaseDate: new Date().toISOString().split('T')[0],
      model: '',
      costPrice: '',
      saleDate: '',
      salePrice: '',
      purchaseSlip: null,
      saleSlip: null
    })
  }

  return (
    <div className="transaction-form-container">
      <h2>{editingTransaction ? '✏️ แก้ไขข้อมูล' : '➕ เพิ่มข้อมูลใหม่'}</h2>
      
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-grid">
          {/* ข้อมูลการซื้อ */}
          <div className="form-section">
            <h3>📥 ข้อมูลการซื้อ</h3>
            
            <div className="form-group">
              <label>วันที่ซื้อ *</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="date-input"
                required
              />
            </div>

            <div className="form-group">
              <label>รุ่น *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="ระบุรุ่นสินค้า"
                required
              />
            </div>

            <div className="form-group">
              <label>ราคาทุน (บาท) *</label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>สลิปซื้อ (รูปจะถูกบีบอัดอัตโนมัติ)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'purchaseSlip')}
                className="file-input"
              />
              {formData.purchaseSlip && (
                <div className="image-preview">
                  <img src={formData.purchaseSlip} alt="Purchase slip" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, purchaseSlip: null }))}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ข้อมูลการขาย */}
          <div className="form-section">
            <h3>📤 ข้อมูลการขาย</h3>
            
            <div className="form-group">
              <label>วันที่ขาย</label>
              <input
                type="date"
                name="saleDate"
                value={formData.saleDate}
                onChange={handleChange}
                className="date-input"
              />
            </div>

            <div className="form-group">
              <label>ราคาขาย (บาท)</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>สลิปขาย (รูปจะถูกบีบอัดอัตโนมัติ)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'saleSlip')}
                className="file-input"
              />
              {formData.saleSlip && (
                <div className="image-preview">
                  <img src={formData.saleSlip} alt="Sale slip" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, saleSlip: null }))}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* แสดงกำไร/ขาดทุน */}
            {formData.salePrice && formData.costPrice && (
              <div className="profit-preview">
                {(() => {
                  const result = calculateProfit(
                    parseFloat(formData.costPrice),
                    parseFloat(formData.salePrice)
                  )
                  return (
                    <div className={`profit-box ${result.profit >= 0 ? 'profit' : 'loss'}`}>
                      <span className="profit-label">
                        {result.profit >= 0 ? '📈 กำไร' : '📉 ขาดทุน'}
                      </span>
                      <span className="profit-amount">
                        {Math.abs(result.profit).toLocaleString('th-TH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} บาท
                      </span>
                      <span className="profit-percent">
                        ({result.profitPercent >= 0 ? '+' : ''}{result.profitPercent.toFixed(2)}%)
                      </span>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          {editingTransaction && (
            <button type="button" onClick={onCancelEdit} className="btn btn-secondary">
              ยกเลิก
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {editingTransaction ? '💾 บันทึกการแก้ไข' : '➕ เพิ่มข้อมูล'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransactionForm