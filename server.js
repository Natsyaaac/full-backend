import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // middleware untuk mengizinkan request lintas origini (CORS policy browser)
app.use(express.json()); // middleware untuk parsing body request JSON menjadi object rea.body


const initialTasks = [  // array of obejct sebagai mock data awal (state awal apliaksi)
  {
    id: '1',
    title: 'Design Wireframe',
    description: 'Buat wireframe untuk halaman utama',
    status: 'todo',
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Implement API',
    description: 'Buat endpoint untuk tasks',
    status: 'doing',
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Testing',
    description: 'Lakukan unit testing',
    status: 'done',
    priority: 'medium',
    createdAt: new Date().toISOString()
  }
]

let tasks = [...initialTasks] // membuat salinan shallow copy array (object di dalamnua tetap referensi yang sama)

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))  // fungsi asycn yang mengembalikan Promise dan resolve setelah ms  milidetik 

app.get('/api/tasks', async (req, res) => {  //Route Get async untuk endpoint ke /api/tasks yang dijalankan saat request masuk 
  try {
    await delay(500); // memanggil funngsi dan menunggu 500ms sebelum melanjutkan 

    res.json({ // mengrirm data tasks list sebagai response dalam format json 
      success: true, // penanda bahawa response berhasil true
      data: [...tasks] // mengirirm isi array sbegaai data(bikin salinan baru array baru, spread copy)
    });
  } catch (error) {
    res.status(500).json({ // mengrim response status 500 dalam format json 
      success: false, // penanda bahawa response gagal false
      error: error.message // error diikute dengan pesan didalamnya 
    });
  }
});

app.get('/api/tasks/status/:status', async (req, res) => {  // Route get async untk endpoit ke /api/tasks/status dengan filter 
  try {
    await delay(300);  // memanggil fungsi dan menunggu 300ms sebelum melanjutkan

    const validStatus = ['todo', 'doing', 'done']; // validasi status task list dengan include
    if (!validStatus.includes(req.params.status)) { // validasi jika tidak sama dengan validStatus dan parameter dari url path route 
      throw new Error('Status tidak valid') // lempar error baru status tidak valid 
    }

    const filteredTasks = tasks.filter(  // fungsi untuk menfilter tasks 
      task => task.status === req.params.status // menyamakanya dengan route parameter dari url path 
    );

    res.json({  // mengrim data task status sebagai responsedalam format json 
      success: true,  // penanda bahwa response berhasil 
      data: filteredTasks //  mengirim status list yang sudah difilter 
    });
  } catch (error) {
    res.status(400).json({ // mengirim response status 500 dalam format json 
      success: false,  // penandan bahwa ada kegagalan response, false
      error: error.message  // error diikuti dengan pesan error didalamnya 
    })
  }
});


app.post('/api/tasks', async (req, res) => { // Route POST dengan async agar bisa menggunakan await dan menangani promise rejection
  try {
    const { title, description, priority } = req.body;  // obcjt destructing untuk mengambil properti title, description dll dari req.body 

    const requiredFields = ['title', 'description', 'priority']; // array yangd digunakan menvalidasi request field


    const hasAllFields = requiredFields.every(field =>
      Object.keys(req.body).includes(field)
      //mengecek semua apakah field wajib ada  di req.body menggunakan every(harus semua true)
    );

    if (!hasAllFields) {
      throw new Error('Semua field harus diisi')  // jika validasi gagal, lempar error untuk menghetikan eksekusi dan masuk ke catch 
    }

    const validPriorities = ['low', 'medium', 'high'];  // arrray yang digunakan untuk mevalidasi task list kategori apa 
    if (!validPriorities.includes(priority)) {
      throw new Error('Priority tidak valid')
      // mengecek apakah priority termasuk dalam dafatr menggunakan includes 
    }

    const newTask = {  // membuat object task baru menggunakan shorthand property dan menambahkan id serta timestamp
      id: Date.now().toString(),
      title,
      description,
      priority,
      status: 'todo',
      createdAt: new Date().toISOString()
    };

    tasks = [...tasks, newTask] // membuat array baru dengan spread operator(shallow copy) lalu menambahkan newTask di akhir

    res.status(201).json({
      success: true,
      data: newTask
      // mengirim HTTP 201(created) dengan data task baru dalam format json 
    });
  } catch (error) {
    res.status(400).json({ // mengririm response status 400 ke dalam format json 
      success: false, // gagal dalam mengirim data false 
      error: error.message // error dan diikuti dengan pesan error
    })
  }
});

app.put('/api/tasks/:id', async (req, res) => { // Route PUT  async untuk update task status berdasarkan parameter id (return Promise impliist) 
  try {
    const { id } = req.params; // destrcuting untuk mengambil id dari req.params
    const { status } = req.body; // destructing untuk mengambil statsu dari req.body 

    const validStatus = ['todo', 'doing', 'done']; 
    if (!validStatus.includes(status)) {  
      throw new Error('Status tidak valid')  
      // validasi status menggunakan includes (return bool dengan perbamdimngan ===)
    }

    const taskIndex = tasks.findIndex(t => t.id === id);  // mencari index task berdasarkan id menggunakan findIndex (return  -1 jika tidk ditemukan)

    if (taskIndex === -1) {  // jika index-1(tidak ditemukan, lempar error untuk meghentikan eksekusi)
      throw new Error('Task tidak ditemukan')
    }

    const updatedTask = {
      ...tasks[taskIndex], 
      status,
      updatedAt: new Date().toISOString()
      // membuat object baru dengan shallow copy task lama lalu override status dan updatedAT
    };

    tasks = [
      ...tasks.slice(0, taskIndex),  
      updatedTask, 
      ...tasks.slice(taskIndex + 1) 
      // membuat array baru dengan mengganti item pada index tertentu menggunakan slice + spread (immutable pattern) 
    ];

    res.json({
      success: true,
      data: updatedTask
      // mengirim response JSON berisi data task yang telah diperbarui 
    });
  } catch (error) {
    res.status(400).json({ // mengririm response status 400 ke dalam format json 
      success: false, // gagal dalam mengirim data false 
      error: error.message // error dan diikuti dengan pesan error
    })
  }
});


app.delete('/api/tasks/:id', async (req, res) => { // Route delete dengan async untuk menghapus task lewat id 
  try {
    const { id } = req.params; // obcjt destructing untuk mengambil properti id dari url paath bagian :id  

    const newTask = tasks.filter(task => task.id !== id); // membuat array baru dengan mengahpus task yang id-nya sesuai menggunakan filter (immutable)

    if (newTask.length === tasks.length) { 
      throw new Error('Task tidak ditemukan');
      // jika panjang array tidak berubah, berarti id tidak akan ditemukan 
    }

    tasks = newTask; //\ mengganti refernsi tasks dengan array hasil filter

    res.json({ success: true, message: 'Task deleted' })  // response dengan json menandakan succes dan pesan task terhapush 
  } catch (error) {
    res.status(400).json({ // mengririm response status 400 ke dalam format json 
      success: false, // gagal dalam mengirim data false 
      error: error.message // error dan diikuti dengan pesan error
    })
  }
});

app.listen(5000, () => {  // menjalankan server pada port 5000 dan mengeksekusi callback saat server aktif 
  console.log('🚀 Task Flow API running on http://localhost:5000')
})