import {reactive, ref} from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

export default () => {
  const create = reactive({
    title: '',
    subtitle: ''
  })
  const isLoading = ref(false)

  const rules = {
    title: {required}
  }

  const $v = useVuelidate(rules, create)



  return {create, $v, isLoading}
}
