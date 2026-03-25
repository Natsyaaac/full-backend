import express from 'express';
import cors from 'cors'
import { products } from './productData.js';

const app = express();
const PORT = 3001

app.use(cors());
app.use(express.json());
/*
  - middleware CORS untuk mengizinkan request dengan origin 
  - middleware untuk membaca body request dengan format json agar bisa diakses di req.body 
*/


const createApiResponse = (statusCode) => {
  return (data, message = 'success') => ({
    status: statusCode,
    data: data,
    message: message,
    timestamp: new Date().toISOString()
  })

  /*
    - fungsi factory yang menghasilkan closure dengan menyimpan statusCode dalam lexical scope
    - mengembalikan funsi baru yang tetap memiliki akses ke statusCode(closure)
  */
}
const successResponse = createApiResponse(200);
const errorResponse = createApiResponse(500);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
/* 
  - memanggil fungsi dengan response 200 jika berhasil 
  - memanggi fungsi dengan response 500 jika gagal 
  - mengembalikan Promise dan akan reesolve setelah ms milidetik 
*/


app.get('/api/products', async (req, res) => {
  try {
    await delay(300)
    /* 
      - route handle async untuk endpoint Get /api/products
      - block try catch karna menggunakan async await 
      - menunggu Promise delay resolve melanjutkan eksekusi 
    */

    res.json(successResponse(products))
    /*
      - mengirim response JSON menggunakan closure (successResponse) dengan status 200 berisi data products 
    */
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message));
    /*
      - mengirim response error dengan status 500
      - menggunakan fungsi errorResponse dengan data null pessan eror 2
    */
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    await delay(300)
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id)

    if (product) {
      res.json(successResponse(product))
    } else {
      throw new Error('Produk tidak ditemukan')
    }
  } catch (error) {
    res.status(400).json(errorResponse(null, error.message))
  }
})

app.get('/api/products/filter', async (req, res) => {
  try {
    await delay(300)
    let filteredProducts = [...products];
    const { category, minPrice, maxPrice, search } = req.query;

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.fillter(p => p.category === category);
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
    }

    if (search) {
      filteredProducts = filteredProducts.fillter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(successResponse(filteredProducts))
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message))
  }
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); 
})