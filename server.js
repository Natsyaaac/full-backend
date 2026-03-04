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
    let tasks = [...globalTaskUser.tasks]
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
    let tasks = [...globalTaskUser.tasks]
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
  /* 
    - async route handler dengan middleware authenticate
    - endpoint POST /api/tasks untuk memebuat task baru 
  */
  try {
    const { title, description, priority = 'medium' } = req.body
    await delay(300)
    let tasks = [...globalTaskUser.tasks]
    /*
      - Menuggu Promise delay resolve sebelum melanjutkan eksekusi 
      - destructing, mengambil(title, description dan priority='medium' dari req.body)
    */

    if (!title) {
      throw new Error('Title is required')
      /*
        - pengecekan jika tidak ada title lempar error dengan pesan, yang akan ditangkap oleh cacth
      */
    }

    const newTask = {
      id: tasks.length + 1,
      title,
      description: description || '',
      completed: false,
      priority,
      createdAt: new Date().toISOString()
      /* 
        - membuat objct task baru
        - membuat id dengan panjang tasks ditambah 1
        - judul tasks
        - description task atau (operasi or) jika tidak ada kosongkan saja 
        - set completed menjadi false (belum selesai)
        - priority dari request atau default
        - dan tanggal pembuatan, dengan waktu saat task dibuat dalam format ISO
      */
    };

    const updatedTasks = [...tasks, newTask];
    tasks = updatedTasks;
    /*
      - membuat array baru dari tasks menggunakan spread operator 
      - menambahkan newTask ke akhir array 
      - hasilnya disimpan kembali ke variable tasks 
    */

    res.json(successResponse(newTask))
    /*
     -mengirim response JSON berisi data tasks yang baru dibuat  melalui fungsi successResponse
   */
  } catch (error) {
    res.status(400).json(errorResponse(null, error.message))
    /* 
       - mengirim response error dengan status 400
       - menggunakan fungsi errorResponse dengan data null pesan error 
     */
  }
})

app.put('/api/tasks/:id', authenticate, async (req, res) => {
  /* 
   - async route handler dengan middleware authenticate
   - endpoint PUT /api/tasks/:id untuk mengupdate task
   - :id adalah parameter dinamis 
  */
  try {
    const { id } = req.params;
    const updates = req.body;
    await delay(300);
    let tasks = [...globalTaskUser.tasks]

    /* 
      - object destructing untuk mengambil parameter id dari req.params
      - mengambil updates dari req.body 
      - Menuggu Promise delay resolve sebelum melanjutkan eksekusi 
    */
    let updatedTask = null;
    const updatedTasks = tasks.map(task => {
      if (task.id === parseInt(id)) {
        updatedTask = { ...task, ...updates };
        return updatedTask
      }
      return task
    });
    /* 
     - melakukan iterasi pada array tasks dengan map 
     - jika id tasks sama dengan id dara parameter URL maka task akan diupdate 
     - lalu menimpa menggunakan spread opeator 
     - jika id cocok return task yang sudah diupdate
     - jika tidak task tetap sama 

   */

    if (!updatedTask) {
      throw new Error('Task not found')
      /* 
        - pengecekan jika tidak update, lempar error agar ditangkap catch 
       
      */
    }

    tasks = updatedTasks
    /* 
      - hasil update ditambah ke dalam araay tasks 
    */
    res.json(successResponse(updatedTask))
    /*
     -mengirim response JSON berisi data tasks melalui fungsi successResponse
   */
  } catch (error) {
    res.status(400).json(errorResponse(null, error.message))
    /* 
       - mengirim response error dengan status 400
       - menggunakan fungsi errorResponse dengan data null pesan error 
     */
  }
})

app.delete('/api/tasks/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await delay(300);
    let tasks = [...globalTaskUser.tasks]

    const taskExists = tasks.some(t => t.id === parseInt(id));
    if (!taskExists) {
      throw new Error('Task not found')
    }

    tasks = tasks.filter(task => task.id !== parseInt(id));
    res.json(successResponse(taskExists))
  } catch (error) {
    res.status(400).json(errorResponse(null, error.message))
  }
});


app.post('/api/login/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = [...globalTaskUser.users]
    await delay(300);

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials')
    };

    const token = username === 'admin' ? 'valid-admin-token' : 'valid-user-token';
    const newUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      token
    }

    res.json(successResponse(newUser, "Login successful"));
  } catch (error) {
    res.status(400).json(errorResponse(null, error.message))
  }
});

app.get('/api/event-loop-demo', (req, res) => {
  console.log('1. Start endpoint');

  Promise.resolve().then(() => {
    console.log('2. MicroTask (promise executed)')
  });

  setTimeout(() => {
    console.log('3. Timeout (MacroTask Executed)')
  }, 0)

  console.log('4. End endpoint');

  res.status(200).json({
    message: 'Check server console untuk melihat Event Loop demo',
    concept: 'Event Loop: Call Stack -> Microtask Queue -> Macrotask Queue'
  });
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Stateless concept: Server tidak menyimpan session');
})