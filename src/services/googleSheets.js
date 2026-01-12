/**
 * Google Sheets Service - รองรับการเก็บสลิปแบบ Base64
 */

// ⚠️ สำคัญ: ใส่ Web App URL ที่ได้จาก Google Apps Script Deploy
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzfMXgGoNkCs_wVcv7MV6F_QibZDcobSK3Sm_bDL4jls3RCI6xfVZ4rhG21c5ErBebqbg/exec'

/**
 * เพิ่มข้อมูลลง Google Sheets (รวมสลิป)
 */
export async function addToSheets(transaction) {
  if (!isConfigured()) {
    console.log('⚠️ Google Sheets ยังไม่ได้ตั้งค่า')
    return { success: false, message: 'Not configured' }
  }

  try {
    // รวมข้อมูลทั้งหมด รวมถึงสลิป (Base64)
    const transactionData = {
      id: transaction.id,
      purchaseDate: transaction.purchaseDate,
      model: transaction.model,
      costPrice: transaction.costPrice,
      saleDate: transaction.saleDate || '',
      salePrice: transaction.salePrice || '',
      profit: transaction.profit || '',
      profitPercent: transaction.profitPercent || '',
      purchaseSlip: transaction.purchaseSlip || '',  // เพิ่มสลิปซื้อ
      saleSlip: transaction.saleSlip || ''            // เพิ่มสลิปขาย
    }

    // ใช้ GET method แทน POST เพื่อหลีกเลี่ยง CORS
    const params = new URLSearchParams({
      action: 'add',
      data: JSON.stringify(transactionData)
    })

    const response = await fetch(`${WEBAPP_URL}?${params.toString()}`, {
      method: 'GET',
      redirect: 'follow'
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ บันทึกลง Google Sheets สำเร็จ (รวมสลิป)')
    }
    
    return result
  } catch (error) {
    console.error('❌ Error adding to sheets:', error)
    return { success: false, message: error.toString() }
  }
}

/**
 * ดึงข้อมูลจาก Google Sheets (รวมสลิป)
 */
export async function getFromSheets() {
  if (!isConfigured()) {
    throw new Error('Google Sheets ยังไม่ได้ตั้งค่า')
  }

  try {
    const params = new URLSearchParams({ action: 'getAll' })
    
    const response = await fetch(`${WEBAPP_URL}?${params.toString()}`, {
      method: 'GET',
      redirect: 'follow'
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ ดึงข้อมูลจาก Google Sheets สำเร็จ:', result.data.transactions.length, 'รายการ (รวมสลิป)')
      return result.data.transactions
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('❌ Error getting from sheets:', error)
    throw error
  }
}

/**
 * อัพเดทข้อมูลใน Google Sheets (รวมสลิป)
 */
export async function updateInSheets(transaction) {
  if (!isConfigured()) {
    return { success: false, message: 'Not configured' }
  }

  try {
    const transactionData = {
      id: transaction.id,
      purchaseDate: transaction.purchaseDate,
      model: transaction.model,
      costPrice: transaction.costPrice,
      saleDate: transaction.saleDate || '',
      salePrice: transaction.salePrice || '',
      profit: transaction.profit || '',
      profitPercent: transaction.profitPercent || '',
      purchaseSlip: transaction.purchaseSlip || '',  // รวมสลิปซื้อ
      saleSlip: transaction.saleSlip || ''            // รวมสลิปขาย
    }

    const params = new URLSearchParams({
      action: 'update',
      data: JSON.stringify(transactionData)
    })

    const response = await fetch(`${WEBAPP_URL}?${params.toString()}`, {
      method: 'GET',
      redirect: 'follow'
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ อัพเดทข้อมูลใน Google Sheets สำเร็จ (รวมสลิป)')
    }
    
    return result
  } catch (error) {
    console.error('❌ Error updating in sheets:', error)
    return { success: false, message: error.toString() }
  }
}

/**
 * ลบข้อมูลจาก Google Sheets
 */
export async function deleteFromSheets(id) {
  if (!isConfigured()) {
    return { success: false, message: 'Not configured' }
  }

  try {
    const params = new URLSearchParams({
      action: 'delete',
      id: id
    })

    const response = await fetch(`${WEBAPP_URL}?${params.toString()}`, {
      method: 'GET',
      redirect: 'follow'
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ ลบข้อมูลจาก Google Sheets สำเร็จ')
    }
    
    return result
  } catch (error) {
    console.error('❌ Error deleting from sheets:', error)
    return { success: false, message: error.toString() }
  }
}

/**
 * Sync ข้อมูลทั้งหมดลง Google Sheets (รวมสลิป)
 */
export async function syncAllToSheets(transactions) {
  if (!isConfigured()) {
    throw new Error('Google Sheets ยังไม่ได้ตั้งค่า')
  }

  try {
    // รวมข้อมูลทั้งหมด รวมถึงสลิป
    const transactionsWithSlips = transactions.map(t => ({
      id: t.id,
      purchaseDate: t.purchaseDate,
      model: t.model,
      costPrice: t.costPrice,
      saleDate: t.saleDate || '',
      salePrice: t.salePrice || '',
      profit: t.profit || '',
      profitPercent: t.profitPercent || '',
      purchaseSlip: t.purchaseSlip || '',  // รวมสลิปซื้อ
      saleSlip: t.saleSlip || ''            // รวมสลิปขาย
    }))

    const params = new URLSearchParams({
      action: 'sync',
      data: JSON.stringify({ transactions: transactionsWithSlips })
    })

    const response = await fetch(`${WEBAPP_URL}?${params.toString()}`, {
      method: 'GET',
      redirect: 'follow'
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Sync ข้อมูลทั้งหมดสำเร็จ (รวมสลิป):', result.data.count, 'รายการ')
      return { success: true, count: result.data.count }
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('❌ Error syncing to sheets:', error)
    throw error
  }
}

/**
 * ตรวจสอบว่าได้ตั้งค่า WEBAPP_URL แล้วหรือยัง
 */
export function isConfigured() {
  return WEBAPP_URL !== 'YOUR_WEBAPP_URL_HERE' && WEBAPP_URL.startsWith('https://')
}

/**
 * ทดสอบการเชื่อมต่อ
 */
export async function testConnection() {
  if (!isConfigured()) {
    console.error('❌ ยังไม่ได้ตั้งค่า WEBAPP_URL')
    return false
  }

  try {
    const params = new URLSearchParams({ action: 'test' })
    
    const response = await fetch(`${WEBAPP_URL}?${params.toString()}`, {
      method: 'GET',
      redirect: 'follow'
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ เชื่อมต่อ Google Sheets สำเร็จ:', result)
      return true
    }
    
    return false
  } catch (error) {
    console.error('❌ ไม่สามารถเชื่อมต่อ Google Sheets:', error)
    return false
  }
}