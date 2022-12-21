<template>
  <div>
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Bo'lim qo'shish"
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
        <n-form-item label="Menyuda chiqarish" style="font-weight: bold">
          <n-switch
            v-model:value="create_data.showMenu"
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
          <n-button type="primary" @click="createBranch">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Bo'lim o'zgartirish"
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
        <n-form-item label="Menyuda chiqarish" style="font-weight: bold">
          <n-switch v-model:value="update_data.showMenu" />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="updateBranch">Submit</n-button>
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
        ref="branchRef"
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
import { h, ref, watchEffect } from 'vue'
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
import { onMounted, computed } from 'vue'
import BranchService from '../../../services/branch.service'
export default {
  components: {
    TableNoData,
  },
  setup() {
    let create_data = ref({
      name: '',
      showMenu: 0,
    })
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
            'Name 20 ta belgidan oshmasligi kerak',
            maxLength(20),
          ),
        },
      }
    })
    const update_data = ref({
      name: '',
      showMenu: null,
    })
    const vCreate$ = useValidate(rules, create_data)
    const vUpdate$ = useValidate(rules, update_data)
    let showCreate = ref(false)
    let showUpdate = ref(false)
    let updateId = ref(0)
    let data = ref([])
    const branchInst = ref(null)
    const message = useMessage()
    const dialog = useDialog()
    const del = function deleteSklat(id) {
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          BranchService.delete(id).then((res) => {
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
    const createBranch = function () {
      vCreate$.value.$validate()
      if (!vCreate$.value.$error) {
        BranchService.create(create_data.value).then((res) => {
          showCreate.value = false
          vCreate$.value.$reset()
          data.value.push(res)
          create_data.value = {
            name: '',
            showMenu: 0,
          }
        })
      }
    }
    const updateBranch = function () {
      vUpdate$.value.$validate()
      if (!vUpdate$.value.$error) {
        update_data.value.showMenu == true
          ? (update_data.value.showMenu = 1)
          : (update_data.value.showMenu = 0)
        BranchService.update(updateId.value, update_data.value).then((res) => {
          const index = data.value.findIndex((val) => val.id == res.id)
          showUpdate.value = false
          vUpdate$.value.$reset()
          data.value[index] = res
          update_data.value = {
            name: '',
            showMenu: 0,
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
        showMenu: 0,
      }
      update_data.value = {
        name: '',
        showMenu: 0,
      }
      vCreate$.value.$reset()
      vUpdate$.value.$reset()
    }
    onMounted(async () => {
      data.value = await BranchService.getAll()
    })
    const rowProps = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          updateId.value = row.id
          showUpdate.value = true
          update_data.value.name = row.name
          row.showMenu == 1
            ? (update_data.value.showMenu = true)
            : (update_data.value.showMenu = false)
        },
      }
    }
    const filter = (e) => {
      branchInst.value.filter({
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
      leave,
      data,
      branchRef: branchInst,
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

          update_data.value.name = row.name
          row.showMenu == 1
            ? (update_data.value.showMenu = true)
            : (update_data.value.showMenu = false)
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
      createBranch,
      updateBranch,
      filter,
      rowProps,
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
