import { User, Product } from '../types';

// Keys for LocalStorage
const USERS_KEY = 'daraz_app_users';
const PRODUCTS_KEY = 'daraz_app_products';
const SESSION_KEY = 'daraz_app_session';

// Helper to delay execution to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const StorageService = {
  // --- Auth & Users ---
  
  async signup(user: Omit<User, 'id'>): Promise<User> {
    await delay(500);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find(u => u.email === user.email)) {
      throw new Error('User already exists');
    }

    const newUser: User = { ...user, id: crypto.randomUUID() };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  async login(email: string, password: string): Promise<User> {
    await delay(500);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Set session
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  },

  async updateUser(user: User): Promise<User> {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      // Update session if it's the current user
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === user.id) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
    }
    return user;
  },

  // --- Products ---

  async getProducts(userId: string): Promise<Product[]> {
    await delay(300);
    const allProducts: Product[] = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    return allProducts.filter(p => p.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getProduct(id: string): Promise<Product | undefined> {
    await delay(100);
    const allProducts: Product[] = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    return allProducts.find(p => p.id === id);
  },

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    await delay(400);
    const allProducts: Product[] = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    allProducts.push(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await delay(400);
    const allProducts: Product[] = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const index = allProducts.findIndex(p => p.id === id);
    
    if (index === -1) throw new Error('Product not found');
    
    const updatedProduct = {
      ...allProducts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    allProducts[index] = updatedProduct;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    await delay(300);
    let allProducts: Product[] = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    allProducts = allProducts.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
  }
};