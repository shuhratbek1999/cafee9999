<script setup>
import { ref, onMounted, h, computed, reactive } from 'vue'
import { required, helpers, maxLength } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import FormData from '../../components/FormData.vue'
import { useStore } from 'vuex'
import {
  NButton,
  NIcon,
  useMessage,
  useDialog,
  NSelect,
  NInput,
  NText,
  NInputNumber,
} from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import DocSalaryService from '../../../services/doc_salary.service'
import WorkerService from '../../../services/worker.service'
import TableNoData from '../../../components/TableNoData.vue'
const message = useMessage()
const dialog = useDialog()
const store = useStore()
//table start
const docSalaryRef = ref(null)
const cancelCallback = () => {
  create_data.value = {
    created_at: '',
    updated_at: '',
  }
  update_data.value = {
    created_at: '',
    last_updated: '',
    updated_at: '',
  }
  createE.value.data = []
  updateE.value.data = []
  showCreate.value = false
  showUpdate.value = false
}
const rowProps = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      update_data.value.created_at = row.created_at
      update_data.value.last_updated = row.updated_at
      update_data.value.updated_at = moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss',
      )
      for (let index = 0; index < row.doc_tables.length; index++) {
        const element = row.doc_tables[index]
        updateE.value.data.push({
          service: element.service.toString(),
          price: element.price,
          worker_id: element.worker.id,
        })
      }
      updateId.value = row.id
      showUpdate.value = true
    },
  }
}
const createDocSalary = async () => {
  vCreateExtra$.value.$validate()
  if (!vCreateExtra$.value.$error) {
    create_data.value.created_at = moment(create_data.value.created_at).format(
      'X',
    )
    create_data.value.updated_at = moment(create_data.value.updated_at).format(
      'X',
    )
    create_data.value['doc_salary_table'] = createE.value.data
    try {
      let res = await DocSalaryService.create(create_data.value)
      res.created_at = moment.unix(res.created_at).format('YYYY-MM-DD HH:mm:ss')
      res.updated_at = moment.unix(res.updated_at).format('YYYY-MM-DD HH:mm:ss')
      data.value.push(res)
      showCreate.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const searchDocSalary = (e) => {
  docSalaryRef.value.filter({
    created_at: [e],
  })
}
const renderCell = (value) => {
  if (!value) {
    return h(NText, { depth: 3 }, { default: () => 'empty' })
  }
  return value
}
const data = ref([])
const workers = ref([])
const workersSelect = ref([])
onMounted(async () => {
  data.value = await DocSalaryService.getAll()
  for (let index = 0; index < data.value.length; index++) {
    const element = data.value[index]
    element.created_at = moment
      .unix(element.created_at)
      .format('YYYY-MM-DD HH:mm:ss')
    element.updated_at = moment
      .unix(element.updated_at)
      .format('YYYY-MM-DD HH:mm:ss')
  }
  workers.value = await WorkerService.getAll()
  for (let index = 0; index < workers.value.length; index++) {
    const element = workers.value[index]
    workersSelect.value.push({ label: element.name, value: element.id })
  }
})
const pagination = ref({
  pageSize: 10,
})
const rulesExtraData = computed(() => {
  return {
    data: {
      $each: helpers.forEach({
        worker_id: {
          required: helpers.withMessage('Tanlang', required),
        },
        price: {
          required: helpers.withMessage("Miqdorni to'ldiring", required),
        },
      }),
    },
  }
})

const parse = (input) => {
  const nums = input.replace(/\s/g, '').trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
  return nums === '' ? null : Number.NaN
}
const format = (value) => {
  if (value === null) return ''
  return value.toLocaleString('ru-RU')
}

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
    title: 'Yaratilgan vaqti',
    key: 'created_at',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    filter(value, row) {
      return ~row.created_at.toString().indexOf(value)
    },
  },
  {
    title: 'Action',
    key: 'actions',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'success',
            style: {
              height: '35px',
            },
            onClick: (e) => {
              e.stopPropagation()
              update_data.value.created_at = row.created_at
              update_data.value.last_updated = row.updated_at
              update_data.value.updated_at = moment(new Date()).format(
                'YYYY-MM-DD HH:mm:ss',
              )
              for (let index = 0; index < row.doc_tables.length; index++) {
                const element = row.doc_tables[index]
                updateE.value.data.push({
                  service: element.service.toString(),
                  price: element.price,
                  worker_id: element.worker.id,
                })
              }
              updateId.value = row.id
              showUpdate.value = true
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: Pencil,
              }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: {
              height: '35px',
              marginLeft: '10px',
            },
            onClick: (e) => {
              e.stopPropagation()
              dialog.success({
                title: 'Ogohlantirish',
                content: "O'chirilsinmi ?",
                positiveText: 'Ha',
                negativeText: "Yo'q",
                onPositiveClick: async () => {
                  try {
                    await DocSalaryService.delete(row.id)
                    message.success("Muvaffaqiyatli o'chirildi")
                    const index = data.value.findIndex(
                      (val) => val.id == row.id,
                    )
                    data.value.splice(index, 1)
                  } catch (error) {
                    message.error(error)
                  }
                },
                onNegativeClick: () => {
                  message.info("O'chirilmadi")
                },
              })
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: Delete,
              }),
          },
        ),
      ]
    },
  },
]
//table end

