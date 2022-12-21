<script setup>
import { ref, onMounted, h, computed, reactive } from 'vue'
import useValidate from '@vuelidate/core'
import { maxLength, helpers, required } from '@vuelidate/validators'
import PaySupplierService from '@/services/pay-supplier.service.js'
import SupplierService from '@/services/taminotchilar.service.js'
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

//supplier start
const suppliers = ref([])
const suppliersSelect = ref([])
onMounted(async () => {
  suppliers.value = await SupplierService.getAll()
  for (let index = 0; index < suppliers.value.length; index++) {
    const element = suppliers.value[index]
    suppliersSelect.value.push({ label: element.name, value: element.id })
  }
})
const supplierRef = ref(null)
const showChooseSupplier = ref(false)
const showAddSupplier = ref(false)
const formSupplier = reactive([
  { value: '', key: 'name', label: 'Name', type: 'input' },
  { value: '', key: 'tel', label: 'Tel', type: 'input' },
  { value: '', key: 'comment', label: 'Comment', type: 'input' },
])
const leaveSupplier = () => {
  store.dispatch('setNull')
}
const createSupplier = async (e) => {
  const vSupplier$ = useValidate(rulesSupplier, e)
  vSupplier$.value.$validate()
  store.state.modalValidations = vSupplier$
  if (!vSupplier$.value.$error) {
    try {
      const res = await SupplierService.create(e)
      suppliers.value.push(res)
      suppliersSelect.value.push({ label: res.name, value: res.id })
      if (showCreate.value) {
        create_data.value.supplier_id = res.id
        create_data.value.ost = res.qoldiq
      } else if (showUpdate.value) {
        update_data.value.supplier_id = res.id
        update_data.value.ost = res.qoldiq
      }
      showAddSupplier.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const openAddSupplier = () => {
  showAddSupplier.value = true
  showChooseSupplier.value = false
}
const rowPropsSupplier = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      showChooseSupplier.value = false
      const supplier = suppliers.value.find((val) => val.id === row.id)
      if (showCreate.value) {
        create_data.value.supplier_id = row.id
        create_data.value.ost = supplier.qoldiq
      } else if (showUpdate.value) {
        update_data.value.ost = supplier.qoldiq
        update_data.value.supplier_id = row.id
      }
    },
  }
}
const searchSupplier = (e) => {
  supplierRef.value.filter({
    name: [e],
  })
}
const rulesSupplier = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Name bo'sh bo'lmasligi kerak", required),
      maxLength: helpers.withMessage(
        'Name 30 ta belgidan oshmasligi kerak',
        maxLength(30),
      ),
    },
    tel: {
      required: helpers.withMessage("Tel bo'sh bo'lmasligi kerak", required),
      maxLength: helpers.withMessage(
        'Tel 30 ta belgidan oshmasligi kerak',
        maxLength(30),
      ),
    },
    comment: {
      required: helpers.withMessage(
        "Comment bo'sh bo'lmasligi kerak",
        required,
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
const paysupplier = ref([])
onMounted(async () => {
  paysupplier.value = await PaySupplierService.getAll()
  for (let index = 0; index < paysupplier.value.length; index++) {
    let element = paysupplier.value[index]
    element.datetime = moment
      .unix(element.datetime)
      .format('YYYY-MM-DD HH:mm:ss')
  }
})
const paysupplierRef = ref(null)
const rowProps = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      const { supplier, id, ...obj } = row
      update_data.value.supplier_id = supplier.id
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
    key: 'supplier.name',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    filter(value, row) {
      return (
        ~row.supplier.name.toLowerCase().indexOf(value.toLowerCase()) ||
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
              const { supplier, id, ...obj } = row
              update_data.value.supplier_id = supplier.id
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
                    const data = await PaySupplierService.delete(row.id)
                    message.success("Muvaffaqiyatli o'chirildi")
                    const index = suppliers.value.findIndex(
                      (val) => val.id == data.id,
                    )
                    paysupplier.value.splice(index, 1)
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
const searchPaySupplier = (e) => {
  paysupplierRef.value.filter({
    'supplier.name': [e],
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
  supplier_id: null,
  pay_type: null,
  comment: '',
  sum: 0,
  ost: '',
})
const rules = computed(() => {
  return {
    supplier_id: {
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
    supplier_id: null,
    pay_type: null,
    comment: '',
    sum: '',
    ost: '',
  }
  vCreate$.value.$reset()
}
const cancelCallback = () => {
  showCreate.value = false
  showUpdate.value = false
}
const createPaySupplier = async () => {
  vCreate$.value.$validate()
  if (!vCreate$.value.$error) {
    try {
      create_data.value.datetime = moment(create_data.value.datetime).format(
        'X',
      )
      const res = await PaySupplierService.create(create_data.value)
      res.datetime = moment.unix(res.datetime).format('YYYY-MM-DD HH:mm:ss')
      paysupplier.value.push(res)
      showCreate.value = false
    } catch (e) {
      message.error(e)
    }
  }
}
const changeSupplier = (e) => {
  const supplier = suppliers.value.find((val) => val.id == e)
  if (showCreate.value) {
    create_data.value.supplier_id = e
    create_data.value.ost = supplier.qoldiq
  } else if (showUpdate.value) {
    update_data.value.supplier_id = e
    update_data.value.ost = supplier.qoldiq
  }
}
//pay worker create end
//pay worker update start
const showUpdate = ref(false)
const update_data = ref({
  datetime: '',
  supplier_id: null,
  pay_type: null,
  comment: '',
  sum: '',
  ost: '',
})
const vUpdate$ = useValidate(rules, update_data)
const updatePaySupplier = async () => {
  vUpdate$.value.$validate()
  if (!vUpdate$.value.$error) {
    try {
      update_data.value.datetime = moment(update_data.value.datetime).format(
        'X',
      )
      const res = await PaySupplierService.update(
        updateId.value,
        update_data.value,
      )
      res.datetime = moment.unix(res.datetime).format('YYYY-MM-DD HH:mm:ss')
      updateId.value = null
      const index = paysupplier.value.findIndex((val) => val.id === res.id)
      paysupplier.value[index] = res
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
    supplier_id: null,
    pay_type: null,
    comment: '',
    sum: '',
    ost: '',
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
        @input="searchPaySupplier"
      ></n-input>
    </div>
    <n-data-table
      :data="paysupplier"
      :columns="createColumns"
      style="margin-top: 20px"
      :pagination="pagination"
      ref="paysupplierRef"
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
      title="Ta'minotchiga to'lov"
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
            <p style="font-weight: bold">Ta'minotchi</p>
            <div style="display: flex">
              <n-select
                :options="suppliersSelect"
                v-model:value="create_data.supplier_id"
                filterable
                placeholder="Tanlang"
                :on-update:value="changeSupplier"
              >
                <template #empty> Ma'lumotlar topilmadi 🙁 </template>
              </n-select>
              <n-button @click="showChooseSupplier = true">...</n-button>
            </div>
            <small>
              <n-gradient-text type="error" v-if="vCreate$.supplier_id.$error">
                {{ vCreate$.supplier_id.$errors[0].$message }}
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
          <n-button type="primary" @click="createPaySupplier">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <!--create modal end-->
    <!--update modal start-->
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Ta'minotchiga to'lov"
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
            <p style="font-weight: bold">Ta'minotchi</p>
            <div style="display: flex">
              <n-select
                :options="suppliersSelect"
                v-model:value="update_data.supplier_id"
                filterable
                placeholder="Tanlang"
                :on-update:value="changeSupplier"
              >
                <template #empty> Ma'lumotlar topilmadi 🙁 </template>
              </n-select>
              <n-button @click="showChooseSupplier = true">...</n-button>
            </div>
            <small>
              <n-gradient-text type="error" v-if="vUpdate$.supplier_id.$error">
                {{ vUpdate$.supplier_id.$errors[0].$message }}
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
          <n-button type="primary" @click="updatePaySupplier">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <!--update modal end-->
    <!--choose worker start-->
    <n-modal v-model:show="showChooseSupplier">
      <n-card
        style="width: 400px"
        title="Ta'minotchini tanlash"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <div style="display: flex">
          <n-button @click="openAddSupplier" type="primary">+</n-button>
          <n-input
            placeholder="Qidirish"
            @input="searchSupplier"
            style="margin-left: 20px"
          ></n-input>
        </div>
        <n-data-table
          :data="suppliers"
          :columns="modalColumn"
          style="margin-top: 20px"
          ref="supplierRef"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
          :rowProps="rowPropsSupplier"
        >
          <template #empty> <table-no-data></table-no-data> </template>
        </n-data-table>
      </n-card>
    </n-modal>
    <!--choose worker end-->
    <!--add worker start-->
    <n-modal
      v-model:show="showAddSupplier"
      preset="dialog"
      title="Ta'monotchi"
      :on-after-leave="leaveSupplier"
    >
      <form-data :data="formSupplier" @click="createSupplier"></form-data>
    </n-modal>
    <!--add worker end-->
  </div>
</template>
