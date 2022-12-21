<template>
  <div>
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="O'lchov birlik qo'shish"
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
        <div style="display: flex; justify-content: flex-end">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="createMeasure">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="O'lchov birlik o'zgartirish"
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
        <div style="display: flex; justify-content: flex-end">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="updateMeasure">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-space vertical :size="12">
      <div style="display: flex; justify-content: space-between">
        <n-button type="primary" @click="showCreate = true">+</n-button>
        <n-input
          type="text"
          placeholder="Search"
          style="width: 94%; border-radius: 5px"
          @input="filter"
        />
      </div>
      <n-data-table
        ref="measureRef"
        :bordered="false"
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :rowProps="rowProps"
        :render-cell="renderCell"
      >
        <template #empty><table-no-data></table-no-data></template>
      </n-data-table>
    </n-space>
  </div>
</template>
<script>
import { h, ref } from 'vue'
import { NButton, NIcon, useDialog, useMessage, NText } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
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
        return ~row.name.toLowerCase().indexOf(value.toLowerCase())
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
import { computed, onMounted, watchEffect } from 'vue'
import MeasureService from '../../../services/measure.service'
import TableNoData from '../../../components/TableNoData.vue'
export default {
  components: {
    TableNoData,
  },
  setup() {
    let create_data = ref({
      name: '',
    })
    const update_data = ref({
      name: '',
    })
    const rules = computed(() => {
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
    const vCreate$ = useValidate(rules, create_data)
    const vUpdate$ = useValidate(rules, update_data)
    let showCreate = ref(false)
    let showUpdate = ref(false)
    let updateId = ref(0)
    let data = ref([])
    const measureInst = ref(null)
    const firstInput = ref(null)
    const firstUpdateInput = ref(null)
    const message = useMessage()
    const dialog = useDialog()
    const del = function deleteSklat(id) {
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          MeasureService.delete(id).then((res) => {
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
    const createMeasure = function () {
      vCreate$.value.$validate()
      if (!vCreate$.value.$error) {
        vCreate$.value.$reset()
        MeasureService.create(create_data.value).then((res) => {
          data.value.push(res)
          create_data.value = {
            name: '',
          }
        })
        showCreate.value = false
      }
    }
    const updateMeasure = function () {
      vUpdate$.value.$validate()
      if (!vUpdate$.value.$error) {
        MeasureService.update(updateId.value, update_data.value).then((res) => {
          vUpdate$.value.$reset()
          const index = data.value.findIndex((val) => val.id == res.id)
          data.value[index] = res
          update_data.value = {
            name: '',
          }
          updateId.value = 0
        })
        showUpdate.value = false
      }
    }
    const cancelCallback = function () {
      showCreate.value = false
      showUpdate.value = false
    }
    const leave = function () {
      create_data.value = {
        name: '',
      }
      update_data.value = {
        name: '',
      }
      vCreate$.value.$reset()
      vUpdate$.value.$reset()
    }
    onMounted(async () => {
      data.value = await MeasureService.getAll()
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
      measureInst.value.filter({
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
    return {
      vCreate$,
      vUpdate$,
      data,
      leave,
      measureRef: measureInst,
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
      create_data,
      update_data,
      createMeasure,
      updateMeasure,
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
