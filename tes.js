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