<script setup>
import { ref } from 'vue'
const TimeValue = ref(null)
const selectItems = ref([
  { label: 'Naqt', value: 1 },
  { label: 'Plastik', value: 2 },
])
const selectedItem = ref(null)
</script>

<template>
  <div style="display: flex; justify-content: space-between">
    <div style="width: 55%">
      <p style="text-align: center">Vaqt oralig'ini tanlang</p>
      <n-date-picker v-model:value="TimeValue" type="datetimerange" clearable />
      <pre>{{ JSON.stringify(TimeValue) }}</pre>
    </div>
    <div style="width: 20%">
      <p style="text-align: center">To'lovni to'ldiring</p>
      <n-select
        v-model:value="selectedItem"
        size="medium"
        :options="selectItems"
      />
    </div>
    <div style="width: 10%">
      <n-button style="margin-top: 40px">Bajarish</n-button>
    </div>
  </div>
</template>
