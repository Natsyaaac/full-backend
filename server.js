import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors()); // mengaktifkan cors untu mengizinkan akses ke api backend 
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
    getAllMovies: () => [...movies], // fungsi untuk menyalin semua movies untuk digunakan sebagai kategori semua 
    getMovieById: (id) => movies.find(movie => movie.id === id), // fungis untuk menyaring movie berdasarkan id nya 
    addMovie: (movie) => {  // fungsi untuk menambahkan movie baru ke dalam array 
      const newMovie = { ...movie, id: movies.length + 1 }; // menambahkan id baru dengan panjang semua id ditambah 1 misal (6 + 1 = 7)
      movies.push(newMovie); // simpan ke array  sebagai movie baru 
      return newMovie // mengirim hasil ke pemanggil fungsi untu langsu dipakai datanya 
    },
    toggleWatched: (id) => {  // fungsi dimana mendeteksi apakah film ini sudah di tonton atau belum 
      movies = movies.map(movie =>  
        movie.id === id ? { ...movie, watched: !movie.watched } : movie

        // jika semua id movie sama dengan id di array makan salin smua, dan tetapkan ditonton atau belom ditonton 
      );

      return movies.find(movie => movie.id === id); // mengirim hasil untuk filter nya sesuai id 
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


