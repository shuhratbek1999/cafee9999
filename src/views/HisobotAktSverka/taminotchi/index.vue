<script setup>
import { ref, onMounted } from 'vue'
import { NButton } from 'naive-ui'
import TableNoData from '../../../components/TableNoData.vue'
import ReportService from '../../../services/report.service.js'
import SupplierService from '../../../services/taminotchilar.service.js'
const suppliers = ref([])
const loadSuppliers = ref([])
const supplier_act = ref([])
const pagination = ref({
  pageSize: 20,
})
let postValues = ref({
  datetime1: 35131311,
  datetime2: 215313544,
  supplier_id: null,
})
const onShow = async () => {
  supplier_act.value = await ReportService.supplierAct(postValues.value)
  console.log(supplier_act.value)
}
onMounted(async () => {
  loadSuppliers.value = await SupplierService.getAll()
  for (let index = 0; index < loadSuppliers.value.length; index++) {
    const element = loadSuppliers.value[index]
    suppliers.value.push({ label: element.name, value: element.id })
  }
})
const createColumns = [
  {
    title: '#',
    key: 'no',
    width: 50,
    render: (_, index) => {
      return index + 1
    },
  },
  {
    title: 'Operatsiya',
    key: 'comment',
  },
  {
    title: 'Summa',
    key: 'summa',
    children: [
      {
        title: "To'landi",
        key: 'kirim',
      },
      {
        title: 'Olindi',
        key: 'chiqim',
      },
    ],
  },
]
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div style="width: 22%">
        <p style="text-align: center">Boshlang'ich vaqt</p>
        <n-date-picker
          v-model:value="postValues.datetime1"
          type="datetime"
          clearable
        />
      </div>
      <div style="width: 22%">
        <p style="text-align: center">Oxirgi vaqt</p>
        <n-date-picker
          v-model:value="postValues.datetime2"
          type="datetime"
          clearable
        />
      </div>
      <div style="width: 20%">
        <p style="text-align: center">Ta'minotchini tanlang</p>
        <n-select
          v-model:value="postValues.supplier_id"
          size="medium"
          :options="suppliers"
        />
      </div>
      <div style="width: 10%">
        <n-button style="margin-top: 40px" @click="onShow">Ko'rish</n-button>
      </div>
    </div>
    <!-- data table -->
    <n-data-table
      size="small"
      :data="supplier_act"
      :columns="createColumns"
      :single-line="false"
      style="margin-top: 20px"
      :pagination="pagination"
    >
      <template #empty>
        <table-no-data></table-no-data>
      </template>
    </n-data-table>
  </div>
</template>
