# 📊 Trading System - ระบบเก็บข้อมูลซื้อขาย

ระบบเก็บบันทึกข้อมูลการซื้อและขายสินค้า พร้อมคำนวณกำไร-ขาดทุนอัตโนมัติ

## 🚀 การติดตั้ง

1. ติดตั้ง dependencies
```bash
npm install
```

2. รันโปรเจค
```bash
npm run dev
```

3. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

## ✨ ฟีเจอร์

- ✅ บันทึกข้อมูลการซื้อ-ขาย
- ✅ คำนวณกำไร-ขาดทุนอัตโนมัติ
- ✅ อัพโหลดสลิปซื้อ-ขาย
- ✅ เชื่อมต่อ Google Sheets (เร็วๆ นี้)

## 📝 วิธีใช้งาน

1. กรอกข้อมูลการซื้อ (วันที่ซื้อ, รุ่น, ราคาทุน)
2. กรอกข้อมูลการขาย (วันที่ขาย, ราคาขาย)
3. ระบบจะคำนวณกำไร/ขาดทุนให้อัตโนมัติ
4. อัพโหลดสลิปซื้อและขาย (ถ้ามี)

## 🛠️ เทคโนโลยีที่ใช้

- React 18
- Vite
- React DatePicker
- React Dropzone
- Date-fns

## 📦 โครงสร้างโปรเจค

```
trading-system/
├── src/
│   ├── components/     # React Components
│   ├── hooks/          # Custom Hooks
│   ├── services/       # API Services
│   ├── styles/         # CSS Files
│   └── utils/          # Helper Functions
├── public/             # Static Files
└── package.json        # Dependencies
```

## 👨‍💻 พัฒนาโดย

Made with ❤️ in Thailand