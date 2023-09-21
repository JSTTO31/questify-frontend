import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import { useUserStore } from './store/user'
import 'nprogress/nprogress.css';
const app = createApp({
  ...App,
  mounted(){
    const $user = useUserStore()
    $user.setUser()
  }
})

registerPlugins(app)

app.mount('#app')
