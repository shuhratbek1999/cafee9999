<script setup>
import { ref, onMounted, h, computed, watchEffect } from 'vue'
import { NButton, NIcon, useMessage, useDialog } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import TableNoData from '../../../components/TableNoData.vue'
import {
  required,
  maxLength,
  helpers,
  email,
  minLength,
} from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
const message = useMessage()
const dialog = useDialog()
//caisher start
import CaisherService from '../../../services/caisher.service.js'
let caisher = ref([])
const showModal = ref(false)

//formdata start
const form_data = ref({
  username: '',
  password: '',
  email: '',
})
const caisherRef = ref(null)
const isCreate = ref(null)
const searchCaisher = (e) => {
  caisherRef.value.filter({
    username: [e],
  })
}
const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage(
        "Username bo'sh bo'lmasligi kerak",
        required,
      ),
      maxLength: helpers.withMessage(
        'Name 100 ta belgidan oshmasligi kerak',
        maxLength(100),
      ),
      minLength: helpers.withMessage(
        "Name kamida 2 ta belgidan iborat bo'lishi kerak",
        minLength(2),
      ),
    },
    password: {
      required: helpers.withMessage(
        "Password bo'sh bo'lmasligi kerak",
        required,
      ),
      maxLength: helpers.withMessage(
        'Name 25 ta belgidan oshmasligi kerak',
        maxLength(25),
      ),
    },
    email: {
      required: helpers.withMessage("Email bo'sh bo'lmasligi kerak", required),
      email: helpers.withMessage("Bu email bo'lishi kerak", email),
    },
  }
})
const vForm$ = useValidate(rules, form_data)
const cancelCallback = () => {
  form_data.value = {
    username: '',
    password: '',
    email: '',
  }
  showModal.value = false
  isCreate.value = false
  vForm$.value.$reset()
}
const leaveModal = () => {
  form_data.value = {
    username: '',
    password: '',
    email: '',
  }
  showModal.value = false
  isCreate.value = false
  vForm$.value.$reset()
}
const openCreate = () => {
  showModal.value = true
  isCreate.value = true
}
const sumbitCaisher = async () => {
  vForm$.value.$validate()
  if (!vForm$.value.$error) {
    if (isCreate.value) {
      try {
        const data = await CaisherService.create(form_data.value)
        caisher.value.push(data)
        form_data.value = {
          username: '',
          password: '',
          email: '',
        }
        showModal.value = false
        vForm$.value.$reset()
      } catch (error) {
        message.error(error)
      }
    }
  }
}
//caisher end
const pagination = ref({
  pageSize: 10,
})
onMounted(async () => {
  caisher.value = await CaisherService.getAll()
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
    key: 'username',
    defaultSortOrder: 'ascend',
    sorter: 'default',
    filter(value, row) {
      return (
        ~row.username.toLowerCase().indexOf(value.toLowerCase()) ||
        ~row.email.toLowerCase().indexOf(value.toLowerCase())
      )
    },
  },
  {
    title: 'Email',
    key: 'email',
    defaultSortOrder: 'ascend',
    sorter: 'default',
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
              console.log(row)
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
                    const data = await CaisherService.delete(row.id)
                    message.success("Muvaffaqiyatli o'chirildi")
                    const index = caisher.value.findIndex(
                      (val) => val.id == data.id,
                    )
                    caisher.value.splice(index, 1)
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
//waiter end
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
        @input="searchCaisher"
      ></n-input>
    </div>
    <n-data-table
      :data="caisher"
      :columns="createColumns"
      style="margin-top: 20px"
      :pagination="pagination"
      ref="caisherRef"
    >
      <template #empty>
        <table-no-data></table-no-data>
      </template>
    </n-data-table>
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="Kassir"
      :on-after-leave="leaveModal"
    >
      <n-form>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Username</p>
          <n-input
            v-model:value="form_data.username"
            placeholder="Kiriting"
            ref="firstInput"
          />
          <small>
            <n-gradient-text type="error" v-if="vForm$.username.$error">
              {{ vForm$.username.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Password</p>
          <n-input v-model:value="form_data.password" placeholder="Kiriting" />
          <small>
            <n-gradient-text type="error" v-if="vForm$.password.$error">
              {{ vForm$.password.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div style="display: flex; flex-direction: column; height: 100px">
          <p style="font-weight: bold">Email</p>
          <n-input v-model:value="form_data.email" placeholder="Kiriting" />
          <small>
            <n-gradient-text type="error" v-if="vForm$.email.$error">
              {{ vForm$.email.$errors[0].$message }}
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
          <n-button type="primary" @click="sumbitCaisher">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>
