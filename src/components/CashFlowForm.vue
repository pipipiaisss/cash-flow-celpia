<template>
  <form @submit.prevent="handleSubmit">
    <h3>Add New Transaction</h3>

    <!-- Status messages passed via props -->
    <div v-if="isSubmitting" class="status-message loading-message">Submitting transaction...</div>
    <div v-if="submitError" class="status-message error-message">Error: {{ submitError }}</div>
    <div v-if="submitSuccess" class="status-message success-message">Transaction added successfully!</div>

    <div class="form-grid">
      <div class="form-group">
        <label>Name</label>
        <input type="text" v-model="newTransaction.name" placeholder="e.g., Salary" required :disabled="isSubmitting" />
      </div>
      <div class="form-group">
        <label>Type</label>
        <select v-model="newTransaction.type" :disabled="isSubmitting">
          <option value="cash-out">Cash Out</option>
          <option value="cash-in">Cash In</option>
        </select>
      </div>
      <div class="form-group">
        <label>Planned Amount</label>
        <input type="text" :value="formattedPlannedAmount" @input="updatePlannedAmount" placeholder="Rp 1.000.000" required :disabled="isSubmitting" />
      </div>
      <div class="form-group">
        <label>Planned Date</label>
        <input type="date" v-model="newTransaction.plannedDate" required :disabled="isSubmitting" />
      </div>
      <div class="form-group">
        <label>Realization Amount</label>
        <input type="text" :value="formattedRealizationAmount" @input="updateRealizationAmount" placeholder="Rp 1.000.000" :disabled="isSubmitting" />
      </div>
      <div class="form-group">
        <label>Realization Date</label>
        <input type="date" v-model="newTransaction.realizationDate" :disabled="isSubmitting" />
      </div>
      <div class="form-group full-width">
        <label>Description</label>
        <textarea v-model="newTransaction.description" placeholder="Monthly salary" :disabled="isSubmitting"></textarea>
      </div>
      <div class="form-group full-width">
        <label class="checkbox-label">
          <input type="checkbox" v-model="newTransaction.confirmed" :disabled="isSubmitting" />
          <span>Confirmed</span>
        </label>
      </div>
    </div>
    <button type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Submitting...' : 'Add Transaction' }}</button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCurrencyFormatter } from '../composables/useCurrencyFormatter';

const props = defineProps({
  isSubmitting: Boolean,
  submitError: String,
  submitSuccess: Boolean,
});

const emit = defineEmits(['add-transaction']);

const { 
  amount: plannedAmount, 
  formattedAmount: formattedPlannedAmount, 
  updateAmount: updatePlannedAmount,
  setAmount: setPlannedAmount,
  reset: resetPlannedAmount
} = useCurrencyFormatter();

const { 
  amount: realizationAmount, 
  formattedAmount: formattedRealizationAmount, 
  updateAmount: updateRealizationAmount,
  setAmount: setRealizationAmount,
  reset: resetRealizationAmount
} = useCurrencyFormatter();

// Form data
const newTransaction = ref({
  plannedDate: '',
  realizationDate: '',
  name: '',
  type: 'cash-out',
  description: '',
  confirmed: false,
});

// SINKRONISASI LOGIC
watch(plannedAmount, (newValue) => {
  setRealizationAmount(newValue);
});

watch(() => newTransaction.value.plannedDate, (newDate) => {
  if (newDate) {
    newTransaction.value.realizationDate = newDate;
  }
});

// OTOMATISASI CHECKBOX 'CONFIRMED'
watch(
  [
    () => newTransaction.value.name,
    () => newTransaction.value.type,
    plannedAmount,
    () => newTransaction.value.plannedDate,
    realizationAmount,
    () => newTransaction.value.realizationDate,
  ],
  (values) => {
    const allFilled = values.every((val) => {
      if (typeof val === 'number') {
        return val > 0;
      }
      return val !== '' && val !== null && val !== undefined;
    });
    newTransaction.value.confirmed = allFilled;
  },
  { deep: true }
);

// FUNGSI FORM
const resetForm = () => {
  newTransaction.value = {
    plannedDate: '',
    realizationDate: '',
    name: '',
    type: 'cash-out',
    description: '',
    confirmed: false,
  };
  resetPlannedAmount();
  resetRealizationAmount();
};

const handleSubmit = () => {
  if (props.isSubmitting) return;
  
  emit('add-transaction', {
    ...newTransaction.value,
    plannedAmount: plannedAmount.value,
    realizationAmount: realizationAmount.value > 0 ? realizationAmount.value : null,
  });
};

// Reset form setelah berhasil submit
watch(() => props.submitSuccess, (newVal) => {
  if (newVal) {
    resetForm();
  }
});

</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.full-width {
  grid-column: 1 / -1;
}
label {
  font-weight: 500;
  color: #374151;
}
textarea {
  min-height: 80px;
  resize: vertical;
}
button {
  align-self: flex-end;
  width: auto;
  padding: 12px 20px;
  transition: background-color 0.3s, opacity 0.3s;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.checkbox-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.status-message {
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 500;
}

.loading-message {
  background-color: #e0f2fe; /* blue-100 */
  color: #0c4a6e; /* blue-800 */
}

.error-message {
  background-color: #fee2e2; /* red-100 */
  color: #991b1b; /* red-800 */
}

.success-message {
  background-color: #dcfce7; /* green-100 */
  color: #166534; /* green-800 */
}
</style>
