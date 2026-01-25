<template>
  <div class="transaction-list-container">
    <h3>Transaction History</h3>
    <ul class="transaction-list">
      <li v-for="transaction in paginatedTransactions" :key="transaction.id" class="transaction-item">
        
        <!-- EDITING VIEW -->
        <div v-if="editingTransactionId === transaction.id" class="transaction-edit-form">
          <form @submit.prevent="saveChanges">
              <div class="form-field area-name">
                  <label for="edit-name">Transaction Name</label>
                  <div class="input-wrapper">
                      <span class="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </span>
                      <input type="text" id="edit-name" class="form-input" v-model="editedTransaction.name" placeholder="e.g., Monthly Salary">
                  </div>
              </div>
              <div class="form-field area-type">
                  <label for="edit-type">Transaction Type</label>
                  <div class="input-wrapper">
                      <span class="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>
                      </span>
                      <select id="edit-type" class="form-select" v-model="editedTransaction.type">
                          <option value="cash-in">Cash In</option>
                          <option value="cash-out">Cash Out</option>
                      </select>
                  </div>
              </div>
          
              <div class="form-field area-description">
                  <label for="edit-description">Description</label>
                  <div class="input-wrapper">
                      <span class="icon">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                      </span>
                      <textarea id="edit-description" class="form-textarea" v-model="editedTransaction.description" placeholder="e.g., From company X"></textarea>
                  </div>
              </div>

              <div class="form-field area-planned-amount">
                  <label for="edit-planned-amount">Planned Amount</label>
                  <div class="input-wrapper">
                      <span class="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>
                      </span>
                      <CurrencyInput id="edit-planned-amount" v-model="editedTransaction.plannedAmount" />
                  </div>
              </div>
              <div class="form-field area-planned-date">
                  <label for="edit-planned-date">Planned Date</label>
                  <div class="input-wrapper">
                      <span class="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>
                      </span>
                      <input type="date" id="edit-planned-date" class="form-input" v-model="editedTransaction.plannedDate">
                  </div>
              </div>

              <div class="form-field area-realization-amount">
                  <label for="edit-realization-amount">Realization Amount</label>
                  <div class="input-wrapper">
                      <span class="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>
                      </span>
                      <CurrencyInput id="edit-realization-amount" v-model="editedTransaction.realizationAmount" />
                  </div>
              </div>
              <div class="form-field area-realization-date">
                  <label for="edit-realization-date">Realization Date</label>
                  <div class="input-wrapper">
                      <span class="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>
                      </span>
                      <input type="date" id="edit-realization-date" class="form-input" v-model="editedTransaction.realizationDate">
                  </div>
              </div>

              <div class="area-confirmed form-field-checkbox">
                  <input type="checkbox" id="edit-confirmed" v-model="editedTransaction.confirmed">
                  <label for="edit-confirmed">Confirmed Transaction</label>
              </div>
              <div class="area-actions form-actions">
                  <button type="button" @click="cancelEditing" class="cancel-btn">Cancel</button>
                  <button type="submit" class="save-btn">
                      <span>Save Changes</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </button>
              </div>
          </form>
        </div>

        <!-- REGULAR VIEW -->
        <template v-else>
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
                <button @click="startEditing(transaction)" class="edit-btn" title="Edit transaction">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button @click="emitDelete(transaction.id)" class="delete-btn" title="Delete transaction" :disabled="isLoading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        </template>
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
import CurrencyInput from './CurrencyInput.vue';

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

const emit = defineEmits(['delete-transaction', 'update-transaction', 'page-changed']);

const editingTransactionId = ref(null);
const editedTransaction = ref(null);

const startEditing = (transaction) => {
  editingTransactionId.value = transaction.id;
  editedTransaction.value = {
      ...transaction,
      plannedDate: transaction.plannedDate ? new Date(transaction.plannedDate).toISOString().split('T')[0] : '',
      realizationDate: transaction.realizationDate ? new Date(transaction.realizationDate).toISOString().split('T')[0] : ''
  };
};

const cancelEditing = () => {
  editingTransactionId.value = null;
  editedTransaction.value = null;
};

const saveChanges = () => {
  if (!editedTransaction.value) return;
  emit('update-transaction', editedTransaction.value.id, editedTransaction.value);
  cancelEditing();
};

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
  background-color: rgba(255, 255, 255, 0.7);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(236, 72, 153, 0.2);
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--primary-color);
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
    color: var(--primary-color);
    transition: all 0.2s ease-in-out;
}

.delete-btn:hover {
    background-color: rgba(236, 72, 153, 0.1);
    color: var(--primary-color);
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
  color: var(--text-color-dark);
}

.description {
  font-size: 0.9rem;
  color: #6B7280;
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
  color: #059669;
}

.amount.outcome {
  color: var(--primary-color);
}

.remaining {
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 2px;
}

.remaining.surplus {
  color: #059669;
}

.remaining.deficit {
  color: var(--primary-color);
}

.remaining.neutral {
  color: var(--text-color-dark);
}

.sub-info {
  margin-top: 8px;
  font-size: 0.9rem;
  color: var(--text-color-dark);
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
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
  color: #6B7280;
}

.info-group .value {
  font-weight: 500;
}

.info-group .separator {
  color: rgba(0, 0, 0, 0.2);
}

.no-transactions {
  text-align: center;
  padding: 40px;
  color: var(--text-color-dark);
}
</style>
