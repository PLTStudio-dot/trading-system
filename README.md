# 📊 Trading System - ระบบเก็บข้อมูลซื้อขาย v2.0

ระบบเก็บบันทึกข้อมูลการซื้อและขายสินค้า พร้อมคำนวณกำไร-ขาดทุนอัตโนมัติ  
**✨ NEW:** รองรับการเก็บสลิปใน Google Sheets + ฟีเจอร์กรองข้อมูลตามปี

---

## 🚀 การติดตั้ง

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโปรเจค
```bash
npm run dev
```

### 3. เปิดเบราว์เซอร์
ไปที่ `http://localhost:3000`

---

## ✨ ฟีเจอร์หลัก

### ✅ ฟีเจอร์พื้นฐาน
- บันทึกข้อมูลการซื้อ-ขาย (วันที่, รุ่น, ราคา)
- คำนวณกำไร-ขาดทุนอัตโนมัติ
- อัพโหลดสลิปซื้อ-ขาย (บีบอัดรูปภาพอัตโนมัติ)
- เก็บข้อมูลใน localStorage

### 🆕 ฟีเจอร์ใหม่ v2.0
- **เก็บสลิปใน Google Sheets** (Base64 encoding)
- **กรองข้อมูลตามปี** พร้อมแสดงจำนวนรายการ
- Sync ข้อมูลรวมสลิปไป/กลับจาก Google Sheets
- สรุปกำไร/ขาดทุนรวมแบบ Real-time
- Responsive Design ทุกอุปกรณ์

---

## 📝 วิธีใช้งาน

### การบันทึกข้อมูล
1. กรอกข้อมูลการซื้อ (วันที่ซื้อ, รุ่น, ราคาทุน)
2. อัพโหลดสลิปซื้อ (ไม่บังคับ)
3. กรอกข้อมูลการขาย (วันที่ขาย, ราคาขาย)
4. อัพโหลดสลิปขาย (ไม่บังคับ)
5. ระบบจะคำนวณกำไร/ขาดทุนให้อัตโนมัติ

### การกรองข้อมูล
- เลือกปีจากเมนู dropdown
- ระบบจะแสดงเฉพาะรายการของปีที่เลือก
- เลือก "ทั้งหมด" เพื่อดูข้อมูลทั้งหมด

### การจัดการสลิป
- รูปภาพจะถูกบีบอัดอัตโนมัติก่อนบันทึก
- ขนาดไฟล์ไม่เกิน 5 MB
- สามารถดูสลิปแบบเต็มหน้าจอได้

---

## 🔗 การตั้งค่า Google Sheets

### ขั้นตอนที่ 1: สร้าง Google Sheet

1. สร้าง Google Sheet ใหม่
2. ตั้งชื่อแถวแรก (Header) ดังนี้:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| ID | วันที่ซื้อ | รุ่น | ราคาทุน | วันที่ขาย | ราคาขาย | กำไร/ขาดทุน | เปอร์เซ็นต์ | สลิปซื้อ | สลิปขาย | วันที่บันทึก |

**หรือใช้ฟังก์ชัน `setupHeaders()`** ใน Apps Script (แนะนำ)

### ขั้นตอนที่ 2: ติดตั้ง Apps Script

1. เปิด Google Sheet → **Extensions** → **Apps Script**
2. ลบโค้ดเดิมทั้งหมด
3. วางโค้ดจากไฟล์ `Code.gs` (ที่อัพเดทใหม่)
4. บันทึก (Ctrl+S)

### ขั้นตอนที่ 3: Deploy as Web App

1. คลิก **Deploy** → **New deployment**
2. Type: **Web app**
3. Description: "Trading System API v2.0"
4. Execute as: **Me**
5. Who has access: **Anyone**
6. คลิก **Deploy**
7. คัดลอก **Web App URL**

### ขั้นตอนที่ 4: ตั้งค่าใน React App

1. เปิดไฟล์ `src/services/googleSheets.js`
2. แก้ไข `WEBAPP_URL`:
```javascript
const WEBAPP_URL = 'YOUR_WEB_APP_URL_HERE'
```
3. บันทึกไฟล์

### ขั้นตอนที่ 5: ทดสอบการเชื่อมต่อ

1. กด **Test Connection** ในแอพ
2. ถ้าสำเร็จจะแสดง "✅ เชื่อมต่อสำเร็จ!"

---

## 🛠️ เทคโนโลยีที่ใช้