//create modal start
const leaveCreate = () => {
  vCreateExtra$.value.$reset()
  create_data.value = {
    created_at: '',
    updated_at: '',
  }
  createE.value.data = []
}
const createEColumns = [
  {
    title: 'Ishchi',
    key: 'worker_id',
    className: 'workerR',
    render(row, index) {
      return [
        h(
          NSelect,
          {
            value: row.worker_id,
            options: workersSelect.value,
            placeholder: 'Tanlang',
            filterable: true,
            style: {
              width: '200px',
              marginBottom: '12px',
            },
            onUpdateValue(v) {
              createE.value.data[index].worker_id = v
            },
          },
          {
            empty: () => "Ma'lumotlar topilmadi 🙁",
          },
        ),
        h(NButton, {
          style: {
            width: '20px',
            border: '1px solid #eee',
          },
          innerHTML: '...',
          onClick: () => {
            showChooseWorker.value = true
            indexOfSelect.value = index
          },
        }),
      ]
    },
  },
  {
    title: 'Narxi',
    key: 'price',
    render(row, index) {
      return [
        h(NInputNumber, {
          value: row.price,
          placeholder: 'Kiriting',
          type: 'number',
          parse: parse,
          format: format,
          keyboard: {
            ArrowUp: false,
            ArrowDown: false,
          },
          'show-button': false,
          onUpdateValue(v) {
            createE.value.data[index].price = v
          },
        }),
      ]
    },
  },
  {
    title: 'Service',
    key: 'service',
    render(row, index) {
      return [
        h(NInput, {
          value: row.service,
          placeholder: 'Kiriting',
          onUpdateValue(v) {
            createE.value.data[index].service = v
          },
        }),
      ]
    },
  },
]
const updateEColumn = [
  {
    title: 'Ishchi',
    key: 'worker_id',
    className: 'workerR',
    render(row, index) {
      return [
        h(
          NSelect,
          {
            value: row.worker_id,
            options: workersSelect.value,
            placeholder: 'Tanlang',
            filterable: true,
            style: {
              width: '200px',
              marginBottom: '12px',
            },
            onUpdateValue(v) {
              updateE.value.data[index].worker_id = v
            },
          },
          {
            empty: () => "Ma'lumotlar topilmadi 🙁",
          },
        ),
        h(NButton, {
          style: {
            width: '20px',
            border: '1px solid #eee',
          },
          innerHTML: '...',
          onClick: () => {
            showChooseWorker.value = true
            indexOfSelect.value = index
          },
        }),
      ]
    },
  },
  {
    title: 'Narxi',
    key: 'price',
    render(row, index) {
      return [
        h(NInputNumber, {
          value: row.price,
          placeholder: 'Kiriting',
          type: 'number',
          parse: parse,
          format: format,
          keyboard: {
            ArrowUp: false,
            ArrowDown: false,
          },
          'show-button': false,
          onUpdateValue(v) {
            updateE.value.data[index].price = v
          },
        }),
      ]
    },
  },
  {
    title: 'Service',
    key: 'service',
    render(row, index) {
      return [
        h(NInput, {
          value: row.service,
          placeholder: 'Kiriting',
          onUpdateValue(v) {
            updateE.value.data[index].service = v
          },
        }),
      ]
    },
  },
]
const workerColumn = [
  {
    title: '#',
    key: 'no',
    width: 50,
    render: (_, index) => {
      return index + 1
    },
  },
  {
    title: 'Name',
    key: 'name',
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase())
    },
  },
]
import moment from 'moment'
const showCreate = ref(false)
const indexOfSelect = ref(null)
const create_data = ref({
  created_at: '',
  updated_at: '',
})

