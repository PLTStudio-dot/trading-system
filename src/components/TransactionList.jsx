import TransactionItem from './TransactionItem'
import '../styles/List.css'

function TransactionList({ transactions, onDelete, onEdit }) {
  if (transactions.length === 0) {
    return (
      <div className="transaction-list-container">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>ยังไม่มีข้อมูล</h3>
          <p>เริ่มต้นเพิ่มข้อมูลการซื้อ-ขายของคุณ</p>
        </div>
      </div>
    )
  }

  // คำนวณสรุปรวม
  const summary = transactions.reduce((acc, transaction) => {
    if (transaction.profit !== undefined) {
      acc.totalProfit += transaction.profit
      if (transaction.profit >= 0) {
        acc.profitCount++
      } else {
        acc.lossCount++
      }
    }
    return acc
  }, { totalProfit: 0, profitCount: 0, lossCount: 0 })

  return (
    <div className="transaction-list-container">
      <div className="list-header">
        <h2>📋 รายการทั้งหมด ({transactions.length} รายการ)</h2>
        
        <div className="summary-cards">
          <div className="summary-card profit">
            <div className="summary-label">กำไรรวม</div>
            <div className="summary-value">
              +{summary.totalProfit >= 0 
                ? summary.totalProfit.toLocaleString('th-TH', { minimumFractionDigits: 2 })
                : '0.00'} ฿
            </div>
            <div className="summary-count">{summary.profitCount} รายการ</div>
          </div>

          <div className="summary-card loss">
            <div className="summary-label">ขาดทุนรวม</div>
            <div className="summary-value">
              {summary.totalProfit < 0 
                ? Math.abs(summary.totalProfit).toLocaleString('th-TH', { minimumFractionDigits: 2 })
                : '0.00'} ฿
            </div>
            <div className="summary-count">{summary.lossCount} รายการ</div>
          </div>

          <div className="summary-card total">
            <div className="summary-label">กำไร/ขาดทุนสุทธิ</div>
            <div className={`summary-value ${summary.totalProfit >= 0 ? 'profit-text' : 'loss-text'}`}>
              {summary.totalProfit >= 0 ? '+' : ''}
              {summary.totalProfit.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
            </div>
            <div className="summary-count">รวมทั้งหมด</div>
          </div>
        </div>
      </div>

      <div className="transaction-list">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  )
}

export default TransactionList