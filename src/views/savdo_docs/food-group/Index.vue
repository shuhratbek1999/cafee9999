<template>
  <div>
    <!--add printer start-->
    <n-modal
      v-model:show="showAddPrinter"
      preset="dialog"
      title="Printer"
      :on-after-leave="leavePrinter"
    >
      <form-data :data="formPrinter" @click="createPrinter"></form-data>
    </n-modal>
    <!--add printer end-->
    <!--choose printer start-->
    <n-modal v-model:show="showChoosePrinter">
      <n-card
        title="Tanlang"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        style="width: 400px"
      >
        <div style="display: flex">
          <n-button type="primary" @click="openAddPrinter">+</n-button>
          <n-input
            style="margin-left: 20px"
            placeholder="Qidirish"
            @input="searchPrinter"
          ></n-input>
        </div>
        <n-data-table
          :columns="columnsModal"
          :data="loadPrinters"
          ref="printerRef"
          style="margin-top: 20px"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
          :rowProps="rowPropsPrinter"
        >
          <template #empty>
            <table-no-data></table-no-data>
          </template>
        </n-data-table>
      </n-card>
    </n-modal>
    <!--add printer end-->
    <!--add food disturbute start-->
    <n-modal
      v-model:show="showAddFDisturbute"
      preset="dialog"
      title="Ovqat disturbute"
      :on-after-leave="leaveFoodDisturbute"
    >
      <form-data :data="formFDisturbute" @click="createFDisturbute"></form-data>
    </n-modal>
    <!--add food disturbute end-->
    <!--choose food disturbute start-->
    <n-modal v-model:show="showChooseFDisturbute">
      <n-card
        title="Tanlang"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        style="width: 400px"
      >
        <div style="display: flex">
          <n-button type="primary" @click="openAddFDisturbute">+</n-button>
          <n-input
            style="margin-left: 20px"
            placeholder="Qidirish"
            @input="searchFDisturbute"
          ></n-input>
        </div>
        <n-data-table
          :columns="columnsModal"
          :data="loadFdistrubute"
          ref="fdisturbuteRef"
          style="margin-top: 20px"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
          :rowProps="rowPropsFDisturbute"
        >
          <template #empty>
            <table-no-data></table-no-data>
          </template>
        </n-data-table>
      </n-card>
    </n-modal>
    <!--choose food disturbute end-->
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Ovqat group qo'shish"
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
          <p style="font-weight: bold">Ovqat yetkazib berishni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.food_distrubute_group_id"
              :options="fdistrubuteItems"
              placeholder="Tanlang"
              style="font-weight: 400"
              filterable
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="showChooseFDisturbute = true">...</n-button>
          </div>
          <small>
            <n-gradient-text
              type="error"
              v-if="vCreate$.food_distrubute_group_id.$error"
            >
              {{ vCreate$.food_distrubute_group_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <n-form-item label="Menyuga chiqarish" style="font-weight: bold">
          <n-switch
            v-model:value="create_data.showMenu"
            checked-value="1"
            unchecked-value="0"
          />
        </n-form-item>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Printerni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.printer_id"
              :options="printerItems"
              placeholder="Tanlang"
              style="font-weight: 400"
              filterable
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="showChoosePrinter = true">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vCreate$.printer_id.$error">
              {{ vCreate$.printer_id.$errors[0].$message }}
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
          <n-button type="primary" @click="createFoodgroup">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Ovqat group o'zgartirish"
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
          <p style="font-weight: bold">Ovqat yetkazib berishni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="update_data.food_distrubute_group_id"
              :options="fdistrubuteItems"
              placeholder="Tanlang"
              style="font-weight: 400"
              filterable
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="showChooseFDisturbute = true">...</n-button>
          </div>
          <small>
            <n-gradient-text
              type="error"
              v-if="vUpdate$.food_distrubute_group_id.$error"
            >
              {{ vUpdate$.food_distrubute_group_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <n-form-item label="Menyuga chiqarish" style="font-weight: bold">
          <n-switch v-model:value="update_data.showMenu" />
        </n-form-item>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Printerni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="update_data.printer_id"
              :options="printerItems"
              placeholder="Tanlang"
              style="font-weight: 400"
              filterable
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="showChoosePrinter = true">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.printer_id.$error">
              {{ vUpdate$.printer_id.$errors[0].$message }}
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
          <n-button type="primary" @click="updateFoodgroup">Submit</n-button>
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
    <n-data-table
      ref="groupRef"
      :data="data"
      :bordered="false"
      :columns="columns"
      :rowProps="rowProps"
      :render-cell="renderCell"
    >
      <template #empty>
        <table-no-data></table-no-data>
      </template>
    </n-data-table>
  </div>
</template>
<script>
import FoodgroupService from '../../../services/food-group.service'
import Food_ditrubute_groupService from '../../../services/food-disturbute.service'
import PrinterService from '../../../services/printer.service'
import { h, ref, computed, onMounted, watchEffect, reactive } from 'vue'
import { NButton, NIcon, useMessage, useDialog, NText } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import { required, maxLength, helpers } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import TableNoData from '../../../components/TableNoData.vue'
import FormData from '../../components/FormData.vue'
import { useStore } from 'vuex'
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
      defaultSortOrder: 'ascend',
      sorter: 'default',
      filter(value, row) {
        return (
          ~row.name.toLowerCase().indexOf(value.toLowerCase()) ||
          ~row.food_ditrubute_group.name
            .toLowerCase()
            .indexOf(value.toLowerCase()) ||
          ~row.printer.name.toLowerCase().indexOf(value.toLowerCase())
        )
      },
    },
    {
      title: 'Ovqat yetkazib berish',
      key: 'food_ditrubute_group.name',
      sorter: (row1, row2) =>
        row1.food_distrubute_group.name.localeCompare(
          row2.food_distrubute_group.name,
        ),
    },
    {
      title: 'Printer',
      key: 'printer.name',
      sorter: (row1, row2) =>
        row1.printer.name.localeCompare(row2.printer.name),
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
  name: 'Food-group-view',
  components: {
    TableNoData,
    FormData,
  },
  setup() {
    const data = ref([])
    const create_data = ref({
      name: '',
      showMenu: 0,
      food_distrubute_group_id: null,
      printer_id: null,
    })
    const update_data = ref({
      name: '',
      showMenu: null,
      food_distrubute_group_id: null,
      printer_id: null,
    })
    const message = useMessage()
    const dialog = useDialog()
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
        food_distrubute_group_id: {
          required: helpers.withMessage(
            'Ovqat yetkazib berish tanlanishi kerak',
            required,
          ),
        },
        printer_id: {
          required: helpers.withMessage('Printer tanlanishi kerak', required),
        },
      }
    })
    const vCreate$ = useVuelidate(rules, create_data)
    const vUpdate$ = useVuelidate(rules, update_data)
    const firstInput = ref(null)
    const firstUpdateInput = ref(null)
    let updateId = ref(0)
    let showCreate = ref(false)
    let showUpdate = ref(false)
    let loadFdistrubute = ref([])
    let fdistrubuteItems = ref([])
    let loadPrinters = ref([])
    let printerItems = ref([])
    const groupInst = ref(null)
    const store = useStore()
    const del = function (id) {
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          FoodgroupService.delete(id).then((res) => {
            message.success("Muvaffaqiyatli o'chirildi")
            const index = data.value.findIndex((val) => val.id == res.id)
            data.value.splice(index, 1)
          })
        },
        onNegativeClick: () => {
          message.info("O'chirilmadi")
        },
      })
    }
    const createFoodgroup = function () {
      vCreate$.value.$validate()
      if (!vCreate$.value.$error) {
        FoodgroupService.create(create_data.value).then((res) => {
          data.value.push(res)
          create_data.value = {
            name: '',
            showMenu: 0,
            food_distrubute_group_id: null,
            printer_id: null,
          }
        })
        showCreate.value = false
      }
    }
    const updateFoodgroup = function () {
      vUpdate$.value.$validate()
      if (!vUpdate$.value.$error) {
        update_data.value.showMenu == true
          ? (update_data.value.showMenu = 1)
          : (update_data.value.showMenu = 0)
        FoodgroupService.update(updateId.value, update_data.value).then(
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
        showMenu: 0,
        food_distrubute_group_id: null,
        printer_id: null,
      }
      update_data.value = {
        name: '',
        showMenu: null,
        food_distrubute_group_id: null,
        printer_id: null,
      }
      vCreate$.value.$reset()
      vUpdate$.value.$reset()
    }
    onMounted(async () => {
      data.value = await FoodgroupService.getAll()
      loadFdistrubute.value = await Food_ditrubute_groupService.getAll()
      for (let index = 0; index < loadFdistrubute.value.length; index++) {
        const element = loadFdistrubute.value[index]
        fdistrubuteItems.value.push({ label: element.name, value: element.id })
      }
      loadPrinters.value = await PrinterService.getAll()
      for (let index = 0; index < loadPrinters.value.length; index++) {
        const element = loadPrinters.value[index]
        printerItems.value.push({ label: element.name, value: element.id })
      }
    })
    const rowProps = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          updateId.value = row.id
          if ('food_ditrubute_group' in row) {
            row['food_distrubute_group_id'] = row.food_ditrubute_group.id
          }
          if ('printer' in row) {
            row['printer_id'] = row.printer.id
          }
          update_data.value = { ...row }
          if (row.showMenu == 1) {
            update_data.value.showMenu = true
          } else {
            update_data.value.showMenu = false
          }
          showUpdate.value = true
        },
      }
    }
    const filter = (e) => {
      groupInst.value.filter({
        name: [e],
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
    //food disturbute start
    const showChooseFDisturbute = ref(false)
    const showAddFDisturbute = ref(false)
    const rowPropsFDisturbute = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          showChooseFDisturbute.value = false
          if (showCreate.value) {
            create_data.value.food_distrubute_group_id = row.id
          } else if (showUpdate.value) {
            create_data.value.food_distrubute_group_id = row.id
          }
        },
      }
    }
    const fdisturbuteInst = ref(null)
    const searchFDisturbute = (e) => {
      fdisturbuteInst.value.filter({
        name: [e],
      })
    }
    const openAddFDisturbute = () => {
      showChooseFDisturbute.value = false
      showAddFDisturbute.value = true
    }
    const formFDisturbute = reactive([
      { value: '', key: 'name', label: 'Name', type: 'input' },
      {
        value: '0',
        key: 'showMenu',
        label: "Menyuda ko'rsatish",
        type: 'switch',
      },
    ])
    const rulesFDisturbute = computed(() => {
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
      }
    })
    const createFDisturbute = async (e) => {
      const vFDisturbute$ = useVuelidate(rulesFDisturbute, e)
      vFDisturbute$.value.$validate()
      store.state.modalValidations = vFDisturbute$
      if (!vFDisturbute$.value.$error) {
        try {
          const res = await Food_ditrubute_groupService.create(e)
          loadFdistrubute.value.push(res)
          fdistrubuteItems.value.push({ label: res.name, value: res.id })
          if (showCreate.value) {
            create_data.value.food_distrubute_group_id = res.id
          } else if (showUpdate.value) {
            update_data.value.food_distrubute_group_id = res.id
          }
          showAddFDisturbute.value = false
        } catch (e) {
          message.error(e)
        }
      }
    }
    const leaveFoodDisturbute = () => {
      store.dispatch('setNull')
    }
    //food disturbute end
    //printer start
    const showChoosePrinter = ref(false)
    const showAddPrinter = ref(false)
    const printerInst = ref(null)
    const searchPrinter = (e) => {
      printerInst.value.filter({
        name: [e],
      })
    }
    const rowPropsPrinter = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          showChoosePrinter.value = false
          if (showCreate.value) {
            create_data.value.printer_id = row.id
          } else if (showUpdate.value) {
            update_data.value.printer_id = row.id
          }
        },
      }
    }
    const openAddPrinter = () => {
      showAddPrinter.value = true
      showChoosePrinter.value = false
    }
    const rulesPrinter = computed(() => {
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
        ip: {
          required: helpers.withMessage("IP bo'sh bo'lmasligi kerak", required),
          maxLength: helpers.withMessage(
            'IP 55 ta belgidan oshmasligi kerak',
            maxLength(55),
          ),
        },
      }
    })
    const formPrinter = reactive([
      { value: '', key: 'name', label: 'Name', type: 'input' },
      { value: '', key: 'ip', label: 'Ip', type: 'input' },
    ])
    const createPrinter = async (e) => {
      const vPrinter$ = useVuelidate(rulesPrinter, e)
      vPrinter$.value.$validate()
      store.state.modalValidations = vPrinter$
      if (!vPrinter$.value.$error) {
        try {
          const res = await PrinterService.create(e)
          loadPrinters.value.push(res)
          printerItems.value.push({ label: res.name, value: res.id })
          if (showCreate.value) {
            create_data.value.printer_id = res.id
          } else if (showUpdate.value) {
            update_data.value.printer_id = res.id
          }
          showAddPrinter.value = false
        } catch (e) {
          message.error(e)
        }
      }
    }
    const leavePrinter = () => {
      store.dispatch('setNull')
    }
    //printer end
    return {
      data,
      printerRef: printerInst,
      leavePrinter,
      loadPrinters,
      formPrinter,
      openAddPrinter,
      createPrinter,
      searchPrinter,
      rowPropsPrinter,
      formFDisturbute,
      showChoosePrinter,
      showAddPrinter,
      fdisturbuteRef: fdisturbuteInst,
      leaveFoodDisturbute,
      createFDisturbute,
      showAddFDisturbute,
      openAddFDisturbute,
      searchFDisturbute,
      showChooseFDisturbute,
      rowPropsFDisturbute,
      create_data,
      update_data,
      showCreate,
      showUpdate,
      vCreate$,
      loadFdistrubute,
      vUpdate$,
      leave,
      fdistrubuteItems,
      printerItems,
      groupRef: groupInst,
      firstInput,
      firstUpdateInput,
      columns: createColumns({
        del(row, e) {
          e.stopPropagation()
          del(row.id)
        },
        update(row, e) {
          e.stopPropagation()
          updateId.value = row.id
          if ('food_ditrubute_group' in row) {
            row['food_distrubute_group_id'] = row.food_ditrubute_group.id
          }
          if ('printer' in row) {
            row['printer_id'] = row.printer.id
          }
          update_data.value = { ...row }
          if (row.showMenu == 1) {
            update_data.value.showMenu = true
          } else {
            update_data.value.showMenu = false
          }
          showUpdate.value = true
        },
      }),
      renderCell: (value) => {
        if (!value) {
          return h(NText, { depth: 3 }, { default: () => 'empty' })
        }
        return value
      },
      createFoodgroup,
      updateFoodgroup,
      filter,
      rowProps,
      cancelCallback,
      pagintion: {
        pageSize: 10,
      },
      columnsModal: modalColumn(),
    }
  },
}
</script>
