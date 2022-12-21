import httpClient from './http.service'

const END_POINT = '/user'

class UserService {
  getAll() {
    return httpClient.get(END_POINT + '/get-all').then((res) => {
      return res.data
    })
  }
}
export default new UserService()
