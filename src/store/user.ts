import { api } from "@/composables/useUtilities";
import { defineStore } from "pinia";


export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
    token: '',
  }),
  actions: {
    setUser(){
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      if(Object.keys(userData).length > 0){
        const {user, token} = userData;
        this.user = user;
        this.token = token;
        api.defaults.headers.common.Authorization = `Bearer ${token}`
      }

    },
    login(credentials: {email: string, password: string}){
      return api.get(process.env.backend_api_url + '/sanctum/csrf-cookie').then(() => {
        return api.post('/login', credentials).then((response) => {
          const {user,token} = response.data;
          this.user = user;
          this.token = token;
          localStorage.setItem('user', JSON.stringify(response.data))
          api.defaults.headers.common.Authorization = `Bearer ${token}`
          //@ts-ignore
          location.href = process.env.private_url
        })
      });
    },
    logout(){
      return api.post('/logout').then(() => {
        localStorage.removeItem('user')
        window.location.reload()
      })
    },
    async change_password(data: {
      old_password: string, password: string, password_confirmation: string
    }){
      try {
        const response = await api.post('/change-password', {...data})

        return response
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
})
