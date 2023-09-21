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
      return api.get('http://localhost:8000' + '/sanctum/csrf-cookie').then(() => {
        return api.post('/login', credentials).then((response) => {
          const {user,token} = response.data;
          this.user = user;
          this.token = token;
          localStorage.setItem('user', JSON.stringify(response.data))
          api.defaults.headers.common.Authorization = `Bearer ${token}`
          location.href = 'http://localhost:3000/'
        })
      });
    }
  }
})