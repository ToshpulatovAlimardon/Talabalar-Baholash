const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// MongoDB bilan bog'lanish
mongoose.connect('mongodb://localhost:27017/studentsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Talabalar modeli
const studentSchema = new mongoose.Schema({
  group: String,
  name: String,
  task: String,
  grades: [Number],
});

const Student = mongoose.model('Student', studentSchema);

// Talabalarni olish
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Talabani qo'shish
app.post('/students', async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.sendStatus(201);
});

// Talabani o'chirish
app.delete('/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`Server ${PORT} portida ishlayapti.`);
});
