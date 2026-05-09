const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server ishlayapti!' });
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishga tushdi`);
});
