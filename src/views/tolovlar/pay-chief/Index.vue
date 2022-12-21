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
import PayChiefService from '@/services/pay-chief.service.js'
import ChiefService from '@/services/chief.service.js'
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

//chief start
const chiefs = ref([])
const chiefsSelect = ref([])
onMounted(async () => {
  chiefs.value = await ChiefService.getAll()
  for (let index = 0; index < chiefs.value.length; index++) {
    const element = chiefs.value[index]
    chiefsSelect.value.push({ label: element.username, value: element.id })
  }
})
const chiefRef = ref(null)
const showChooseChief = ref(false)
const showAddChief = ref(false)
const formChief = reactive([
  { value: '', key: 'username', label: 'Username', type: 'input' },
  { value: '', key: 'password', label: 'Password', type: 'input' },
  { value: '', key: 'email', label: 'Email', type: 'input' },
])
const leaveChief = () => {
  store.dispatch('setNull')
}
const createChief = async (e) => {
  const vChief$ = useValidate(rulesChief, e)
  vChief$.value.$validate()
  store.state.modalValidations = vChief$
  if (!vChief$.value.$error) {
    try {
      const res = await ChiefService.create(e)
      chiefs.value.push(res)
      chiefsSelect.value.push({ label: res.username, value: res.id })
      if (showCreate.value) {
        create_data.value.chef_id = res.id
        create_data.value.ost = res.qoldiq
      } else if (showUpdate.value) {
        update_data.value.chef_id = res.id
        update_data.value.ost = res.qoldiq
      }
      showAddChief.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const openAddChief = () => {
  showAddChief.value = true
  showChooseChief.value = false
}
const rowPropsChief = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      showChooseChief.value = false
      const chief = chiefs.value.find((val) => val.id === row.id)
      if (showCreate.value) {
        create_data.value.chef_id = row.id
        create_data.value.ost = chief.qoldiq
      } else if (showUpdate.value) {
        update_data.value.ost = chief.qoldiq
        update_data.value.chef_id = row.id
      }
    },
  }
}
const searchChef = (e) => {
  chiefRef.value.filter({
    username: [e],
  })
}
const rulesChief = computed(() => {
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
//chief end

//pay chief start
const paychief = ref([])
onMounted(async () => {
  paychief.value = await PayChiefService.getAll()
  for (let index = 0; index < paychief.value.length; index++) {
    let element = paychief.value[index]
    element.datetime = moment
      .unix(element.datetime)
      .format('YYYY-MM-DD HH:mm:ss')
  }
})
const paychiefRef = ref(null)
const rowProps = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      const { chef, id, ...obj } = row
      update_data.value.chef_id = chef.id
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
    key: 'chef.username',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    filter(value, row) {
      return (
        ~row.chief.username.toLowerCase().indexOf(value.toLowerCase()) ||
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
              const { chef, id, ...obj } = row
              update_data.value.chef_id = chef.id
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
                    const data = await PayChiefService.delete(row.id)
                    message.success("Muvaffaqiyatli o'chirildi")
                    const index = chiefs.value.findIndex(
                      (val) => val.id == data.id,
                    )
                    paychief.value.splice(index, 1)
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
const searchPayChief = (e) => {
  paychiefRef.value.filter({
    'chief.name': [e],
  })
}

//pay chief end

//pay chief create start
const showCreate = ref(false)
const payTypes = [
  { label: 'Naqt', value: 'cash' },
  { label: 'Plastik', value: 'plastic' },
]
const create_data = ref({
  datetime: '',
  chef_id: null,
  pay_type: null,
  comment: '',
  sum: 0,
  ost: 0,
})
const rules = computed(() => {
  return {
    chef_id: {
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
    chef_id: null,
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
const createPayChief = async () => {
  vCreate$.value.$validate()
  if (!vCreate$.value.$error) {
    try {
      create_data.value.datetime = moment(create_data.value.datetime).format(
        'X',
      )
      const res = await PayChiefService.create(create_data.value)
      res.datetime = moment.unix(res.datetime).format('YYYY-MM-DD HH:mm:ss')
      paychief.value.push(res)
      showCreate.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const changeChief = (e) => {
  const chief = chiefs.value.find((val) => val.id == e)
  if (showCreate.value) {
    create_data.value.chef_id = e
    create_data.value.ost = chief.qoldiq
  } else if (showUpdate.value) {
    update_data.value.chef_id = e
    update_data.value.ost = chief.qoldiq
  }
}
//pay chief create end
//pay chief update start
const showUpdate = ref(false)
const update_data = ref({
  datetime: '',
  chef_id: null,
  pay_type: null,
  comment: '',
  sum: 0,
  ost: 0,
})
const vUpdate$ = useValidate(rules, update_data)
const updatePayChief = async () => {
  vUpdate$.value.$validate()
  if (!vUpdate$.value.$error) {
    try {
      update_data.value.datetime = moment(update_data.value.datetime).format(
        'X',
      )
      const res = await PayChiefService.update(
        updateId.value,
        update_data.value,
      )
      res.datetime = moment.unix(res.datetime).format('YYYY-MM-DD HH:mm:ss')
      updateId.value = null
      const index = paychief.value.findIndex((val) => val.id === res.id)
      paychief.value[index] = res
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
    chef_id: null,
    pay_type: null,
    comment: '',
    sum: 0,
    ost: 0,
  }
  updateId.value = null
}
//pay chief update end
</script>

<template>
  <div>
    <div style="display: flex">
      <n-button type="primary" @click="openCreate">+</n-button>
      <n-input
        placeholder="Qidirish"
        style="margin-left: 20px"
        @input="searchPayChief"
      ></n-input>
    </div>
    <n-data-table
      :data="paychief"
      :columns="createColumns"
      style="margin-top: 20px"
      :pagination="pagination"
      ref="paychiefRef"
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
            <p style="font-weight: bold">Oshpaz</p>
            <div style="display: flex">
              <n-select
                :options="chiefsSelect"
                v-model:value="create_data.chef_id"
                filterable
                placeholder="Tanlang"
                :on-update:value="changeChief"
              >
                <template #empty> Ma'lumotlar topilmadi 🙁 </template>
              </n-select>
              <n-button @click="showChooseChief = true">...</n-button>
            </div>
            <small>
              <n-gradient-text type="error" v-if="vCreate$.chef_id.$error">
                {{ vCreate$.chef_id.$errors[0].$message }}
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
          <n-button type="primary" @click="createPayChief">Submit</n-button>
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
            <p style="font-weight: bold">Oshpaz</p>
            <div style="display: flex">
              <n-select
                :options="chiefsSelect"
                v-model:value="update_data.chef_id"
                filterable
                placeholder="Tanlang"
                :on-update:value="changeChief"
              >
                <template #empty> Ma'lumotlar topilmadi 🙁 </template>
              </n-select>
              <n-button @click="showChooseChief = true">...</n-button>
            </div>
            <small>
              <n-gradient-text type="error" v-if="vUpdate$.chef_id.$error">
                {{ vUpdate$.chef_id.$errors[0].$message }}
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
          <n-button type="primary" @click="updatePayChief">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <!--update modal end-->
    <!--choose worker start-->
    <n-modal v-model:show="showChooseChief">
      <n-card
        style="width: 400px"
        title="Oshpazni tanlash"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <div style="display: flex">
          <n-button @click="openAddChief" type="primary">+</n-button>
          <n-input
            placeholder="Qidirish"
            @input="searchChef"
            style="margin-left: 20px"
          ></n-input>
        </div>
        <n-data-table
          :data="chiefs"
          :columns="modalColumn"
          style="margin-top: 20px"
          ref="chiefRef"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
          :rowProps="rowPropsChief"
        >
          <template #empty> <table-no-data></table-no-data> </template>
        </n-data-table>
      </n-card>
    </n-modal>
    <!--choose worker end-->
    <!--add worker start-->
    <n-modal
      v-model:show="showAddChief"
      preset="dialog"
      title="Ta'monotchi"
      :on-after-leave="leaveChief"
    >
      <form-data :data="formChief" @click="createChief"></form-data>
    </n-modal>
    <!--add worker end-->
  </div>
</template>
