import { formatDate, formatCurrency } from '../utils/formatters'

function TransactionItem({ transaction, onDelete, onEdit }) {
  const {
    id,
    purchaseDate,
    model,
    costPrice,
    saleDate,
    salePrice,
    profit,
    profitPercent,
    purchaseSlip,
    saleSlip
  } = transaction

  const handleDelete = () => {
    if (window.confirm('คุณต้องการลบข้อมูลนี้หรือไม่?')) {
      onDelete(id)
    }
  }

  return (
    <div className="transaction-item">
      <div className="item-header">
        <div className="item-model">
          <h3>{model}</h3>
          {profit !== undefined && (
            <span className={`profit-badge ${profit >= 0 ? 'profit' : 'loss'}`}>
              {profit >= 0 ? '📈' : '📉'} {profit >= 0 ? 'กำไร' : 'ขาดทุน'}
            </span>
          )}
        </div>
        <div className="item-actions">
          <button onClick={() => onEdit(transaction)} className="btn-icon btn-edit" title="แก้ไข">
            ✏️
          </button>
          <button onClick={handleDelete} className="btn-icon btn-delete" title="ลบ">
            🗑️
          </button>
        </div>
      </div>

      <div className="item-content">
        <div className="item-section">
          <h4>📥 ข้อมูลการซื้อ</h4>
          <div className="item-details">
            <div className="detail-row">
              <span className="detail-label">วันที่ซื้อ:</span>
              <span className="detail-value">{formatDate(purchaseDate)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">ราคาทุน:</span>
              <span className="detail-value price">{formatCurrency(costPrice)}</span>
            </div>
            {purchaseSlip && (
              <div className="detail-row">
                <span className="detail-label">สลิปซื้อ:</span>
                <a href={purchaseSlip} target="_blank" rel="noopener noreferrer" className="slip-link">
                  ดูสลิป 🔗
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="item-section">
          <h4>📤 ข้อมูลการขาย</h4>
          <div className="item-details">
            <div className="detail-row">
              <span className="detail-label">วันที่ขาย:</span>
              <span className="detail-value">
                {saleDate ? formatDate(saleDate) : <span className="text-muted">ยังไม่ขาย</span>}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">ราคาขาย:</span>
              <span className="detail-value price">
                {salePrice ? formatCurrency(salePrice) : <span className="text-muted">-</span>}
              </span>
            </div>
            {saleSlip && (
              <div className="detail-row">
                <span className="detail-label">สลิปขาย:</span>
                <a href={saleSlip} target="_blank" rel="noopener noreferrer" className="slip-link">
                  ดูสลิป 🔗
                </a>
              </div>
            )}
          </div>
        </div>

        {profit !== undefined && (
          <div className="item-section">
            <h4>💰 ผลกำไร/ขาดทุน</h4>
            <div className="profit-summary">
              <div className={`profit-amount ${profit >= 0 ? 'profit' : 'loss'}`}>
                {profit >= 0 ? '+' : ''}{formatCurrency(Math.abs(profit))}
              </div>
              <div className={`profit-percent ${profitPercent >= 0 ? 'profit' : 'loss'}`}>
                ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionItem