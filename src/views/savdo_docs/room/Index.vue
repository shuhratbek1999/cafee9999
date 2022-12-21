<template>
  <div>
    <!--Branch start-->
    <n-modal
      v-model:show="showBranchAdd"
      preset="dialog"
      title="Bo'limni tanlang"
      :on-after-leave="leaveExtra"
    >
      <form-data :data="formBranch" @click="createBranch"></form-data>
    </n-modal>
    <n-modal v-model:show="showBranchChoose">
      <n-card
        title="Birlik qo'shish"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        style="width: 400px"
      >
        <div style="display: flex">
          <n-button type="primary" @click="openBranchAdd">+</n-button>
          <n-input
            placeholder="Qidirish"
            style="margin-left: 20px"
            @input="searchBranch"
          />
        </div>
        <n-data-table
          :columns="modalColumns"
          :data="loadBranches"
          ref="branchRef"
          :rowProps="rowPropsBranch"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
          style="margin-top: 20px"
        >
          <template #empty>
            <table-no-data></table-no-data>
          </template>
        </n-data-table>
      </n-card>
    </n-modal>
    <!--Branch end-->
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Xona qo'shish"
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
          <p style="font-weight: bold">Bo'limni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.branch_id"
              :options="branchItems"
              placeholder="Bo'limni tanlang"
              style="font-weight: 400"
              filterable
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="openBranch">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vCreate$.branch_id.$error">
              {{ vCreate$.branch_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <n-form-item label="Faollik" style="font-weight: bold">
          <n-switch
            v-model:value="create_data.active"
            checked-value="1"
            unchecked-value="0"
          />
        </n-form-item>
        <n-form-item label="Comment" style="font-weight: bold">
          <n-input
            v-model:value="create_data.comment"
            style="font-weight: 400"
          ></n-input>
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="createRoom">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Xona o'zgartirish"
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
          <p style="font-weight: bold">Bo'limni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="update_data.branch_id"
              :options="branchItems"
              placeholder="Bo'limni tanlang"
              style="font-weight: 400"
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="openBranch">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.branch_id.$error">
              {{ vUpdate$.branch_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <n-form-item label="Faollik" style="font-weight: bold">
          <n-switch v-model:value="update_data.active" />
        </n-form-item>
        <n-form-item label="Comment" style="font-weight: bold">
          <n-input
            v-model:value="update_data.comment"
            placeholder="Kiriting"
            style="font-weight: 400"
          ></n-input>
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button
            @click="cancelCallback"
            style="margin-right: 10px"
            type="error"
            >Close</n-button
          >
          <n-button type="primary" @click="updateRoom">Submit</n-button>
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
      ref="roomRef"
      :data="data"
      :bordered="false"
      :columns="columns"
      :rowProps="rowProps"
    >
      <template #empty>
        <table-no-data></table-no-data>
      </template>
    </n-data-table>
  </div>
</template>
<script>
import RoomService from '../../../services/room.service'
import BranchService from '../../../services/branch.service'
import { h, ref, computed, onMounted, watchEffect, reactive } from 'vue'
import { NButton, NIcon, useMessage, useDialog, NText } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import { required, maxLength, helpers } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { useStore } from 'vuex'
import TableNoData from '../../../components/TableNoData.vue'
import FormData from '../../components/FormData.vue'
const columnsModal = () => {
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
          ~row.branch.name.toLowerCase().indexOf(value.toLowerCase())
        )
      },
    },
    {
      title: "Bo'limi",
      key: 'branch.name',
      sorter: (row1, row2) => row1.branch.name.localeCompare(row2.branch.name),
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
  name: 'RoomView',
  components: {
    TableNoData,
    FormData,
  },
  setup() {
    const data = ref([])
    const firstInput = ref(null)
    const firstUpdateInput = ref(null)
    const create_data = ref({
      name: '',
      active: 0,
      branch_id: null,
      comment: '',
    })
    const update_data = ref({
      name: '',
      active: null,
      branch_id: null,
      comment: '',
    })
    const message = useMessage()
    const dialog = useDialog()
    const store = useStore()
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
        branch_id: {
          required: helpers.withMessage("Bo'lim tanlanishi kerak", required),
        },
      }
    })
    const vCreate$ = useVuelidate(rules, create_data)
    const vUpdate$ = useVuelidate(rules, update_data)
    let updateId = ref(0)
    let showCreate = ref(false)
    let showUpdate = ref(false)
    let loadBranches = ref([])
    let branchItems = ref([])
    const roomInst = ref(null)
    const del = function (id) {
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          RoomService.delete(id).then((res) => {
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
    const createRoom = function () {
      vCreate$.value.$validate()
      if (!vCreate$.value.$error) {
        RoomService.create(create_data.value).then((res) => {
          showCreate.value = false
          vCreate$.value.$reset()
          data.value.push(res)
          create_data.value = {
            name: '',
            active: 0,
            branch_id: null,
            comment: '',
          }
        })
      }
    }
    const updateRoom = function () {
      vUpdate$.value.$validate()
      if (!vUpdate$.value.$error) {
        update_data.value.active == true
          ? (update_data.value.active = 1)
          : (update_data.value.active = 0)
        RoomService.update(updateId.value, update_data.value).then((res) => {
          const index = data.value.findIndex((val) => val.id == res.id)
          showUpdate.value = false
          vUpdate$.value.$reset()
          data.value[index] = res
          updateId.value = 0
          update_data.value = {
            name: '',
            active: null,
            branch_id: null,
            comment: '',
          }
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
        active: 0,
        branch_id: null,
        comment: '',
      }
      update_data.value = {
        name: '',
        active: null,
        branch_id: null,
        comment: '',
      }
      vCreate$.value.$reset()
      vUpdate$.value.$reset()
    }
    onMounted(async () => {
      data.value = await RoomService.getAll()
      loadBranches.value = await BranchService.getAll()
      for (let index = 0; index < loadBranches.value.length; index++) {
        const element = loadBranches.value[index]
        branchItems.value.push({ label: element.name, value: element.id })
      }
    })
    const rowProps = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          updateId.value = row.id
          if ('branch' in row) {
            row['branch_id'] = row.branch.id
          }
          update_data.value = { ...row }
          if (row.active == 1) {
            update_data.value.active = true
          } else {
            update_data.value.active = false
          }
          showUpdate.value = true
        },
      }
    }
    const filter = (e) => {
      roomInst.value.filter({
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
    //Branch start
    const showBranchChoose = ref(false)
    const showBranchAdd = ref(false)
    const branchInst = ref(null)
    const formBranch = reactive([
      { value: '', key: 'name', label: 'Name', type: 'input' },
      {
        value: '0',
        key: 'showMenu',
        label: "Menyuda ko'rsatish",
        type: 'switch',
      },
    ])
    const rulesBranch = computed(() => {
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
    const createBranch = async (e) => {
      const vBranch$ = useVuelidate(rulesBranch, e)
      vBranch$.value.$validate()
      store.state.modalValidations = vBranch$
      if (!vBranch$.value.$error) {
        const data = await BranchService.create(e)
        loadBranches.value.push(data)
        branchItems.value.push({ label: data.name, value: data.id })
        if (showCreate.value) {
          create_data.value.branch_id = data.id
        } else if (showUpdate.value) {
          update_data.value.branch_id = data.id
        }
        showBranchAdd.value = false
      }
    }
    const rowPropsBranch = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          if (showCreate.value) {
            create_data.value.branch_id = row.id
            showBranchChoose.value = false
          } else if (showUpdate.value) {
            update_data.value.branch_id = row.id
            showBranchChoose.value = false
          }
        },
      }
    }
    const openBranch = () => {
      showBranchChoose.value = true
    }
    const openBranchAdd = () => {
      showBranchAdd.value = true
      showBranchChoose.value = false
    }
    const searchBranch = (e) => {
      branchInst.value.filter({
        name: [e],
      })
    }
    const leaveExtra = () => {
      store.dispatch('setNull')
    }
    //Branch end
    return {
      data,
      create_data,
      update_data,
      showCreate,
      showUpdate,
      vCreate$,
      vUpdate$,
      leave,
      branchItems,
      loadBranches,
      leaveExtra,
      formBranch,
      roomRef: roomInst,
      branchRef: branchInst,
      searchBranch,
      createBranch,
      openBranch,
      openBranchAdd,
      showBranchChoose,
      showBranchAdd,
      firstInput,
      firstUpdateInput,
      rowPropsBranch,
      columns: createColumns({
        del(row, e) {
          e.stopPropagation()
          del(row.id)
        },
        update(row, e) {
          e.stopPropagation()
          updateId.value = row.id
          if ('branch' in row) {
            row['branch_id'] = row.branch.id
          }
          update_data.value = { ...row }
          if (row.active == 1) {
            update_data.value.active = true
          } else {
            update_data.value.active = false
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
      modalColumns: columnsModal(),
      createRoom,
      updateRoom,
      filter,
      rowProps,
      cancelCallback,
      pagintion: {
        pageSize: 10,
      },
    }
  },
}
</script>
