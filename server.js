require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(express.json());
app.use(express.static('public'));

app.post('/api/register', async (req, res) => {
    const { firstName, lastName, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from('users').insert([{ first_name: firstName, last_name: lastName, password: hashed }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, user: data[0] });
});

app.post('/api/login', async (req, res) => {
    const { firstName, lastName, password } = req.body;
    const { data, error } = await supabase.from('users').select('*').eq('first_name', firstName).eq('last_name', lastName).single();
    if (error || !data) return res.status(400).json({ error: "Foydalanuvchi topilmadi" });
    const valid = await bcrypt.compare(password, data.password);
    if (!valid) return res.status(400).json({ error: "Parol xato" });
    res.json({ success: true, user: data });
});

app.listen(PORT, () => console.log(`Server ${PORT}da ishga tushdi`));