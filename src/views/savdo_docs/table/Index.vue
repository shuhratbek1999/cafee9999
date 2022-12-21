<template>
  <div>
    <!--Branch start-->
    <n-modal
      v-model:show="showAddBranch"
      preset="dialog"
      title="Qo'shish"
      :on-after-leave="leaveBranch"
    >
      <n-form>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Name</p>
          <n-input
            v-model:value="create_branch.name"
            placeholder="Kiriting"
            ref="firstInput"
          />
          <small>
            <n-gradient-text type="error" v-if="vBranch$.name.$error">
              {{ vBranch$.name.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <n-form-item label="Menyuda chiqarish" style="font-weight: bold">
          <n-switch
            v-model:value="create_branch.showMenu"
            checked-value="1"
            unchecked-value="0"
          />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button type="primary" @click="createBranch">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal v-model:show="showChooseBranch">
      <n-card
        title="Tanlang"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        style="width: 400px"
      >
        <div style="display: flex">
          <n-button type="primary" @click="openAddBranch">+</n-button>
          <n-input
            style="margin-left: 20px"
            placeholder="Qidirish"
            @input="searchBranch"
          ></n-input>
        </div>
        <n-data-table
          :columns="columnsModal"
          :data="loadBranches"
          ref="branchRef"
          style="margin-top: 20px"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
          :rowProps="rowPropsBranch"
        >
          <template #empty>
            <table-no-data></table-no-data>
          </template>
        </n-data-table>
      </n-card>
    </n-modal>
    <!--Branch end-->
    <!--Room start-->
    <n-modal
      v-model:show="showAddRoom"
      preset="dialog"
      title="Qo'shish"
      :on-after-leave="leaveRoom"
    >
      <n-form>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Name</p>
          <n-input
            v-model:value="create_room.name"
            placeholder="Kiriting"
            ref="firstInput"
          />
          <small>
            <n-gradient-text type="error" v-if="vRoom$.name.$error">
              {{ vRoom$.name.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Bo'limni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_room.branch_id"
              :options="Branches"
              placeholder="Bo'limni tanlang"
              style="font-weight: 400"
              filterable
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="openBranch">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vRoom$.branch_id.$error">
              {{ vRoom$.branch_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <n-form-item label="Faollik" style="font-weight: bold">
          <n-switch
            v-model:value="create_room.active"
            checked-value="1"
            unchecked-value="0"
          />
        </n-form-item>
        <n-form-item label="Comment" style="font-weight: bold">
          <n-input
            v-model:value="create_room.comment"
            style="font-weight: 400"
            placeholder="Kiriting"
          ></n-input>
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button type="primary" @click="createRoom">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal v-model:show="showChooseRoom">
      <n-card
        title="Tanlang"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        style="width: 400px"
      >
        <div style="display: flex">
          <n-button type="primary" @click="openAddRoom">+</n-button>
          <n-input
            style="margin-left: 20px"
            placeholder="Qidirish"
            @input="searchRoom"
          ></n-input>
        </div>
        <n-data-table
          :columns="columnsModal"
          :data="loadRooms"
          ref="roomRef"
          style="margin-top: 20px"
          :max-height="300"
          :min-height="300"
          :render-cell="renderCell"
          :rowProps="rowPropsRoom"
        >
          <template #empty>
            <table-no-data></table-no-data>
          </template>
        </n-data-table>
      </n-card>
    </n-modal>
    <!--Room end-->
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Stol qo'shish"
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
          <p style="font-weight: bold">Xonani tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.room_id"
              :options="room"
              filterable
              placeholder="Tanlang"
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="openChooseRoom">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vCreate$.room_id.$error">
              {{ vCreate$.room_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Stullar soni</p>
          <n-input-number
            v-model:value="create_data.chair_count"
            placeholder="Kiriting"
            type="number"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
            :parse="parse"
            :format="format"
          >
          </n-input-number>
          <small>
            <n-gradient-text type="error" v-if="vCreate$.chair_count.$error">
              {{ vCreate$.chair_count.$errors[0].$message }}
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
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Stolni taxrirlash"
      :on-after-leave="leave"
    >
      <n-form>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Name</p>
          <n-input
            v-model:value="update_data.name"
            placeholder="Kiriting"
            ref="firstUpdateInput
          "
          />
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.name.$error">
              {{ vUpdate$.name.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Xonani tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="update_data.room_id"
              :options="room"
              filterable
            >
              <template #empty>Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="openChooseRoom">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.room_id.$error">
              {{ vUpdate$.room_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Stullar soni</p>
          <n-input-number
            v-model:value="update_data.chair_count"
            placeholder="Input chair count"
            type="number"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
            :parse="parse"
            :format="format"
          >
          </n-input-number>
          <small>
            <n-gradient-text type="error" v-if="vUpdate$.chair_count.$error">
              {{ vUpdate$.chair_count.$errors[0].$message }}
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
        ref="tableRef"
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
import { computed, h, ref, watchEffect, reactive } from 'vue'
import { NButton, NIcon, NText } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import useVuelidate from '@vuelidate/core'
import TableNoData from '../../../components/TableNoData.vue'
import { required, maxLength, numeric, helpers } from '@vuelidate/validators'
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
          ~row.room.name.toLowerCase().indexOf(value.toLowerCase()) ||
          ~row.chair_count.toString().indexOf(value)
        )
      },
    },
    {
      title: 'Room',
      key: 'room.name',
      sorter: (row1, row2) => row1.room.name.localeCompare(row2.room.name),
    },
    {
      title: 'Chair',
      key: 'chair_count',
      sorter: (row1, row2) => row1.chair_count - row2.chair_count,
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.chair_count,
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

import { onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import TableService from '../../../services/table.service'
import RoomService from '../../../services/room.service'
import BranchService from '../../../services/branch.service'
export default {
  components: {
    TableNoData,
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
    let create_data = ref({
      name: '',
      chair_count: null,
      room_id: null,
    })
    const update_data = ref({
      name: '',
      chair_count: null,
      room_id: null,
    })
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
        chair_count: {
          required: helpers.withMessage(
            "Stollar soni bo'sh bo'lmasligi kerak",
            required,
          ),
          numeric: helpers.withMessage(
            "Stollar soni son bo'lishi kerak",
            numeric,
          ),
          maxLength: helpers.withMessage(
            'chair_count ta belgidan oshmasligi kerak',
            maxLength(11),
          ),
        },
        room_id: {
          required: helpers.withMessage('Xona tanlanishi kerak', required),
          numeric: helpers.withMessage("Xona son bo'lishi kerak", numeric),
        },
      }
    })
    const vCreate$ = useVuelidate(rules, create_data)
    const vUpdate$ = useVuelidate(rules, update_data)
    let updateId = ref(0)
    let deleteId = ref(0)
    let data = ref([])
    let room = ref([])
    let loadRooms = ref([])
    let loadBranches = ref([])
    let Branches = ref([])
    const tableInst = ref(null)
    const del = function deleteTable(id) {
      deleteId.value = id
      showModalRef.value = true
    }
    const createTable = function () {
      vCreate$.value.$validate()
      if (!vCreate$.value.$error) {
        TableService.create(create_data.value).then((res) => {
          showCreate.value = false
          vCreate$.value.$reset()
          data.value.push(res)
          showCreate.value = false
        })
      }
    }
    const updateTable = function () {
      vUpdate$.value.$validate()
      if (!vUpdate$.value.$error) {
        TableService.update(updateId.value, update_data.value).then((res) => {
          const index = data.value.findIndex((val) => val.id == res.id)
          vUpdate$.value.$reset()
          data.value[index] = res
          updateId.value = 0
          showUpdate.value = false
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
        chair_count: 0,
        room_id: null,
      }
      update_data.value = {
        name: '',
        chair_count: 0,
        room_id: 0,
      }
      vCreate$.value.$reset()
      vUpdate$.value.$reset()
    }
    onMounted(async () => {
      data.value = await TableService.getAll()
      loadRooms.value = await RoomService.getAll()
      for (let i = 0; i < loadRooms.value.length; i++) {
        const element = loadRooms.value[i]
        room.value.push({ label: element.name, value: element.id })
      }
      loadBranches.value = await BranchService.getAll()
      for (let i = 0; i < loadBranches.value.length; i++) {
        const element = loadBranches.value[i]
        Branches.value.push({ label: element.name, value: element.id })
      }
    })
    const rowProps = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          updateId.value = row.id
          showUpdate.value = true
          update_data.value.name = row.name
          update_data.value.room_id = row.room.id
          update_data.value.chair_count = row.chair_count
        },
      }
    }
    const filter = (e) => {
      tableInst.value.filter({
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
    //room start
    const showChooseRoom = ref(false)
    const showAddRoom = ref(false)
    const roomInst = ref(null)
    const create_room = reactive({
      name: '',
      active: 0,
      branch_id: null,
      comment: '',
    })
    const rulesRoom = computed(() => {
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
    const vRoom$ = useVuelidate(rulesRoom, create_room)
    const leaveRoom = () => {
      create_room.name = ''
      create_room.active = 0
      create_room.branch_id = null
      create_room.comment = ''
      vRoom$.value.$reset()
    }
    const searchRoom = (e) => {
      roomInst.value.filter({
        name: [e],
      })
    }
    const openChooseRoom = () => {
      showChooseRoom.value = true
    }
    const openAddRoom = () => {
      showChooseRoom.value = false
      showAddRoom.value = true
    }
    const createRoom = async () => {
      vRoom$.value.$validate()
      if (!vRoom$.value.$error) {
        try {
          const data = await RoomService.create(create_room)
          loadRooms.value.push(data)
          room.value.push({ label: data.name, value: data.id })
          if (showCreate.value) {
            create_data.value.room_id = data.id
          } else if (showUpdate.value) {
            update_data.value.room_id = data.id
          }
          showAddRoom.value = false
        } catch (e) {
          message.error(e)
        }
      }
    }
    const rowPropsRoom = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          if (showCreate.value) {
            create_data.value.room_id = row.id
          } else if (showUpdate.value) {
            update_data.value.room_id = row.id
          }
          showChooseRoom.value = false
        },
      }
    }
    //room end
    //branch start
    const showChooseBranch = ref(false)
    const showAddBranch = ref(false)
    const branchInst = ref(null)
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
    const create_branch = reactive({
      name: '',
      showMenu: 0,
    })
    const vBranch$ = useVuelidate(rulesBranch, create_branch)
    const createBranch = async () => {
      vBranch$.value.$validate()
      if (!vBranch$.value.$error) {
        const data = await BranchService.create(create_branch)
        loadBranches.value.push(data)
        Branches.value.push({ label: data.name, value: data.id })
        create_room.branch_id = data.id
        showAddBranch.value = false
      }
    }
    const openBranch = () => {
      showChooseBranch.value = true
    }
    const leaveBranch = () => {
      create_branch.name = ''
      create_branch.showMenu = 0
      vBranch$.value.$reset()
    }
    const rowPropsBranch = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          create_room.branch_id = row.id
          showChooseBranch.value = false
        },
      }
    }
    const openAddBranch = () => {
      showAddBranch.value = true
      showChooseBranch.value = false
    }
    const searchBranch = (e) => {
      branchInst.value.filter({
        name: [e],
      })
    }
    //branch end
    return {
      showDelete: showModalRef,
      onPositiveClick() {
        TableService.delete(deleteId.value).then((res) => {
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
      createBranch,
      showAddBranch,
      showChooseBranch,
      create_branch,
      rowPropsBranch,
      searchBranch,
      vBranch$,
      format,
      parse,
      branchRef: branchInst,
      leaveBranch,
      leaveRoom,
      data,
      tableRef: tableInst,
      openAddRoom,
      openAddBranch,
      firstInput,
      create_room,
      firstUpdateInput,
      openBranch,
      loadRooms,
      rowPropsRoom,
      showAddRoom,
      loadBranches,
      Branches,
      roomRef: roomInst,
      vRoom$,
      showChooseRoom,
      createRoom,
      openChooseRoom,
      searchRoom,
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
          update_data.value.room_id = row.room.id
          update_data.value.chair_count = row.chair_count
        },
      }),
      renderCell: (value) => {
        if (!value) {
          return h(NText, { depth: 3 }, { default: () => 'empty' })
        }
        return value
      },
      room,
      create_data,
      update_data,
      vUpdate$,
      vCreate$,
      createTable,
      updateTable,
      leave,
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
