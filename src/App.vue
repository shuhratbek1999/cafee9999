<template>
  <CToaster placement="top-end">
    <CToast v-for="toast in toasts" :key="toast.id">
      <CToastHeader closeButton>
        <span class="me-auto fw-bold">{{ toast.title }}</span>
      </CToastHeader>
      <CToastBody>
        {{ toast.content }}
      </CToastBody>
    </CToast>
  </CToaster>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <router-view />
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-loading-bar-provider>
</template>
<script>
import { useStore } from 'vuex'
import { watch, ref, onMounted } from 'vue'
import $ from 'jquery'
export default {
  setup() {
    const store = useStore()
    let toasts = ref([])
    onMounted(async () => {
      //umumiy enter bosilsa keyingi maydonga otish
      $('body').on('keydown', 'input', function (e) {
        let self = $(this),
          form = self.parents('form:eq(0)'),
          focusable = form.find('input,.n-base-selection-label,button')
        if (e.keyCode == 13) {
          let focused = focusable.eq(focusable.index(this) + 1)
          const classes = focused.attr('class').split(' ')
          if (classes[1] == 'n-button--error-type') {
            focused = focusable.eq(focusable.index(this) + 2)
            focused.focus()
          } else {
            focused.focus()
          }
        }
      })
      //Arrow buttonlar bosilganda keyingi va oldingi inputga o'tishi
      $('body').on(
        'keydown',
        'input,textarea,.n-base-selection-label,button',
        function (e) {
          let self = $(this),
            modal = self.parents('form:eq(0)'),
            focusable = modal.find(
              'input,.n-base-selection-label,textarea,button',
            )
          if (e.keyCode == 40) {
            let focused = focusable.eq(focusable.index(this) + 1)
            focused.focus()
          }
          if (e.keyCode == 38) {
            const focused = focusable.eq(focusable.index(this) - 1)
            focused.focus()
          }
        },
      )
    })
    watch(
      () => store.getters.error_message,
      function (value) {
        if (value != '') {
          toasts.value.push({
            title: 'Xatolik',
            content: value,
          })
          setTimeout(() => {
            store.state.error_message = ''
          }, 5000)
        }
      },
    )
    return {
      toasts,
    }
  },
}
</script>
<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
</style>
<style>
body {
  background-color: #eee;
}
.n-data-table-td {
  padding: 0 10px !important;
}
</style>
