# Rangkuman Konsep JavaScript di `full-backend/server.js`

## 1. Scope dan Closure

- `tasks` dideklarasikan di level module (`let tasks = [...initialTasks]`), jadi semua route handler bisa akses dan update data yang sama.
- Setiap callback route seperti `app.get(...)` membentuk closure terhadap variable di luar fungsi, termasuk `tasks` dan `delay`.
- Pada `delay(ms)`, callback di dalam `new Promise(...)` juga menutup akses ke `ms` dan `resolve` sampai `setTimeout` selesai.

## 2. Promise

- Fungsi `delay` mengembalikan Promise:

```js
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
```

- Promise dipakai untuk simulasi proses async (seolah ada query database/API lain).
- Semua route yang ditandai `async` secara otomatis juga mengembalikan Promise.

## 3. Async / Await

- Route memakai `async` agar bisa pakai `await`.
- `await delay(500)` membuat eksekusi menunggu Promise selesai tanpa callback berantai.
- Pola ini bikin alur kode lebih mudah dibaca dibanding `.then().catch()`.

## 4. Array Method yang Dipakai

### `includes`

- Validasi nilai status:

```js
validStatus.includes(req.params.status)
```

- Validasi priority:

```js
validPriorities.includes(priority)
```

- Cek key wajib di body:

```js
Object.keys(req.body).includes(field)
```

### `every`

- Memastikan semua field wajib ada:

```js
requiredFields.every(field => Object.keys(req.body).includes(field))
```

### `filter`

- Filter task berdasarkan status.
- Hapus task dengan membuat array baru tanpa id tertentu.

### `findIndex`

- Mencari posisi task berdasarkan id sebelum update:

```js
const taskIndex = tasks.findIndex(t => t.id === id)
```

### `slice`

- Dipakai saat update untuk membangun array baru sebelum dan sesudah index yang diubah.

### `map` (konsep terkait)

- Di `server.js` utama tidak dipakai langsung.
- Biasanya `map` dipakai untuk transformasi semua item array (misalnya update banyak data sekaligus).

## 5. Error Handling (`try/catch`)

- Setiap route dibungkus `try/catch`.
- Saat validasi gagal, kode melempar error:

```js
throw new Error('Status tidak valid')
```

- Error ditangani di `catch`, lalu kirim response JSON dengan status code (`400` atau `500`) dan pesan error.

## 6. Destructuring

- Mengambil property dari object secara ringkas:

```js
const { title, description, priority } = req.body;
const { id } = req.params;
const { status } = req.body;
```

- Membuat kode lebih pendek dan fokus pada field yang dibutuhkan.

## 7. Spread Operator (`...`)

### Pada array

- Salin data awal:

```js
let tasks = [...initialTasks]
```

- Tambah task baru (immutable style):

```js
tasks = [...tasks, newTask]
```

- Ganti item di index tertentu dengan gabungan `slice + spread`:

```js
tasks = [
  ...tasks.slice(0, taskIndex),
  updatedTask,
  ...tasks.slice(taskIndex + 1)
]
```

### Pada object

- Salin task lama lalu override field tertentu:

```js
const updatedTask = {
  ...tasks[taskIndex],
  status,
  updatedAt: new Date().toISOString()
}
```

## Inti Pola Kode

- Pakai async flow yang rapi (`async/await + try/catch`).
- Validasi input dengan kombinasi array methods.
- Update data dengan immutable pattern memakai spread operator.
- Pisahkan jalur sukses (`success: true`) dan gagal (`success: false`) di response API.
