<template>
  <input
    ref="inputRef"
    type="text"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
    class="form-input"
    placeholder="Rp0"
  />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0,
  },
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);

// Always store and work with the raw numeric value internally
const numericValue = ref(0);

// Helper to parse any incoming value (string, number, formatted string) to a pure number
function parseToNumber(val) {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  // Remove all non-digit characters, then parse
  const digits = String(val).replace(/[^0-9]/g, '');
  return parseInt(digits, 10) || 0;
}

// Helper to format a number into IDR currency string
function formatToCurrency(num) {
  if (num === null || num === undefined) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// When the parent component changes the modelValue, update our internal numeric value
watch(() => props.modelValue, (newValue) => {
  const newNumericValue = parseToNumber(newValue);
  if (numericValue.value !== newNumericValue) {
      numericValue.value = newNumericValue;
  }
  // Also update the displayed value if not in focus
  if (inputRef.value && document.activeElement !== inputRef.value) {
      inputRef.value.value = formatToCurrency(newNumericValue);
  }
}, { immediate: true });


const onInput = (event) => {
  // When user types, update the internal numeric value and emit it to the parent
  const newNumericValue = parseToNumber(event.target.value);
  numericValue.value = newNumericValue;
  emit('update:modelValue', newNumericValue);
};

const onFocus = (event) => {
  // When user clicks into the input, show the raw number for easy editing
  event.target.value = numericValue.value ? numericValue.value.toString() : '';
};

const onBlur = (event) => {
  // When user clicks away, display the formatted currency value
  event.target.value = formatToCurrency(numericValue.value);
};

// Set the initial formatted value when the component is first mounted
onMounted(() => {
    if (inputRef.value) {
        numericValue.value = parseToNumber(props.modelValue);
        inputRef.value.value = formatToCurrency(numericValue.value);
    }
});

</script>

<style scoped>
.form-input {
    text-align: right;
}
</style>
