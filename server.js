import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors()); // mengaktifkan cors agar bacend bisa diakses dari domain / fronted lain
app.use(express.json()); // membaca body request JSON lalu mengubah nya ke object javascript 


// fungsi untuk data film dengan closure implementasi 
const createMovieCollection = () => {
  let movies = [  // arry untuk menyimpan object daftar film, nama, rating, tahun dan ditonton
    { id: 1, title: "Inception", genre: "Sci-Fi", rating: 8.8, year: 2010, watched: false },
    { id: 2, title: "The Shawshank Redemption", genre: "Drama", rating: 9.3, year: 1994, watched: true },
    { id: 3, title: "The Dark Knight", genre: "Action", rating: 9.0, year: 2008, watched: false },
    { id: 4, title: "Pulp Fiction", genre: "Crime", rating: 8.9, year: 1994, watched: true },
    { id: 5, title: "Forrest Gump", genre: "Drama", rating: 8.8, year: 1994, watched: false },
    { id: 6, title: "The Matrix", genre: "Sci-Fi", rating: 8.7, year: 1999, watched: true },
    { id: 7, title: "Goodfellas", genre: "Crime", rating: 8.7, year: 1990, watched: false },
    { id: 8, title: "Interstellar", genre: "Sci-Fi", rating: 8.6, year: 2014, watched: true }
  ];

  return {
    getAllMovies: () => [...movies], // mengembalikan salinan selurug data movie agar data asli tidak dimodifikasi langsung
    getMovieById: (id) => movies.find(movie => movie.id === id), // mencari satu movie berdasarkan id yang cocok 
    addMovie: (movie) => {  // fungsi untuk menambahkan movie baru ke dalam array 
      const newMovie = { ...movie, id: movies.length + 1 }; // membuat object baru dan memberi id berdasarkan jumlah data saat ini 
      movies.push(newMovie); // menambahkan movie baru ke dalam array 
      return newMovie // mengembalikan data movie yang baru ditambahkan 
    },
    toggleWatched: (id) => {  // fungsi dimana mendeteksi apakah film ini sudah di tonton atau belum 
      movies = movies.map(movie =>
        movie.id === id ? { ...movie, watched: !movie.watched } // jika id cocok, balik nilai watched(false) 
          : movie // jika tidak cocok, birakan data tetap
      );

      return movies.find(movie => movie.id === id); // mengembalikan movie yang sudahh diperbarui
    },
    getStats: () => ({ // fungsi untuk melihat stat data 
      total: movies.length, // menghitung semua movie yang ada didalam array 
      watched: movies.filter(m => m.watched).length, // menghitung semua movie yang telah dilihat 
      unwatched: movies.filter(m => !m.watched).length, // menghitung semua movie yang belom dilihat 
      averageRating: (movies.reduce((acc, m) => acc + m.rating, 0) / movies.length).toFixed(1)
      // menghitung rating dengan mengumpulkan rating movie jadi satu dengan menghitung (tampungan hasil sementara + rating movie diarray dibagi semua movie) dan dibulatkan menggunakan tofixed 
    })
  };
};

const movieCollection = createMovieCollection(); // memanggil createMovieCollection  lalu menyimpan object hasil return agar bisa digunakan 

app.get('/api/movies', async (req, res) => {  // route GET untuk ke  /api/movies yang dijalankan saat ada request masuk 
  try { // coba 
    await new Promise(resolve => setTimeout(resolve, 500)); // menuungu 500ms sebelum melanjutkan eksekusi 
    const movies = movieCollection.getAllMovies(); // mengambil seluruh data movie dari colection 
    res.json(movies); // mengirim data movie sebagai response dalam format JSON ke client 
  } catch (error) {
    res.status(500).json({ error: error.message }); // jika terjadi error saat proses, kirim response status 500 beserta pesan error
  }
});

app.get('/api/movies/:id', async (req, res) => { // route GET untuk untuk mengambil satu movie berdasarkan id saat ada request 
  try {
    await new Promise(resolve => setTimeout(resolve, 300)); // menunggu 300ms sebelum melanjutkan eksekusi 
    const movie = movieCollection.getMovieById(parseInt(req.params.id)); // mengambil satud ata movie berdasarkan id dari parameter URL
    if (!movie) { // jika bukan movie tampilkan status error dengan pesan  'Movie not found'
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);  // mengirim data movie sebagai response dalam format JSON ke client
  } catch (error) {
    res.status(500).json({ error: error.message }); // jika terjadi error saat proses, kirim response status 500 beserta pesan error 
  }
});

app.post('/api/movies/toggle/:id', async (req, res) => { // route POST untuk mengubah status watched pada movie berdasarkan id 
  try {
    await new Promise(resolve => setTimeout(resolve, 400)); // menunggu 400ms sebelum melanjutkan eksekusi 
    const updateMovie = movieCollection.toggleWatched(parseInt(req.params.id)); // membalik nilai watched (true/false) dari movie sesuai id 
    res.json(updateMovie); // mengirim data movie sebagai response dalam format JSON ke client
  } catch (error) {
    res.status(500).json({ error: error.message }); // jika terjadi error saat proses, kirim response status 500 beserta pesan error 
  }
});

app.get('/api/stats', async (req, res) => { // route GET untuk ke /api/stats saat request masuk
  try {
    await new Promise(resolve => setTimeout(resolve, 200)); // menunggu 200ms sebelum melanjutkan eksekusi 
    const stats = movieCollection.getStats();  // mengambil data statistik seperti total movie, watched, unwatched, dan rata-rata rating
    res.json(stats);  // mengirim data movie sebagai response dalam format JSON ke client 
  } catch (error) {
    res.status(500).json({ error: error.message }); // jika terjadi error saat proses, kirim response status 500 beserta pesan error 
  }
});

app.listen(port, () => { //mulai server dan dengar request http di port 5000
  console.log(`Server running at http://localhost:${port}`) // callback dijalankan setelah server berhasil hidup // tapil di console dengan server running at http://localhost:5000
})



