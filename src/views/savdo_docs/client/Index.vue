<template>
  <div>
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Mijoz qo'shish"
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
          <p style="font-weight: bold">Address</p>
          <n-input v-model:value="create_data.address" placeholder="Kiriting" />
          <small>
            <n-gradient-text type="error" v-if="vCreate$.address.$error">
              {{ vCreate$.address.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Tel</p>
          <n-input v-model:value="create_data.tel" placeholder="Kiriting" />
          <small>
            <n-gradient-text type="error" v-if="vCreate$.tel.$error">
              {{ vCreate$.tel.$errors[0].$message }}
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
          <n-button type="primary" @click="createMijoz">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Mijoz o'zgartirish"
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
          <p style="font-weight: bold">Address</p>
          <n-input v-model:value="update_data.address" placeholder="Kiriting" />
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.address.$error">
              {{ vUpdate$.address.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Tel</p>
          <n-input v-model:value="update_data.tel" placeholder="Kiriting" />
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.tel.$error">
              {{ vUpdate$.tel.$errors[0].$message }}
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
          <n-button type="primary" @click="updateMijoz">Submit</n-button>
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
        ref="clientRef"
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
    },
    {
      title: 'Address',
      key: 'address',
      defaultSortOrder: 'ascend',
      sorter: 'default',
    },
    {
      title: 'Tel',
      key: 'tel',
      filter(value, row) {
        return (
          ~row.tel.indexOf(value) ||
          ~row.address.toLowerCase().indexOf(value.toLowerCase()) ||
          ~row.name.toLowerCase().indexOf(value.toLowerCase())
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

import useValidate from '@vuelidate/core'
import { required, maxLength, minLength, helpers } from '@vuelidate/validators'
import { computed, onMounted } from 'vue'
import MijozlarService from '../../../services/client.service'
export default {
  components: {
    TableNoData,
  },
  setup() {
    const firstInput = ref(null)
    const firstUpdateInput = ref(null)
    let create_data = ref({
      name: '',
      address: '',
      tel: '',
    })
    const update_data = ref({
      name: '',
      address: '',
      tel: '',
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
        address: {
          required: helpers.withMessage(
            "Address bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Tel 55 ta belgidan oshmasligi kerak',
            maxLength(55),
          ),
        },
        tel: {
          required: helpers.withMessage(
            "tel bo'sh bo'lmasligi kerak",
            required,
          ),
          minLength: helpers.withMessage(
            "Tel kamida 13 ta belgidan iborat bo'lishi kerak",
            minLength(13),
          ),
          maxLength: helpers.withMessage(
            'Tel 13 ta belgidan oshmasligi kerak',
            maxLength(13),
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
    const clientInst = ref(null)
    const del = function deleteSklat(id) {
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          MijozlarService.delete(id).then((res) => {
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
    const createMijoz = function () {
      vCreate$.value.$validate()
      if (!vCreate$.value.$error) {
        MijozlarService.create(create_data.value).then((res) => {
          showCreate.value = false
          vCreate$.value.$reset()
          data.value.push(res)
          create_data.value = {
            name: '',
            address: '',
            tel: '',
          }
        })
      }
    }
    const updateMijoz = function () {
      vUpdate$.value.$validate()
      if (!vUpdate$.value.$error) {
        MijozlarService.update(updateId.value, update_data.value).then(
          (res) => {
            const index = data.value.findIndex((val) => val.id == res.id)
            showUpdate.value = false
            vUpdate$.value.$reset()
            data.value[index] = res
            update_data.value = {
              name: '',
              address: '',
              tel: '',
            }
            updateId.value = 0
          },
        )
      }
    }
    const cancelCallback = function () {
      showCreate.value = false
      showUpdate.value = false
    }
    const leave = function () {
      create_data.value = {
        name: '',
        address: '',
        tel: '',
      }
      update_data.value = {
        name: '',
        address: '',
        tel: '',
      }
      vCreate$.value.$reset()
      vUpdate$.value.$reset()
    }
    onMounted(async () => {
      data.value = await MijozlarService.getAll()
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
      clientInst.value.filter({
        tel: [e],
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
      clientRef: clientInst,
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
      createMijoz,
      updateMijoz,
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
