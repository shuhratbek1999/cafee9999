<script setup>
import { useStore } from 'vuex'
import { onMounted, ref, h } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { useCurrentTime } from './useCurrentTime'
import { Printer as PrinterOne } from '@vicons/carbon'
import { PrinterFilled as PrinterTwo } from '@vicons/antd'
import { ArrowBigLeft as LeftMain } from '@vicons/tabler'
import { FavoriteFilled } from '@vicons/material'
import { MobileAdd } from '@vicons/carbon'
import { Search } from '@vicons/tabler'
import { useRouter } from 'vue-router'
import SimpleKeyboard from './SimpleKeyboard.vue'
import NumericKeyboard from './NumericKeyboard.vue'

const Items = ref(null)
const store = useStore()
const message = useMessage()
const showKeyboard = ref(false)
const showCalc = ref(false)
const rowPropsSearch = () => {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      showCalc.value = true
    },
  }
}
onMounted(async () => {
  Items.value = store.getters.sellingTable
})
const createColumns = ({ play }) => {
  return [
    {
      title: 'No',
      key: 'no',
    },
    {
      title: 'Title',
      key: 'title',
    },
    {
      title: 'Length',
      key: 'length',
    },
    {
      title: 'Action',
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => play(row),
          },
          { default: () => 'Play' },
        )
      },
    },
  ]
}
const onChange = (input) => {
  searchText.value = input
}
const onChangeNumeric = (input) => {
  searchAmount.value = input
}
const searchText = ref('')
const searchAmount = ref('')
const leaveCalc = () => {
  searchAmount.value = ''
}
const leaveSearch = () => {
  searchText.value = ''
}
const data = [
  { no: 3, title: 'Wonderwall', length: '4:18' },
  { no: 4, title: "Don't Look Back in Anger", length: '4:48' },
  { no: 12, title: 'Champagne Supernova', length: '7:27' },
  { no: 3, title: 'Wonderwall', length: '4:18' },
  { no: 4, title: "Don't Look Back in Anger", length: '4:48' },
  { no: 12, title: 'Champagne Supernova', length: '7:27' },
  { no: 3, title: 'Wonderwall', length: '4:18' },
  { no: 4, title: "Don't Look Back in Anger", length: '4:48' },
  { no: 12, title: 'Champagne Supernova', length: '7:27' },
]
const columns = createColumns({
  play(row) {
    message.info(`Play ${row}`)
  },
})
const showSearch = ref(false)
const router = useRouter()
const products = ref([
  { id: 1, name: 'P1' },
  { id: 2, name: 'P1' },
  { id: 3, name: 'P1' },
  { id: 4, name: 'P1' },
  { id: 5, name: 'P1' },
  { id: 1, name: 'P1' },
  { id: 2, name: 'P1' },
  { id: 3, name: 'P1' },
  { id: 4, name: 'P1' },
  { id: 5, name: 'P1' },
  { id: 1, name: 'P1' },
  { id: 2, name: 'P1' },
  { id: 3, name: 'P1' },
  { id: 4, name: 'P1' },
  { id: 5, name: 'P1' },
  { id: 1, name: 'P1' },
  { id: 2, name: 'P1' },
  { id: 3, name: 'P1' },
  { id: 4, name: 'P1' },
  { id: 5, name: 'P1' },
])
const { currentTime } = useCurrentTime()
</script>

