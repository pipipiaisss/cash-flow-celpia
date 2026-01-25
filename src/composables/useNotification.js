import { ref, readonly } from 'vue';

// State is internal to the module
const _isVisible = ref(false);
const _message = ref('');
const _type = ref('success'); // 'success' or 'error'

let _timeoutId = null;

export function useNotification() {

  const showNotification = (newMessage, newType = 'success', duration = 3000) => {
    _message.value = newMessage;
    _type.value = newType;
    _isVisible.value = true;

    // Clear any existing timeout to reset the timer
    if (_timeoutId) {
      clearTimeout(_timeoutId);
    }

    // Set a timeout to hide the notification
    _timeoutId = setTimeout(() => {
      _isVisible.value = false;
    }, duration);
  };

  // Expose state as readonly to prevent external modification
  return {
    isVisible: readonly(_isVisible),
    message: readonly(_message),
    type: readonly(_type),
    showNotification,
  };
}
