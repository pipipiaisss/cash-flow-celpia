<template>
  <div class="input-container">
    <CashFlowForm 
      @add-transaction="handleTransactionSubmit" 
      :is-submitting="isSubmitting"
      :submit-error="submitError"
      :submit-success="submitSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CashFlowForm from '../components/CashFlowForm.vue';
import { useApi } from '../composables/useApi';

const emit = defineEmits(['transaction-added']);

const { addTransaction } = useApi();
const isSubmitting = ref(false);
const submitError = ref(null);
const submitSuccess = ref(false);

const handleTransactionSubmit = async (transactionData) => {
  isSubmitting.value = true;
  submitError.value = null;
  submitSuccess.value = false;

  try {
    await addTransaction(transactionData);
    submitSuccess.value = true;
    emit('transaction-added'); // Notify parent (App.vue)
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      submitSuccess.value = false;
    }, 3000);

  } catch (error) {
    console.error("Error submitting transaction:", error);
    submitError.value = error.message || 'Failed to add transaction. Please try again.';
    
    // Hide error message after 5 seconds
    setTimeout(() => {
      submitError.value = null;
    }, 5000);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.input-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--white-color);
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
