<template>
  <div class="transaction-list-container">
    <h3>Transaction History</h3>
    <ul class="transaction-list">
      <li v-for="transaction in paginatedTransactions" :key="transaction.id" class="transaction-item">
        <div class="transaction-content">
            <div class="main-info">
              <div class="name-description">
                <span class="name">{{ transaction.name }}</span>
                <span v-if="transaction.description" class="description">{{ transaction.description }}</span>
              </div>
              <div class="realization-info">
                <div :class="['amount', transaction.type === 'cash-in' ? 'income' : 'outcome']">
                  {{ formatCurrency(transaction.realizationAmount || 0) }}
                </div>
                <div v-if="calculateRemaining(transaction) !== 0" class="remaining" :class="getRemainingClass(transaction)">
                  {{ formatRemaining(calculateRemaining(transaction)) }}
                </div>
              </div>
            </div>
            <div class="sub-info">
              <div class="info-group">
                <span class="label">Planned:</span>
                <span class="value">{{ formatCurrency(transaction.plannedAmount) }}</span>
                <span class="separator">|</span>
                <span class="date">{{ formatDate(transaction.plannedDate) }}</span>
              </div>
              <div class="info-group">
                <span class="label">Realized:</span>
                <span class="date">{{ formatDate(transaction.realizationDate) }}</span>
              </div>
            </div>
        </div>
        <div class="actions">
            <button @click="emitDelete(transaction.id)" class="delete-btn" title="Delete transaction" :disabled="isLoading">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        </div>
      </li>
    </ul>
    <div v-if="transactions.length === 0" class="no-transactions">
      <p>No transactions found for the selected period.</p>
    </div>
    <PaginationControls
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PaginationControls from './PaginationControls.vue';

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  },
  isLoading: {
      type: Boolean,
      default: false
  }
});

const emit = defineEmits(['delete-transaction', 'page-changed']);

const emitDelete = (id) => {
    emit('delete-transaction', id);
}

const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => {
  return Math.ceil(props.transactions.length / itemsPerPage);
});

const paginatedTransactions = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return props.transactions.slice(startIndex, endIndex);
});

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

const formatRemaining = (value) => {
    if (value === null || value === undefined) return '-';
    const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(value));
    if (value > 0) {
        return `+${formatted}`;
    }
    return `-${formatted}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'Pending';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const calculateRemaining = (transaction) => {
  const realization = transaction.realizationAmount || 0;
  const planned = transaction.plannedAmount || 0;
  if (transaction.type === 'cash-in') {
    return realization - planned;
  } else { 
    return planned - realization;
  }
};

const getRemainingClass = (transaction) => {
  const remaining = calculateRemaining(transaction);
  if (remaining > 0) return 'surplus';
  if (remaining < 0) return 'deficit';
  return 'neutral';
};
</script>

<style scoped>
.transaction-list-container {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--white-color);
  font-weight: 600;
}

.transaction-list {
  list-style: none;
  padding: 0;
  margin: 0;
  min-height: 300px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.transaction-content {
    flex-grow: 1;
}

.actions {
    margin-left: 20px;
}

.delete-btn {
    background: none;
    border: 1px solid transparent;
    border-radius: 50%;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-light);
    transition: all 0.2s ease-in-out;
}

.delete-btn:hover {
    background-color: rgba(255, 121, 198, 0.2);
    color: #ff79c6;
}

.delete-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.transaction-item:last-child {
  border-bottom: none;
}

.main-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.name-description {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--white-color);
}

.description {
  font-size: 0.9rem;
  color: var(--text-color-light);
  margin-top: 2px;
}

.realization-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  white-space: nowrap;
  margin-left: 20px;
}

.amount {
  font-weight: 700;
  font-size: 1.1rem;
}

.amount.income {
  color: #31e89f;
}

.amount.outcome {
  color: #ff79c6;
}

.remaining {
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 2px;
}

.remaining.surplus {
  color: #31e89f;
}

.remaining.deficit {
  color: #ff79c6;
}

.remaining.neutral {
  color: var(--text-color-light);
}

.sub-info {
  margin-top: 8px;
  font-size: 0.9rem;
  color: var(--text-color-light);
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 8px;
  flex-wrap: wrap;
}

.info-group {
  display: flex;
  gap: 6px;
  align-items: center;
}

.info-group .label {
  font-weight: 500;
  font-size: 0.85rem;
  color: var(--text-color-light);
}

.info-group .value {
  font-weight: 500;
}

.info-group .separator {
  color: rgba(255, 255, 255, 0.2);
}

.no-transactions {
  text-align: center;
  padding: 40px;
  color: var(--text-color-light);
}
</style>
