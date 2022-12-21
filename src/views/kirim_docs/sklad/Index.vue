<template>
  <div>
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Sklat qo'shish"
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
        <n-form-item label="Menyuga chiqarish" style="font-weight: bold">
          <n-switch
            v-model:value="create_data.show"
            checked-value="1"
            unchecked-value="0"
          />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="createSklat">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Sklat o'zgartirish"
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
        <n-form-item label="Menyuga chiqarish" style="font-weight: bold">
          <n-switch v-model:value="update_data.show" />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="updateSklat">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-space vertical :size="12">
      <div style="display: flex; justify-content: space-between">
        <n-button type="primary" @click="openCreate">+</n-button>
        <n-input
          type="text"
          placeholder="Search"
          style="width: 94%; border-radius: 5px"
          @input="filter"
        />
      </div>
      <n-data-table
        ref="skladRef"
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
import { onMounted, computed, watchEffect } from 'vue'
import SklatService from '../../../services/sklat.service'
export default {
  components: {
    TableNoData,
  },
  setup() {
    let create_data = ref({
      name: '',
      show: 0,
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
    const update_data = ref({
      name: '',
      show: null,
    })
    const skladInst = ref(null)
    const vCreate$ = useValidate(rules, create_data)
    const vUpdate$ = useValidate(rules, update_data)
    let showCreate = ref(false)
    let showUpdate = ref(false)
    let updateId = ref(0)
    let data = ref([])
    const message = useMessage()
    const dialog = useDialog()
    const firstInput = ref(null)
    const firstUpdateInput = ref(null)
    const del = function deleteSklat(id) {
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          SklatService.delete(id).then((res) => {
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
    const createSklat = function () {
      vCreate$.value.$validate()
      if (!vCreate$.value.$error) {
        SklatService.create(create_data.value).then((res) => {
          data.value.push(res)
          create_data.value = {
            name: '',
            show: 0,
          }
          vCreate$.value.$reset()
        })
        showCreate.value = false
      }
    }
    const updateSklat = function () {
      vUpdate$.value.$validate()
      if (!vUpdate$.value.$error) {
        update_data.value.show == true
          ? (update_data.value.show = 1)
          : (update_data.value.show = 0)
        SklatService.update(updateId.value, update_data.value).then((res) => {
          const index = data.value.findIndex((val) => val.id == res.id)
          data.value[index] = res
          update_data.value = {
            name: '',
            show: null,
          }
          updateId.value = 0
        })
        showUpdate.value = false
      }
    }
    const cancelCallback = function () {
      showUpdate.value = false
      showCreate.value = false
      leave()
    }
    const leave = function () {
      create_data.value = {
        name: '',
        show: 0,
      }
      update_data.value = {
        name: '',
        show: null,
      }
      vCreate$.value.$reset()
      vUpdate$.value.$reset()
    }
    onMounted(async () => {
      try {
        data.value = await SklatService.getAll()
      } catch (e) {
        console.log(e)
      }
    })
    const rowProps = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          updateId.value = row.id
          update_data.value.name = row.name
          if (row.show == 1) {
            update_data.value.show = true
          } else {
            update_data.value.show = false
          }
          showUpdate.value = true
        },
      }
    }
    const filter = (e) => {
      skladInst.value.filter({
        name: [e],
      })
    }
    const openCreate = () => {
      showCreate.value = true
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
      openCreate,
      leave,
      data,
      skladRef: skladInst,
      firstInput,
      firstUpdateInput,
      filter,
      columns: createColumns({
        del(row, e) {
          e.stopPropagation()
          del(row.id)
        },
        update(row, e) {
          e.stopPropagation()
          updateId.value = row.id
          update_data.value.name = row.name
          if (row.show == 1) {
            update_data.value.show = true
          } else {
            update_data.value.show = false
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
      create_data,
      update_data,
      rowProps,
      createSklat,
      updateSklat,
      showCreate,
      showUpdate,
      cancelCallback,
      pagination: {
        pageSize: 6,
      },
    }
  },
}
</script>
