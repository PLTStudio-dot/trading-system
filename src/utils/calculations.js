/**
 * คำนวณกำไร/ขาดทุน
 * @param {number} costPrice - ราคาทุน
 * @param {number} salePrice - ราคาขาย
 * @returns {object} - { profit, profitPercent }
 */
export function calculateProfit(costPrice, salePrice) {
  if (!costPrice || !salePrice) {
    return {
      profit: undefined,
      profitPercent: undefined
    }
  }

  const profit = salePrice - costPrice
  const profitPercent = (profit / costPrice) * 100

  return {
    profit: parseFloat(profit.toFixed(2)),
    profitPercent: parseFloat(profitPercent.toFixed(2))
  }
}

/**
 * คำนวณกำไรรวมจากรายการทั้งหมด
 * @param {array} transactions - รายการธุรกรรม
 * @returns {number} - กำไรรวม
 */
export function calculateTotalProfit(transactions) {
  return transactions.reduce((total, transaction) => {
    if (transaction.profit !== undefined) {
      return total + transaction.profit
    }
    return total
  }, 0)
}

/**
 * คำนวณจำนวนรายการที่กำไรและขาดทุน
 * @param {array} transactions - รายการธุรกรรม
 * @returns {object} - { profitCount, lossCount }
 */
export function calculateProfitLossCount(transactions) {
  return transactions.reduce((acc, transaction) => {
    if (transaction.profit !== undefined) {
      if (transaction.profit >= 0) {
        acc.profitCount++
      } else {
        acc.lossCount++
      }
    }
    return acc
  }, { profitCount: 0, lossCount: 0 })
}