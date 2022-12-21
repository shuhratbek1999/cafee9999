<template>
  <!--Supplier modal start-->
  <n-modal
    v-model:show="showSupplierAdd"
    title="Taminotchi qo'shish"
    preset="dialog"
    :on-after-leave="leaveExtra"
  >
    <form-data :data="formSupplier" @click="createSupplier" />
  </n-modal>
  <n-modal v-model:show="showSupplier">
    <n-card
      style="width: 400px"
      title="Taminotchi tanlash"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <div style="display: flex">
        <n-button type="primary" @click="openSupplierAdd">+</n-button>
        <n-input
          placeholder="Qidirish"
          style="margin-left: 20px"
          @input="filterSupplier"
        ></n-input>
      </div>
      <n-data-table
        :data="loadSuppliers"
        :columns="columnsModal"
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
  <!--Supplier modal end-->
  <!--Sklad modal start-->
  <n-modal
    v-model:show="showSkladAdd"
    title="Sklad qo'shish"
    preset="dialog"
    :on-after-leave="leaveExtra"
  >
    <form-data :data="formSklad" @click="createSklad" />
  </n-modal>
  <n-modal v-model:show="showSklad">
    <n-card
      style="width: 400px"
      title="Skladni tanlash"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <div style="display: flex">
        <n-button type="primary" @click="openSkladAdd">+</n-button>
        <n-input
          placeholder="Qidirish"
          style="margin-left: 20px"
          @input="filterSklad"
        ></n-input>
      </div>
      <n-data-table
        :data="loadSklats"
        :columns="columnsModal"
        style="margin-top: 20px"
        ref="skladRef"
        :max-height="300"
        :min-height="300"
        :render-cell="renderCell"
        :rowProps="rowPropsSklad"
      >
        <template #empty> <table-no-data></table-no-data> </template>
      </n-data-table>
    </n-card>
  </n-modal>
  <!--Sklad modal end-->
  <!--Measure modal start-->
  <n-modal
    v-model:show="showMeasureAdd"
    title="Birlik qo'shish"
    preset="dialog"
    :on-after-leave="leaveMeasureAdd"
  >
    <n-form>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Name</p>
        <n-input
          v-model:value="create_measure.name"
          placeholder="Kiriting"
          ref="firstInput"
        />
        <small>
          <n-gradient-text type="error" v-if="vMeasure$.name.$error">
            {{ vMeasure$.name.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <n-button type="primary" @click="createMeasure">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <n-modal v-model:show="showChooseMeasure">
    <n-card
      style="width: 400px"
      title="Birlikni tanlash"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <div style="display: flex">
        <n-button type="primary" @click="openMeasureAdd">+</n-button>
        <n-input style="margin-left: 20px" placeholder="Qidirish" />
      </div>
      <n-data-table
        :data="measures"
        :columns="columnsModal"
        style="margin-top: 20px"
        ref="measureRef"
        :max-height="300"
        :min-height="300"
        :render-cell="renderCell"
        :rowProps="rowPropsMeasure"
      >
        <template #empty> <table-no-data></table-no-data> </template>
      </n-data-table>
    </n-card>
  </n-modal>
  <!--Measure modal end-->
  <!--Product modal start-->
  <n-modal
    v-model:show="showProductAdd"
    title="Mahsulot qo'shish"
    preset="dialog"
    :on-after-leave="leaveProductAdd"
  >
    <n-form>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Name</p>
        <n-input
          v-model:value="create_product.name"
          placeholder="Kiriting"
          ref="firstInput"
        />
        <small>
          <n-gradient-text type="error" v-if="vProduct$.name.$error">
            {{ vProduct$.name.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Birlikni tanlang</p>
        <div style="display: flex">
          <n-select
            :options="measuresSelect"
            v-model:value="create_product.measure_id"
            filterable
            placeholder="Tanlang"
          >
            <template #empty> Ma'lumotlar topilmadi 🙁 </template>
          </n-select>
          <n-button @click="showChooseMeasure = true">...</n-button>
        </div>
        <small>
          <n-gradient-text type="error" v-if="vProduct$.measure_id.$error">
            {{ vProduct$.measure_id.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Sotib olish narxi</p>
        <n-input
          v-model:value="create_product.purchase_price"
          placeholder="Kiriting"
          type="number"
        />
        <small>
          <n-gradient-text type="error" v-if="vProduct$.purchase_price.$error">
            {{ vProduct$.purchase_price.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <n-button type="primary" @click="createProduct">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <n-modal v-model:show="showProduct">
    <n-card
      style="width: 400px"
      title="Mahsulotni tanlash"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <div style="display: flex">
        <n-button type="primary" @click="openProductAdd">+</n-button>
        <n-input
          placeholder="Qidirish"
          style="margin-left: 20px"
          @input="filterProduct"
        ></n-input>
      </div>
      <n-data-table
        :data="foods"
        :columns="columnsModal"
        style="margin-top: 20px"
        ref="productRef"
        :max-height="300"
        :min-height="300"
        :render-cell="renderCell"
        :rowProps="rowPropsProduct"
      >
        <template #empty> <table-no-data></table-no-data> </template>
      </n-data-table>
    </n-card>
  </n-modal>
  <!--Product modal end-->
  <n-modal
    v-model:show="showCreate"
    preset="dialog"
    title="Kirim qilish oynasi"
    style="width: 1000px"
    :close-on-esc="false"
    :on-after-leave="leave"
  >
    <n-form>
      <div style="display: flex; justify-content: space-between">
        <div
          style="
            width: 22%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Sana</p>
          <n-input :value="create_data.datetime" :disabled="true" />
        </div>

        <div
          style="
            width: 22%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">To'lov turini tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.pay_type"
              :options="pay_types"
              filterable
              placeholder="Tanlang"
              ref="firstInput"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
          </div>
        </div>
        <div
          style="
            width: 22%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Taminotchini tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.supplier_id"
              :options="suppliers"
              filterable
              placeholder="Tanlang"
              ref="firstInput"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
            <n-button @click="showSupplier = true">...</n-button>
          </div>
          <n-gradient-text type="error" v-if="vCreateData$.supplier_id.$error">
            {{ vCreateData$.supplier_id.$errors[0].$message }}
          </n-gradient-text>
        </div>
        <div
          style="
            width: 22%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Skladni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.sklad_id"
              :options="sklats"
              filterable
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
            <n-button @click="showSklad = true">...</n-button>
          </div>
          <n-gradient-text type="error" v-if="vCreateData$.sklad_id.$error">
            {{ vCreateData$.sklad_id.$errors[0].$message }}
          </n-gradient-text>
        </div>
      </div>
      <n-button
        @click="add"
        type="primary"
        style="margin-top: 20px; margin-bottom: 10px"
        >+</n-button
      >
      <n-data-table :columns="columns2" :data="createE.data">
        <template #empty><table-no-data></table-no-data></template>
      </n-data-table>
      <n-gradient-text type="error" v-if="vCreateExtra$.$error">
        Yuqoridagi ma'lumotlarni to'ldiring
      </n-gradient-text>
      <div
        style="
          width: 90%;
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
        "
      >
        <div style="display: flex; flex-direction: column; width: 50%">
          <p style="font-weight: bold">Comment</p>
          <n-input
            v-model:value="create_data.comment"
            type="textarea"
            placeholder="Commentni kiriting"
          />
        </div>
        <!-- naqd summa -->
        <div style="display: flex; flex-direction: column">
          <p style="font-weight: bold">Naqd to'lov</p>
          <n-input-number
            v-model:value="create_data.cash_sum"
            type="text"
            placeholder="Oldindan naqd to'lash"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
            :parse="parse"
            :format="format"
          >
          </n-input-number>
        </div>
        <!-- umumiy narx -->
        <div style="display: flex; flex-direction: column">
          <p style="font-weight: bold">Umumiy summa</p>
          {{
            new Intl.NumberFormat('ru-RU', {
              style: 'decimal',
            }).format(create_data.total_sum)
          }}
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 10px">
        <n-button
          @click="cancelCallback"
          style="margin-right: 10px"
          type="error"
          >Close</n-button
        >
        <n-button type="primary" @click="createKirim">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <n-modal
    v-model:show="showUpdate"
    preset="dialog"
    title="Kirimni o'zgartirish oynasi"
    style="width: 1000px"
    :close-on-esc="false"
    :on-after-leave="leave"
  >
    <n-form>
      <div style="display: flex; justify-content: space-between">
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Sana</p>
          <n-input :value="update_data.datetime" :disabled="true" />
        </div>
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Taminotchini tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="update_data.supplier_id"
              :options="suppliers"
              filterable
              placeholder="Tanlang"
              ref="firstUpdateInput"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
            <n-button @click="showSupplier = true">...</n-button>
          </div>
          <n-gradient-text type="error" v-if="vUpdateData$.supplier_id.$error">
            {{ vUpdateData$.supplier_id.$errors[0].$message }}
          </n-gradient-text>
        </div>
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Skladni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="update_data.sklad_id"
              :options="sklats"
              filterable
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
            <n-button @click="showSklad = true">...</n-button>
          </div>
          <n-gradient-text type="error" v-if="vUpdateData$.sklad_id.$error">
            {{ vUpdateData$.sklad_id.$errors[0].$message }}
          </n-gradient-text>
        </div>
      </div>
      <n-button
        @click="addUpdate"
        type="primary"
        style="margin-top: 10px; margin-bottom: 10px"
        >+</n-button
      >
      <n-data-table :columns="columnsUpdate" :data="updateE.data">
        <template #empty><table-no-data></table-no-data></template>
      </n-data-table>
      <n-gradient-text type="error" v-if="vUpdateExtra$.$error">
        Yuqoridagi ma'lumotlarni to'ldiring
      </n-gradient-text>
      <div style="width: 90%; display: flex; justify-content: space-between">
        <div style="display: flex; flex-direction: column; width: 50%">
          <p style="font-weight: bold">Comment</p>
          <n-input
            v-model:value="update_data.comment"
            type="textarea"
            placeholder="Commentni kiriting"
          />
        </div>
        <!-- naqd summa -->
        <div style="display: flex; flex-direction: column">
          <p style="font-weight: bold">Naqd to'lov</p>
          <n-input-number
            v-model:value="update_data.cash_sum"
            type="text"
            placeholder="Oldindan naqd to'lash"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
            :parse="parse"
            :format="format"
          />
        </div>
        <!-- umumiy narx -->
        <div style="display: flex; flex-direction: column">
          <p style="font-weight: bold">Umumiy summa</p>
          {{
            new Intl.NumberFormat('ru-RU', {
              style: 'decimal',
            }).format(update_data.total_sum)
          }}
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 10px">
        <n-button
          @click="cancelCallback"
          style="margin-right: 10px"
          type="error"
          >Close</n-button
        >
        <n-button type="primary" @click="updateKirim">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <div style="display: flex; justify-content: space-between">
    <n-button type="primary" @click="openCreate">+</n-button>
    <n-input
      type="text"
      placeholder="Search"
      style="width: 94%; border-radius: 5px"
      @input="filter"
    />
  </div>
  <br />
  <div style="display: flex; justify-content: space-between">
    <div style="width: 69%">
      <n-data-table
        ref="debitRef"
        :data="data"
        :columns="columns"
        :pagination="paginition"
        :rowProps="rowProps"
        :render-cell="renderCell"
      >
        <template #empty><table-no-data></table-no-data></template>
      </n-data-table>
    </div>
    <div style="width: 30%">
      <n-data-table :data="childs.data" :columns="childColumns">
        <template #empty><table-no-data></table-no-data></template>
      </n-data-table>
    </div>
  </div>
</template>
<script>
import DocdebitService from '../../../services/doc_debit_table.service'
import SupplierService from '../../../services/taminotchilar.service'
import SklatService from '../../../services/sklat.service'
import FoodService from '../../../services/food_resourse.service'
import MeasureService from '../../../services/measure.service.js'
import { reactive, ref, onMounted, h, computed } from 'vue'
import {
  NButton,
  NIcon,
  NSelect,
  useDialog,
  useMessage,
  NTag,
  NText,
  NInputNumber,
} from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import Click from '@vicons/fluent/CursorClick20Regular'
import Cancel from '@vicons/material/CancelFilled'
import moment from 'moment'
import useValidate from '@vuelidate/core'
import { required, helpers, maxLength, numeric } from '@vuelidate/validators'
import TableNoData from '../../../components/TableNoData.vue'
import FormData from '../../components/FormData.vue'
import { useStore } from 'vuex'
const createColumns = ({ update, del, click }) => {
  return [
    {
      title: '#',
      key: 'no',
      width: 50,
      render: (_, index) => {
        return index + 1
      },
    },
    {
      title: 'Yuk beruvchi',
      key: 'supplier.name',
      sorter: (row1, row2) =>
        row1.supplier.name.localeCompare(row2.supplier.name),
    },
    {
      title: 'Sana',
      key: 'datetime',
      sorter: (row1, row2) => new Date(row1.datetime) - new Date(row2.datetime),
    },
    {
      title: 'Umumiy summa',
      key: 'total_sum',
      sorter: (row1, row2) => row1.total_sum - row2.total_sum,
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.total_sum,
        )
      },
      filter(value, row) {
        return (
          ~row.supplier.name.toLowerCase().indexOf(value.toLowerCase()) ||
          ~row.datetime.toLowerCase().indexOf(value.toLowerCase()) ||
          ~row.total_sum.toString().indexOf(value)
        )
      },
    },
    {
      title: 'Action',
      key: 'actions',
      render(row, index) {
        return [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              style: {
                height: '35px',
                fontSize: '20px',
              },
              onClick: () => click(row, index),
            },
            {
              icon: () =>
                h(NIcon, {
                  component: Click,
                }),
            },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              style: {
                height: '35px',
                marginLeft: '10px',
              },
              onClick: (e) => update(row, e),
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
              onClick: (e) => del(row, index, e),
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
}
const createChildcolumns = () => {
  return [
    {
      title: 'Mahsulot',
      key: 'food_resource.name',
    },
    {
      title: 'Miqdori',
      key: 'amount',
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.amount,
        )
      },
    },
    {
      title: 'Narxi',
      key: 'price',
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.price,
        )
      },
    },
    {
      title: 'Summa',
      key: 'sum',
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.sum,
        )
      },
    },
  ]
}
const modalColumn = () => {
  return [
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
}
export default {
  components: {
    TableNoData,
    FormData,
  },
  setup() {
    const parse = (input) => {
      const nums = input.replace(/\s/g, '').trim()
      if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
      return nums === '' ? null : Number.NaN
    }
    const format = (value) => {
      if (value === null) return ''
      return value.toLocaleString('ru-RU')
    }

    let data = ref([])
    const firstInput = ref(null)
    const firstUpdateInput = ref(null)
    let create_data = ref({
      datetime: '',
      comment: '',
      cash_sum: 0,
      measure_id: null,
      supplier_id: null,
      sklad_id: null,
      pay_type: 'cash',
      total_sum: 0,
    })
    let update_data = ref({
      datetime: '',
      comment: '',
      cash_sum: '',
      measure_id: null,
      supplier_id: null,
      sklad_id: null,
      pay_type: 'cash',
      total_sum: 0,
    })
    let updateId = ref(null)
    const createE = ref({
      data: [],
    })
    const updateE = ref({
      data: [],
    })
    let suppliers = ref([])
    let pay_types = ref([
      {
        label: 'Naqd',
        value: 'cash',
      },
      {
        label: 'Plastik',
        value: 'plastic',
      },
    ])
    let loadSuppliers = ref([])
    let sklats = ref([])
    let loadSklats = ref([])
    let foodsSelect = ref([])
    let foods = ref([])
    const store = useStore()
    let childs = ref({
      id: null,
      data: [],
    })
    let showCreate = ref(false)
    let showUpdate = ref(false)
    let showSupplier = ref(false)
    let showSupplierAdd = ref(false)
    let showSklad = ref(false)
    let showSkladAdd = ref(false)
    const debitInst = ref(null)
    const supplierInst = ref(null)
    const message = useMessage()
    const dialog = useDialog()
    const openCreate = function () {
      create_data.value.datetime = moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss',
      )
      showCreate.value = true
    }
    let measuresSelect = reactive([])
    let measures = ref([])
    onMounted(async () => {
      data.value = await DocdebitService.getAll()
      for (let index = 0; index < data.value.length; index++) {
        const element = data.value[index]
        element['datetime'] = moment
          .unix(element.datetime)
          .format('YYYY-MM-DD HH:mm:ss')
      }
      loadSuppliers.value = await SupplierService.getAll()
      for (let index = 0; index < loadSuppliers.value.length; index++) {
        const element = loadSuppliers.value[index]
        suppliers.value.push({ label: element.name, value: element.id })
      }
      loadSklats.value = await SklatService.getAll()
      for (let index = 0; index < loadSklats.value.length; index++) {
        const element = loadSklats.value[index]
        sklats.value.push({ label: element.name, value: element.id })
      }
      foods.value = await FoodService.getAll()
      for (let index = 0; index < foods.value.length; index++) {
        const element = foods.value[index]
        foodsSelect.value.push({ label: element.name, value: element.id })
      }
      measures.value = await MeasureService.getAll()
      for (let index = 0; index < measures.value.length; index++) {
        const element = measures.value[index]
        measuresSelect.push({ label: element.name, value: element.id })
      }
    })
    const add = function () {
      createE.value.data.push({
        food_resource_id: null,
        amount: 0,
        measure: '',
        measure_id: '',
        price: 0,
        sum: '',
      })
    }
    const addUpdate = function () {
      updateE.value.data.push({
        food_resource_id: null,
        amount: '',
        measure: '',
        measure_id: '',
        price: '',
        sum: '',
      })
    }
    const createColumnsE = ({ del, addProduct }) => [
      {
        title: 'Mahsulot',
        key: 'food_resource_id',
        className: 'foodR',
        render(row, index) {
          return [
            h(
              NSelect,
              {
                value: row.food_resource_id,
                options: foodsSelect.value,
                placeholder: 'Tanlang',
                filterable: true,
                style: {
                  width: '200px',
                  marginBottom: '12px',
                },
                onUpdateValue(v) {
                  createE.value.data[index].food_resource_id = v
                  const food = foods.value.find((val) => val.id == v)
                  createE.value.data[index].price = food.purchase_price
                  createE.value.data[index].measure = food.measure.name
                  createE.value.data[index].measure_id = food.measure.id
                  if (createE.value.data[index].amount != '') {
                    createE.value.data[index].sum =
                      Number(createE.value.data[index].price) *
                      Number(createE.value.data[index].amount)
                    create_data.value.total_sum = 0
                    for (
                      let index = 0;
                      index < createE.value.data.length;
                      index++
                    ) {
                      const element = createE.value.data[index]
                      if (element.sum != '') {
                        create_data.value.total_sum += Number(element.sum)
                      }
                    }
                  }
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
              onClick: () => addProduct(index),
            }),
          ]
        },
      },
      {
        title: 'Miqdori',
        key: 'amount',
        render(row, index) {
          return h(NInputNumber, {
            value: row.amount,
            placeholder: 'miqdori',
            type: 'number',
            parse: parse,
            format: format,
            'show-button': false,
            keyboard: {
              ArrowUp: false,
              ArrowDown: false,
            },
            onUpdateValue(v) {
              createE.value.data[index].amount = v
              if (v == '') {
                createE.value.data[index].sum = '0'
              } else {
                createE.value.data[index].sum =
                  Number(v) * Number(createE.value.data[index].price)
              }
              create_data.value.total_sum = 0
              for (let index = 0; index < createE.value.data.length; index++) {
                const element = createE.value.data[index]
                if (element.sum != '') {
                  create_data.value.total_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            },
          })
        },
      },
      {
        title: "O'lchov birligi",
        key: 'measure',
        render(row) {
          return h(NTag, {
            innerHTML: row.measure,
            style: {
              backgroundColor: '#fafafc',
              width: '100px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Narxi',
        key: 'price',
        render(row, index) {
          return h(NInputNumber, {
            value: row.price,
            placeholder: 'narxi',
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
              if (v == '') {
                createE.value.data[index].sum = '0'
              } else {
                createE.value.data[index].sum =
                  Number(v) * Number(createE.value.data[index].amount)
              }
              create_data.value.total_sum = 0
              for (let index = 0; index < createE.value.data.length; index++) {
                const element = createE.value.data[index]
                if (element.sum != '') {
                  create_data.value.total_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            },
          })
        },
      },
      {
        title: 'Summa',
        key: 'sum',
        render(row) {
          return h(NTag, {
            innerHTML: new Intl.NumberFormat('ru-RU', {
              style: 'decimal',
            }).format(row.sum),
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Actions',
        test: 'actions',
        render(row, index) {
          return [
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                style: {
                  height: '35px',
                  marginLeft: '10px',
                },
                onClick: () => del(row, index),
              },
              {
                icon: () =>
                  h(NIcon, {
                    component: Cancel,
                  }),
              },
            ),
          ]
        },
      },
    ]
    const updateColumnsE = ({ del, addProduct }) => [
      {
        title: 'Mahsulot',
        key: 'food_resource_id',
        className: 'foodR',
        render(row, index) {
          return [
            h(
              NSelect,
              {
                value: row.food_resource_id,
                options: foodsSelect.value,
                filterable: true,
                placeholder: 'Tanlang',
                style: {
                  width: '200px',
                  marginBottom: '12px',
                },
                onUpdateValue(v) {
                  updateE.value.data[index].food_resource_id = v
                  const food = foods.value.find((val) => val.id == v)
                  updateE.value.data[index].price = food.purchase_price
                  updateE.value.data[index].measure = food.measure.name
                  updateE.value.data[index].measure_id = food.measure.id
                  if (updateE.value.data[index].amount != '') {
                    updateE.value.data[index].sum =
                      Number(updateE.value.data[index].price) *
                      Number(updateE.value.data[index].amount)
                    update_data.value.total_sum = 0
                    for (
                      let index = 0;
                      index < updateE.value.data.length;
                      index++
                    ) {
                      const element = updateE.value.data[index]
                      if (element.sum != '') {
                        update_data.value.total_sum += Number(element.sum)
                      }
                    }
                  }
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
                marginBottom: '12px',
              },
              innerHTML: '...',
              onClick: () => addProduct(index),
            }),
          ]
        },
      },
      {
        title: 'Miqdori',
        key: 'amount',
        render(row, index) {
          return h(NInputNumber, {
            value: row.amount,
            type: 'number',
            parse: parse,
            format: format,
            keyboard: {
              ArrowUp: false,
              ArrowDown: false,
            },
            'show-button': false,
            onUpdateValue(v) {
              updateE.value.data[index].amount = v
              if (updateE.value.data[index].amount == '') {
                updateE.value.data[index].sum = '0'
              } else {
                updateE.value.data[index].sum =
                  Number(v) * Number(updateE.value.data[index].price)
              }
              update_data.value.total_sum = 0
              for (let index = 0; index < updateE.value.data.length; index++) {
                const element = updateE.value.data[index]
                if (element.sum != '') {
                  update_data.value.total_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            },
          })
        },
      },
      {
        title: "O'lchov birligi",
        key: 'measure',
        render(row) {
          return h(NTag, {
            innerHTML: row.measure,
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Narxi',
        key: 'price',
        render(row, index) {
          return h(NInputNumber, {
            value: row.price,
            placeholder: 'narxi',
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
              if (updateE.value.data[index].price == '') {
                updateE.value.data[index].sum = '0'
              } else {
                updateE.value.data[index].sum =
                  Number(v) * Number(updateE.value.data[index].amount)
              }
              update_data.value.total_sum = 0
              for (let index = 0; index < updateE.value.data.length; index++) {
                const element = updateE.value.data[index]
                if (element.sum != '') {
                  update_data.value.total_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            },
          })
        },
      },
      {
        title: 'Summa',
        key: 'sum',
        render(row) {
          return h(NTag, {
            innerHTML: new Intl.NumberFormat('ru-RU', {
              style: 'decimal',
            }).format(row.sum),
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Actions',
        test: 'actions',
        render(row, index) {
          return [
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                style: {
                  height: '35px',
                  marginLeft: '10px',
                },
                onClick: () => del(row, index),
              },
              {
                icon: () =>
                  h(NIcon, {
                    component: Cancel,
                  }),
              },
            ),
          ]
        },
      },
    ]
    const rulesData = computed(() => {
      return {
        sklad_id: {
          required: helpers.withMessage('Skladni tanlang', required),
        },
        supplier_id: {
          required: helpers.withMessage('Taminotchini tanlang', required),
        },
      }
    })
    const rulesExtraData = computed(() => {
      return {
        data: {
          $each: helpers.forEach({
            food_resource_id: {
              required: helpers.withMessage('Mahsulotni tanlang', required),
            },
            amount: {
              required: helpers.withMessage("Miqdorni to'ldiring", required),
            },
          }),
        },
      }
    })
    const vCreateData$ = useValidate(rulesData, create_data)
    const vCreateExtra$ = useValidate(rulesExtraData, createE)
    const vUpdateData$ = useValidate(rulesData, update_data)
    const vUpdateExtra$ = useValidate(rulesExtraData, updateE)
    const createKirim = function () {
      vCreateData$.value.$validate()
      vCreateExtra$.value.$validate()
      if (!vCreateData$.value.$error && !vCreateExtra$.value.$error) {
        create_data.value.datetime = moment(create_data.value.datetime).format(
          'X',
        )
        for (let index = 0; index < createE.value.data.length; index++) {
          const element = createE.value.data[index]
          delete element['measure']
        }
        create_data.value['doc_debit_table'] = createE.value.data
        DocdebitService.create(create_data.value)
          .then((res) => {
            res.doc_debit['datetime'] = moment
              .unix(res.doc_debit['datetime'])
              .format('YYYY-MM-DD HH:mm:ss')
            data.value.push(res.doc_debit)
            create_data.value = {
              datetime: '',
              comment: '',
              cash_sum: 0,
              supplier_id: null,
              sklad_id: null,
              total_sum: 0,
            }
            createE.value.data = []
            showCreate.value = false
          })
          .catch((e) => {
            message.error(e)
          })
      }
    }
    const updateKirim = function () {
      vUpdateData$.value.$validate()
      vUpdateExtra$.value.$validate()
      if (!vUpdateData$.value.$error && !vUpdateExtra$.value.$error) {
        update_data.value.datetime = moment(update_data.value.datetime).format(
          'X',
        )
        for (let index = 0; index < updateE.value.data.length; index++) {
          const element = updateE.value.data[index]
          delete element['measure']
        }
        update_data.value['doc_debit_table'] = updateE.value.data
        DocdebitService.update(updateId.value, update_data.value).then(
          (res) => {
            res['datetime'] = moment
              .unix(res['datetime'])
              .format('YYYY-MM-DD HH:mm:ss')
            const index = data.value.findIndex((val) => val.id == res.id)
            data.value[index] = res
            update_data.value = {
              datetime: '',
              comment: '',
              cash_sum: 0,
              supplier_id: null,
              sklad_id: null,
              total_sum: 0,
            }
            updateE.value.data = []
            showUpdate.value = false
          },
        )
      }
    }
    const del = function (row) {
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          message.success('Ishladi')
          DocdebitService.delete(row.id).then((res) => {
            message.success("Muvaffaqiyatli o'chirildi")
            const index = data.value.findIndex((val) => val.id == res.id)
            data.value.splice(index, 1)
            if (row.id == childs.value.id) {
              childs.value.data = []
              childs.value.id = null
            }
          })
        },
        onNegativeClick: () => {
          message.info("O'chirilmadi")
        },
      })
    }
    const cancelCallback = function () {
      showCreate.value = false
      showUpdate.value = false
      leave()
    }
    const leave = function () {
      updateE.value.data = []
      createE.value.data = []
      updateId.value = null
      create_data.value = {
        datetime: '',
        comment: '',
        cash_sum: 0,
        supplier_id: null,
        sklad_id: null,
        pay_type: 'cash',
        total_sum: 0,
      }
      update_data.value = {
        datetime: '',
        comment: '',
        cash_sum: 0,
        supplier_id: null,
        sklad_id: null,
        pay_type: 'cash',
        total_sum: 0,
      }
      vCreateData$.value.$reset()
      vUpdateData$.value.$reset()
    }
    const rowProps = (row, index) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          childs.value.id = row.id
          childs.value.data = data.value[index].doc_tables
        },
      }
    }
    const filter = (e) => {
      debitInst.value.filter({
        total_sum: [e],
      })
    }
    const leaveExtra = () => {
      store.dispatch('setNull')
    }
    //sklad start
    const formSklad = reactive([
      { value: '', key: 'name', label: 'Nomi', type: 'input' },
      {
        value: 0,
        key: 'show',
        label: "Menyuda ko'rsatish",
        type: 'switch',
      },
    ])
    const openSkladAdd = () => {
      showSklad.value = false
      showSkladAdd.value = true
    }
    const rulesSklad = computed(() => {
      return {
        name: {
          required: helpers.withMessage(
            "Name bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 20 ta belgidan oshmasligi kerak',
            maxLength(20),
          ),
        },
      }
    })
    const createSklad = (e) => {
      const vSklad$ = useValidate(rulesSklad, e)
      vSklad$.value.$validate()
      store.state.modalValidations = vSklad$
      if (!vSklad$.value.$error) {
        SklatService.create(e).then((res) => {
          loadSklats.value.push(res)
          sklats.value.push({ label: res.name, value: res.id })
          if (showCreate.value) {
            create_data.value.sklad_id = res.id
          } else if (showUpdate.value) {
            update_data.value.sklad_id = res.id
          }
          showSkladAdd.value = false
        })
      }
    }
    const skladInst = ref(null)
    const filterSklad = (e) => {
      skladInst.value.filter({
        name: [e],
      })
    }
    const rowPropsSklad = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          if (showCreate.value) {
            create_data.value.sklad_id = row.id
            showSklad.value = false
          } else if (showUpdate.value) {
            update_data.value.sklad_id = row.id
            showSklad.value = false
          }
        },
      }
    }
    //sklad end
    //start supplier
    const formSupplier = reactive([
      { value: '', key: 'name', label: 'Name', type: 'input' },
      { value: '', key: 'tel', label: 'Tel', type: 'input' },
      { value: '', key: 'comment', label: 'Comment', type: 'input' },
    ])
    const rulesSupplier = computed(() => {
      return {
        name: {
          required: helpers.withMessage(
            "Name bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 30 ta belgidan oshmasligi kerak',
            maxLength(30),
          ),
        },
        tel: {
          required: helpers.withMessage(
            "Tel bo'sh bo'lmasligi kerak",
            required,
          ),
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
    const createSupplier = (e) => {
      const vSupplier$ = useValidate(rulesSupplier, e)
      vSupplier$.value.$validate()
      store.state.modalValidations = vSupplier$
      if (!vSupplier$.value.$error) {
        SupplierService.create(e).then((res) => {
          loadSuppliers.value.push(res)
          suppliers.value.push({ label: res.name, value: res.id })
          if (showCreate.value) {
            create_data.value.supplier_id = res.id
            showSupplierAdd.value = false
          } else if (showUpdate.value) {
            update_data.value.supplier_id = res.id
            showSupplierAdd.value = false
          }
        })
      }
    }
    const filterSupplier = (e) => {
      supplierInst.value.filter({
        name: [e],
      })
    }
    const openSupplierAdd = () => {
      showSupplier.value = false
      showSupplierAdd.value = true
    }
    const rowPropsSupplier = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          if (showCreate.value) {
            create_data.value.supplier_id = row.id
            showSupplier.value = false
          } else if (showUpdate.value) {
            update_data.value.supplier_id = row.id
            showSupplier.value = false
          }
        },
      }
    }
    //end supplier

    //measure start
    const rulesMeasure = computed(() => {
      return {
        name: {
          required: helpers.withMessage(
            "Name bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 20 ta belgidan oshmasligi kerak',
            maxLength(20),
          ),
        },
      }
    })
    const showMeasureAdd = ref(false)
    const showChooseMeasure = ref(false)
    const create_measure = reactive({
      name: '',
    })
    const vMeasure$ = useValidate(rulesMeasure, create_measure)
    const openMeasureAdd = () => {
      showMeasureAdd.value = true
      showChooseMeasure.value = false
    }
    const createMeasure = () => {
      vMeasure$.value.$validate()
      if (!vMeasure$.value.$error) {
        MeasureService.create(create_measure).then((res) => {
          measures.value.push(res)
          measuresSelect.push({ label: res.name, value: res.id })
          create_product.measure_id = res.id
          showMeasureAdd.value = false
        })
      }
    }
    const rowPropsMeasure = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          create_product.measure_id = row.id
          showChooseMeasure.value = false
        },
      }
    }
    const leaveMeasureAdd = () => {
      vMeasure$.value.$reset()
      create_measure.name = ''
    }
    //measure end
    //product start
    const indexOfSelect = ref(null)
    const showProduct = ref(false)
    const showProductAdd = ref(false)
    const productInst = ref(null)
    const rulesProduct = computed(() => {
      return {
        name: {
          required: helpers.withMessage(
            "Name bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 30 ta belgidan oshmasligi kerak',
            maxLength(30),
          ),
        },
        measure_id: {
          required: helpers.withMessage(
            "O'lchov birligi tanlanishi kerak",
            required,
          ),
        },
        purchase_price: {
          required: helpers.withMessage(
            "Sotib olish narxi bo'sh bo'lmasligi kerak",
            required,
          ),
          numeric: helpers.withMessage(
            "Sotib olish narxi son bo'lishi kerak",
            numeric,
          ),
        },
      }
    })
    const filterProduct = (e) => {
      productInst.value.filter({
        name: [e],
      })
    }
    const openProductAdd = () => {
      showProduct.value = false
      showProductAdd.value = true
    }
    const create_product = reactive({
      name: '',
      measure_id: null,
      purchase_price: '',
    })
    const vProduct$ = useValidate(rulesProduct, create_product)
    const createProduct = () => {
      vProduct$.value.$validate()
      if (!vProduct$.value.$error) {
        FoodService.create(create_product).then((res) => {
          foods.value.push(res)
          foodsSelect.value.push({ label: res.name, value: res.id })
          if (showCreate.value) {
            const index = indexOfSelect.value
            createE.value.data[index].food_resource_id = res.id
            createE.value.data[index].price = res.purchase_price
            createE.value.data[index].measure = res.measure.name
            createE.value.data[index].measure_id = res.measure.id
            if (createE.value.data[index].amount != '') {
              createE.value.data[index].sum =
                Number(createE.value.data[index].price) *
                Number(createE.value.data[index].amount)
              create_data.value.total_sum = 0
              for (let index = 0; index < createE.value.data.length; index++) {
                const element = createE.value.data[index]
                if (element.sum != '') {
                  create_data.value.total_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            }
            createE.value.data[index].price =
              createE.value.data[index].price.toString()
            showProductAdd.value = false
          } else if (showUpdate.value) {
            const index = indexOfSelect.value
            updateE.value.data[index].food_resource_id = res.id
            updateE.value.data[index].price = res.purchase_price
            updateE.value.data[index].measure = res.measure.name
            updateE.value.data[index].measure_id = res.measure.id
            if (updateE.value.data[index].amount != '') {
              updateE.value.data[index].sum =
                Number(updateE.value.data[index].price) *
                Number(updateE.value.data[index].amount)
              update_data.value.total_sum = 0
              for (let index = 0; index < updateE.value.data.length; index++) {
                const element = updateE.value.data[index]
                if (element.sum != '') {
                  update_data.value.total_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            }
            updateE.value.data[index].price =
              updateE.value.data[index].price.toString()
            showProductAdd.value = false
          }
        })
      }
    }
    const rowPropsProduct = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          const index = indexOfSelect.value
          if (showCreate.value) {
            createE.value.data[index].food_resource_id = row.id
            const food = foods.value.find((val) => val.id == row.id)
            createE.value.data[index].price = food.purchase_price
            createE.value.data[index].measure = food.measure.name
            createE.value.data[index].measure_id = food.measure.id
            if (createE.value.data[index].amount != '') {
              createE.value.data[index].sum =
                Number(createE.value.data[index].price) *
                Number(createE.value.data[index].amount)
              create_data.value.total_sum = 0
              for (let index = 0; index < createE.value.data.length; index++) {
                const element = createE.value.data[index]
                if (element.sum != '') {
                  create_data.value.total_sum += Number(element.sum)
                }
              }
            }
            showProduct.value = false
          } else if (showUpdate.value) {
            const index = indexOfSelect.value
            updateE.value.data[index].food_resource_id = row.id
            const food = foods.value.find((val) => val.id == row.id)
            updateE.value.data[index].price = food.purchase_price
            updateE.value.data[index].measure = food.measure.name
            updateE.value.data[index].measure_id = food.measure.id
            if (updateE.value.data[index].amount != '') {
              updateE.value.data[index].sum =
                Number(updateE.value.data[index].price) *
                Number(updateE.value.data[index].amount)
              update_data.value.total_sum = 0
              for (let index = 0; index < updateE.value.data.length; index++) {
                const element = updateE.value.data[index]
                if (element.sum != '') {
                  update_data.value.total_sum += Number(element.sum)
                }
              }
            }
            showProduct.value = false
          }
        },
      }
    }
    const leaveProductAdd = () => {
      vProduct$.value.$reset()
      create_product.name = ''
      create_product.measure_id = null
      create_product.purchase_price = ''
      indexOfSelect.value = null
    }
    //product end
    return {
      showProduct,
      showProductAdd,
      openProductAdd,
      rowProps,
      rowPropsProduct,
      create_product,
      formSupplier,
      formSklad,
      createSupplier,
      createSklad,
      measures,
      createProduct,
      data,
      debitRef: debitInst,
      supplierRef: supplierInst,
      skladRef: skladInst,
      productRef: productInst,
      rowPropsSupplier,
      rowPropsMeasure,
      filterSupplier,
      firstInput,
      firstUpdateInput,
      filterSklad,
      filterProduct,
      leaveProductAdd,
      leaveMeasureAdd,
      showCreate,
      showUpdate,
      showSupplier,
      showSupplierAdd,
      openSupplierAdd,
      showMeasureAdd,
      openMeasureAdd,
      create_measure,
      showSklad,
      showSkladAdd,
      openSkladAdd,
      createMeasure,
      showChooseMeasure,
      create_data,
      update_data,
      foods,
      updateId,
      vCreateData$,
      vCreateExtra$,
      vProduct$,
      vUpdateData$,
      vUpdateExtra$,
      vMeasure$,
      suppliers,
      pay_types,
      sklats,
      loadSuppliers,
      loadSklats,
      rowPropsSklad,
      childs,
      openCreate,
      leaveExtra,
      leave,
      createKirim,
      updateKirim,
      measuresSelect,
      filter,
      cancelCallback,
      paginition: {
        pageSize: 6,
      },
      createE,
      updateE,
      add,
      addUpdate,
      columnsUpdate: updateColumnsE({
        del(row, index) {
          if (updateE.value.data[index].sum != '') {
            update_data.value.total_sum -= updateE.value.data[index].sum
          }
          updateE.value.data.splice(index, 1)
        },
        addProduct(index) {
          indexOfSelect.value = index
          showProduct.value = true
        },
      }),
      renderCell: (value) => {
        if (!value) {
          return h(NText, { depth: 3 }, { default: () => 'empty' })
        }
        return value
      },
      format,
      parse,
      columns: createColumns({
        click(row, index) {
          childs.value.id = row.id
          childs.value.data = data.value[index].doc_tables
        },
        del(row, index, e) {
          e.stopPropagation()
          del(row, index)
        },
        update(row, e) {
          e.stopPropagation()
          updateId.value = row.id
          update_data.value.datetime = row.datetime
          update_data.value.sklad_id = row.sklad.id
          update_data.value.supplier_id = row.supplier.id
          update_data.value.total_sum = row.total_sum
          update_data.value.comment = row.comment
          update_data.value.cash_sum = row.cash_sum
          for (let index = 0; index < row.doc_tables.length; index++) {
            const element = row.doc_tables[index]
            updateE.value.data.push({
              food_resource_id: element.food_resource.id,
              amount: element.amount,
              measure: element.food_resource.measure.name,
              measure_id: element.food_resource.measure.id,
              price: element.price,
              sum: element.sum,
            })
          }
          showUpdate.value = true
        },
      }),
      columns2: createColumnsE({
        del(row, index) {
          if (createE.value.data[index].sum != '') {
            create_data.value.total_sum -= createE.value.data[index].sum
          }
          createE.value.data.splice(index, 1)
        },
        addProduct(index) {
          indexOfSelect.value = index
          showProduct.value = true
        },
      }),
      childColumns: createChildcolumns(),
      columnsModal: modalColumn(),
    }
  },
}
</script>

<style>
.foodR {
  display: flex;
  margin-top: 12px;
}
</style>
