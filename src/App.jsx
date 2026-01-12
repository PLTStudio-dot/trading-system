import { useState } from 'react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import useTransactions from './hooks/useTransactions'
import { addToSheets, syncAllToSheets, getFromSheets, isConfigured, testConnection } from './services/googleSheets'
import './styles/App.css'

function App() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction, setTransactions } = useTransactions()
  const [editingId, setEditingId] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState('')

  const handleSubmit = async (transaction) => {
    if (editingId) {
      updateTransaction(editingId, transaction)
      setEditingId(null)
    } else {
      // เพิ่มข้อมูลใน localStorage
      addTransaction(transaction)
      
      // บันทึกลง Google Sheets อัตโนมัติ (ถ้าตั้งค่าแล้ว)
      if (isConfigured()) {
        try {
          await addToSheets(transaction)
          console.log('✅ บันทึกลง Google Sheets สำเร็จ')
        } catch (error) {
          console.error('❌ ไม่สามารถบันทึกลง Google Sheets:', error)
          // ไม่แสดง alert เพื่อไม่รบกวนการใช้งาน
        }
      }
    }
  }

  const handleEdit = (transaction) => {
    setEditingId(transaction.id)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  // Sync ข้อมูลทั้งหมดลง Google Sheets
  const handleSync = async () => {
    if (!isConfigured()) {
      alert('⚠️ กรุณาตั้งค่า Google Sheets URL ก่อน\n\nไปที่ไฟล์ src/services/googleSheets.js\nแล้วใส่ WEBAPP_URL ของคุณ')
      return
    }

    setSyncing(true)
    setSyncStatus('กำลัง Sync...')

    try {
      const result = await syncAllToSheets(transactions)
      setSyncStatus(`✅ Sync สำเร็จ! (${result.count} รายการ)`)
      setTimeout(() => setSyncStatus(''), 3000)
    } catch (error) {
      setSyncStatus('❌ Sync ล้มเหลว: ' + error.message)
      setTimeout(() => setSyncStatus(''), 5000)
    } finally {
      setSyncing(false)
    }
  }

  // ดึงข้อมูลจาก Google Sheets กลับมา
  const handleRestore = async () => {
    if (!isConfigured()) {
      alert('⚠️ กรุณาตั้งค่า Google Sheets URL ก่อน')
      return
    }

    if (!window.confirm('ต้องการดึงข้อมูลจาก Google Sheets หรือไม่?\n\n⚠️ ข้อมูลปัจจุบันจะถูกแทนที่')) {
      return
    }

    setSyncing(true)
    setSyncStatus('กำลังดึงข้อมูล...')

    try {
      const data = await getFromSheets()
      setTransactions(data)
      setSyncStatus(`✅ ดึงข้อมูลสำเร็จ! (${data.length} รายการ)`)
      setTimeout(() => setSyncStatus(''), 3000)
    } catch (error) {
      setSyncStatus('❌ ดึงข้อมูลล้มเหลว: ' + error.message)
      setTimeout(() => setSyncStatus(''), 5000)
    } finally {
      setSyncing(false)
    }
  }

  // ทดสอบการเชื่อมต่อ
  const handleTestConnection = async () => {
    setSyncing(true)
    setSyncStatus('กำลังทดสอบการเชื่อมต่อ...')

    const success = await testConnection()
    
    if (success) {
      setSyncStatus('✅ เชื่อมต่อสำเร็จ!')
    } else {
      setSyncStatus('❌ เชื่อมต่อล้มเหลว')
    }

    setTimeout(() => setSyncStatus(''), 3000)
    setSyncing(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 ระบบเก็บข้อมูลซื้อ-ขาย</h1>
        <p>บันทึกและติดตามกำไร-ขาดทุนของคุณ</p>
        
        {/* ปุ่ม Google Sheets Sync */}
        <div className="sync-buttons">
          <button 
            onClick={handleSync} 
            disabled={syncing || transactions.length === 0}
            className="btn-sync"
            title="บันทึกข้อมูลทั้งหมดลง Google Sheets"
          >
            {syncing ? '⏳' : '☁️'} บันทึกข้อมูลทั้งหมด
          </button>
          
          <button 
            onClick={handleRestore} 
            disabled={syncing}
            className="btn-restore"
            title="ดึงข้อมูลจาก Google Sheets กลับมา"
          >
            {syncing ? '⏳' : '⬇️'} ดึงข้อมูลจาก Google Sheets
          </button>

          <button 
            onClick={handleTestConnection} 
            disabled={syncing}
            className="btn-test"
            title="ทดสอบการเชื่อมต่อ Google Sheets"
          >
            {syncing ? '⏳' : '🔌'} Test Connection
          </button>
        </div>

        {syncStatus && (
          <div className={`sync-status ${syncStatus.includes('✅') ? 'success' : syncStatus.includes('❌') ? 'error' : ''}`}>
            {syncStatus}
          </div>
        )}
      </header>

      <main className="app-main">
        <div className="container">
          <TransactionForm 
            onSubmit={handleSubmit}
            editingTransaction={transactions.find(t => t.id === editingId)}
            onCancelEdit={handleCancelEdit}
          />
          
          <TransactionList 
            transactions={transactions}
            onDelete={deleteTransaction}
            onEdit={handleEdit}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 Trading System - DACAMERA SHOP</p>
        {isConfigured() && <p className="sheets-status">🟢 Google Sheets: เชื่อมต่อแล้ว</p>}
        {!isConfigured() && <p className="sheets-status">🔴 Google Sheets: ยังไม่ได้ตั้งค่า</p>}
      </footer>
    </div>
  )
}

export default App