<template>
  <div class="main">
    <CRow>
      <CCol sm="4" md="4" lg="4" xl="4" xxl="4">
        <div class="headerLeft">
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: row;
              margin-top: 10px;
              margin-left: 10px;
            "
          >
            <p class="title">Ofitsant</p>
            <p class="value">Abubakir</p>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: row;
              margin-left: 10px;
              margin-top: -15px;
            "
          >
            <p class="title">Bo'lim</p>
            <p class="value">Ovshiy</p>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: row;
              margin-left: 10px;
              margin-top: -15px;
            "
          >
            <p class="title stol">Stol</p>
            <div class="table">
              <p style="width: 300px; margin-left: 0px; text-align: left">
                <span
                  style="
                    border: 1px solid #aaa;
                    width: 120%;
                    display: block;
                    text-align: center;
                  "
                  >Stol - 1</span
                >
              </p>
              <n-button
                style="
                  height: 25px;
                  font-weight: bold;
                  margin-left: 20px;
                  width: 60px;
                "
              >
                stollar
              </n-button>
            </div>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: row;
              margin-left: 10px;
              margin-top: -15px;
            "
          >
            <p class="title">Xizmat</p>
            <p class="value">490</p>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: row;
              margin-left: 10px;
              margin-top: -15px;
            "
          >
            <p class="title">Itogiy summa</p>
            <p class="value">490</p>
          </div>
        </div>
      </CCol>
      <CCol sm="8" md="8" lg="8" xl="8" xxl="8">
        <div class="headerRight">
          <div class="top">
            <p style="width: 200px; text-align: center">
              {{ currentTime.toLocaleTimeString() }}
            </p>
            <p>BDM oshxonasi</p>
          </div>
          <div class="bottom">
            <n-button style="width: 80%" type="info">Asosiy</n-button>
          </div>
        </div>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="4" md="4" lg="4" xl="4" xxl="4">
        <div class="contentLeft">
          <n-data-table
            :columns="columns"
            :data="data"
            :bordered="false"
            :max-height="300"
          />
        </div>
      </CCol>
      <CCol sm="8" md="8" lg="8" xl="8" xxl="8">
        <div class="contentRight">
          <n-scrollbar style="max-height: 380px">
            <n-grid cols="4 s:4 m:4">
              <n-grid-item v-for="product in products" :key="product.id">
                <n-button type="info"> {{ product.name }} </n-button>
              </n-grid-item>
            </n-grid>
          </n-scrollbar>
        </div>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12" md="12" lg="12" xl="12" xxl="12">
        <div class="footer">
          <n-button type="info">
            <template #icon>
              <n-icon><printer-one></printer-one></n-icon>
            </template>
          </n-button>
          <div class="control">
            <n-button type="info">+</n-button>
            <n-button type="info">-</n-button>
          </div>
          <n-button type="info">
            <template #icon>
              <n-icon><printer-two></printer-two></n-icon>
            </template>
          </n-button>
          <n-button type="info" @click="router.go(-1)">
            <template #icon>
              <n-icon><left-main></left-main></n-icon>
            </template>
            Bosh
          </n-button>
          <n-button type="info">
            <template #icon>
              <n-icon><favorite-filled></favorite-filled></n-icon>
            </template>
            Ommabop
          </n-button>
          <n-button type="info">
            <template #icon>
              <n-icon><mobile-add></mobile-add></n-icon>
            </template>
            Qo'shimcha
          </n-button>
          <n-button type="info" @click="showSearch = true">
            <template #icon>
              <n-icon><search></search></n-icon>
            </template>
            Qidiruv
          </n-button>
        </div>
      </CCol>
    </CRow>
    <n-modal
      v-model:show="showSearch"
      preset="dialog"
      title="Stollar"
      style="width: 800px"
      :on-after-leave="leaveSearch"
    >
      <n-input
        placeholder="Qidirish"
        v-model:value="searchText"
        @focus="showKeyboard = true"
      />
      <n-data-table
        :columns="columns"
        :data="data"
        :bordered="false"
        :max-height="300"
        :rowProps="rowPropsSearch"
        style="margin-top: 10px"
      />
      <simple-keyboard
        style="margin-top: 20px"
        @onChange="onChange"
        v-show="showKeyboard"
        :input="searchText"
      />
    </n-modal>
    <n-modal
      v-model:show="showCalc"
      preset="dialog"
      style="width: 460px"
      :on-after-leave="leaveCalc"
    >
      <div style="display: flex">
        <div
          class="left"
          style="width: 210px; font-weight: bold; font-size: 18px"
        >
          <p>Product name</p>
          <div style="display: flex; flex-direction: column">
            <span style="display: block">Narxi</span>
            <span style="display: block; text-align: left; padding-left: 20px"
              >X</span
            >
            <span style="display: block">Umumiy narxi</span>
          </div>
          <div
            class="leftFooter"
            style="margin-top: 20px; display: flex; justify-content: flex-start"
          >
            <n-button type="info" @click="showCalc = false">OK</n-button>
            <n-button type="error" style="margin-left: 10px">Cancel</n-button>
          </div>
        </div>
        <div class="right" style="width: 250px">
          <n-input
            placeholder="Kiriting"
            type="number"
            v-model:value="searchAmount"
          />
          <numeric-keyboard
            style="margin-top: 20px"
            @onChange="onChangeNumeric"
            :input="searchAmount"
          />
        </div>
      </div>
    </n-modal>
  </div>
</template>
<style scoped>
.main {
  width: 98%;
  margin-left: auto;
  margin-right: auto;
}
.title {
  text-align: center;
  width: 40%;
  font-weight: bold;
  border: 1px solid #aaa;
}
.value {
  margin-left: 20px;
  width: 40%;
  text-align: center;
  font-weight: bold;
  border: 1px solid #aaa;
}
.table {
  width: 40%;
  margin-left: 20px;
  display: flex;
  height: 20px;
  font-weight: bold;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90px;
  font-size: 30px;
  padding: 0 75px;
  font-weight: 550;
}
.bottom {
  display: flex;
  justify-content: center;
  height: 55px;
  align-items: flex-end;
}
.bottom button {
  height: 40px;
  font-size: 20px;
}
.headerLeft {
  box-shadow: 0px 0px 3px #aaa;
  padding-top: 5px;
  box-sizing: border-box;
  align-items: center;
  margin-top: 10px;
  width: 400px;
  background-color: white;
}
.headerRight {
  box-shadow: 0px 0px 3px #aaa;
  margin-top: 10px;
  height: 165px;
  background-color: white;
}
.contentLeft {
  box-shadow: 0px 0px 3px #aaa;
  width: 400px;
  margin-top: 10px;
  padding: 10px;
  background-color: white;
  height: 380px;
}
.contentRight {
  box-shadow: 0px 0px 3px #aaa;
  height: 380px;
  background-color: white;
  margin-top: 10px;
  padding: 10px;
}
.contentRight div {
  height: 100px;
}
.contentRight div button {
  width: 90%;
  height: 80px;
  margin-left: 10px;
  margin-top: 10px;
  font-size: 25px;
}
.footer {
  box-shadow: 0px 0px 3px #aaa;
  background-color: white;
  margin-top: 10px;
  height: 70px;
}
.footer button {
  width: 150px;
  height: 40px;
}
.footer .control {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 70px;
  padding-bottom: 14px;
}
.footer .control button {
  height: 25px;
  width: 40px;
}
</style>
