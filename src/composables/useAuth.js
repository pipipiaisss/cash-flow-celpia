import { ref } from 'vue';

const isAuthenticated = ref(!!localStorage.getItem('isAuthenticated'));

export function useAuth() {
  const login = (username, password) => {
    if (username === 'celpia' && password === 'celpiacantik') {
      isAuthenticated.value = true;
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    isAuthenticated.value = false;
    localStorage.removeItem('isAuthenticated');
  };

  return { isAuthenticated, login, logout };
}
