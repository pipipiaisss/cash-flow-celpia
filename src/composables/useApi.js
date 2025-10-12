import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'https://cash-flow-rouge.vercel.app/cashflows';

const backendToFrontendMapping = {
  '_id': 'id',
  'tanggal_perencanaan': 'plannedDate',
  'tanggal_realisasi': 'realizationDate',
  'nama_cash_flow': 'name',
  'type': 'type',
  'keterangan': 'description',
  'status': 'confirmed',
  'nominal_perencanaan': 'plannedAmount',
  'nominal_realisasi': 'realizationAmount',
};

const transformToFrontend = (data) => {
  const frontendData = {};
  for (const key in data) {
    if (backendToFrontendMapping[key]) {
      const frontendKey = backendToFrontendMapping[key];
      let value = data[key];
      if (frontendKey === 'type') {
        value = value === 'cashin' ? 'cash-in' : 'cash-out';
      } else if (frontendKey === 'confirmed') {
        value = value === 'sudah dikonfirmasi';
      }
      frontendData[frontendKey] = value;
    }
  }
  return frontendData;
};

const transformToBackend = (data) => {
  return {
    tanggal_perencanaan: data.plannedDate,
    nama_cash_flow: data.name,
    type: data.type === 'cash-in' ? 'cashin' : 'cashout',
    keterangan: data.description,
    status: data.confirmed ? 'sudah dikonfirmasi' : 'belum dikonfirmasi',
    nominal_perencanaan: data.plannedAmount,
    tanggal_realisasi: data.realizationDate || null,
    nominal_realisasi: data.realizationAmount || 0,
  };
};

export function useApi() {
  const transactions = ref([]);
  const error = ref(null);
  const isLoading = ref(false);

  const fetchTransactions = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data)) {
        transactions.value = response.data.map(transformToFrontend);
      } else {
        transactions.value = [];
        console.warn('API response is not an array as expected.', response.data);
      }
    } catch (e) {
      error.value = 'Failed to fetch transactions from the correct API.';
      console.error(e);
      transactions.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const addTransaction = async (transactionData) => {
    const backendData = transformToBackend(transactionData);
    try {
      const response = await axios.post(API_URL, backendData);
      await fetchTransactions();
      return transformToFrontend(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Backend Error Response:', error.response.data);
      }
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // Remove the transaction from the local state immediately
      const index = transactions.value.findIndex(t => t.id === id);
      if (index !== -1) {
        transactions.value.splice(index, 1);
      }
    } catch (error) {
        console.error(`Failed to delete transaction ${id}:`, error);
        // Optionally, re-throw the error to be handled by the component
        throw error;
    }
  };

  return { transactions, error, isLoading, fetchTransactions, addTransaction, deleteTransaction };
}
