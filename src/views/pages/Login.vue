<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <!-- {{ user }} -->
      <CRow class="justify-content-center">
        <CCol :md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent>
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autocomplete="username"
                      v-model="user.username"
                    />
                  </CInputGroup>
                  <n-gradient-text type="error" v-if="v$.username.$error">
                    {{ v$.username.$errors[0].$message }}
                  </n-gradient-text>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="user.password"
                    />
                  </CInputGroup>
                  <n-gradient-text type="error" v-if="v$.password.$error">
                    {{ v$.password.$errors[0].$message }}
                  </n-gradient-text>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" @click="Login">
                        Login
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { reactive, computed } from 'vue'
import { required } from '@vuelidate/validators'
import AuthService from '../../services/auth.service'
export default {
  name: 'Login',
  setup() {
    const user = reactive({
      username: '',
      password: '',
    })
    const rules = computed(() => {
      return {
        username: { required },
        password: { required },
      }
    })
    const v$ = useVuelidate(rules, user)
    return {
      user,
      v$,
    }
  },
  methods: {
    Login() {
      this.v$.$validate()
      if (!this.v$.$error) {
        AuthService.login(this.user).then((res) => {
          if (res.status == false) {
            console.log('uxladi')
          } else {
            this.$router.push('/dashboard')
          }
        })
      }
    },
  },
}
</script>
