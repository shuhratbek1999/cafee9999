import httpClient from './http.service'

const END_POINT = '/user'
class AuthService {
  login(data) {
    return httpClient.post(END_POINT + '/login', data).then((response) => {
      if (response.data.token) {
        // console.log(response)
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.setItem('token', JSON.stringify(response.data.token))
      }
      return response.data
    })
  }

  logout() {
    localStorage.removeItem('user')
  }
}

export default new AuthService()
