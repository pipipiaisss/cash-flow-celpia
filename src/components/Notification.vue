<script setup>
import { useNotification } from '../composables/useNotification';

const { isVisible, message, type } = useNotification();

const iconClass = {
  success: 'M9 12.75L11.25 15L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
};
</script>

<template>
  <transition name="slide-fade">
    <div v-if="isVisible" :class="['notification-container', `notification-${type}`]" role="alert">
      <div class="icon-container">
        <svg class="icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" :d="iconClass[type]"></path>
        </svg>
      </div>
      <div class="message-container">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 1.5rem; /* 24px */
  right: 1.5rem; /* 24px */
  z-index: 9999; 
  display: flex;
  align-items: center;
  max-width: 24rem; /* 384px */
  width: 100%;
  padding: 1rem; /* 16px */
  color: white;
  border-radius: 0.5rem; /* 8px */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.notification-success {
  background-color: #48bb78; /* Green */
}

.notification-error {
  background-color: #f56565; /* Red */
}

.icon-container {
  flex-shrink: 0;
}

.icon {
  width: 1.5rem; /* 24px */
  height: 1.5rem; /* 24px */
}

.message-container {
  margin-left: 0.75rem; /* 12px */
  font-size: 0.875rem; /* 14px */
  line-height: 1.25rem; /* 20px */
  font-weight: 500;
}

/* Transition classes */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
