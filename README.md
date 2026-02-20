# Task Flow Backend API

Backend sederhana berbasis **Express** untuk manajemen task (to-do, doing, done) dengan data in-memory.

## Fitur Utama

- CRUD task (create, read, update status, delete)
- Filter task berdasarkan status
- Validasi input (`title`, `description`, `priority`)
- Simulasi delay async pada beberapa endpoint
- Response JSON konsisten dengan format `success`, `data`, atau `error`

## Struktur Folder

```text
full-backend/
├─ server.js              # Backend utama Task Flow API
├─ server-1/server.js     # Contoh backend lain (Movie API)
├─ tes/server.js          # Versi latihan dari Task Flow API
├─ package.json
└─ README.md
```

## Teknologi

- Node.js
- Express
- CORS

## Menjalankan Project

1. Install dependency:

```bash
npm install
```

2. Jalankan backend:

```bash
npm run server
```

Server berjalan di:

```text
http://localhost:5000
```

## Data Task

Setiap task punya struktur:

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "todo | doing | done",
  "priority": "low | medium | high",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string (opsional)"
}
```

## API Endpoint

### 1) Get semua task

- Method: `GET`
- URL: `/api/tasks`

### 2) Get task berdasarkan status

- Method: `GET`
- URL: `/api/tasks/status/:status`
- Status valid: `todo`, `doing`, `done`

### 3) Tambah task baru

- Method: `POST`
- URL: `/api/tasks`
- Body wajib:

```json
{
  "title": "Belajar Express",
  "description": "Membuat endpoint CRUD",
  "priority": "high"
}
```

### 4) Update status task

- Method: `PUT`
- URL: `/api/tasks/:id`
- Body:

```json
{
  "status": "doing"
}
```

### 5) Hapus task

- Method: `DELETE`
- URL: `/api/tasks/:id`

## Catatan

- Data disimpan di memory (`let tasks = [...]`), jadi akan reset saat server restart.
- `server-1/server.js` adalah contoh API terpisah (movie collection), bukan endpoint utama Task Flow.
- Script `dev/build/preview` di `package.json` terkait setup Vite; backend utama dijalankan lewat `npm run server`.
