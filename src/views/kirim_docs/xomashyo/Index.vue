<template>
  <div>
    <n-modal v-model:show="showMeasureAdd" :on-after-leave="leaveMeasure">
      <n-card
        title="Birlik qo'shish"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        style="width: 400px"
      >
        <n-form>
          <n-input
            v-model:value="create_measure_data.name"
            placeholder="Kiriting"
          />
          <small>
            <n-gradient-text type="error" v-if="vCreateMeasure$.name.$error">
              {{ vCreateMeasure$.name.$errors[0].$message }}
            </n-gradient-text>
          </small>
          <div
            style="display: flex; justify-content: flex-end; margin-top: 10px"
          >
            <n-button type="primary" @click="createMeasure">Submit</n-button>
          </div>
        </n-form>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showMeasure">
      <n-card
        title="O'chov birliklar"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        style="width: 400px"
      >
        <div style="display: flex; margin-bottom: 10px">
          <n-button type="primary" @click="openMeasureAdd">+</n-button>
          <n-input
            style="margin-left: 10px"
            placeholder="Qidirish"
            @input="searchMeasure"
          />
        </div>
        <n-data-table
          :data="loadMeasures"
          :columns="columnsMeasure"
          :rowProps="rowPropsMeasure"
          ref="measureRef"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
        >
          <template #empty><table-no-data></table-no-data></template>
        </n-data-table>
      </n-card>
    </n-modal>
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Xomashyo qo'shish"
      :on-after-leave="leave"
    >
      <n-form>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Name</p>
          <n-input
            v-model:value="create_data.name"
            placeholder="Kiriting"
            ref="firstInput"
          />
          <small>
            <n-gradient-text type="error" v-if="vCreate$.name.$error">
              {{ vCreate$.name.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Birlikni tanlang</p>
          <div style="display: flex">
            <n-select
              :options="measureItems"
              v-model:value="create_data.measure_id"
              filterable
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
            <n-button @click="showMeasure = true">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vCreate$.measure_id.$error">
              {{ vCreate$.measure_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Sotib olish narxi</p>
          <n-input-number
            :parse="parse"
            :format="format"
            v-model:value="create_data.purchase_price"
            placeholder="Kiriting"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
          />
          <small>
            <n-gradient-text type="error" v-if="vCreate$.purchase_price.$error">
              {{ vCreate$.purchase_price.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; justify-content: flex-end">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="createFood">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Xomashyoni o'zgartirish"
      :on-after-leave="leave"
    >
      <n-form>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Name</p>
          <n-input
            v-model:value="update_data.name"
            placeholder="Kiriting"
            ref="firstUpdateInput"
          />
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.name.$error">
              {{ vUpdate$.name.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Birlikni tanlang</p>
          <div style="display: flex">
            <n-select
              :options="measureItems"
              v-model:value="update_data.measure_id"
              filterable
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
            <n-button @click="showMeasure = true">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.measure_id.$error">
              {{ vUpdate$.measure_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Sotib olish narxi</p>
          <n-input-number
            v-model:value="update_data.purchase_price"
            :parse="parse"
            :format="format"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
          ></n-input-number>
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.purchase_price.$error">
              {{ vUpdate$.purchase_price.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; justify-content: flex-end">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="updateFood">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <div style="display: flex; justify-content: space-between">
      <n-button type="primary" @click="showCreate = true">+</n-button>
      <n-input
        type="text"
        placeholder="Search"
        style="width: 94%; border-radius: 5px"
        @input="filter"
      />
    </div>
    <br />
    <n-space vertical :size="12">
      <n-data-table
        ref="resourseRef"
        :data="data"
        :bordered="false"
        :columns="columns"
        :rowProps="rowProps"
        :pagination="pagination"
        :renderCell="renderCell"
      >
        <template #empty><table-no-data></table-no-data></template>
      </n-data-table>
    </n-space>
  </div>
</template>
<script>
import Food_resourseService from '../../../services/food_resourse.service'
import MeasureService from '../../../services/measure.service'
import { h, ref, computed, onMounted, reactive, watchEffect } from 'vue'
import { NButton, NIcon, useMessage, useDialog, NText } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import { required, maxLength, numeric, helpers } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import TableNoData from '../../../components/TableNoData.vue'
const columnsMeasure = () => {
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
const createColumns = ({ update, del }) => {
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
      defaultSortOrder: 'ascend',
      sorter: 'default',
      filter(value, row) {
        return (
          ~row.name.toLowerCase().indexOf(value.toLowerCase()) ||
          ~row.purchase_price.toString().indexOf(value)
        )
      },
    },
    {
      title: 'Sotib olish narxi',
      key: 'purchase_price',
      sorter: (row1, row2) => row1.purchase_price - row2.purchase_price,
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.purchase_price,
        )
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
              type: 'primary',
              style: {
                height: '35px',
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
              onClick: (e) => del(row, e),
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
export default {
  name: 'XomashyoView',
  components: {
    TableNoData,
  },
  setup() {
    const data = ref([])
    const create_data = ref({
      name: '',
      measure_id: null,
      purchase_price: 0,
    })
    let create_measure_data = reactive({
      name: '',
    })
    const update_data = ref({
      name: '',
      measure_id: null,
      purchase_price: 0,
    })
    const message = useMessage()
    const dialog = useDialog()
    const resourseInst = ref(null)
    const measureInst = ref(null)
    const firstInput = ref(null)
    const firstUpdateInput = ref(null)
    const rules = computed(() => {
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
    const vCreateMeasure$ = useVuelidate(rulesMeasure, create_measure_data)
    const vCreate$ = useVuelidate(rules, create_data)
    const vUpdate$ = useVuelidate(rules, update_data)
    let updateId = ref(0)
    let showCreate = ref(false)
    let showUpdate = ref(false)
    let showMeasure = ref(false)
    let showMeasureAdd = ref(false)
    let loadMeasures = ref([])
    let measureItems = ref([])
    const del = function (id) {
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          Food_resourseService.delete(id).then((res) => {
            message.success(`Muvaffaqiyatli o'chirildi`)
            const index = data.value.findIndex((val) => val.id == res.id)
            data.value.splice(index, 1)
          })
        },
        onNegativeClick: () => {
          message.info("O'chirilmadi")
        },
      })
    }
    const createMeasure = () => {
      vCreateMeasure$.value.$validate()
      if (!vCreateMeasure$.value.$error) {
        MeasureService.create(create_measure_data).then((res) => {
          if (showCreate.value) {
            create_data.value.measure_id = res.id
          } else if (showUpdate.value) {
            update_data.value.measure_id = res.id
          }
          measureItems.value.push({ label: res.name, value: res.id })
          loadMeasures.value.push(res)
          vCreateMeasure$.value.$reset()
          create_measure_data.name = ''
          showMeasureAdd.value = false
        })
      }
    }
    const createFood = function () {
      vCreate$.value.$validate()
      if (!vCreate$.value.$error) {
        Food_resourseService.create(create_data.value).then((res) => {
          data.value.push(res)
          create_data.value = {
            name: '',
            tel: '',
            comment: '',
          }
        })
        showCreate.value = false
      }
    }
    const updateFood = function () {
      vUpdate$.value.$validate()
      if (!vUpdate$.value.$error) {
        Food_resourseService.update(updateId.value, update_data.value).then(
          (res) => {
            const index = data.value.findIndex((val) => val.id == res.id)
            data.value[index] = res
            updateId.value = 0
          },
        )
        showUpdate.value = false
      }
    }
    const cancelCallback = function () {
      showCreate.value = false
      showUpdate.value = false
      leave()
    }
    const leave = function () {
      create_data.value = {
        name: '',
        measure_id: null,
        purchase_price: 0,
      }
      update_data.value = {
        name: '',
        measure_id: null,
        purchase_price: 0,
      }
      vCreate$.value.$reset()
      vUpdate$.value.$reset()
    }
    const leaveMeasure = () => {
      create_measure_data.name = ''
      vCreateMeasure$.value.$reset()
    }
    onMounted(async () => {
      data.value = await Food_resourseService.getAll()
      loadMeasures.value = await MeasureService.getAll()
      for (let index = 0; index < loadMeasures.value.length; index++) {
        const element = loadMeasures.value[index]
        measureItems.value.push({ label: element.name, value: element.id })
      }
    })
    const rowProps = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          updateId.value = row.id
          if ('measure' in row) {
            row['measure_id'] = row.measure.id
          }
          showUpdate.value = true
          update_data.value = { ...row }
        },
      }
    }
    const rowPropsMeasure = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          if (showCreate.value) {
            create_data.value.measure_id = row.id
            showMeasure.value = false
          } else if (showUpdate.value) {
            update_data.value.measure_id = row.id
            showMeasure.value = false
          }
        },
      }
    }
    const filter = (e) => {
      resourseInst.value.filter({
        name: [e],
      })
    }
    const searchMeasure = (e) => {
      measureInst.value.filter({
        name: [e],
      })
    }
    const openMeasureAdd = () => {
      showMeasureAdd.value = true
      showMeasure.value = false
    }
    watchEffect(() => {
      if (firstInput.value) {
        firstInput.value.focus()
      } else {
        // not mounted yet, or the element was unmounted (e.g. by v-if)
      }
      if (firstUpdateInput.value) {
        firstUpdateInput.value.focus()
      } else {
        // not mounted yet, or the element was unmounted (e.g. by v-if)
      }
    })
    return {
      data,
      create_data,
      update_data,
      create_measure_data,
      showCreate,
      showUpdate,
      showMeasure,
      showMeasureAdd,
      openMeasureAdd,
      createMeasure,
      leaveMeasure,
      leave,
      vCreate$,
      vUpdate$,
      vCreateMeasure$,
      measureItems,
      loadMeasures,
      columnsMeasure: columnsMeasure(),
      resourseRef: resourseInst,
      measureRef: measureInst,
      firstInput,
      firstUpdateInput,
      searchMeasure,
      columns: createColumns({
        del(row, e) {
          e.stopPropagation()
          del(row.id)
        },
        update(row, e) {
          e.stopPropagation()
          updateId.value = row.id
          if ('measure' in row) {
            row['measure_id'] = row.measure.id
          }
          showUpdate.value = true
          update_data.value = { ...row }
        },
      }),
      renderCell: (value) => {
        if (!value) {
          return h(NText, { depth: 3 }, { default: () => 'empty' })
        }
        return value
      },
      createFood,
      updateFood,
      filter,
      rowProps,
      rowPropsMeasure,
      cancelCallback,
      pagination: {
        pageSize: 10,
      },
      parse: (input) => {
        const nums = input.replace(/\s/g, '').trim()
        if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
        return nums === '' ? null : Number.NaN
      },
      format: (value) => {
        if (value === null) return ''
        return value.toLocaleString('ru-RU')
      },
    }
  },
}
</script>
