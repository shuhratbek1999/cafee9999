<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useCurrentTime } from './useCurrentTime'
import { h, ref } from 'vue'
import { NButton, useMessage } from 'naive-ui'

window.addEventListener('keydown', (e) => {
  if (e.key == 'F4') {
    showTables.value = true
  }
  console.log(e)
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
const createColumnsChild = ({ play }) => {
  return [
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
const dataChild = [
  { title: 'Champagne Supernova', length: '7:27' },
  { title: 'Wonderwall', length: '4:18' },
  { title: "Don't Look Back in Anger", length: '4:48' },
  { title: 'Champagne Supernova', length: '7:27' },
]
const store = useStore()
const message = useMessage()
const branches = ref([
  { name: 'Test' },
  { name: 'Test' },
  { name: 'Test' },
  { name: 'Test' },
  { name: 'Test' },
])
const columns = createColumns({
  play(row) {
    message.info(`Play ${row.title}`)
  },
})
const columnsChild = createColumnsChild({
  play(row) {
    message.info(`Play ${row.title}`)
  },
})
const showTables = ref(false)
const router = useRouter()
const { currentTime } = useCurrentTime()
const tables = ref([
  { name: 'Stol' },
  { name: 'Stol' },
  { name: 'Stol' },
  { name: 'Stol' },
  { name: 'Stol' },
  { name: 'Stol' },
  { name: 'Stol' },
  { name: 'Stol' },
  { name: 'Stol' },
  { name: 'Stol' },
])
const rowProps = (row) => {
  return {
    style: 'cursor: pointer',
    ondblclick: () => {
      store.state.sellingTable = row
      router.push({
        name: 'Selling table',
      })
      console.log(row)
    },
    onclick: () => {
      console.log('Test')
    },
  }
}
</script>

<template>
  <div class="main">
    <div class="header">
      <div class="headerLeft">
        <div class="name">UserName</div>
        <span>{{ currentTime.toLocaleTimeString() }}</span>
      </div>
      <div class="headerCenter">
        <h1>BDM oshxonasi</h1>
      </div>
    </div>
    <div class="content">
      <div class="contentLeft">
        <n-button
          v-for="branch in branches"
          :key="branch.id"
          type="success"
          style="width: 130px; height: 50px; margin-top: 10px"
          @click="showTables = true"
          >{{ branch.name }}</n-button
        >
      </div>
      <div class="contentCenter">
        <n-data-table
          :columns="columns"
          :data="data"
          :bordered="false"
          :max-height="350"
          :rowProps="rowProps"
        />
      </div>
      <div class="contentRight">
        <n-data-table
          :columns="columnsChild"
          :data="dataChild"
          :bordered="false"
          :max-height="350"
        />
      </div>
    </div>
    <div class="footer">
      <n-modal
        v-model:show="showTables"
        preset="dialog"
        title="Stollar"
        style="width: 800px"
      >
        <n-grid cols="2 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen">
          <n-grid-item
            v-for="table in tables"
            :key="table.id"
            style="width: 100%"
          >
            <div
              style="
                height: 100px;
                margin-left: 10px;
                margin-top: 10px;
                font-size: 20px;
              "
            >
              <n-button
                type="info"
                style="
                  width: 100%;
                  height: 100px;
                  border-radius: 0px;
                  font-size: 30px;
                "
                >{{ table.name }}</n-button
              >
            </div>
          </n-grid-item>
        </n-grid>
      </n-modal>
      <n-button
        @click="router.go(-1)"
        style="width: 120px; height: 50px; font-size: 20px"
        type="error"
        >Orqaga</n-button
      >
    </div>
  </div>
</template>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.headerLeft {
  width: 10%;
  margin-left: 40px;
}
.headerLeft .name {
  font-weight: bold;
}
.headerCenter {
  width: 80%;
}
.footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  background-color: #fff;
  height: 103px;
  padding-left: 40px;
}
.content {
  display: flex;
  justify-content: space-between;
  height: 480px;
  padding: 20px;
}
.content .contentCenter {
  width: 55%;
  padding: 20px;
}
.content .contentRight {
  width: 30%;
  padding: 20px;
}
.contentLeft {
  width: 10%;
  padding: 20px;
}
</style>
