import express, { json } from 'express';
import cors from 'cors'

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

const bugUserGlobal = {
  users: [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'admin', active: true },
    { id: 2, name: 'Sarah Chen', email: 'sarah@example.com', role: 'user', active: true },
    { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'user', active: false },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'editor', active: true },
    { id: 5, name: 'James Brown', email: 'james@example.com', role: 'user', active: true }
  ],
  bugs: [
    { id: 1, userId: 1, title: 'Login Button Not Working', likes: 45, category: 'bug' },
    { id: 2, userId: 2, title: 'API Response Delay Issue', likes: 32, category: 'bug' },
    { id: 3, userId: 1, title: 'Form Validation Error', likes: 78, category: 'bug' },
    { id: 4, userId: 3, title: 'Navbar Overlapping Content', likes: 23, category: 'bug' },
    { id: 5, userId: 4, title: 'Image Not Loading on Mobile', likes: 56, category: 'bug' },
    { id: 6, userId: 2, title: 'Token Expired Too Fast', likes: 41, category: 'bug' },
    { id: 7, userId: 3, title: 'Dark Mode Toggle Crash', likes: 98, category: 'bug' },
    { id: 8, userId: 4, title: 'Search Feature Not Filtering', likes: 58, category: 'bug' },
    { id: 9, userId: 2, title: 'Pagination Not Updating', likes: 77, category: 'bug' },
    { id: 10, userId: 5, title: 'Data Not Saved to Database', likes: 50, category: 'bug' },
    { id: 12, userId: 5, title: '500 Internal Server Error', likes: 80, category: 'bug' }
  ]
}

const createApiResponse = (statusCode) => {
  return (data, message = 'Success') => ({
    status: statusCode,
    data: data,
    message: message,
    timestamp: new Date().toISOString()
  })
}
const successResponse = createApiResponse(200);
const errorResponse = createApiResponse(500);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

app.get('/api/users', async (req, res) => {
  try {
    await delay(500);
    const { filter, role } = req.query;
    const filteredUsers = [...bugUserGlobal.users]

    if (filter === 'active') {
      filteredUsers = filteredUsers.filter(user => user.active)
    }
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }

    res.json(successResponse(filteredUsers));
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message))
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    await delay(300)
    const user = bugUserGlobal.users.find(user => user.id === parseInt(id))

    if (!user) {
      return res.status(404).json(errorResponse(null, 'User not found'))
    }

    const userWithBugs = {
      ...user,
      bugs: bugUserGlobal.bugs.filter(bug => bug.userId === user.id)
    }

    res.json(successResponse(userWithBugs))
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message))
  }
});

app.get('/api/bugs', async (req, res) => {
  try {
    const { category, minLikes } = req.query;
    let filteredBugs = [...bugUserGlobal.bugs]

    if (category) {
      filteredBugs = filteredBugs.filter(bug => bug.category === category)
    }
    if (minLikes) {
      filteredBugs = filteredBugs.filter(bug => bug.likes >= parseInt(minLikes))
    }

    const maxLike = 50;
    const resultPostBug = filteredBugs.filter(b => b.likes > maxLike).map(p => p.id);

    const bugWithUser = filteredBugs.map(bug => {
      const user = bugUserGlobal.users.find(u => u.id === bug.userId);

      return {
        ...bug,
        author: user ? user.name : 'Unknown',
        status: resultPostBug.includes(bug.id) ? 'Terpopuler' : undefined, // atau bisa juga ''
        isPopular: resultPostBug.includes(bug.id)
      }
    });

    res.json(successResponse(bugWithUser))
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message))
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});

