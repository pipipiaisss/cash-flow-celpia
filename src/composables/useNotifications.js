import { ref, readonly } from 'vue';

const isVisible = ref(false);
const message = ref('');
const type = ref('success'); // 'success' or 'error'

let timeoutId = null;

export function useNotifications() {
  const showNotification = (newMessage, newType = 'success', duration = 3000) => {
    message.value = newMessage;
    type.value = newType;
    isVisible.value = true;

    // Clear any existing timeout to prevent premature closing
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Automatically hide after 'duration'
    timeoutId = setTimeout(() => {
      isVisible.value = false;
      timeoutId = null;
    }, duration);
  };

  const hideNotification = () => {
    isVisible.value = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return {
    isVisible: readonly(isVisible),
    message: readonly(message),
    type: readonly(type),
    showNotification,
    hideNotification,
  };
}
