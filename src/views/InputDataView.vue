<template>
  <div class="input-view-container">
    <header class="view-header">
      <h1>Input Transaksi Baru</h1>
      <p>Tambahkan pemasukan atau pengeluaran ke dalam catatan keuangan Anda.</p>
    </header>
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
import { useTransactions } from '../composables/useTransactions';

const { addTransaction } = useApi();
const { fetchTransactions } = useTransactions();

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
    await fetchTransactions();
    
    setTimeout(() => {
      submitSuccess.value = false;
    }, 3000);

  } catch (error) {
    console.error("Error submitting transaction:", error);
    submitError.value = error.message || 'Failed to add transaction. Please try again.';
    
    setTimeout(() => {
      submitError.value = null;
    }, 5000);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.input-view-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  box-sizing: border-box;
}

.view-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.view-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.view-header p {
  font-size: 1.1rem;
  color: var(--text-color-light);
  margin-top: 0.5rem;
}


@media (max-width: 768px) {
  .input-view-container {
    margin: 1rem auto;
    padding: 1.5rem;
  }

  .view-header h1 {
    font-size: 2rem;
  }
}
</style>
