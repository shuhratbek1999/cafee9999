import httpClient from './http.service'

const END_POINT = '/report'

class ReportService {
  supplierAct(data) {
    return httpClient.post(END_POINT + '/supplier-act', data).then((res) => {
      return res.data
    })
  }
}
export default new ReportService()
