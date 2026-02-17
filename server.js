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