- **React 18** - UI Framework
- **Vite** - Build Tool & Dev Server
- **Google Apps Script** - Backend API
- **Google Sheets** - Database
- **LocalStorage** - Local Backup
- **Base64** - Image Encoding

---

## 📦 โครงสร้างโปรเจค

```
trading-system/
├── src/
│   ├── components/
│   │   ├── TransactionForm.jsx    # ฟอร์มบันทึกข้อมูล
│   │   ├── TransactionList.jsx    # แสดงรายการทั้งหมด
│   │   ├── TransactionItem.jsx    # แสดงรายการแต่ละรายการ
│   │   ├── ImageUpload.jsx        # อัพโหลดรูปภาพ
│   │   └── YearFilter.jsx         # 🆕 กรองข้อมูลตามปี
│   ├── hooks/
│   │   └── useTransactions.js     # Custom Hook จัดการข้อมูล
│   ├── services/
│   │   └── googleSheets.js        # 🆕 Google Sheets API (รองรับสลิป)
│   ├── styles/
│   │   ├── App.css
│   │   ├── Form.css
│   │   └── List.css               # 🆕 รวม Style สำหรับ YearFilter
│   ├── utils/
│   │   ├── calculations.js        # คำนวณกำไร/ขาดทุน
│   │   └── formatters.js          # จัดรูปแบบข้อมูล
│   ├── App.jsx                    # 🆕 Main App (รองรับ YearFilter)
│   ├── main.jsx
│   └── index.css
├── public/
├── Code.gs                        # 🆕 Google Apps Script (รองรับสลิป)
├── package.json
├── vite.config.js
└── README.md
```

---

## 💡 เคล็ดลับการใช้งาน

### การบีบอัดรูปภาพ
- รูปภาพจะถูกปรับขนาดเป็น 800px (ความกว้างสูงสุด)
- คุณภาพรูปภาพ 70% (ปรับได้ในโค้ด)
- ลดขนาดไฟล์ประมาณ 70-90%

### การจัดการพื้นที่เก็บข้อมูล
- localStorage มีขนาดจำกัดประมาณ 5-10 MB
- แนะนำให้ Sync ข้อมูลไป Google Sheets เป็นประจำ
- หากพื้นที่เต็ม ระบบจะบันทึกข้อมูลโดยไม่มีรูปภาพ

### การสำรองข้อมูล
1. กด "บันทึกข้อมูลทั้งหมด" ไป Google Sheets
2. ข้อมูลจะถูกเก็บรวมถึงสลิป
3. สามารถดึงข้อมูลกลับมาได้ทุกเมื่อ

---

## 🐛 แก้ปัญหาที่พบบ่อย

### ไม่สามารถ Sync ข้อมูลได้

1. ตรวจสอบ `WEBAPP_URL` ใน `googleSheets.js`
2. ตรวจสอบว่า Deploy Apps Script แล้ว
3. ตรวจสอบว่าตั้งค่า "Who has access: Anyone"
4. กด Test Connection เพื่อทดสอบ

### รูปภาพไม่แสดงหลัง Restore

- Google Sheets อาจใช้เวลาในการโหลดข้อมูล Base64
- ลองรีเฟรชหน้าเว็บ
- ตรวจสอบว่าสลิปมีขนาดไม่เกิน 5 MB

### พื้นที่ localStorage เต็ม

1. กด "บันทึกข้อมูลทั้งหมด" ไป Google Sheets
2. ลบข้อมูลเก่าที่ไม่ต้องการ
3. ลดขนาดรูปภาพก่อนอัพโหลด

---

## 🔄 อัพเดท v2.0 (มกราคม 2026)

### ✨ เพิ่มใหม่
- เก็บสลิปใน Google Sheets (Base64)
- กรองข้อมูลตามปี
- ปรับปรุง UI/UX

### 🐛 แก้ไข
- ปรับปรุงการบีบอัดรูปภาพ
- แก้ไขปัญหาการ Sync ข้อมูล
- เพิ่มความเสถียร localStorage

---

## 👨‍💻 สนับสนุน

หากพบปัญหาหรือต้องการคำแนะนำ:
- ติดต่อ: DACAMERA SHOP

---

## 📄 ลิขสิทธิ์

© 2026 Trading System - DACAMERA SHOP  
Made with ❤️ in Thailand

---

## 🎯 Roadmap

- [ ] Export ข้อมูลเป็น Excel
- [ ] แสดงกราฟกำไร/ขาดทุน
- [ ] รายงานสรุปรายเดือน/ปี
- [ ] Multi-user Support
- [ ] Mobile App (React Native)