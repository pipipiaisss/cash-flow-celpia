import { ref } from 'vue';
import axios from 'axios';
import { useNotification } from './useNotification';

const API_URL = 'https://cash-flow-celpia-be.vercel.app/cashflows';

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

const formatDateToYYYYMMDD = (date) => {
  if (!date) return null;
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return null;
  }
};

const transformToFrontend = (data) => {
  if (!data) return {};
  const frontendData = {};
  for (const key in data) {
    const frontendKey = backendToFrontendMapping[key] || key;
    let value = data[key];
    if (frontendKey === 'type') {
      value = value === 'cashin' ? 'cash-in' : 'cash-out';
    } else if (frontendKey === 'confirmed') {
      value = value === 'sudah dikonfirmasi';
    }
    frontendData[frontendKey] = value;
  }
  return frontendData;
};

const parseCurrency = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const numericString = String(value).replace(/[^\d]/g, '');
  return parseInt(numericString, 10) || 0;
};

const transformToBackend = (data) => {
  return {
    type: data.type === 'cash-in' ? 'cashin' : 'cashout',
    nama_cash_flow: data.name,
    keterangan: data.description,
    status: data.confirmed ? 'sudah dikonfirmasi' : 'belum',
    nominal_perencanaan: parseCurrency(data.plannedAmount),
    nominal_realisasi: parseCurrency(data.realizationAmount),
    tanggal_perencanaan: formatDateToYYYYMMDD(data.plannedDate),
    tanggal_realisasi: formatDateToYYYYMMDD(data.realizationDate),
  };
};

export function useApi() {
  const transactions = ref([]);
  const error = ref(null);
  const isLoading = ref(false);
  const { showNotification } = useNotification();

  const fetchTransactions = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(API_URL);
      transactions.value = response.data.map(transformToFrontend);
    } catch (e) {
      error.value = 'Failed to fetch transactions.';
      showNotification('Failed to load data from server.', 'error');
    } finally {
      isLoading.value = false;
    }
  };

  const addTransaction = async (transactionData) => {
    const backendData = transformToBackend(transactionData);
    try {
      await axios.post(API_URL, backendData);
      await fetchTransactions();
      showNotification('Transaction added successfully!', 'success');
    } catch (error) {
      console.error('Backend Add Error:', error.response?.data);
      showNotification('Failed to add transaction.', 'error');
      throw error;
    }
  };

  const updateTransaction = async (id, transactionData) => {
    const backendData = transformToBackend(transactionData);
    try {
      await axios.put(`${API_URL}/${id}`, backendData);
      await fetchTransactions();
      showNotification('Data berhasil diupdate!', 'success');
    } catch (error) {
      console.error('--- FAILED UPDATE REQUEST ---');
      console.error('ID:', id);
      console.error('Data Sent:', JSON.stringify(backendData, null, 2));
      console.error('Backend Error Response:', error.response?.data);
      showNotification('Failed to update transaction.', 'error');
      throw new Error('Failed to update transaction. Please try again.');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      transactions.value = transactions.value.filter(t => t.id !== id);
      showNotification('Data berhasil dihapus!', 'success');
    } catch (error) {
      console.error(`Failed to delete transaction ${id}:`, error);
      showNotification('Failed to delete transaction.', 'error');
      throw error;
    }
  };

  return { transactions, error, isLoading, fetchTransactions, addTransaction, updateTransaction, deleteTransaction };
}
