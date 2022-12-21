<template>
  <div>
    <!--measure start-->
    <n-modal
      v-model:show="showAddMeasure"
      preset="dialog"
      title="Birlik qo'shish"
      :on-after-leave="leaveMeasureAdd"
    >
      <form-data-modal
        :data="formMeasure"
        @click="createMeasure"
      ></form-data-modal>
    </n-modal>
    <n-modal v-model:show="showChooseMeasure">
      <n-card
        title="Tanlang"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        style="width: 400px"
      >
        <div style="display: flex">
          <n-button type="primary" @click="openAddMeasure">+</n-button>
          <n-input
            style="margin-left: 20px"
            placeholder="Qidirish"
            @input="searchMeasure"
          ></n-input>
        </div>
        <n-data-table
          :columns="columnsModal"
          :data="loadMeasure"
          ref="measureRef"
          style="margin-top: 20px"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
          :rowProps="rowPropsMeasure"
        >
          <template #empty>
            <table-no-data></table-no-data>
          </template>
        </n-data-table>
      </n-card>
    </n-modal>
    <!--measure end-->
    <!-- create modal -->
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Qo'shimcha hizmat qo'shish"
      :on-after-leave="leave"
    >
      <n-form>
        <!-- Name input -->
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
        <!-- color input -->
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Rangini tanlang</p>
          <n-color-picker v-model:value="create_data.color" />
          <small>
            <n-gradient-text type="error" v-if="vCreate$.color.$error">
              {{ vCreate$.color.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <!-- test file input -->
        <div style="display: flex; flex-direction: column; height: 120px">
          <p style="font-weight: bold">Fileni tanlang</p>
          <n-upload
            ref="file"
            :default-upload="false"
            @change="fileChange"
            :multiple="false"
            :max="1"
          >
            <n-button>Upload File</n-button>
          </n-upload>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Narxni kiriting</p>
          <n-input-number
            v-model:value="create_data.price"
            type="number"
            placeholder="Kiriting"
            :format="format"
            :parse="parse"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
          ></n-input-number>
          <small>
            <n-gradient-text type="error" v-if="vCreate$.price.$error">
              {{ vCreate$.price.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <!-- select showMenu -->
        <n-form-item style="font-weight: bold" label="Menyuga chiqarish">
          <n-switch v-model:value="createSwicht" />
        </n-form-item>
        <!-- Select measure_id -->
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Birlikni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.measure_id"
              :options="measure"
              filterable
              placeholder="Tanlang"
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="openChooseMeasure">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vCreate$.measure_id.$error">
              {{ vCreate$.measure_id.$errors[0].$message }}
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
          <n-button type="primary" @click="createTable">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <!--******************* UPDATE MODAL **********************-->
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Qo'shimcha xizmatni taxrirlash"
      :on-after-leave="leave"
    >
      <n-form>
        <!-- Name input -->
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
        <!-- color input -->
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Rangini tanlang</p>
          <n-color-picker v-model:value="update_data.color" />
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.color.$error">
              {{ vUpdate$.color.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <!-- test file input -->
        <n-form-item style="font-weight: bold">
          <n-image width="200" :src="imageUrl + update_data.picture" />
        </n-form-item>
        <n-form-item>
          <n-upload
            ref="file"
            :default-upload="false"
            @change="fileChange"
            :multiple="false"
            :max="1"
          >
            <n-button>Upload File</n-button>
          </n-upload>
        </n-form-item>
        <!-- input price -->
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Narxini kiriting</p>
          <n-input-number
            v-model:value="update_data.price"
            type="number"
            placeholder="Kiriting"
            :format="format"
            :parse="parse"
            :show-button="false"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
          ></n-input-number>
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.price.$error">
              {{ vUpdate$.price.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <!-- select showMenu -->
        <n-form-item label="Menyuga chiqarish" style="font-weight: bold">
          <n-switch v-model:value="updateSwicht" />
        </n-form-item>
        <!-- Select measure_id -->
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Birlikni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="update_data.measure_id"
              :options="measure"
              style="font-weight: 400"
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="openChooseMeasure">...</n-button>
          </div>
          <n-gradient-text type="error" v-if="vUpdate$.measure_id.$error">
            {{ vUpdate$.measure_id.$errors[0].$message }}
          </n-gradient-text>
        </div>
        <div style="display: flex; justify-content: flex-end">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="updateTable">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showDelete"
      :mask-closable="false"
      preset="dialog"
      title="Dialog"
      content="Are you sure?"
      positive-text="Confirm"
      negative-text="Cancel"
      @positive-click="onPositiveClick"
      @negative-click="onNegativeClick"
    />
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
        ref="serviceRef"
        :bordered="false"
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :rowProps="rowProps"
        :render-cell="renderCell"
      >
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </n-space>
  </div>
</template>
<script>
import { computed, h, ref, watchEffect } from 'vue'
import { NButton, NIcon, NText } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import useVuelidate from '@vuelidate/core'
import { required, maxLength, numeric, helpers } from '@vuelidate/validators'
import TableNoData from '../../../components/TableNoData.vue'
import FormDataModal from '../../components/FormData.vue'
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
    },
    {
      title: 'Measure',
      key: 'measure.name',
    },
    {
      title: 'Color',
      key: 'color',
    },
    {
      title: 'Price',
      key: 'price',
      filter(value, row) {
        return (
          ~row.price.toString().indexOf(value) ||
          ~row.name.toLowerCase().indexOf(value.toLowerCase())
        )
      },
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.price,
        )
      },
    },
    {
      title: 'Picture',
      key: 'picture',
    },
    {
      title: 'Show menu',
      key: 'showMenu',
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

import { onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import ExtraServisService from '../../../services/extra_service.service'
import MeasureService from '../../../services/measure.service'
import { useStore } from 'vuex'
export default {
  components: {
    TableNoData,
    FormDataModal,
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
    const message = useMessage()
    const showModalRef = ref(false)
    const firstInput = ref(null)
    const firstUpdateInput = ref(null)
    const store = useStore()
    let create_data = ref({
      name: '',
      color: '',
      price: 0,
      picture: '',
      showMenu: 0,
      measure_id: null,
    })
    const update_data = ref({
      name: '',
      color: '',
      price: 0,
      picture: '',
      showMenu: 0,
      measure_id: null,
    })
    const imageUrl = ref('http://localhost/bdmkafe/images/')
    const createSwicht = ref(false)
    const updateSwicht = ref(false)
    let showCreate = ref(false)
    let showUpdate = ref(false)
    const rules = computed(() => {
      return {
        name: {
          required: helpers.withMessage(
            "Name bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 55 ta belgidan oshmasligi kerak',
            maxLength(55),
          ),
        },
        color: {
          required: helpers.withMessage(
            "color bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'color 55 ta belgidan oshmasligi kerak',
            maxLength(55),
          ),
        },
        picture: {
          required: helpers.withMessage(
            "picture bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'picture 55 ta belgidan oshmasligi kerak',
            maxLength(55),
          ),
        },
        price: {
          required: helpers.withMessage(
            "price bo'sh bo'lmasligi kerak",
            required,
          ),
          numeric: helpers.withMessage("price son bo'lishi kerak", numeric),
          maxLength: helpers.withMessage(
            '11 ta belgidan oshmasligi kerak',
            maxLength(11),
          ),
        },
        measure_id: {
          required: helpers.withMessage('Birlik tanlanishi kerak', required),
          numeric: helpers.withMessage("Birlik son bo'lishi kerak", numeric),
        },
      }
    })
    const vCreate$ = useVuelidate(rules, create_data)
    const vUpdate$ = useVuelidate(rules, update_data)
    let updateId = ref(0)
    let deleteId = ref(0)
    let data = ref([])
    let loadMeasure = ref([])
    let measure = ref([])
    const serviceInst = ref(null)
    const del = function deleteTable(id) {
      deleteId.value = id
      showModalRef.value = true
    }
    const createTable = () => {
      vCreate$.value.$validate()
      if (!vCreate$.value.$error) {
        if (createSwicht.value) create_data.value.showMenu = 1
        else create_data.value.showMenu = 0
        let formData = new FormData()
        formData.append('picture', create_data.value.picture)
        formData.append('name', create_data.value.name)
        formData.append('color', create_data.value.color)
        formData.append('price', create_data.value.price)
        formData.append('showMenu', create_data.value.showMenu)
        formData.append('measure_id', create_data.value.measure_id)
        ExtraServisService.create(formData).then((res) => {
          data.value.push(res)
          showCreate.value = false
          vCreate$.value.$reset()
          create_data.value = {
            name: '',
            color: '',
            price: 0,
            picture: '',
            showMenu: 0,
            measure_id: null,
          }
        })
      }
    }
    const updateTable = function () {
      vUpdate$.value.$validate()
      if (!vUpdate$.value.$error) {
        if (updateSwicht.value) {
          update_data.value.showMenu = 1
        } else {
          update_data.value.showMenu = 0
        }
        let formData = new FormData()
        formData.append('name', update_data.value.name)
        formData.append('color', update_data.value.color)
        formData.append('price', update_data.value.price)
        formData.append('picture', update_data.value.picture)
        formData.append('showMenu', update_data.value.showMenu)
        formData.append('measure_id', update_data.value.measure_id)
        ExtraServisService.update(updateId.value, formData).then((res) => {
          const index = data.value.findIndex((val) => val.id == res.id)
          showUpdate.value = false
          data.value[index] = res
          vUpdate$.value.$reset()
          update_data.value = {
            name: '',
            color: '',
            price: 0,
            picture: '',
            showMenu: 0,
            measure_id: null,
          }
          updateId.value = 0
        })
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
        color: '',
        price: 0,
        picture: '',
        showMenu: 0,
        measure_id: null,
      }
      update_data.value = {
        name: '',
        color: '',
        price: 0,
        picture: '',
        showMenu: 0,
        measure_id: null,
      }
      createSwicht.value = false
      updateSwicht.value = false
      vCreate$.value.$reset()
      vUpdate$.value.$reset()
    }
    const fileChange = function (event) {
      create_data.value.picture = event.file.file
    }
    onMounted(async () => {
      data.value = await ExtraServisService.getAll()
      loadMeasure.value = await MeasureService.getAll()
      for (let i = 0; i < loadMeasure.value.length; i++) {
        const element = loadMeasure.value[i]
        measure.value.push({ label: element.name, value: element.id })
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
          if (update_data.value.showMenu == 1) updateSwicht.value = true
          else updateSwicht.value = false
        },
      }
    }
    const filter = (e) => {
      serviceInst.value.filter({
        price: [e],
      })
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
    //measure start
    const showChooseMeasure = ref(false)
    const showAddMeasure = ref(false)
    const measureInst = ref(null)
    const openChooseMeasure = () => {
      showChooseMeasure.value = true
    }
    const openAddMeasure = () => {
      showChooseMeasure.value = false
      showAddMeasure.value = true
    }
    const rowPropsMeasure = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          if (showCreate.value) {
            create_data.value.measure_id = row.id
          } else if (showUpdate.value) {
            update_data.value.measure_id = row.id
          }
          showChooseMeasure.value = false
        },
      }
    }
    const searchMeasure = (e) => {
      measureInst.value.filter({
        name: [e],
      })
    }
    const formMeasure = [
      { value: '', key: 'name', label: 'Name', type: 'input' },
    ]
    const leaveMeasureAdd = () => {
      store.dispatch('setNull')
    }
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
    const createMeasure = async (e) => {
      const vMeasure$ = useVuelidate(rulesMeasure, e)
      vMeasure$.value.$validate()
      store.state.modalValidations = vMeasure$
      if (!vMeasure$.value.$error) {
        const data = await MeasureService.create(e)
        loadMeasure.value.push(data)
        measure.value.push({ label: data.name, value: data.id })
        if (showCreate.value) {
          create_data.value.measure_id = data.id
        } else if (showUpdate.value) {
          update_data.value.measure_id = data.id
        }
        showAddMeasure.value = false
      }
    }
    //measure end
    return {
      showDelete: showModalRef,
      onPositiveClick() {
        ExtraServisService.delete(deleteId.value).then((res) => {
          const index = data.value.findIndex((val) => val.id == res.id)
          data.value.splice(index, 1)
        })
        message.success('Deleted')
        showModalRef.value = false
      },
      onNegativeClick() {
        message.success('Undeleted')
        showModalRef.value = false
      },
      data,
      parse,
      format,
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
          if (update_data.value.showMenu == 1) updateSwicht.value = true
          else updateSwicht.value = false
        },
      }),
      renderCell: (value) => {
        if (!value) {
          return h(NText, { depth: 3 }, { default: () => 'empty' })
        }
        return value
      },
      measure,
      leaveMeasureAdd,
      createMeasure,
      openAddMeasure,
      formMeasure,
      searchMeasure,
      measureRef: measureInst,
      rowPropsMeasure,
      showChooseMeasure,
      openChooseMeasure,
      loadMeasure,
      imageUrl,
      serviceRef: serviceInst,
      firstInput,
      showAddMeasure,
      firstUpdateInput,
      createSwicht,
      updateSwicht,
      create_data,
      update_data,
      leave,
      vUpdate$,
      vCreate$,
      fileChange,
      createTable,
      updateTable,
      filter,
      rowProps,
      showCreate,
      showUpdate,
      cancelCallback,
      pagination: {
        pageSize: 6,
      },
      columnsModal: modalColumn(),
    }
  },
}
</script>
