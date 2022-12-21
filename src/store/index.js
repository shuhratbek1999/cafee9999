import { createStore } from 'vuex'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    error_message: '',
    sellingTable: {},
    modalValidations: {},
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    setNull(state) {
      for (const key in state.modalValidations) {
        delete state.modalValidations[key]
      }
    },
  },
  getters: {
    error_message(state) {
      return state.error_message
    },
    sellingTable(state) {
      return state.sellingTable
    },
    modalValidations(state) {
      return state.modalValidations
    },
  },
  actions: {
    setNull(context) {
      context.commit('setNull')
    },
  },
  modules: {},
})
