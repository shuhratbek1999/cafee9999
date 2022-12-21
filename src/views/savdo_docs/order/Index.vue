<template>
  <n-modal
    v-model:show="showCreate"
    preset="dialog"
    title="Buyurtma qilish oynasi"
    style="width: 1250px"
    :close-on-esc="false"
    :on-after-leave="leave"
  >
    <n-form>
      <div style="display: flex; justify-content: space-between">
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Yaratilgan sana</p>
          <n-alert type="success">
            {{ create_data.created_date }}
          </n-alert>
        </div>
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">To'lov summa</p>
          <n-input
            v-model:value="create_data.pay_sum"
            type="number"
            ref="firstInput"
          />
        </div>
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Umumiy xizmat</p>
          <n-input v-model:value="create_data.common_service" type="number" />
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 20px"
      >
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Umumiy summa</p>
          <n-input v-model:value="create_data.common_sum" type="number" />
        </div>
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Chegirma (%)</p>
          <n-input v-model:value="create_data.bonus" type="number" />
        </div>
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Plastik</p>
          <n-input v-model:value="create_data.plactic_sum" type="number" />
        </div>
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Naqt</p>
          <n-input v-model:value="create_data.cash_sum" type="number" />
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 20px"
      >
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Afitsantni tanlang</p>
          <n-select
            v-model:value="create_data.user_id"
            :options="usersSelect"
            filterable
            placeholder="Tanlang"
          >
            <template #empty> Ma'lumotlar topilmadi 🙁</template>
          </n-select>
          <small>
            <n-gradient-text type="error" v-if="vCreateData$.user_id.$error">
              Afitsantni tanlang
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Xonani tanlang</p>
          <n-select
            v-model:value="create_data.room_id"
            :options="roomsSelect"
            @update:value="updateRoom"
            placeholder="Tanlang"
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
          <small>
            <n-gradient-text type="error" v-if="vCreateData$.room_id.$error">
              Xonani tanlang
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Stolni tanlang</p>
          <n-select
            v-model:value="create_data.table_id"
            :options="tables"
            filterable
            placeholder="Tanlang"
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
          <small>
            <n-gradient-text type="error" v-if="vCreateData$.table_id.$error">
              Stolni tanlang
            </n-gradient-text>
          </small>
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 25px"
      >
        <div
          style="
            width: 40%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Mijozni tanlang</p>
          <n-select
            v-model:value="create_data.client_id"
            :options="clientsSelect"
            filterable
            placeholder="Tanlang"
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
          <small>
            <n-gradient-text type="error" v-if="vCreateData$.client_id.$error">
              Mijozni tanlang
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            width: 40%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Status</p>
          <n-select
            v-model:value="create_data.status"
            :options="statusMainSelect"
            filterable
            placeholder="Tanlang"
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
        </div>
      </div>
      <n-button
        @click="add"
        type="primary"
        style="margin-top: 35px; margin-bottom: 20px"
        >+</n-button
      >
      <n-data-table :columns="columns2" :data="createE.data">
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
      <small>
        <n-gradient-text type="error" v-if="vCreateExtra$.$error">
          Yuqoridagi ma'lumotlarni to'ldiring
        </n-gradient-text>
      </small>
      <n-form-item label="Umumiy summa" style="font-weight: bold">
        {{ create_data.all_sum }}
      </n-form-item>
      <n-form-item label="Comment kiriting" style="font-weight: bold">
        <n-input
          v-model:value="create_data.comment"
          type="text"
          style="font-weight: 400"
          placeholder="Commentni kiriting"
        />
      </n-form-item>
      <div style="display: flex; justify-content: flex-end">
        <n-button
          @click="cancelCallback"
          style="margin-right: 10px"
          type="error"
          >Close</n-button
        >
        <n-button type="primary" @click="createOrder">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <n-modal
    v-model:show="showUpdate"
    preset="dialog"
    title="Buyurtmani o'zgartirish oynasi"
    style="width: 1250px"
    :close-on-esc="false"
    :on-after-leave="leave"
  >
    <n-form>
      <div style="display: flex; justify-content: space-between">
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Yaratilgan vaqti</p>
          <n-alert type="success">
            {{ update_data.created_date }}
          </n-alert>
        </div>
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Oxirgi o'zgarish vaqti</p>
          <n-alert type="success">
            {{ update_data.last_update }}
          </n-alert>
        </div>
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Hozirgi vaqt</p>
          <n-alert type="success">
            {{ update_data.updated_date }}
          </n-alert>
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 20px"
      >
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">To'lov summa</p>
          <n-input
            v-model:value="update_data.pay_sum"
            type="number"
            ref="firstUpdateInput"
          />
        </div>
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Umumiy xizmat</p>
          <n-input v-model:value="update_data.common_service" type="number" />
        </div>
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Umumiy summa</p>
          <n-input v-model:value="update_data.common_sum" type="number" />
        </div>
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-weight: bold">Chegirma (%)</p>
          <n-input v-model:value="update_data.bonus" type="number" />
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 20px"
      >
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Plastik</p>
          <n-input v-model:value="update_data.plastic_sum" type="number" />
        </div>
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Naqt</p>
          <n-input v-model:value="update_data.cash_sum" type="number" />
        </div>
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Afitsantni tanlang</p>
          <n-select
            v-model:value="update_data.user_id"
            :options="usersSelect"
            filterable
            placeholder="Tanlang"
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
          <small>
            <n-gradient-text type="error" v-if="vUpdateData$.user_id.$error">
              Afitsantni tanlang
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Xonani tanlang</p>
          <n-select
            v-model:value="update_data.room_id"
            :options="roomsSelect"
            @update:value="updateRoom2"
            placeholder="Tanlang"
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
          <small>
            <n-gradient-text type="error" v-if="vUpdateData$.room_id.$error">
              Xonani tanlang
            </n-gradient-text>
          </small>
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 20px"
      >
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Stolni tanlang</p>
          <n-select
            v-model:value="update_data.table_id"
            :options="tables"
            placeholder="Tanlang"
            filterable
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
          <small>
            <n-gradient-text type="error" v-if="vUpdateData$.table_id.$error">
              Stolni tanlang
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Mijozni tanlang</p>
          <n-select
            v-model:value="update_data.client_id"
            :options="clientsSelect"
            filterable
            placeholder="Tanlang"
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
          <small>
            <n-gradient-text type="error" v-if="vUpdateData$.client_id.$error">
              Mijozni tanlang
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Status</p>
          <n-select
            v-model:value="update_data.status"
            :options="statusMainSelect"
            placeholder="Tanlang"
            filterable
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
        </div>
      </div>
      <n-button
        @click="addUpdate"
        type="primary"
        style="margin-top: 20px; margin-top: 20px"
        >+</n-button
      >
      <n-data-table :columns="columnsUpdate" :data="updateE.data">
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
      <small>
        <n-gradient-text type="error" v-if="vUpdateExtra$.$error">
          Yuqoridagi ma'lumotlarni to'ldiring
        </n-gradient-text>
      </small>
      <n-form-item label="Umumiy summa" style="font-weight: bold">
        {{ update_data.all_sum }}
      </n-form-item>
      <n-form-item label="Comment kiriting" style="font-weight: bold">
        <n-input
          v-model:value="update_data.comment"
          type="text"
          style="font-weight: 400"
          placeholder="Commentni kiriting"
        />
      </n-form-item>
      <div style="display: flex; justify-content: flex-end">
        <n-button
          @click="cancelCallback"
          style="margin-right: 10px"
          type="error"
          >Close</n-button
        >
        <n-button type="primary" @click="updateOrder">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <div style="display: flex; justify-content: space-between">
    <n-button type="primary" @click="openCreate">+</n-button>
    <n-input
      type="text"
      placeholder="Search"
      style="width: 94%; border-radius: 5px"
      @input="filter"
    />
  </div>
  <br />
  <div style="display: flex; justify-content: space-between">
    <div style="width: 69%">
      <n-data-table
        ref="orderRef"
        :data="data"
        :columns="columns"
        :pagination="paginition"
        :rowProps="rowProps"
        :render-cell="renderCell"
      >
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </div>
    <div style="width: 30%">
      <n-data-table :data="childs.data" :columns="childColumns">
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </div>
  </div>
