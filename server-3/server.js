import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Data dummy dengan berbagai scope (global scope)
const globalData = {
  users: [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'admin', active: true },
    { id: 2, name: 'Sarah Chen', email: 'sarah@example.com', role: 'user', active: true },
    { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'user', active: false },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'editor', active: true },
    { id: 5, name: 'James Brown', email: 'james@example.com', role: 'user', active: true }
  ],
  posts: [
    { id: 1, userId: 1, title: 'Getting Started with React', likes: 45, category: 'food' },
    { id: 2, userId: 2, title: 'Modern JavaScript Features', likes: 32, category: 'food' },
    { id: 3, userId: 1, title: 'Travel Tips 2024', likes: 78, category: 'food' },
    { id: 4, userId: 3, title: 'Healthy Recipes', likes: 23, category: 'food' },
    { id: 5, userId: 4, title: 'Photography Basics', likes: 56, category: 'food' },
    { id: 6, userId: 2, title: 'Meditation Guide', likes: 41, category: 'food' }
  ]
};

// Closure example: function factory
const createApiResponse = (statusCode) => {
  // statusCode adalah closure variable
  return (data, message = 'Success') => ({
    status: statusCode,
    data: data,
    message: message,
    timestamp: new Date().toISOString()
  });
};

const successResponse = createApiResponse(200);
const errorResponse = createApiResponse(500);

// API Routes dengan async/await dan error handling
app.get('/api/users', async (req, res) => {
  try {
    // Simulasi async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Destructuring query params
    const { filter, role } = req.query;
    let filteredUsers = [...globalData.users];
    
    // Menggunakan filter method
    if (filter === 'active') {
      filteredUsers = filteredUsers.filter(user => user.active);
    }
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    res.json(successResponse(filteredUsers));
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message));
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Menggunakan find method
    const user = globalData.users.find(user => user.id === parseInt(id));
    
    if (!user) {
      return res.status(404).json(errorResponse(null, 'User not found'));
    }
    
    // Spread operator untuk menambah properti
    const userWithPosts = {
      ...user,
      posts: globalData.posts.filter(post => post.userId === user.id)
    };
    
    res.json(successResponse(userWithPosts));
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message));
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const { category, minLikes } = req.query;
    let filteredPosts = [...globalData.posts];
    
    // Multiple array methods
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    if (minLikes) {
      filteredPosts = filteredPosts.filter(post => post.likes >= parseInt(minLikes));
    }
    
    // Menggunakan map untuk transform data
    const postsWithUser = filteredPosts.map(post => {
      const user = globalData.users.find(u => u.id === post.userId);
      return {
        ...post,
        author: user ? user.name : 'Unknown',
        // Menggunakan includes untuk cek kategori populer
        isPopular: [45, 56, 78].includes(post.likes)
      };
    });
    
    res.json(successResponse(postsWithUser));
  } catch (error) {
    res.status(500).json(errorResponse(null, error.message));
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});