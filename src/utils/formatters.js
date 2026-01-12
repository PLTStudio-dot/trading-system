/**
 * จัดรูปแบบวันที่เป็น DD/MM/YYYY
 * @param {Date|string} date - วันที่
 * @returns {string} - วันที่ในรูปแบบ DD/MM/YYYY
 */
export function formatDate(date) {
  if (!date) return '-'
  
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear() + 543 // แปลงเป็น พ.ศ.
  
  return `${day}/${month}/${year}`
}

/**
 * จัดรูปแบบเงินเป็นบาท
 * @param {number} amount - จำนวนเงิน
 * @returns {string} - จำนวนเงินในรูปแบบ 1,234.56 บาท
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '-'
  
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * จัดรูปแบบตัวเลขทั่วไป
 * @param {number} number - ตัวเลข
 * @param {number} decimals - จำนวนทศนิยม (default: 2)
 * @returns {string} - ตัวเลขในรูปแบบ 1,234.56
 */
export function formatNumber(number, decimals = 2) {
  if (number === undefined || number === null) return '-'
  
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number)
}

/**
 * จัดรูปแบบเปอร์เซ็นต์
 * @param {number} percent - เปอร์เซ็นต์
 * @returns {string} - เปอร์เซ็นต์ในรูปแบบ +12.34%
 */
export function formatPercent(percent) {
  if (percent === undefined || percent === null) return '-'
  
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(2)}%`
}

/**
 * แปลงไฟล์เป็น Base64
 * @param {File} file - ไฟล์
 * @returns {Promise<string>} - Base64 string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
    reader.readAsDataURL(file)
  })
}