</template>
<script>
import OrderService from '../../../services/order.service'
import UserService from '../../../services/user.service'
import RoomService from '../../../services/room.service'
import FoodService from '../../../services/food.service'
import TableNoData from '../../../components/TableNoData.vue'
import ClientService from '../../../services/client.service'
import { ref, onMounted, h, computed, watchEffect } from 'vue'
import {
  NButton,
  NIcon,
  NSelect,
  NInput,
  useDialog,
  useMessage,
  NTag,
  NText,
} from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import Click from '@vicons/fluent/CursorClick20Regular'
import Cancel from '@vicons/material/CancelFilled'
import moment from 'moment'
import useValidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
const createColumns = ({ update, del, click }) => {
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
      title: 'Afitsant',
      key: 'user.username',
      sorter: (row1, row2) =>
        row1.user.username.localeCompare(row2.user.username),
    },
    {
      title: 'Stol',
      key: 'table.name',
      sorter: (row1, row2) => row1.table.name.localeCompare(row2.table.name),
    },
    {
      title: 'Jami Summa',
      key: 'all_sum',
      sorter: (row1, row2) => row1.common_sum - row2.common_sum,
      filter(value, row) {
        return (
          ~row.all_sum.toString().indexOf(value) ||
          ~row.table.name.toLowerCase().indexOf(value.toLowerCase()) ||
          ~row.user.username.toLowerCase().indexOf(value.toLowerCase())
        )
      },
    },
    {
      title: 'Action',
      key: 'actions',
      render(row, index) {
        return [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              style: {
                height: '35px',
                fontSize: '20px',
              },
              onClick: () => click(row, index),
            },
            {
              icon: () =>
                h(NIcon, {
                  component: Click,
                }),
            },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              style: {
                height: '35px',
                marginLeft: '10px',
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
              onClick: (e) => del(row, index, e),
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
const createChildcolumns = () => {
  return [
    {
      title: 'Mahsulot',
      key: 'food.name',
    },
    {
      title: 'Miqdori',
      key: 'amount',
    },
    {
      title: 'Narxi',
      key: 'body_price',
    },
    {
      title: 'Summa',
      key: 'sum',
    },
  ]
}
export default {
  components: {
    TableNoData,
  },
  setup() {
    let data = ref([])
    const firstInput = ref(null)
    const firstUpdateInput = ref(null)
    let create_data = ref({
      created_date: null,
      updated_date: null,
      pay_sum: '',
      common_service: '',
      common_sum: '',
      all_sum: 0,
      bonus: '',
      cash_sum: '',
      plastic_sum: '',
      comment: '',
      status: null,
      user_id: null,
      room_id: null,
      table_id: null,
      branch_id: null,
      client_id: null,
    })
    let update_data = ref({
      created_date: null,
      updated_date: null,
      last_update: null,
      pay_sum: '',
      common_service: '',
      common_sum: '',
      all_sum: 0,
      bonus: '',
      cash_sum: '',
      plastic_sum: '',
      comment: '',
      status: null,
      user_id: null,
      room_id: null,
      table_id: null,
      branch_id: null,
      client_id: null,
    })
    let updateId = ref(null)
    const createE = ref({
      data: [],
    })
    const updateE = ref({
      data: [],
    })
    let users = ref([])
    let usersSelect = ref([])
    let rooms = ref([])
    let roomsSelect = ref([])
    let tables = ref([])
    let foods = ref([])
    let foodsSelect = ref([])
    let clients = ref([])
    let clientsSelect = ref([])
    const statusMainSelect = ref([
      { label: 'Yaratilgan', value: 'created' },
      { label: "To'lovda", value: 'pay' },
      { label: 'Tugallangan', value: 'completed' },
      { label: 'Bekor qilingan', value: 'cancel' },
    ])
    const statusChildSelect = ref([
      { label: 'Kutilmoqda', value: 'waiting' },
      { label: "Jo'natilgan", value: 'sending' },
      { label: 'Tayyorlanmoqda', value: 'processing' },
      { label: 'Tugallangan', value: 'completed' },
      { label: 'Bekor qilingan', value: 'cancel' },
    ])
    let childs = ref({
      id: null,
      data: [],
    })
    let showCreate = ref(false)
    let showUpdate = ref(false)
    const orderInst = ref(null)
    const message = useMessage()
    const dialog = useDialog()
    const openCreate = function () {
      create_data.value.created_date = moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss',
      )
      create_data.value.updated_date = moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss',
      )
      showCreate.value = true
    }
    onMounted(async () => {
      data.value = await OrderService.getAll()
      users.value = await UserService.getAll()
      for (let index = 0; index < users.value.length; index++) {
        const element = users.value[index]
        usersSelect.value.push({ label: element.username, value: element.id })
      }
      rooms.value = await RoomService.getAll()
      for (let index = 0; index < rooms.value.length; index++) {
        const element = rooms.value[index]
        roomsSelect.value.push({ label: element.name, value: element.id })
      }
      foods.value = await FoodService.getAll()
      for (let index = 0; index < foods.value.length; index++) {
        const element = foods.value[index]
        foodsSelect.value.push({ label: element.name, value: element.id })
      }
      clients.value = await ClientService.getAll()
      for (let index = 0; index < clients.value.length; index++) {
        const element = clients.value[index]
        clientsSelect.value.push({ label: element.name, value: element.id })
      }
    })
    const add = function () {
      createE.value.data.push({
        food_id: null,
        amount: '',
        body_price: '',
        sum: '',
        status: null,
        comment: '',
        measure_id: null,
        measure: '',
      })
    }
    const addUpdate = function () {
      updateE.value.data.push({
        food_id: null,
        amount: '',
        body_price: '',
        sum: '',
        status: null,
        comment: '',
        measure_id: null,
        measure: '',
      })
    }
    const createColumnsE = ({ del }) => [
      {
        title: 'Taom',
        key: 'food_id',
        render(row, index) {
          return h(
            NSelect,
            {
              value: row.food_id,
              options: foodsSelect.value,
              placeholder: 'Tanlang',
              filterable: true,
              style: {
                width: '200px',
              },
              onUpdateValue(v) {
                createE.value.data[index].food_id = v
                const food = foods.value.find((val) => val.id == v)
                createE.value.data[index].body_price =
                  food.selling_price.toString()
                createE.value.data[index].measure = food.measure.name
                createE.value.data[index].measure_id = food.measure.id
                if (createE.value.data[index].amount != '') {
                  createE.value.data[index].sum = (
                    Number(createE.value.data[index].body_price) *
                    Number(createE.value.data[index].amount)
                  ).toString()
                  create_data.value.all_sum = 0
                  for (
                    let index = 0;
                    index < createE.value.data.length;
                    index++
                  ) {
                    const element = createE.value.data[index]
                    if (element.sum != '') {
                      create_data.value.all_sum += Number(element.sum)
                      element.sum = element.sum.toString()
                    }
                  }
                }
              },
            },
            {
              empty: () => "Ma'lumotlar topilmadi 🙁",
            },
          )
        },
      },
      {
        title: 'Miqdori',
        key: 'amount',
        render(row, index) {
          return h(NInput, {
            value: row.amount,
            placeholder: 'Kiriting',
            type: 'number',
            style: {
              width: '100px',
            },
            onUpdateValue(v) {
              createE.value.data[index].amount = v
              if (v == '') {
                createE.value.data[index].sum = '0'
              } else {
                createE.value.data[index].sum = (
                  Number(v) * Number(createE.value.data[index].body_price)
                ).toString()
              }
              create_data.value.all_sum = 0
              for (let index = 0; index < createE.value.data.length; index++) {
                const element = createE.value.data[index]
                if (element.sum != '') {
                  create_data.value.all_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            },
          })
        },
      },
      {
        title: 'Birligi',
        key: 'measure',
        render(row) {
          return h(NTag, {
            innerHTML: row.measure,
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Narxi',
        key: 'body_price',
        render(row) {
          return h(NTag, {
            innerHTML: row.body_price,
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Summa',
        key: 'sum',
        render(row) {
          return h(NTag, {
            innerHTML: row.sum,
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Status',
        key: 'status',
        render(row, index) {
          return h(
            NSelect,
            {
              value: row.status,
              options: statusChildSelect.value,
              placeholder: 'Tanlang',
              filterable: true,
              style: {
                width: '160px',
              },
              onUpdateValue(v) {
                createE.value.data[index].status = v
              },
            },
            {
              empty: () => "Ma'lumotlar topilmadi 🙁",
            },
          )
        },
      },
      {
        title: 'Comment',
        key: 'comment',
        render(row, index) {
          return h(NInput, {
            value: row.comment,
            placeholder: 'Kiriting',
            style: {
              width: '100px',
            },
            onUpdateValue(v) {
              createE.value.data[index].comment = v
            },
          })
        },
      },
      {
        title: 'Actions',
        test: 'actions',
        render(row, index) {
          return [
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                style: {
                  height: '35px',
                  marginLeft: '10px',
                },
                onClick: () => del(row, index),
              },
              {
                icon: () =>
                  h(NIcon, {
                    component: Cancel,
                  }),
              },
            ),
          ]
        },
      },
    ]
    const updateColumnsE = ({ del }) => [
      {
        title: 'Mahsulot',
        key: 'food_id',
        render(row, index) {
          return h(
            NSelect,
            {
              value: row.food_id,
              options: foodsSelect.value,
              placeholder: 'Tanlang',
              filterable: true,
              style: {
                width: '200px',
              },
              onUpdateValue(v) {
                updateE.value.data[index].food_id = v
                const food = foods.value.find((val) => val.id == v)
                updateE.value.data[index].body_price = food.selling_price
                updateE.value.data[index].measure = food.measure.name
                updateE.value.data[index].measure_id = food.measure.id
                if (updateE.value.data[index].amount != '') {
                  updateE.value.data[index].sum =
                    Number(updateE.value.data[index].body_price) *
                    Number(updateE.value.data[index].amount)
                  update_data.value.all_sum = 0
                  for (
                    let index = 0;
                    index < updateE.value.data.length;
                    index++
                  ) {
                    const element = updateE.value.data[index]
                    if (element.sum != '') {
                      update_data.value.all_sum += Number(element.sum)
                      element.sum = element.sum.toString()
                    }
                  }
                }
                updateE.value.data[index].body_price =
                  updateE.value.data[index].body_price.toString()
              },
            },
            {
              empty: () => "Ma'lumotlar topilmadi 🙁",
            },
          )
        },
      },
      {
        title: 'Miqdori',
        key: 'amount',
        render(row, index) {
          return h(NInput, {
            value: row.amount,
            type: 'number',
            style: {
              width: '100px',
            },
            placeholder: 'Kiriting',
            onUpdateValue(v) {
              updateE.value.data[index].amount = v
              if (updateE.value.data[index].amount == '') {
                updateE.value.data[index].sum = '0'
              } else {
                updateE.value.data[index].sum =
                  Number(v) * Number(updateE.value.data[index].body_price)
              }
              update_data.value.all_sum = 0
              for (let index = 0; index < updateE.value.data.length; index++) {
                const element = updateE.value.data[index]
                if (element.sum != '') {
                  update_data.value.all_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            },
          })
        },
      },
      {
        title: 'Birligi',
        key: 'measure',
        render(row) {
          return h(NTag, {
            innerHTML: row.measure,
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Narxi',
        key: 'body_price',
        render(row) {
          return h(NTag, {
            innerHTML: row.body_price,
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Summa',
        key: 'sum',
        render(row) {
          return h(NTag, {
            innerHTML: row.sum,
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Status',
        key: 'status',
        render(row, index) {
          return h(
            NSelect,
            {
              value: row.status,
              options: statusChildSelect.value,
              placeholder: 'Tanlang',
              style: {
                width: '160px',
              },
              onUpdateValue(v) {
                updateE.value.data[index].status = v
              },
            },
            {
              empty: () => "Ma'lumotlar topilmadi 🙁",
            },
          )
        },
      },
      {
        title: 'Comment',
        key: 'comment',
        render(row, index) {
          return h(NInput, {
            value: row.comment,
            placeholder: 'Kiriting',
            style: {
              width: '100px',
            },
            onUpdateValue(v) {
              updateE.value.data[index].comment = v
            },
          })
        },
      },
      {
        title: 'Actions',
        test: 'actions',
        render(row, index) {
          return [
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                style: {
                  height: '35px',
                  marginLeft: '10px',
                },
                onClick: () => del(row, index),
              },
              {
                icon: () =>
                  h(NIcon, {
                    component: Cancel,
                  }),
              },
            ),
          ]
        },
      },
    ]
    const rulesData = computed(() => {
      return {
        user_id: {
          required: helpers.withMessage('Afitsantni tanlang', required),
        },
        room_id: {
          required: helpers.withMessage('Xonani tanlang', required),
        },
        table_id: {
          required: helpers.withMessage('Stolni tanlang', required),
        },
        client_id: {
          required: helpers.withMessage('Mijozni tanlang', required),
        },
      }
    })
    const rulesExtraData = computed(() => {
      return {
        data: {
          $each: helpers.forEach({
            food_id: {
              required: helpers.withMessage('Mahsulotni tanlang', required),
            },
            amount: {
              required: helpers.withMessage("Miqdorni to'ldiring", required),
            },
          }),
        },
      }
    })
    const vCreateData$ = useValidate(rulesData, create_data)
    const vCreateExtra$ = useValidate(rulesExtraData, createE)
    const vUpdateData$ = useValidate(rulesData, update_data)
    const vUpdateExtra$ = useValidate(rulesExtraData, updateE)
    const createOrder = function () {
      vCreateData$.value.$validate()
      vCreateExtra$.value.$validate()
      if (!vCreateData$.value.$error && !vCreateExtra$.value.$error) {
        create_data.value.created_date = moment(
          create_data.value.created_date,
        ).format('X')
        create_data.value.updated_date = moment(
          create_data.value.updated_data,
        ).format('X')
        const branch_id = rooms.value.find(
          (val) => val.id == create_data.value.room_id,
        ).branch.id
        create_data.value.branch_id = branch_id
        for (let index = 0; index < createE.value.data.length; index++) {
          const element = createE.value.data[index]
          delete element['measure']
        }
        create_data.value['order_foods'] = createE.value.data
        OrderService.create(create_data.value).then((res) => {
          data.value.push(res)
          create_data.value = {
            created_date: null,
            updated_date: null,
            pay_sum: '',
            common_service: '',
            common_sum: '',
            all_sum: 0,
            bonus: '',
            cash_sum: '',
            plastic_sum: '',
            comment: '',
            status: null,
            user_id: null,
            room_id: null,
            table_id: null,
            branch_id: null,
            client_id: null,
          }
          createE.value.data = []
          showCreate.value = false
        })
      }
    }
    const updateOrder = function () {
      vUpdateData$.value.$validate()
      vUpdateExtra$.value.$validate()
      if (!vUpdateData$.value.$error && !vUpdateExtra$.value.$error) {
        update_data.value.created_date = moment(
          update_data.value.created_date,
        ).format('X')
        update_data.value.updated_date = moment(
          update_data.value.updated_date,
        ).format('X')
        for (let index = 0; index < updateE.value.data.length; index++) {
          const element = updateE.value.data[index]
          delete element['measure']
        }
        delete update_data.value['last_update']
        update_data.value['order_foods'] = updateE.value.data
        showUpdate.value = false
        OrderService.update(updateId.value, update_data.value).then((res) => {
          if (res) {
            const index = data.value.findIndex((val) => val.id == res.id)
            data.value[index] = res
            update_data.value = {
              created_date: null,
              updated_date: null,
              last_update: null,
              pay_sum: '',
              common_service: '',
              common_sum: '',
              all_sum: 0,
              bonus: '',
              cash_sum: '',
              plastic_sum: '',
              comment: '',
              status: null,
              user_id: null,
              room_id: null,
              table_id: null,
              branch_id: null,
              client_id: null,
            }
            updateE.value.data = []
            showUpdate.value = false
          }
        })
      }
    }
    const del = function (row) {
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          OrderService.delete(row.id).then((res) => {
            message.success("Muvaffaqiyatli o'chirildi")
            const index = data.value.findIndex((val) => val.id == res.id)
            data.value.splice(index, 1)
            if (row.id == childs.value.id) {
              childs.value.data = []
              childs.value.id = null
            }
          })
        },
        onNegativeClick: () => {
          message.info("O'chirilmadi")
        },
      })
    }
    const cancelCallback = function () {
      showCreate.value = false
      showUpdate.value = false
      leave()
    }
    const leave = function () {
      updateE.value.data = []
      createE.value.data = []
      updateId.value = null
      create_data.value = {
        created_date: null,
        updated_date: null,
        pay_sum: '',
        common_service: '',
        common_sum: '',
        all_sum: 0,
        bonus: '',
        cash_sum: '',
        plastic_sum: '',
        comment: '',
        status: null,
        user_id: null,
        room_id: null,
        table_id: null,
        branch_id: null,
        client_id: null,
      }
      update_data.value = {
        created_date: null,
        updated_date: null,
        last_update: null,
        pay_sum: '',
        common_service: '',
        common_sum: '',
        all_sum: 0,
        bonus: '',
        cash_sum: '',
        plastic_sum: '',
        comment: '',
        status: null,
        user_id: null,
        room_id: null,
        table_id: null,
        branch_id: null,
        client_id: null,
      }
      vCreateData$.value.$reset()
      vUpdateData$.value.$reset()
      vCreateExtra$.value.$reset()
      vUpdateExtra$.value.$reset()
    }
    const rowProps = (row, index) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          childs.value.id = row.id
          childs.value.data = data.value[index].order_foods
        },
      }
    }
    const filter = (e) => {
      orderInst.value.filter({
        all_sum: [e],
      })
    }
    const updateRoom = (v) => {
      const val = rooms.value.find((val) => val.id == v).table
      tables.value = []
      create_data.value.table_id = null
      for (let index = 0; index < val.length; index++) {
        const element = val[index]
        tables.value.push({ label: element.name, value: element.id })
      }
    }
    const updateRoom2 = (v) => {
      const val = rooms.value.find((val) => val.id == v).table
      tables.value = []
      update_data.value.table_id = null
      for (let index = 0; index < val.length; index++) {
        const element = val[index]
        tables.value.push({ label: element.name, value: element.id })
      }
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
      rowProps,
      data,
      firstInput,
      firstUpdateInput,
      showCreate,
      showUpdate,
      create_data,
      update_data,
      updateId,
      vCreateData$,
      vCreateExtra$,
      vUpdateData$,
      vUpdateExtra$,
      childs,
      usersSelect,
      roomsSelect,
      foodsSelect,
      clientsSelect,
      tables,
      openCreate,
      leave,
      cancelCallback,
      paginition: {
        pageSize: 6,
      },
      createE,
      updateE,
      statusMainSelect,
      createOrder,
      updateOrder,
      orderRef: orderInst,
      filter,
      updateRoom,
      updateRoom2,
      add,
      addUpdate,
      columnsUpdate: updateColumnsE({
        del(row, index) {
          if (updateE.value.data[index].sum != '') {
            update_data.value.all_sum -= updateE.value.data[index].sum
          }
          updateE.value.data.splice(index, 1)
        },
      }),
      columns: createColumns({
        click(row, index) {
          childs.value.id = row.id
          childs.value.data = data.value[index].order_foods
        },
        del(row, index, e) {
          e.stopPropagation()
          del(row, index)
        },
        update(row, e) {
          e.stopPropagation()
          updateId.value = row.id
          update_data.value.created_date = moment
            .unix(row.created_date)
            .format('YYYY-MM-DD HH:mm:ss')
          update_data.value.last_update = moment
            .unix(row.updated_date)
            .format('YYYY-MM-DD HH:mm:ss')
          update_data.value.updated_date = moment(new Date()).format(
            'YYYY-MM-DD HH:mm:ss',
          )
          row.pay_sum == null
            ? (update_data.value.pay_sum = null)
            : (update_data.value.pay_sum = row.pay_sum.toString())
          row.common_service == null
            ? (update_data.value.common_service = null)
            : (update_data.value.common_service = row.common_service.toString())
          row.common_sum == null
            ? (update_data.value.common_sum = null)
            : (update_data.value.common_sum = row.common_sum.toString())
          row.cash_sum == null
            ? (update_data.value.cash_sum = null)
            : (update_data.value.cash_sum = row.cash_sum.toString())
          row.bonus == null
            ? (update_data.value.bonus = null)
            : (update_data.value.bonus = row.bonus.toString())
          row.plastic_sum == null
            ? (update_data.value.plastic_sum = null)
            : (update_data.value.plastic_sum = row.plastic_sum.toString())
          update_data.value.all_sum = row.all_sum
          update_data.value.comment = row.comment
          update_data.value.status = row.status
          update_data.value.user_id = row.user.id
          update_data.value.room_id = row.room.id
          update_data.value.table_id = row.table.id
          const val = rooms.value.find(
            (val) => val.id == update_data.value.room_id,
          ).table
          tables.value = []
          for (let index = 0; index < val.length; index++) {
            const element = val[index]
            tables.value.push({ label: element.name, value: element.id })
          }
          update_data.value.client_id = row.client.id
          for (let index = 0; index < row.order_foods.length; index++) {
            const element = row.order_foods[index]
            updateE.value.data.push({
              food_id: element.food.id,
              amount: element.amount.toString(),
              body_price: element.food.selling_price.toString(),
              sum: element.sum.toString(),
              status: element.status,
              comment: element.comment,
              measure_id: element.food.measure.id,
              measure: element.food.measure.name,
            })
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
      columns2: createColumnsE({
        del(row, index) {
          console.log(row)
          if (createE.value.data[index].sum != '') {
            create_data.value.all_sum -= createE.value.data[index].sum
          }
          createE.value.data.splice(index, 1)
        },
      }),
      childColumns: createChildcolumns(),
    }
  },
}
</script>
