// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/cyberkoc', { useNewUrlParser: true, useUnifiedTopology: true });

// Veri modeli
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String
});

const TopicSchema = new mongoose.Schema({
    title: String,
    author: String,
    replies: [String]
});

const User = mongoose.model('User', UserSchema);
const Topic = mongoose.model('Topic', TopicSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Kullanıcı kayıt
app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send("Kayıt başarılı!");
    } catch (error) {
        res.status(400).send("Bu kullanıcı adı zaten alınmış.");
    }
});

// Kullanıcı giriş
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.status(200).send("Giriş başarılı!");
    } else {
        res.status(400).send("Kullanıcı adı veya şifre hatalı.");
    }
});

// Konu ekleme
app.post('/topics', async (req, res) => {
    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).send("Konu başarıyla eklendi!");
});

// Konuları listeleme
app.get('/topics', async (req, res) => {
    const topics = await Topic.find();
    res.status(200).json(topics);
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
