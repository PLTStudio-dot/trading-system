import { useState, useEffect } from 'react'

function YearFilter({ transactions, onFilterChange }) {
  const [selectedYear, setSelectedYear] = useState('all')
  const [availableYears, setAvailableYears] = useState([])

  // หาปีทั้งหมดจากข้อมูล
  useEffect(() => {
    const years = new Set()
    transactions.forEach(t => {
      if (t.purchaseDate) {
        const year = new Date(t.purchaseDate).getFullYear()
        years.add(year)
      }
    })
    const sortedYears = Array.from(years).sort((a, b) => b - a) // เรียงจากใหม่ไปเก่า
    setAvailableYears(sortedYears)
  }, [transactions])

  // เมื่อเลือกปี
  const handleYearChange = (year) => {
    setSelectedYear(year)
    
    if (year === 'all') {
      onFilterChange(transactions)
    } else {
      const filtered = transactions.filter(t => {
        if (!t.purchaseDate) return false
        const transactionYear = new Date(t.purchaseDate).getFullYear()
        return transactionYear === parseInt(year)
      })
      onFilterChange(filtered)
    }
  }

  return (
    <div className="year-filter">
      <label htmlFor="year-select" className="filter-label">
        📅 กรองตามปี:
      </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => handleYearChange(e.target.value)}
        className="filter-select"
      >
        <option value="all">ทั้งหมด ({transactions.length} รายการ)</option>
        {availableYears.map(year => {
          const count = transactions.filter(t => {
            if (!t.purchaseDate) return false
            return new Date(t.purchaseDate).getFullYear() === year
          }).length
          return (
            <option key={year} value={year}>
              ปี {year + 543} ({count} รายการ)
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default YearFilter