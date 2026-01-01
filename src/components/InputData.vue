<script setup>
import { ref } from 'vue';
import { useApi } from '../composables/useApi';

const { addTransaction } = useApi();

const form = ref({
  name: '',
  type: 'cash-out',
  plannedAmount: null,
  plannedDate: ''
});

const handleSubmit = async () => {
  if (!form.value.name || !form.value.type || !form.value.plannedAmount || !form.value.plannedDate) {
    alert('Please fill out all required fields.');
    return;
  }
  try {
    await addTransaction(form.value);
    alert('Transaction added successfully!');
    // Reset form
    form.value = {
      name: '',
      type: 'cash-out',
      plannedAmount: null,
      plannedDate: ''
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    alert('Failed to add transaction. Please try again.');
  }
};
</script>

<template>
  <div class="input-container">
    <h2>Add New Transaction</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="form.name" required placeholder="e.g., Salary" />
      </div>
      <div class="form-group">
        <label for="type">Type</label>
        <select id="type" v-model="form.type" required>
          <option value="cash-out">Cash Out</option>
          <option value="cash-in">Cash In</option>
        </select>
      </div>
      <div class="form-group">
        <label for="plannedAmount">Planned Amount</label>
        <input type="number" id="plannedAmount" v-model.number="form.plannedAmount" required placeholder="Rp 1.000.000" />
      </div>
      <div class="form-group">
        <label for="plannedDate">Planned Date</label>
        <input type="date" id="plannedDate" v-model="form.plannedDate" required />
      </div>
      <button type="submit" class="submit-button">Add Transaction</button>
    </form>
  </div>
</template>

<style scoped>
.input-container {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

h2 {
  text-align: center;
  color: var(--white-color);
  margin-bottom: 25px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color-light);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 1rem;
  color: var(--text-color-light);
}

.form-group input::placeholder {
    color: rgba(224, 224, 224, 0.5);
}

.submit-button {
  width: 100%;
  padding: 12px;
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

.submit-button:hover {
  background-color: #00f2fe;
  box-shadow: 0 0 25px rgba(0, 242, 254, 0.7);
  transform: translateY(-2px);
}
</style>
