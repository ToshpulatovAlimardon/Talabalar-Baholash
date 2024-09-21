let students = [];
let isTeacher = false;

// Talabalar jadvalini ko'rsatish
async function renderTable(filteredStudents = students) {
  const response = await fetch('http://localhost:5000/students');
  students = await response.json(); // Backenddan talabalarni olish

  const tableBody = document.getElementById("studentTable");
  tableBody.innerHTML = ""; // Jadvalni tozalash

  // Talabalarni ism bo'yicha alifbo tartibida saralash
  filteredStudents.sort((a, b) => a.name.localeCompare(b.name));

  filteredStudents.forEach((student, index) => {
    const avgGrade = Math.round((student.grades.reduce((a, b) => a + b, 0) / (student.grades.length * 3)) * 100);
    let row = `<tr class="border-b border-gray-200 hover:bg-gray-100">
                  <td class="py-3 px-6 text-left">${student.group}</td>
                  <td class="py-3 px-6 text-left">${student.name}</td>
                  <td class="py-3 px-6 text-left">${student.task}</td>
                  <td class="py-3 px-6 text-left">`;

    // Baholarni rang bilan ajratib ko'rsatish
    student.grades.forEach(grade => {
      row += `<span class="px-2 py-1 text-white rounded ${getGradeColor(grade)}">${grade}</span> `;
    });

    row += `</td>
              <td class="py-3 px-6 text-left">${avgGrade}%</td>`;

    // Harakatlar faqat o'qituvchi uchun ko'rinadi
    if (isTeacher) {
      row += `<td class="py-3 px-6 text-left">
                <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline" onclick="editStudent(${index})">Tahrirlash</button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline" onclick="deleteStudent(${student._id})">O'chirish</button>
              </td>`;
    }
    row += `</tr>`;
    tableBody.innerHTML += row;
  });
}

// Baholar rangini aniqlash funksiyasi
function getGradeColor(grade) {
  switch (grade) {
    case 0: return "bg-red-500"; // Qizil
    case 1: return "bg-yellow-500"; // Sarxil
    case 2: return "bg-green-500"; // Yashil
    case 3: return "bg-blue-500"; // Moviy
    default: return "bg-gray-500"; // Xato baho
  }
}

// Login funksiyasi
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // O'qituvchi loginini tekshirish
  if (username === "teacher" && password === "password123") {
    isTeacher = true; // O'qituvchi kirganligini belgilash
    document.getElementById("studentForm").classList.remove("hidden");
    alert("Tizimga muvaffaqiyatli kirdingiz!");
    renderTable(); // Jadvalni ko'rsatish
  } else {
    alert("Login yoki parol xato!");
  }
});

// Baholash formasi orqali talabani qo'shish
document.getElementById("studentForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const group = document.getElementById("group").value;
  const name = document.getElementById("name").value;
  const task = document.getElementById("task").value;
  const grades = document.getElementById("grades").value.split(",").map(Number);

  await fetch('http://localhost:5000/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ group, name, task, grades }),
  });

  renderTable(); // Jadvalni yangilash
  document.getElementById("studentForm").reset(); // Formani tozalash
});

// Talabalarni filterlash
document.getElementById("filterName").addEventListener("input", function () {
  const filterValue = this.value.toLowerCase();
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(filterValue)
  );
  renderTable(filteredStudents);
});

// Talabani o'chirish funksiyasi
async function deleteStudent(id) {
  await fetch(`http://localhost:5000/students/${id}`, {
    method: 'DELETE',
  });
  renderTable(); // Jadvalni yangilash
}

// Sahifa yuklanganda talabalarni ko'rsatish
renderTable();
