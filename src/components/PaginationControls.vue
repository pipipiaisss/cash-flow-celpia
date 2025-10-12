<template>
  <div class="pagination-controls">
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">
      &laquo; Previous
    </button>
    <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-button">
      Next &raquo;
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['page-changed']);

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= props.totalPages) {
    emit('page-changed', newPage);
  }
};
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  gap: 15px;
}

.pagination-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: var(--primary-dark-color);
}

.pagination-button:disabled {
  background-color: #d1d5db; /* gray-300 */
  cursor: not-allowed;
  opacity: 0.7;
}

.page-info {
  color: #4b5563; /* gray-600 */
  font-weight: 500;
  font-size: 0.95rem;
}
</style>
