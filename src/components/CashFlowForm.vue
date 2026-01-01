<template>
  <form @submit.prevent="handleSubmit">
    <h3>Add New Transaction</h3>

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
      <div class="form-group checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="newTransaction.confirmed" :disabled="isSubmitting" />
          <span class="checkbox-custom"></span>
          <span>Confirmed</span>
        </label>
      </div>
    </div>
    <div class="status-messages">
        <transition name="fade">
            <div v-if="isSubmitting" class="status-message loading-message">Submitting transaction...</div>
        </transition>
        <transition name="fade">
            <div v-if="submitError" class="status-message error-message">Error: {{ submitError }}</div>
        </transition>
        <transition name="fade">
            <div v-if="submitSuccess" class="status-message success-message">Transaction added successfully!</div>
        </transition>
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
  background-color: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 25px;
}

h3 {
  text-align: center;
  color: var(--white-color);
  margin-bottom: 0;
  font-weight: 600;
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.full-width {
  grid-column: 1 / -1;
}

label {
  font-weight: 500;
  color: var(--text-color-light);
}

input[type="text"],
input[type="date"],
select,
textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 1rem;
  color: var(--text-color-light);
  transition: all 0.2s ease;
}

input::placeholder, textarea::placeholder {
    color: rgba(224, 224, 224, 0.5);
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.4);
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.checkbox-group {
  grid-column: 1 / -1;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: var(--text-color-light);
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-custom::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid var(--background-dark);
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  opacity: 1;
}

button {
  align-self: flex-end;
  width: auto;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  background-color: var(--primary-color);
  color: var(--background-dark);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
}

button:hover:not(:disabled) {
  box-shadow: 0 0 25px rgba(0, 242, 254, 0.7);
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.status-messages {
    min-height: 24px; /* Reserve space */
    text-align: center;
}

.status-message {
  padding: 10px;
  border-radius: 6px;
  margin-top: 10px;
  font-weight: 500;
  font-size: 0.95rem;
}

.loading-message {
  background-color: rgba(0, 242, 254, 0.1);
  color: var(--primary-color);
}

.error-message {
  background-color: rgba(255, 121, 198, 0.1);
  color: var(--secondary-color);
}

.success-message {
  background-color: rgba(49, 232, 159, 0.1);
  color: #31e89f;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  button {
    width: 100%;
  }
}
</style>
