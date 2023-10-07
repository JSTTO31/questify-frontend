import {reactive, ref} from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { Questionnaire } from '@/store/questionnaire'

export default (questionnaire: Questionnaire) => {
  const create = reactive({
    title: questionnaire.title,
    subtitle: questionnaire.subtitle
  })
  const isLoading = ref(false)

  const rules = {
    title: {required}
  }

  const $v = useVuelidate(rules, create)



  return {create, $v, isLoading}
}
