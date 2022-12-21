<script setup>
import { ref, onMounted, h, computed, watchEffect } from 'vue'
import { NButton, NIcon, useMessage, useDialog } from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import TableNoData from '../../../components/TableNoData.vue'
//chief start
import ChiefService from '../../../services/chief.service'
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
let chiefs = ref([])
const showModal = ref(false)
const chiefRef = ref(null)
//formdata start
const form_data = ref({
  username: '',
  password: '',
  email: '',
})
const isCreate = ref(null)
const searchChief = (e) => {
  chiefRef.value.filter({
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
const sumbitChief = async () => {
  vForm$.value.$validate()
  if (!vForm$.value.$error) {
    if (isCreate.value) {
      try {
        const data = await ChiefService.create(form_data.value)
        chiefs.value.push(data)
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
//formdata end
const pagination = ref({
  pageSize: 10,
})
onMounted(async () => {
  chiefs.value = await ChiefService.getAll()
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
                    const data = await ChiefService.delete(row.id)
                    message.success("Muvaffaqiyatli o'chirildi")
                    const index = chiefs.value.findIndex(
                      (val) => val.id == data.id,
                    )
                    chiefs.value.splice(index, 1)
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
//chief end
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
        @input="searchChief"
      ></n-input>
    </div>
    <n-data-table
      :data="chiefs"
      :columns="createColumns"
      style="margin-top: 20px"
      :pagination="pagination"
      ref="chiefRef"
    >
      <template #empty>
        <table-no-data></table-no-data>
      </template>
    </n-data-table>
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="Oshpaz"
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
          <n-input
            v-model:value="form_data.email"
            placeholder="Kiriting"
            type="email"
          />
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
          <n-button type="primary" @click="sumbitChief">Submit</n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>
