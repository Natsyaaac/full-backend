import express, { json } from 'express';
import cors from 'cors';

const app = express()
const port = 5000

app.use(cors()) // middleware untuk mengaktifkan CORS agara server mengizinkan request dari origin berbeda
app.use(express.json()); // middleware untuk parsing body request JSON menjadi object js pada req.body 


const globalData = {  // object global sebagai mock dtata awal aplikasi (in-memory state)
  users: [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'admin', active: true },
    { id: 2, name: 'Sarah Chen', email: 'sarah@example.com', role: 'user', active: true },
    { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'user', active: false },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'editor', active: true },
    { id: 5, name: 'James Brown', email: 'james@example.com', role: 'user', active: true }
  ],
  posts: [
    { id: 1, userId: 1, title: 'Getting Started with React', likes: 45, category: 'food' },
    { id: 2, userId: 2, title: 'Modern JavaScript Features', likes: 32, category: 'food' },
    { id: 3, userId: 1, title: 'Travel Tips 2024', likes: 78, category: 'food' },
    { id: 4, userId: 3, title: 'Healthy Recipes', likes: 23, category: 'food' },
    { id: 5, userId: 4, title: 'Photography Basics', likes: 56, category: 'food' },
    { id: 6, userId: 2, title: 'Meditation Guide', likes: 41, category: 'food' },
    { id: 7, userId: 3, title: 'Recipes', likes: 98, category: 'food' },
    { id: 8, userId: 4, title: 'Photography Basics', likes: 58, category: 'food' },
    { id: 9, userId: 2, title: 'Meditation Guide', likes: 77, category: 'food' },
    {id: 10, userId: 5, title: 'Nasi Goreng', likes: 50, category: 'food'},
    {id: 12, userId: 5, title: 'Ikan Goreng', likes: 80, category: 'food'}
  ]
}

const createApiResponse = (statusCode) => {  // function factory yang menghasilkan closure dengan menyimpan statusCode dalam lexical scope
  return (data, message = 'Success') => ({
    // mengembalikan function baru yang tetap memiliki akses ke statusCode (closure)
    status: statusCode,
    data: data,
    message: message,
    timestamp: new Date().toISOString()
  });
};

const successResponse = createApiResponse(200);  // memanggil fungsi dengan response 200 jika berhasil lalu menyimnpanya 
const errorResponse = createApiResponse(500) // memanggil fungsi dengan response 500 jika gagal lalu menyimpannya 
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)) // function yang mengembalikan Promise dan akan resolve setelah ms milidetik

app.get('/api/users', async (req, res) => {  
  // Route Handler asycn untuk endpoint GET /api/users
  try {
    await delay(500);
    // menunggu Promise delay resolve sebelum melanjutkan eksekusi
    const { filter, role } = req.query;
    let filteredUsers = [...globalData.users]
    // object destructing untuk mengmabil properti filter dan role dari req.query
    // membuat shallow copy array users menggunakan spread operator 

    if(filter === 'active') {
      filteredUsers = filteredUsers.filter(user => user.active)
    }
    // menyaring user dengan properti active bernilai tru dan menghasilkan array baru 

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }
    // menyaring users berdasarkan kecocokan nilai role

    res.json(successResponse(filteredUsers)); 
    // mengirim response JSON menggunakan closure successResponse dengan status 200 berisi filteredUsers yang terlah di filter 
  } catch(error) {
    res.status(500).json(errorResponse(null, error.message))
    // mengirim response gagal dengan status (500), dengan pesan error dan ditambah null 
  }
});


app.get('/api/users/:id', async (req, res) => {
  // Route Handler async endpoint GET /api/users/:id dengan parameter dinamis

  try {
    const { id } = req.params
    await delay(300)
    // object destructing untuk mengambil parameter id dari req.params
    // menunggu Promise delay resolve sebelum melanjutkan eksekusi 

    const user = globalData.users.find(user => user.id === parseInt(id))
    // mencari satu user pertama yang id-nya sama dengan id(yang dikonversi ke number), mengembalikan object atau undefined

    if(!user) {
      return res.status(404).json(errorResponse(null, 'User not found'))
    }
    // jika user tidak ditemukan (undefined), mengirim response 404 dan mengehetikan eksekusi function (early return)

    const userWithPosts = {  
      ...user,
      posts: globalData.posts.filter(post => post.userId === user.id)
    }
    // membuat object baru, melakukan shallow copy seluruh properti user, menambahkan properti ke posts berisi array hasil filter berdasarkan kecockan userId 

    res.json(successResponse(userWithPosts));
    // mengirim response JSON menggunakan closure successResponse dengan status 200 berisi user yang berhasil di ambil
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message))
     // mengirim response gagal dengan status (500), dengan pesan error dan ditambah null 
  }
});

app.get('/api/posts', async (req, res) => {
  // Route Handler asycn untuk endpoint GET /api/posts
  try {
    const { category, minLikes} = req.query;
    let filteredPosts = [...globalData.posts]
    // object destructing untuk mengambil parameter query category dan minLikes dari req.query
    // membuat shallow copy array post agar tidak memodifikasi data asli 

    if(category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    // menyaring post berdasarkan kecocokan nilai category dan menghasilkan array baru

    if (minLikes) {
      filteredPosts = filteredPosts.filter(post => post.likes >= parseInt(minLikes))
    }
    // menyaring posts berdasarkan nilai likes >= minlikes (yang dikonversikan ke number), menghasilkan array baru 

    const postsWithUser = filteredPosts.map(post => {
      const user = globalData.users.find(u => u.id === post.userId);
      // mentranformasi setiap post menjadi object baru dengan properti tambahan 
      // mencari satu user yang id nya sama dengan post.userId menggunakan find()
      return {
        ...post,
        author: user ? user.name : 'Unknown',
        isPopular: [45, 56, 78].includes(post.likes)
      };
      // mengembalikan object baru hasil transformasi
      // shallow copy seluruh properti post 
      // menambahkan properti author berdasarkan hasil pencarian user (ternary operator)
      // menambahkan properti boolead berdasarkan apakah nilai likes terdapat dalam array menggunakan includes
    });

    res.json(successResponse(postsWithUser));
   // mengirim response JSON menggunakan closure successResponse dengan status 200 berisi hasil transformasi post 
  } catch(error) {
    res.status(500).json(errorResponse(null, error.message))
    // mengirim response gagal dengan status (500), dengan pesan error dan ditambah null 
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// menjalankan server pada pory dan mengeksekusi callback pada server actif