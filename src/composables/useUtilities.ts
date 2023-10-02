import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export function showError(validator: any, error_message = ""){
  if(validator.$invalid && validator.$dirty){
      return error_message.length > 0 ? error_message :  validator.$errors[0].$message
  }

  return ""
}

api.interceptors.response.use((response) => {
  return response;
}, error => {
  if(error.response.status == 401){
    localStorage.removeItem('user')
    location.reload()
  }
  return Promise.reject(error)
})
