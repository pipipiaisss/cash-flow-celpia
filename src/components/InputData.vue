<template>
  <div class="input-container">
    <h2>Input Transaction</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>
      <div class="form-group">
        <label for="type">Type:</label>
        <select id="type" v-model="form.type" required>
          <option value="cash-in">Cash In</option>
          <option value="cash-out">Cash Out</option>
        </select>
      </div>
      <div class="form-group">
        <label for="plannedAmount">Planned Amount:</label>
        <input type="number" id="plannedAmount" v-model.number="form.plannedAmount" required />
      </div>
      <div class="form-group">
        <label for="plannedDate">Planned Date:</label>
        <input type="date" id="plannedDate" v-model="form.plannedDate" required />
      </div>
      <button type="submit" class="submit-button">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  type: 'cash-in',
  plannedAmount: 0,
  plannedDate: ''
});

const handleSubmit = () => {
  console.log('Submitting:', form.value);
  // Here you would typically emit an event or call an API
  alert('Transaction submitted (see console for data)!');
  // Reset form
  form.value = {
    name: '',
    type: 'cash-in',
    plannedAmount: 0,
    plannedDate: ''
  };
};
</script>

<style scoped>
.input-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 600px;
}

h2 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.submit-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: var(--primary-color);
  color: var(--white-color);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #4338ca;
}
</style>
