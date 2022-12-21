<script setup>
import { ref, onMounted, h, computed, reactive } from 'vue'
import useValidate from '@vuelidate/core'
import { maxLength, helpers, required } from '@vuelidate/validators'
import PayWorkerService from '@/services/pay-worker.service.js'
import WorkerService from '@/services/worker.service.js'
import { useMessage, useDialog, NIcon, NButton, NText } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import TableNoData from '../../../components/TableNoData.vue'
import FormData from '../../components/FormData.vue'
import moment from 'moment'
import { useStore } from 'vuex'
const message = useMessage()
const dialog = useDialog()
const store = useStore()
const renderCell = (value) => {
  if (!value) {
    return h(NText, { depth: 3 }, { default: () => 'empty' })
  }
  return value
}
const parse = (input) => {
  const nums = input.replace(/\s/g, '').trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
  return nums === '' ? null : Number.NaN
}
const format = (value) => {
  if (value === null) return ''
  return value.toLocaleString('ru-RU')
}
//worker start
const workers = ref([])
const workersSelect = ref([])
onMounted(async () => {
  workers.value = await WorkerService.getAll()
  for (let index = 0; index < workers.value.length; index++) {
    const element = workers.value[index]
    workersSelect.value.push({ label: element.name, value: element.id })
  }
})
const workerRef = ref(null)
const showChooseWorker = ref(false)
const showAddWorker = ref(false)
const formWorker = reactive([
  { value: '', key: 'name', label: 'Name', type: 'input' },
])
const leaveWorker = () => {
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
      if (showCreate.value) {
        create_data.value.worker_id = res.id
        create_data.value.ost = res.qoldiq
      } else if (showUpdate.value) {
        update_data.value.worker_id = res.id
        update_data.value.ost = res.qoldiq
      }
      showAddWorker.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const openAddWorker = () => {
  showAddWorker.value = true
  showChooseWorker.value = false
}
const rowPropsWorker = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      showChooseWorker.value = false
      const worker = workers.value.find((val) => val.id === row.id)
      if (showCreate.value) {
        create_data.value.worker_id = row.id
        create_data.value.ost = worker.qoldiq
      } else if (showUpdate.value) {
        update_data.value.ost = worker.qoldiq
        update_data.value.worker_id = row.id
      }
    },
  }
}
const searchWorker = (e) => {
  workerRef.value.filter({
    name: [e],
  })
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
const modalColumn = [
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
//worker end

//pay worker start
const payworkers = ref([])
onMounted(async () => {
  payworkers.value = await PayWorkerService.getAll()
  for (let index = 0; index < payworkers.value.length; index++) {
    let element = payworkers.value[index]
    element.datetime = moment
      .unix(element.datetime)
      .format('YYYY-MM-DD HH:mm:ss')
  }
})
const payworkerRef = ref(null)
const rowProps = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      const { worker, id, ...obj } = row
      update_data.value.worker_id = worker.id
      update_data.value.pay_type = obj.pay_type
      update_data.value.comment = obj.comment
      update_data.value.sum = obj.sum
      update_data.value.ost = obj.ost
      update_data.value.datetime = obj.datetime
      showUpdate.value = true
      updateId.value = id
    },
  }
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
    title: 'Name',
    key: 'worker.name',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    filter(value, row) {
      return (
        ~row.worker.name.toLowerCase().indexOf(value.toLowerCase()) ||
        ~row.sum.toString().indexOf(value.toLowerCase()) ||
        ~row.ost.toString().indexOf(value.toLowerCase()) ||
        ~row.datetime.toString().indexOf(value.toLowerCase())
      )
    },
  },
  {
    title: 'Summa',
    key: 'sum',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    render: (_) => {
      return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(_.sum)
    },
  },
  {
    title: 'Qoldiq',
    key: 'ost',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    render: (_) => {
      return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(_.ost)
    },
  },
  {
    title: 'Sana',
    key: 'datetime',
    defaultSortOrder: 'ascend',
    sorter: 'default',
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
              const { worker, id, ...obj } = row
              update_data.value.worker_id = worker.id
              update_data.value.pay_type = obj.pay_type
              update_data.value.comment = obj.comment
              update_data.value.sum = obj.sum
              update_data.value.ost = obj.ost
              update_data.value.datetime = obj.datetime
              showUpdate.value = true
              updateId.value = id
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
                    const data = await PayWorkerService.delete(row.id)
                    message.success("Muvaffaqiyatli o'chirildi")
                    const index = workers.value.findIndex(
                      (val) => val.id == data.id,
                    )
                    payworkers.value.splice(index, 1)
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
const pagination = ref({
  pageSize: 10,
})
const searchPayWorker = (e) => {
  payworkerRef.value.filter({
    'worker.name': [e],
  })
}

//pay worker end

//pay worker create start
const showCreate = ref(false)
const payTypes = [
  { label: 'Naqt', value: 'cash' },
  { label: 'Plastik', value: 'plastic' },
]
const create_data = ref({
  datetime: '',
  worker_id: null,
  pay_type: null,
  comment: '',
  sum: 0,
  ost: 0,
})
const rules = computed(() => {
  return {
    worker_id: {
      required: helpers.withMessage('Ishchini tanlang', required),
    },
    comment: {
      maxLength: helpers.withMessage(
        'Comment 255 tadan oshmasligi kerak',
        maxLength(255),
      ),
    },
  }
})
const vCreate$ = useValidate(rules, create_data)
const openCreate = () => {
  showCreate.value = true
  create_data.value.datetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
}
const leaveCreate = () => {
  create_data.value = {
    datetime: '',
    worker_id: null,
    pay_type: null,
    comment: '',
    sum: 0,
    ost: 0,
  }
  vCreate$.value.$reset()
}
const cancelCallback = () => {
  showCreate.value = false
  showUpdate.value = false
}
const createPayWorker = async () => {
  vCreate$.value.$validate()
  if (!vCreate$.value.$error) {
    try {
      create_data.value.datetime = moment(create_data.value.datetime).format(
        'X',
      )
      const res = await PayWorkerService.create(create_data.value)
      res.datetime = moment.unix(res.datetime).format('YYYY-MM-DD HH:mm:ss')
      payworkers.value.push(res)
      showCreate.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const changeWorker = (e) => {
  const worker = workers.value.find((val) => val.id == e)
  if (showCreate.value) {
    create_data.value.worker_id = e
    create_data.value.ost = worker.qoldiq
  } else if (showUpdate.value) {
    update_data.value.worker_id = e
    update_data.value.ost = worker.qoldiq
  }
}
//pay worker create end
//pay worker update start
const showUpdate = ref(false)
const update_data = ref({
  datetime: '',
  worker_id: null,
  pay_type: null,
  comment: '',
  sum: '',
  ost: '',
})
const vUpdate$ = useValidate(rules, update_data)
const updatePayWorker = async () => {
  vUpdate$.value.$validate()
  if (!vUpdate$.value.$error) {
    try {
      update_data.value.datetime = moment(update_data.value.datetime).format(
        'X',
      )
      const res = await PayWorkerService.update(
        updateId.value,
        update_data.value,
      )
      res.datetime = moment.unix(res.datetime).format('YYYY-MM-DD HH:mm:ss')
      updateId.value = null
      const index = payworkers.value.findIndex((val) => val.id === res.id)
      payworkers.value[index] = res
      showUpdate.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const updateId = ref(null)
const leaveUpdate = () => {
  update_data.value = {
    datetime: '',
    worker_id: null,
    pay_type: null,
    comment: '',
    sum: 0,
    ost: 0,
  }
  updateId.value = null
}
//pay worker update end
</script>

<template>
  <div>
    <div style="display: flex">
      <n-button type="primary" @click="openCreate">+</n-button>
      <n-input
        placeholder="Qidirish"
        style="margin-left: 20px"
        @input="searchPayWorker"
      ></n-input>
    </div>
    <n-data-table
      :data="payworkers"
      :columns="createColumns"
      style="margin-top: 20px"
      :pagination="pagination"
      ref="payworkerRef"
      :rowProps="rowProps"
    >
      <template #empty>
        <table-no-data></table-no-data>
      </template>
    </n-data-table>
    <!--create modal start-->
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Ishchiga to'lov"
      :on-after-leave="leaveCreate"
      style="width: 800px"
    >
      <n-form>
        <div style="display: flex; justify-content: space-between">
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">Yaratilgan vaqti</p>
            <n-tag style="height: 34px">{{ create_data.datetime }}</n-tag>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">Ishchi</p>
            <div style="display: flex">
              <n-select
                :options="workersSelect"
                v-model:value="create_data.worker_id"
                filterable
                placeholder="Tanlang"
                :on-update:value="changeWorker"
              >
                <template #empty> Ma'lumotlar topilmadi 🙁 </template>
              </n-select>
              <n-button @click="showChooseWorker = true">...</n-button>
            </div>
            <small>
              <n-gradient-text type="error" v-if="vCreate$.worker_id.$error">
                {{ vCreate$.worker_id.$errors[0].$message }}
              </n-gradient-text>
            </small>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">Qoldiq</p>
            <n-tag style="height: 34px">{{
              new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
                create_data.ost,
              )
            }}</n-tag>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between">
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">To'lov turi</p>
            <n-select
              :options="payTypes"
              filterable
              v-model:value="create_data.pay_type"
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">Summa</p>
            <n-input-number
              v-model:value="create_data.sum"
              placeholder="Kiriting"
              type="number"
              :format="format"
              :parse="parse"
              :keyboard="{ ArrowUp: false, ArrowDown: false }"
              :show-button="false"
            ></n-input-number>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">Comment</p>
            <n-input
              type="textarea"
              v-model:value="create_data.comment"
              placeholder="Kiriting"
            ></n-input>
            <small>
              <n-gradient-text type="error" v-if="vCreate$.comment.$error">
                {{ vCreate$.comment.$errors[0].$message }}
              </n-gradient-text>
            </small>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 60px">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="createPayWorker">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <!--create modal end-->
    <!--update modal start-->
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Ishchiga to'lov"
      :on-after-leave="leaveUpdate"
      style="width: 800px"
    >
      <n-form>
        <div style="display: flex; justify-content: space-between">
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">Yaratilgan vaqti</p>
            <n-tag style="height: 34px">{{ update_data.datetime }}</n-tag>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">Ishchi</p>
            <div style="display: flex">
              <n-select
                :options="workersSelect"
                v-model:value="update_data.worker_id"
                filterable
                placeholder="Tanlang"
                :on-update:value="changeWorker"
              >
                <template #empty> Ma'lumotlar topilmadi 🙁 </template>
              </n-select>
              <n-button @click="showChooseWorker = true">...</n-button>
            </div>
            <small>
              <n-gradient-text type="error" v-if="vUpdate$.worker_id.$error">
                {{ vUpdate$.worker_id.$errors[0].$message }}
              </n-gradient-text>
            </small>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">Qoldiq</p>
            <n-tag style="height: 34px">{{
              new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
                update_data.ost,
              )
            }}</n-tag>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between">
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">To'lov turi</p>
            <n-select
              :options="payTypes"
              filterable
              v-model:value="update_data.pay_type"
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">Summa</p>
            <n-input-number
              v-model:value="update_data.sum"
              placeholder="Kiriting"
              type="number"
              :format="format"
              :parse="parse"
              :keyboard="{ ArrowUp: false, ArrowDown: false }"
              :show-button="false"
            ></n-input-number>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 80px;
              width: 230px;
            "
          >
            <p style="font-weight: bold">Comment</p>
            <n-input
              type="textarea"
              v-model:value="update_data.comment"
              placeholder="Kiriting"
            ></n-input>
            <small>
              <n-gradient-text type="error" v-if="vUpdate$.comment.$error">
                {{ vUpdate$.comment.$errors[0].$message }}
              </n-gradient-text>
            </small>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 60px">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="updatePayWorker">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <!--update modal end-->
    <!--choose worker start-->
    <n-modal v-model:show="showChooseWorker">
      <n-card
        style="width: 400px"
        title="Ishchini tanlash"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <div style="display: flex">
          <n-button @click="openAddWorker" type="primary">+</n-button>
          <n-input
            placeholder="Qidirish"
            @input="searchWorker"
            style="margin-left: 20px"
          ></n-input>
        </div>
        <n-data-table
          :data="workers"
          :columns="modalColumn"
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
