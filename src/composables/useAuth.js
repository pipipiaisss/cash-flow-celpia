import { ref } from 'vue';
import axios from 'axios';

const isAuthenticated = ref(!!localStorage.getItem('token'));
const user = ref(JSON.parse(localStorage.getItem('user')));

export function useAuth() {
  const login = async (identifier, password) => {
    try {
      const response = await axios.post('https://cash-flow-celpia-be.vercel.app/users/login', {
        identifier,
        password,
      });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      isAuthenticated.value = true;
      user.value = userData;
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    isAuthenticated.value = false;
    user.value = null;
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      isAuthenticated.value = true;
      user.value = JSON.parse(localStorage.getItem('user'));
    } else {
      isAuthenticated.value = false;
      user.value = null;
    }
  };

  return { isAuthenticated, user, login, logout, checkAuth };
}