const createE = ref({
  data: [],
})
const vCreateExtra$ = useValidate(rulesExtraData, createE)
const add = () => {
  createE.value.data.push({
    worker: null,
    price: 0,
    service: '',
  })
}
const openCreate = () => {
  showCreate.value = true
  create_data.value.created_at = moment(new Date()).format(
    'YYYY-MM-DD HH:mm:ss',
  )
  create_data.value.updated_at = moment(new Date()).format(
    'YYYY-MM-DD HH:mm:ss',
  )
}
//create modal end
//update modal start
const showUpdate = ref(false)
const updateE = ref({
  data: [],
})
const updateId = ref(null)
const update_data = ref({
  created_at: '',
  last_updated: '',
  updated_at: '',
})
const addUpdate = () => {
  updateE.value.data.push({
    worker_id: null,
    price: 0,
    service: '',
  })
}
const leaveUpdate = () => {
  vUpdateExtra$.value.$reset()
  update_data.value = {
    created_at: '',
    last_updated: '',
    updated_at: '',
  }
  updateE.value.data = []
  updateId.value = null
}

const vUpdateExtra$ = useValidate(rulesExtraData, updateE)
const updateDocSalary = async () => {
  vUpdateExtra$.value.$validate()
  if (!vUpdateExtra$.value.$error) {
    delete update_data.value['last_updated']
    update_data.value['doc_salary_table'] = updateE.value.data
    try {
      delete update_data.value['last_updated']
      update_data.value.created_at = moment(
        update_data.value.created_at,
      ).format('X')
      update_data.value.updated_at = moment(
        update_data.value.updated_at,
      ).format('X')
      update_data.value['doc_salary_table'] = updateE.value.data
      const res = await DocSalaryService.update(
        updateId.value,
        update_data.value,
      )
      res.created_at = moment.unix(res.created_at).format('YYYY-MM-DD HH:mm:ss')
      res.updated_at = moment.unix(res.updated_at).format('YYYY-MM-DD HH:mm:ss')
      const index = data.value.findIndex((val) => val.id === res.id)
      data.value[index] = res
      showUpdate.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
//update modal end
//worker start
const showChooseWorker = ref(false)
const showAddWorker = ref(false)
const workerRef = ref(null)
const searchWorker = (e) => {
  workerRef.value.filter({
    name: [e],
  })
}

const rowPropsWorker = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      const index = indexOfSelect.value
      if (showCreate.value) {
        createE.value.data[index].worker_id = row.id
      } else if (showUpdate.value) {
        updateE.value.data[index].worker_id = row.id
      }
      indexOfSelect.value = false
      showChooseWorker.value = false
    },
  }
}
const rulesWorker = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Name bo'sh bo'lmasligi kerak", required),
      maxLength: helpers.withMessage(
        'Name 100 ta belgidan oshmasligi kerak',
        maxLength(100),
      ),
    },
  }
})
const formWorker = reactive([
  { value: '', key: 'name', label: 'Name', type: 'input' },
])
const leaveWorker = () => {
  indexOfSelect.value = false
  store.dispatch('setNull')
}
const createWorker = async (e) => {
  const vWorker$ = useValidate(rulesWorker, e)
  vWorker$.value.$validate()
  store.state.modalValidations = vWorker$
  if (!vWorker$.value.$error) {
    try {
      const res = await WorkerService.create(e)
      workers.value.push(res)
      workersSelect.value.push({ label: res.name, value: res.id })
      const index = indexOfSelect.value
      if (showCreate.value) {
        createE.value.data[index].worker_id = res.id
      } else if (showUpdate.value) {
        updateE.value.data[index].worker_id = res.id
      }
      showAddWorker.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const openAddWorker = () => {
  showChooseWorker.value = false
  showAddWorker.value = true
}
//worker end
</script>

<template>
  <div>
    <div style="display: flex">
      <n-button type="primary" @click="openCreate">+</n-button>
      <n-input
        placeholder="Qidirish"
        style="margin-left: 20px"
        @input="searchDocSalary"
      ></n-input>
    </div>
    <n-data-table
      :columns="createColumns"
      :data="data"
      :pagination="pagination"
      style="margin-top: 20px"
      ref="docSalaryRef"
      :rowProps="rowProps"
    >
      <template #empty>
        <table-no-data></table-no-data>
      </template>
    </n-data-table>
    <!--create doc salary start-->
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Ishchiga to'lov"
      style="width: 700px"
      :on-after-leave="leaveCreate"
    >
      <n-form>
        <div style="display: flex; flex-direction: column">
          <p>Yaratilgan vaqti</p>
          <n-tag>{{ create_data.created_at }}</n-tag>
        </div>
        <n-button
          @click="add"
          type="primary"
          style="margin-top: 10px; margin-bottom: 10px"
          >+</n-button
        >
        <n-data-table :columns="createEColumns" :data="createE.data">
          <template #empty><table-no-data></table-no-data></template>
        </n-data-table>
        <n-gradient-text type="error" v-if="vCreateExtra$.$error">
          Yuqoridagi ma'lumotlarni to'ldiring
        </n-gradient-text>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="createDocSalary">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <!--create doc salary end-->
    <!--update doc salary start-->
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Ishchiga to'lov"
      style="width: 700px"
      :on-after-leave="leaveUpdate"
    >
      <n-form>
        <div style="display: flex; justify-content: space-between">
          <div style="display: flex; flex-direction: column">
            <p>Yaratilgan vaqti</p>
            <n-tag>{{ update_data.created_at }}</n-tag>
          </div>
          <div style="display: flex; flex-direction: column">
            <p>Oxirigi o'zgarish vaqti</p>
            <n-tag>{{ update_data.last_updated }}</n-tag>
          </div>
          <div style="display: flex; flex-direction: column">
            <p>Hozirgi vaqt</p>
            <n-tag>{{ update_data.updated_at }}</n-tag>
          </div>
        </div>
        <n-button
          @click="addUpdate"
          type="primary"
          style="margin-top: 10px; margin-bottom: 10px"
          >+</n-button
        >
        <n-data-table :columns="updateEColumn" :data="updateE.data">
          <template #empty><table-no-data></table-no-data></template>
        </n-data-table>
        <n-gradient-text type="error" v-if="vUpdateExtra$.$error">
          Yuqoridagi ma'lumotlarni to'ldiring
        </n-gradient-text>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="updateDocSalary">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <!--update doc salary end-->
    <!--choose worker start-->
    <n-modal v-model:show="showChooseWorker">
      <n-card
        style="width: 400px"
        title="Ishchilar"
        role="dialog"
        aria-modal="true"
      >
        <div style="display: flex">
          <n-button type="primary" @click="openAddWorker">+</n-button>
          <n-input
            placeholder="Qidirish"
            style="margin-left: 10px"
            @input="searchWorker"
          />
        </div>
        <n-data-table
          :data="workers"
          :columns="workerColumn"
          style="margin-top: 20px"
          ref="workerRef"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
          :rowProps="rowPropsWorker"
        >
          <template #empty> <table-no-data></table-no-data> </template>
        </n-data-table>
      </n-card>
    </n-modal>
    <!--choose worker end-->
    <!--add worker start-->
    <n-modal
      v-model:show="showAddWorker"
      preset="dialog"
      title="Ishchi"
      :on-after-leave="leaveWorker"
    >
      <form-data :data="formWorker" @click="createWorker"></form-data>
    </n-modal>
    <!--add worker end-->
  </div>
</template>
<style>
.workerR {
  display: flex;
  margin-top: 12px;
}
</style>
