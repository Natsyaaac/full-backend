# Dokumentasi Debugging HTTP Method (Testing API Express)

Dokumentasi ini digunakan untuk mengetes endpoint backend menggunakan Postman atau Postman Extension di VS Code.

Server berjalan di:

http://localhost:3001

---

# 1. GET (Mengambil Data)

Digunakan untuk mengambil data dari server tanpa mengubah data.

Contoh endpoint:

GET http://localhost:3001/api/tasks

Langkah test:

1. Pilih method GET
2. Masukkan URL endpoint
3. Klik Send

Response yang diharapkan:

{
"status":200,
"data":[
{
"id":1,
"title":"Belajar React Hooks"
}
]
}

Jika error:

* cek server berjalan
* cek URL endpoint benar

---

# 2. POST (Membuat Data Baru)

Digunakan untuk menambahkan data baru ke server.

Contoh endpoint:

POST http://localhost:3001/api/tasks

Langkah test:

1. Pilih method POST
2. Masuk ke tab Body
3. Pilih raw
4. Pilih JSON
5. Isi data:

{
"title":"Belajar Debugging",
"description":"Latihan API",
"priority":"high"
}

6. Tambahkan header jika diperlukan

Authorization: Bearer valid-admin-token

7. Klik Send

Response sukses:

{
"status":200,
"data":{
"title":"Belajar Debugging"
}
}

Jika error:

* cek body JSON
* cek header Authorization

---

# 3. PUT (Update Data)

Digunakan untuk mengupdate data yang sudah ada.

Endpoint:

PUT http://localhost:3001/api/tasks/1

Body:

{
"completed": true
}

Langkah test:

1. Pilih PUT
2. Isi body JSON
3. Tambahkan Authorization header
4. Klik Send

Jika sukses server akan mengirim data yang sudah diupdate.

---

# 4. PATCH (Update Sebagian Data)

Mirip dengan PUT tetapi hanya mengupdate sebagian field.

Contoh:

PATCH http://localhost:3001/api/tasks/1

Body:

{
"priority":"high"
}

Biasanya dipakai untuk update sebagian data saja.

---

# 5. DELETE (Menghapus Data)

Digunakan untuk menghapus data dari server.

Endpoint:

DELETE http://localhost:3001/api/tasks/1

Langkah:

1. Pilih DELETE
2. Tambahkan Authorization header
3. Klik Send

Jika berhasil server mengirim response success.

---

# 6. HEAD

Mirip GET tetapi tidak mengirim body response.

Biasanya digunakan untuk:

* cek apakah endpoint tersedia
* cek status server

Contoh:

HEAD http://localhost:3001/api/tasks

---

# 7. OPTIONS

Digunakan untuk melihat method apa saja yang diizinkan server.

Contoh:

OPTIONS http://localhost:3001/api/tasks

Biasanya digunakan oleh browser untuk CORS.

---

# Checklist Debugging API

Jika API error cek hal berikut:

1. Server sudah berjalan
2. URL endpoint benar
3. Method sesuai
4. Body JSON valid
5. Header Authorization ada
6. Response status code diperiksa
7. Cek console server untuk error
