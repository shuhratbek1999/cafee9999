<script setup>
import { ref, onMounted, h, computed, watchEffect } from 'vue'
import { NButton, NIcon, useMessage, useDialog } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import TableNoData from '../../../components/TableNoData.vue'
//chief start
import WorkerService from '../../../services/worker.service'
import { required, maxLength, helpers } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
const message = useMessage()
const dialog = useDialog()

//create start
const leaveCreate = () => {
  form_create.value.name = ''
  showCreate.value = false
  vCreate$.value.$reset()
}
const openCreate = () => {
  showCreate.value = true
}
const showCreate = ref(false)
const form_create = ref({
  name: '',
})
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Name bo'sh bo'lmasligi kerak", required),
      maxLength: helpers.withMessage(
        'Name 100 ta belgidan oshmasligi kerak',
        maxLength(100),
      ),
    },
  }
})
const vCreate$ = useValidate(rules, form_create)
const cancelCallback = () => {
  showCreate.value = false
  showUpdate.value = false
}
const rowProps = (row) => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      updateId.value = row.id
      form_update.value.name = row.name
      showUpdate.value = true
    },
  }
}
const createWorker = async () => {
  vCreate$.value.$validate()
  if (!vCreate$.value.$error) {
    try {
      const data = await WorkerService.create(form_create.value)
      workers.value.push(data)
      form_create.value.name = ''
      showCreate.value = false
      vCreate$.value.$reset()
    } catch (error) {
      message.error(error)
    }
  }
}
//create end
//table start
let workers = ref([])
const workerRef = ref(null)
const searchWorker = (e) => {
  workerRef.value.filter({
    name: [e],
  })
}
//table end
//update start

const showUpdate = ref(false)
const form_update = ref({
  name: '',
})
const updateId = ref(null)
const vUpdate$ = useValidate(rules, form_update)
const leaveUpdate = () => {
  updateId.value = null
  vUpdate$.value.$validate()
  form_update.value = {
    name: '',
  }
}
const updateWorker = async () => {
  vUpdate$.value.$validate()
  if (!vUpdate$.value.$error) {
    try {
      const data = await WorkerService.update(updateId.value, form_update.value)
      const index = workers.value.findIndex((val) => val.id === data.id)
      workers.value[index].name = data.name
      workers.value[index].qoldiq = data.qoldiq
      form_update.value = {
        name: '',
      }
      vUpdate$.value.$reset()
      showUpdate.value = false
    } catch (error) {
      message.error(error)
    }
  }
}
//update end
//formdata start
//formdata end
const pagination = ref({
  pageSize: 10,
})
onMounted(async () => {
  workers.value = await WorkerService.getAll()
})

const createColumns = [
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
    title: 'Qoldiq',
    key: 'qoldiq',
    render: (_) => {
      return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
        _.qoldiq,
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
            type: 'success',
            style: {
              height: '35px',
            },
            onClick: (e) => {
              e.stopPropagation()
              updateId.value = row.id
              form_update.value.name = row.name
              showUpdate.value = true
            },
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
            onClick: (e) => {
              e.stopPropagation()
              dialog.success({
                title: 'Ogohlantirish',
                content: "O'chirilsinmi ?",
                positiveText: 'Ha',
                negativeText: "Yo'q",
                onPositiveClick: async () => {
                  try {
                    const data = await WorkerService.delete(row.id)
                    message.success("Muvaffaqiyatli o'chirildi")
                    const index = workers.value.findIndex(
                      (val) => val.id == data.id,
                    )
                    workers.value.splice(index, 1)
                  } catch (error) {
                    message.error(error)
                  }
                },
                onNegativeClick: () => {
                  message.info("O'chirilmadi")
                },
              })
            },
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
// end
//set focus first input
const firstInput = ref(null)
watchEffect(() => {
  if (firstInput.value) {
    firstInput.value.focus()
  } else {
    // not mounted yet, or the element was unmounted (e.g. by v-if)
  }
})
</script>

<template>
  <div>
    <div style="display: flex">
      <n-button type="primary" @click="openCreate">+</n-button>
      <n-input
        placeholder="Qidirish"
        style="margin-left: 20px"
        @input="searchWorker"
      ></n-input>
    </div>
    <n-data-table
      :data="workers"
      :columns="createColumns"
      style="margin-top: 20px"
      :pagination="pagination"
      ref="workerRef"
      :rowProps="rowProps"
    >
      <template #empty>
        <table-no-data></table-no-data>
      </template>
    </n-data-table>
    <n-modal
      v-model:show="showCreate"
      preset="dialog"
      title="Ishchilar"
      :on-after-leave="leaveCreate"
    >
      <n-form>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Name</p>
          <n-input
            v-model:value="form_create.name"
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
          <n-button type="primary" @click="createWorker">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showUpdate"
      preset="dialog"
      title="Ishchilar"
      :on-after-leave="leaveUpdate"
    >
      <n-form>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Name</p>
          <n-input
            v-model:value="form_update.name"
            placeholder="Kiriting"
            ref="firstInput"
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
          <n-button type="primary" @click="updateWorker">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>
