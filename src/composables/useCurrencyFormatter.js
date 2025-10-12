import { ref } from 'vue';

export function useCurrencyFormatter(initialValue = null) {
  const amount = ref(initialValue);

  const format = (value) => {
    if (value === null || value === undefined) return '';
    let numberValue = String(value).replace(/[^\d]/g, '');
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue || 0);
  };

  const formattedAmount = ref(format(amount.value));

  const updateAmount = (event) => {
    const rawValue = event.target.value.replace(/[^\d]/g, '');
    const numberValue = rawValue ? parseInt(rawValue, 10) : null;
    amount.value = numberValue;
    formattedAmount.value = format(numberValue);
  };

  return {
    amount,
    formattedAmount,
    updateAmount,
  };
}
