
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// إعداد قاعدة البيانات (MongoDB)
mongoose.connect('mongodb://localhost/easyprofit', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Database connection error: ', err));

// إعداد التخزين لجسم الطلبات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// نموذج المستخدم
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  earnings: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

// مسار التسجيل
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password });
  await newUser.save();
  res.send('User registered!');
});

// مسار النقر على الإعلان
app.get('/ad-click', async (req, res) => {
  const userEmail = req.query.userEmail;
  const user = await User.findOne({ email: userEmail });
  if (user) {
    user.earnings += 0.2; // إضافة 0.2 دولار
    await user.save();
  }
  res.send('Ad clicked, your earnings have been updated!');
});

// بدء الخادم
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
