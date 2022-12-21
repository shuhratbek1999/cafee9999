<template>
  <div>
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Printer qo'shish"
      :on-after-leave="leave"
    >
      <n-form>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Name</p>
          <n-input v-model:value="create_data.name" placeholder="Kiriting" />
          <small>
            <n-gradient-text type="error" v-if="vCreate$.name.$error">
              {{ vCreate$.name.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">IP</p>
          <n-input v-model:value="create_data.ip" placeholder="Kiriting" />
          <small>
            <n-gradient-text type="error" v-if="vCreate$.ip.$error">
              {{ vCreate$.ip.$errors[0].$message }}
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
          <n-button type="primary" @click="createPrinter">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Printer o'zgartirish"
      :on-after-leave="leave"
    >
      <n-form>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Name</p>
          <n-input v-model:value="update_data.name" placeholder="Kiriting" />
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.name.$error">
              {{ vUpdate$.name.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">IP</p>
          <n-input v-model:value="update_data.ip" placeholder="Kiriting" />
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.ip.$error">
              {{ vUpdate$.ip.$errors[0].$message }}
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
          <n-button type="primary" @click="updatePrinter">Submit</n-button>
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
        ref="printerRef"
        :bordered="false"
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :rowProps="rowProps"
        :render-cell="renderCell"
        :row-class-name="rowClass"
      >
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </n-space>
  </div>
</template>
<script>
import { h, ref } from 'vue'
import { NButton, NIcon, useMessage, useDialog, NText } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import TableNoData from '../../../components/TableNoData.vue'
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
          ~row.ip.toLowerCase().indexOf(value.toLowerCase())
        )
      },
    },
    {
      title: 'IP',
      key: 'ip',
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

import useValidate from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'
import { computed, onMounted } from 'vue'
import PrinterService from '../../../services/printer.service'
export default {
  components: {
    TableNoData,
  },
  setup() {
    let create_data = ref({
      name: '',
      ip: '',
    })
    const update_data = ref({
      name: '',
      ip: '',
    })
    const message = useMessage()
    const dialog = useDialog()
    const printerInst = ref(null)
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
        ip: {
          required: helpers.withMessage("IP bo'sh bo'lmasligi kerak", required),
          maxLength: helpers.withMessage(
            'IP 55 ta belgidan oshmasligi kerak',
            maxLength(55),
          ),
        },
      }
    })
    const vCreate$ = useValidate(rules, create_data)
    const vUpdate$ = useValidate(rules, update_data)
    let showCreate = ref(false)
    let showUpdate = ref(false)
    let updateId = ref(0)
    let data = ref([])
    const del = function (id) {
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          PrinterService.delete(id).then((res) => {
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
    const createPrinter = function () {
      vCreate$.value.$validate()
      if (!vCreate$.value.$error) {
        PrinterService.create(create_data.value).then((res) => {
          data.value.push(res)
          create_data.value = {
            name: '',
            ip: '',
          }
        })
        showCreate.value = false
      }
    }
    const updatePrinter = function () {
      vUpdate$.value.$validate()
      if (!vUpdate$.value.$error) {
        PrinterService.update(updateId.value, update_data.value).then((res) => {
          const index = data.value.findIndex((val) => val.id == res.id)
          data.value[index] = res
          update_data.value = {
            name: '',
            ip: '',
          }
          updateId.value = 0
        })
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
        ip: '',
      }
      update_data.value = {
        name: '',
        ip: '',
      }
      vCreate$.value.$reset()
      vUpdate$.value.$reset()
    }
    onMounted(async () => {
      data.value = await PrinterService.getAll()
    })
    const rowProps = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          updateId.value = row.id
          showUpdate.value = true
          update_data.value = { ...row }
        },
      }
    }
    const filter = (e) => {
      printerInst.value.filter({
        name: [e],
      })
    }
    return {
      vCreate$,
      vUpdate$,
      leave,
      data,
      printerRef: printerInst,
      columns: createColumns({
        del(row, e) {
          e.stopPropagation()
          del(row.id)
        },
        update(row, e) {
          e.stopPropagation()
          updateId.value = row.id
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
      rowClass: () => {
        return 'rowItem'
      },
      create_data,
      update_data,
      createPrinter,
      updatePrinter,
      filter,
      rowProps,
      showCreate,
      showUpdate,
      cancelCallback,
      pagination: {
        pageSize: 10,
      },
    }
  },
}
</script>

<style>
.rowItem {
  font-size: 15px;
}
</style>
