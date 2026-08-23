const express = require('express');
const app = express();
const PORT = 4000; 

app.use(express.json());

app.get('/meters/readings', (req, res) => {
  const fakeRawData = [
  //  ==========================================
  //   1. ELECTRICITY METERS (Smart Meter) - 12 Readings
  //   ==========================================
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 1200, billingMonth: "2025-09", readingDate: "2025-09-30T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 1410, billingMonth: "2025-10", readingDate: "2025-10-31T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 1600, billingMonth: "2025-11", readingDate: "2025-11-30T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 1820, billingMonth: "2025-12", readingDate: "2025-12-31T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 2050, billingMonth: "2026-01", readingDate: "2026-01-31T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 2260, billingMonth: "2026-02", readingDate: "2026-02-28T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 2490, billingMonth: "2026-03", readingDate: "2026-03-31T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 2710, billingMonth: "2026-04", readingDate: "2026-04-30T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 2980, billingMonth: "2026-05", readingDate: "2026-05-31T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 3300, billingMonth: "2026-06", readingDate: "2026-06-30T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 3680, billingMonth: "2026-07", readingDate: "2026-07-31T23:59:05.000Z" },
    { nationalID: "30306121601727", meterNumber: "1000009900", meterType: "Smart Meter", utility: "Electricity", address: "15 El-Horriya Street, Cairo, Egypt", reading: 4100, billingMonth: "2026-08", readingDate: "2026-08-23T12:00:05.000Z" },

  ];

  res.status(200).json(fakeRawData);
});

app.listen(PORT, () => {
  console.log(`[Fake Company API] running on http://localhost:${PORT}`);
});

// 12 READING FOR GAS AND WATER FOR SINGLE USER "ezz" ID NUMBER "30306121601727 "