import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const initialFoodOrders = [
  {
    id: '1',
    title: 'Nasi Goreng',
    note: 'Pedas level 3',
    status: 'pending',
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Mie Ayam',
    note: 'Tanpa sawi',
    status: 'diproses',
    priority: 'medium',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Ayam Geprek',
    note: 'Sambal dipisah',
    status: 'selesai',
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Bakso',
    note: 'Kuah dipisah',
    status: 'pending',
    priority: 'low',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Es Teh',
    note: 'Gula sedikit',
    status: 'diproses',
    priority: 'low',
    createdAt: new Date().toISOString()
  }
]

let foods = [...initialFoodOrders]
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const generateNewId = () => {
  // 1. foods.map(food => parseInt(food.id)) 
  //    Mengubah semua ID string menjadi number
  //    ['1', '2', '3'] → [1, 2, 3]
  
  // 2. Math.max(...array)
  //    Mencari nilai tertinggi dari array
  
  // 3. || 0 
  //    Jika array kosong, gunakan 0 sebagai default
  
  const maxId = Math.max(...foods.map(food => parseInt(food.id) || 0));
  
  // 4. Tambah 1 dan kembalikan sebagai string
  return (maxId + 1).toString();
};

// Contoh penggunaan:
// Jika foods = [{id: '1'}, {id: '2'}, {id: '3'}]
// maxId = 3
// return '4'

app.get('/api/foods', async (req, res) => {
  try {
    await delay(500);
    res.json({
      success: true,
      data: [...foods]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

app.get('/api/foods/status/:status', async (req, res) => {
  try {
    await delay(300);
    const validOrderstatus = ['pending', 'diproses', 'selesai'];
    if (!validOrderstatus.includes(req.params.status)) {
      throw new Error('Status tidak valid')
    }

    const filteredOrders = foods.filter(
      food => food.status === req.params.status
    );
    res.json({
      success: true,
      data: filteredOrders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
});

app.post('/api/foods', async (req, res) => {
  try {
    const { title, note, priority } = req.body
    const requiredOrderFields = ['title', 'note', 'priority']
    const hasALlOrderFields = requiredOrderFields.every(field =>
      Object.keys(req.body).includes(field)
    );

    if (!hasALlOrderFields) {
      throw new Error('Semua field order harus diisi')
    }

    const validOrderPriorities = ['low', 'medium', 'high'];
    if (!validOrderPriorities.includes(priority)) {
      throw new Error('Protity tidak valid')
    }

    const maxId = generateNewId()
    const newFoodOrders = {
      id: maxId,
      title,
      note,
      priority,
      status: 'diproses',
      createdAt: new Date().toISOString()
    };

    foods = [...foods, newFoodOrders]

    res.status(201).json({
      success: true,
      data: newFoodOrders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
});

app.put('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validOrderStatus = ['pending', 'diproses', 'selesai'];
    if(!validOrderStatus.includes(status)) {
      throw new Error('Status tidak valid')
    }

    const foodIndex = foods.findIndex(f => f.id === id)
    if (foodIndex === -1) {
      throw new Error('Task tidak ditemukan')
    }

    const updateFoods = {
      ...foods[foodIndex],
      status,
      updateAt: new Date().toISOString()
    };

    foods = [
      ...foods.slice(0, foodIndex),
      updateFoods,
      ...foods.slice(foodIndex + 1)
    ];

    res.json({
      success: true,
      data: updateFoods
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
});

app.delete('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const newFoods = foods.filter(food => food.id !== id);

    if(newFoods.length === foods.length) {
      throw new Error('Food Tidak ditemukan')
    }

    foods = newFoods
    res.json({
      success: true,
      message: 'Order Terhapus'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
});

app.listen(5000, () => {
  console.log('🚀 Task Flow API running on http://localhost:5000')
})