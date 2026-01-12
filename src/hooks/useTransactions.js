import { useState, useEffect } from 'react'

function useTransactions() {
  const [transactions, setTransactions] = useState([])

  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions')
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
      localStorage.removeItem('transactions')
    }
  }, [])

  // บันทึกข้อมูลลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions))
    } catch (error) {
      console.error('Error saving transactions:', error)
      
      if (error.name === 'QuotaExceededError') {
        alert('⚠️ พื้นที่เก็บข้อมูลเต็ม!\n\nแนะนำ:\n1. ลดขนาดรูปภาพก่อนอัพโหลด\n2. ลบรายการเก่าที่ไม่ต้องการ\n3. ใช้ Google Sheets เพื่อเก็บข้อมูล')
        
        const transactionsWithoutImages = transactions.map(t => ({
          ...t,
          purchaseSlip: null,
          saleSlip: null
        }))
        
        try {
          localStorage.setItem('transactions', JSON.stringify(transactionsWithoutImages))
          alert('✅ บันทึกข้อมูลสำเร็จ (ไม่รวมรูปภาพ)\n\nคุณสามารถดำเนินการต่อได้')
        } catch (e) {
          console.error('Still cannot save:', e)
          alert('❌ ไม่สามารถบันทึกข้อมูลได้\n\nกรุณาใช้ Google Sheets แทน')
        }
      }
    }
  }, [transactions])

  // เพิ่มรายการใหม่
  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev])
  }

  // ลบรายการ
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  // แก้ไขรายการ
  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...updatedTransaction, id } : t))
    )
  }

  // ลบข้อมูลทั้งหมด
  const clearAllTransactions = () => {
    if (window.confirm('คุณต้องการลบข้อมูลทั้งหมดหรือไม่?')) {
      setTransactions([])
      localStorage.removeItem('transactions')
      alert('✅ ลบข้อมูลทั้งหมดเรียบร้อยแล้ว')
    }
  }

  // ฟังก์ชันล้าง localStorage
  const clearStorage = () => {
    if (window.confirm('⚠️ คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?\n\nการกระทำนี้ไม่สามารถย้อนกลับได้')) {
      localStorage.clear()
      setTransactions([])
      alert('✅ ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว')
      window.location.reload()
    }
  }

  return {
    transactions,
    setTransactions, // เพิ่ม setTransactions เพื่อให้ App.jsx สามารถ restore ข้อมูลได้
    addTransaction,
    deleteTransaction,
    updateTransaction,
    clearAllTransactions,
    clearStorage
  }
}

export default useTransactions