import express from 'express';
import cors from 'cors';
const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']

  /*
  - middleware CORS untuk mengizinkan request dengan origin tertentu
  - menentukan http method apa saja yang boleh
  - menentukan header apa saja yang boleh dikirim oleh client 

  */
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*
  - middleware untuk membaca body request dengan fromat json
  - middleware untuk membaca body dari request form (application/x-www-form-urlencoded)
  -extended: true memungkinkan parsing data nested object 
*/


// Simulasi database dengan array - Implementasi Array method
const globalTaskUser = {

  tasks: [
    { id: 1, title: 'Belajar React Hooks', description: 'useState, useEffect, useContext', completed: false, priority: 'high' },
    { id: 2, title: 'Implementasi Express API', description: 'Buat REST API dengan Express', completed: true, priority: 'medium' },
    { id: 3, title: 'Belajar Array Methods', description: 'map, filter, reduce, includes', completed: false, priority: 'low' }
  ],
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' }
  ]
};

let tasks = [...initialTaskUsers]
const createApiResponse = (statusCode) => {
  return (data, message = 'success') => ({
    status: statusCode,
    data: data,
    message: message,
    timestamp: new Date().toISOString()
  })
}
const successResponse = createApiResponse(200);
const errorResponse = createApiResponse(500);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))



const authenticate = (req, res, next) => {
  /* 
    -middleware autentikasi pada Express
    - berfungsi mengecek token pada header sebelum reques lanjut ke route berikutnya 
  */
  const { authorization } = req.headers;
  // destrcuting mengambil authorization dari req.headers

  if (authorization == null) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' })

    /*
      - mengecek apakah header authorixation tidak ada 
      - jika tidak ada, maka request dianggap tidak 
      terauntetikasi 
      - jika tidak ada header authorization maka server mengirim response 401 unauthorization
    */
  }

  const token = authorization.split(' ')[1];
  // mengambil token dari bearer <token> lalu menyimpanya 

  if (token === 'invalid-token') {
    return res.status(403).json({ message: 'Forbidden - Invalid token' });

    // pengecekan jika token sama dengan invalid token, jika iya balikin 403 forbiden 
  }

  next()
  // jika lolos semua cek panggil next untuk melanjutkan handler berikutnya 
};

app.get('/api/tasks', async (req, res) => {
  // Route handle ansync untuk endpoint Get /api/tasks
  try {
    await delay(300)
    // menuuggu Promise delay resolve sebelum melanjutkan eksekusi 
    res.json(successResponse(tasks));
    // mengirim response JSON menggunakan closure (successResponse) dengan status 200 berisi data tasks
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message))
    /* 
      - mengirim response error dengan status 500
      - menggunakan fungsi errorResponse dengan data null pesan error 
    */
  }
})

app.get('/api/task/:id', async (req, res) => {
  /* 
    - async route handler untuk endpoint Get /api/task/:id
    - :id adalah route parameter dinamis 
  */
  try {
    const { id } = req.params;
    await delay(300)
    // object destructing untuk mengambil parameter id dari req.params
    // menunggu Promise delay resolve seblum melanjutkan eksekusi 

    const task = tasks.find(t => t.id === parseInt(id));
    /*
      - menacri elemen pertama pada array tasks yang memiliki id sama dengan id dari parameter URL
      - id dari URL diubah menjadi number menggunakan parseInt agar tipe data sama
    */

    if (!task) {
      throw new Error('Task not found')

      /*
        - melempar error jika tasks tidak ditemukan sehingga eksekusi berpindah ke block catch 
      */
    };

    res.json(successResponse(task));
    /*
      -mengirim response JSON berisi data tasks melalui fungsi successResponse
    */
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message))
    /* 
       - mengirim response error dengan status 500
       - menggunakan fungsi errorResponse dengan data null pesan error 
     */
  }
})

app.post('/api/tasks', authenticate, async (req, res) => {
  try {
    await delay(300)
    const { title, description, priority = 'medium' } = req.body

    if (!title) {
      throw new Error('Title is required')
    }

    const newTask = {
      id: tasks.length + 1,
      title,
      description: description || '',
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, newTask];
    tasks = updatedTasks;

    req.json(successResponse(newTask))
  } catch (error) {
    res.status(400).json(errorResponse(null, error.message))
  }
})

app.put('/api/tasks/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await delay(300);

    let updatedTask = null;
    const updatedTasks = tasks.map(task => {
      if (task.id === parseInt(id)) {
        updatedTask = { ...task, ...updates };
        return updatedTask
      }
      return task
    });

    if (!updatedTask) {
      throw new Error('Task not found')
    }

    tasks = updatedTasks
    res.json(successResponse(updatedTask))
  } catch (error) {
    res.status(400).json(errorResponse(null, error.message))
  }
})