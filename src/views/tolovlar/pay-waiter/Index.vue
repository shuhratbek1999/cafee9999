<script setup>
import { ref, onMounted, h, computed, reactive } from 'vue'
import useValidate from '@vuelidate/core'
import {
  maxLength,
  helpers,
  required,
  minLength,
  email,
} from '@vuelidate/validators'
import PayWaiterService from '@/services/pay-waiter.service.js'
import WaiterService from '@/services/waiter.service.js'
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
//waiter start
const waiters = ref([])
const waitersSelect = ref([])
onMounted(async () => {
  waiters.value = await WaiterService.getAll()
  for (let index = 0; index < waiters.value.length; index++) {
    const element = waiters.value[index]
    waitersSelect.value.push({ label: element.username, value: element.id })
  }
})
const waiterRef = ref(null)
const showChooseWaiter = ref(false)
const showAddWaiter = ref(false)
const formWaiter = reactive([
  { value: '', key: 'username', label: 'Username', type: 'input' },
  { value: '', key: 'password', label: 'Password', type: 'input' },
  { value: '', key: 'email', label: 'Email', type: 'input' },
])
const leaveWaiter = () => {
  store.dispatch('setNull')
}
const createWaiter = async (e) => {
  const vWaiter$ = useValidate(rulesWaiter, e)
  vWaiter$.value.$validate()
  store.state.modalValidations = vWaiter$
  if (!vWaiter$.value.$error) {
    try {
      const res = await WaiterService.create(e)
      waiters.value.push(res)
      waitersSelect.value.push({ label: res.username, value: res.id })
      if (showCreate.value) {
        create_data.value.waiter_id = res.id
        create_data.value.ost = res.qoldiq
      } else if (showUpdate.value) {
        update_data.value.waiter_id = res.id
        update_data.value.ost = res.qoldiq
      }
      showAddWaiter.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const openAddWaiter = () => {
  showAddWaiter.value = true
  showChooseWaiter.value = false
}
const rowPropsWaiter = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      showChooseWaiter.value = false
      const waiter = waiters.value.find((val) => val.id === row.id)
      if (showCreate.value) {
        create_data.value.waiter_id = row.id
        create_data.value.ost = waiter.qoldiq
      } else if (showUpdate.value) {
        update_data.value.ost = waiter.qoldiq
        update_data.value.waiter_id = row.id
      }
    },
  }
}
const searchWaiter = (e) => {
  waiterRef.value.filter({
    username: [e],
  })
}
const rulesWaiter = computed(() => {
  return {
    username: {
      required: helpers.withMessage(
        "Username bo'sh bo'lmasligi kerak",
        required,
      ),
      maxLength: helpers.withMessage(
        'Name 100 ta belgidan oshmasligi kerak',
        maxLength(100),
      ),
      minLength: helpers.withMessage(
        "Name kamida 2 ta belgidan iborat bo'lishi kerak",
        minLength(2),
      ),
    },
    password: {
      required: helpers.withMessage(
        "Password bo'sh bo'lmasligi kerak",
        required,
      ),
      maxLength: helpers.withMessage(
        'Name 25 ta belgidan oshmasligi kerak',
        maxLength(25),
      ),
    },
    email: {
      required: helpers.withMessage("Email bo'sh bo'lmasligi kerak", required),
      email: helpers.withMessage("Bu email bo'lishi kerak", email),
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
    title: 'Username',
    key: 'username',
    filter(value, row) {
      return ~row.username.toLowerCase().indexOf(value.toLowerCase())
    },
  },
]
//waiter end

//pay waiter start
const paywaiter = ref([])
onMounted(async () => {
  paywaiter.value = await PayWaiterService.getAll()
  for (let index = 0; index < paywaiter.value.length; index++) {
    let element = paywaiter.value[index]
    element.datetime = moment
      .unix(element.datetime)
      .format('YYYY-MM-DD HH:mm:ss')
  }
})
const paywaiterRef = ref(null)
const rowProps = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      const { waiter, id, ...obj } = row
      update_data.value.waiter_id = waiter.id
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
    key: 'waiter.username',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    filter(value, row) {
      return (
        ~row.waiter.username.toLowerCase().indexOf(value.toLowerCase()) ||
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
              const { waiter, id, ...obj } = row
              update_data.value.waiter_id = waiter.id
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
                    const data = await PayWaiterService.delete(row.id)
                    message.success("Muvaffaqiyatli o'chirildi")
                    const index = waiters.value.findIndex(
                      (val) => val.id == data.id,
                    )
                    paywaiter.value.splice(index, 1)
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
const searchPayWaiter = (e) => {
  paywaiterRef.value.filter({
    'waiter.name': [e],
  })
}

//pay waiter end

//pay waiter create start
const showCreate = ref(false)
const payTypes = [
  { label: 'Naqt', value: 'cash' },
  { label: 'Plastik', value: 'plastic' },
]
const create_data = ref({
  datetime: '',
  waiter_id: null,
  pay_type: null,
  comment: '',
  sum: 0,
  ost: 0,
})
const rules = computed(() => {
  return {
    waiter_id: {
      required: helpers.withMessage("Ta'minotchini tanlang", required),
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
    waiter_id: null,
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
const createPayWaiter = async () => {
  vCreate$.value.$validate()
  if (!vCreate$.value.$error) {
    try {
      create_data.value.datetime = moment(create_data.value.datetime).format(
        'X',
      )
      const res = await PayWaiterService.create(create_data.value)
      res.datetime = moment.unix(res.datetime).format('YYYY-MM-DD HH:mm:ss')
      paywaiter.value.push(res)
      showCreate.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const changeWaiter = (e) => {
  const waiter = waiters.value.find((val) => val.id == e)
  if (showCreate.value) {
    create_data.value.waiter_id = e
    create_data.value.ost = waiter.qoldiq
  } else if (showUpdate.value) {
    update_data.value.waiter_id = e
    update_data.value.ost = waiter.qoldiq
  }
}
//pay waiter create end
//pay waiter update start
const showUpdate = ref(false)
const update_data = ref({
  datetime: '',
  waiter_id: null,
  pay_type: null,
  comment: '',
  sum: 0,
  ost: 0,
})
const vUpdate$ = useValidate(rules, update_data)
const updatePayWaiter = async () => {
  vUpdate$.value.$validate()
  if (!vUpdate$.value.$error) {
    try {
      update_data.value.datetime = moment(update_data.value.datetime).format(
        'X',
      )
      const res = await PayWaiterService.update(
        updateId.value,
        update_data.value,
      )
      res.datetime = moment.unix(res.datetime).format('YYYY-MM-DD HH:mm:ss')
      updateId.value = null
      const index = paywaiter.value.findIndex((val) => val.id === res.id)
      paywaiter.value[index] = res
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
    waiter_id: null,
    pay_type: null,
    comment: '',
    sum: 0,
    ost: 0,
  }
  updateId.value = null
}
//pay waiter update end
</script>

<template>
  <div>
    <div style="display: flex">
      <n-button type="primary" @click="openCreate">+</n-button>
      <n-input
        placeholder="Qidirish"
        style="margin-left: 20px"
        @input="searchPayWaiter"
      ></n-input>
    </div>
    <n-data-table
      :data="paywaiter"
      :columns="createColumns"
      style="margin-top: 20px"
      :pagination="pagination"
      ref="paywaiterRef"
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
      title="Oshpazga to'lov"
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
            <p style="font-weight: bold">Ofitsant</p>
            <div style="display: flex">
              <n-select
                :options="waitersSelect"
                v-model:value="create_data.waiter_id"
                filterable
                placeholder="Tanlang"
                :on-update:value="changeWaiter"
              >
                <template #empty> Ma'lumotlar topilmadi 🙁 </template>
              </n-select>
              <n-button @click="showChooseWaiter = true">...</n-button>
            </div>
            <small>
              <n-gradient-text type="error" v-if="vCreate$.waiter_id.$error">
                {{ vCreate$.waiter_id.$errors[0].$message }}
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
          <n-button type="primary" @click="createPayWaiter">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <!--create modal end-->
    <!--update modal start-->
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Oshpazga to'lov"
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
            <p style="font-weight: bold">Ofitsant</p>
            <div style="display: flex">
              <n-select
                :options="waitersSelect"
                v-model:value="update_data.waiter_id"
                filterable
                placeholder="Tanlang"
                :on-update:value="changeWaiter"
              >
                <template #empty> Ma'lumotlar topilmadi 🙁 </template>
              </n-select>
              <n-button @click="showChooseWaiter = true">...</n-button>
            </div>
            <small>
              <n-gradient-text type="error" v-if="vUpdate$.waiter_id.$error">
                {{ vUpdate$.waiter_id.$errors[0].$message }}
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
          <n-button type="primary" @click="updatePayWaiter">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <!--update modal end-->
    <!--choose worker start-->
    <n-modal v-model:show="showChooseWaiter">
      <n-card
        style="width: 400px"
        title="Oshpazni tanlash"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <div style="display: flex">
          <n-button @click="openAddWaiter" type="primary">+</n-button>
          <n-input
            placeholder="Qidirish"
            @input="searchWaiter"
            style="margin-left: 20px"
          ></n-input>
        </div>
        <n-data-table
          :data="waiters"
          :columns="modalColumn"
          style="margin-top: 20px"
          ref="waiterRef"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
          :rowProps="rowPropsWaiter"
        >
          <template #empty> <table-no-data></table-no-data> </template>
        </n-data-table>
      </n-card>
    </n-modal>
    <!--choose worker end-->
    <!--add worker start-->
    <n-modal
      v-model:show="showAddWaiter"
      preset="dialog"
      title="Ta'monotchi"
      :on-after-leave="leaveWaiter"
    >
      <form-data :data="formWaiter" @click="createWaiter"></form-data>
    </n-modal>
    <!--add worker end-->
  </div>
</template>
