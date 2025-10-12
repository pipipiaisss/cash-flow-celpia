<script setup>
const props = defineProps({
  transactions: Array,
});

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if date is invalid
    }
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // getUTCMonth() is zero-based
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  } catch (e) {
    return dateString; // In case of error, return the original string
  }
};
</script>

<template>
  <div>
    <h3>Transaction List</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Planned Amount</th>
          <th>Planned Date</th>
          <th>Realization Amount</th>
          <th>Realization Date</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index">
          <td>{{ transaction.name }}</td>
          <td>{{ transaction.type }}</td>
          <td>{{ formatCurrency(transaction.plannedAmount) }}</td>
          <td>{{ formatDate(transaction.plannedDate) }}</td>
          <td>{{ formatCurrency(transaction.realizationAmount) }}</td>
          <td>{{ formatDate(transaction.realizationDate) }}</td>
          <td>{{ transaction.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  margin-top: 0;
}
</style>
