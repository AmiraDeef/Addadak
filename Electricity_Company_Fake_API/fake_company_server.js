const express = require('express');
const app = express();
const PORT = 4000; 

app.use(express.json());

app.get('/meters/readings', (req, res) => {
  const fakeRawData = [
    {
      nationalID: "29505150102345",
      meterNumber: "1234567890",
      meterType: "Smart Card",
      address: "12 El-Nasr Street, Cairo, Egypt",
      reading: 450,
      readingDate: new Date().toISOString()
    },
    {
      nationalID: "30108220209876",
      meterNumber: "9876543210",
      meterType: "Smart Meter",
      address: "45 Abbas El-Akkad, Cairo, Egypt",
      reading: 890,
      readingDate: new Date().toISOString()
    }
  ];

  res.status(200).json(fakeRawData);
});

app.listen(PORT, () => {
  console.log(`[Fake Company API] running on http://localhost:${PORT}`);
});