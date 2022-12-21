<script setup>
import { onMounted, reactive, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
const emit = defineEmits(['click'])
//create data start

const createData = reactive([])
const store = useStore()
const props = defineProps(['data'])
const createForm = () => {
  const obj = {}
  for (let index = 0; index < createData.length; index++) {
    const element = createData[index]
    obj[element.key] = element.value
  }
  emit('click', obj)
}
//create data end

onMounted(() => {
  for (let index = 0; index < props.data.length; index++) {
    const element = props.data[index]
    const obj = {
      value: element.value,
      key: element.key,
      type: element.type,
      label: element.label,
    }
    if ('number' in element) {
      obj['number'] = element.number
    }
    createData.push(obj)
  }
})
</script>

<template>
  <div>
    <n-form>
      <div
        style="display: flex; flex-direction: column; height: 100px"
        v-for="dt in createData"
        :key="dt.id"
      >
        <p style="font-weight: bold">{{ dt.label }}</p>
        <div v-if="dt.type === 'input' && dt.number === true">
          <n-input
            v-model:value="dt.value"
            placeholder="Kiriting"
            ref="firstInput"
            type="number"
          />
        </div>
        <div v-else-if="dt.type === 'input'">
          <n-input
            v-model:value="dt.value"
            placeholder="Kiriting"
            ref="firstInput"
          />
        </div>
        <div v-else-if="dt.type === 'switch'">
          <n-switch
            v-model:value="dt.value"
            checked-value="1"
            unchecked-value="0"
          />
        </div>
        <small v-if="store.getters.modalValidations !== null">
          <span v-if="store.getters.modalValidations[dt.key] !== undefined">
            <n-gradient-text
              type="error"
              v-if="store.getters.modalValidations[dt.key].$error"
            >
              {{ store.getters.modalValidations[dt.key].$errors[0].$message }}
            </n-gradient-text>
          </span>
        </small>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <n-button type="primary" @click="createForm">Submit</n-button>
      </div>
    </n-form>
  </div>
</template>
