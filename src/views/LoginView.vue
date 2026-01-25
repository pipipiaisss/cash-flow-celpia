<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Welcome Back</h1>
        <p>Login to manage your finances</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <i class="fas fa-user"></i>
          <input type="text" v-model="identifier" placeholder="Username or Email" required>
        </div>
        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" v-model="password" placeholder="Password" required>
        </div>
        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">Login</span>
          <span v-else>Loading...</span>
          <i class="fas fa-arrow-right"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const identifier = ref('');
const password = ref('');
const error = ref(null);
const isLoading = ref(false);

const router = useRouter();
const { login } = useAuth();

const handleLogin = async () => {
  isLoading.value = true;
  error.value = null;
  const success = await login(identifier.value, password.value);
  isLoading.value = false;
  if (success) {
    router.push('/');
  } else {
    error.value = 'Invalid identifier or password. Please try again.';
    setTimeout(() => {
      error.value = null;
    }, 3000);
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
  animation: background-glow 10s infinite alternate;
}

@keyframes background-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.login-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 420px;
  text-align: center;
  z-index: 1;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: auto;
  margin-bottom: 20px;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.login-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
}

.login-header p {
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.3s;
  z-index: 1;
}

.input-group input {
  box-sizing: border-box;
  width: 100%;
  padding: 15px 15px 15px 45px;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  transition: background 0.3s, box-shadow 0.3s;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-group input:focus {
  outline: none;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
}

.input-group input:focus ~ i {
  color: #fff;
}

.error-message {
  background: rgba(255, 82, 82, 0.8);
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.login-button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.login-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-button:hover {
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
  transform: translateY(-2px);
}

.login-button span {
  margin-right: 10px;
  transition: all 0.3s;
}

.login-button i {
  transition: all 0.3s;
}

.login-button:hover span {
  letter-spacing: 1px;
}

.login-button:hover i {
  transform: translateX(5px);
}

.login-footer {
  margin-top: 30px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.login-footer a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.login-footer a:hover {
  color: #764ba2;
}
</style>
