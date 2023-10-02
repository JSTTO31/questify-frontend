import { Answer } from "@/store/questionnaire"
import { useRespondentStore } from "@/store/respondent"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"



export default () => {
  const router = useRouter()
  const showSubmit = ref(false)
  const loading = ref(false)
  const $respondent = useRespondentStore()
  const {questionnaire, question, response, hasResponseIdentity}  = storeToRefs(useRespondentStore())
  const first_question = questionnaire.value.questions[0]
  const last_question = questionnaire.value.questions[questionnaire.value.questions.length - 1]
  //@ts-ignore
  const currentResponseQuestion = computed(() => response.value.question_responses.find(item => item.question_id == question.value.id))


  const links = computed(() => {
      const findIndex = questionnaire.value.questions.findIndex(item => item.id == question.value.id)
      const nextQuestion = questionnaire.value.questions[findIndex + 1]
      const previousQuestion = questionnaire.value.questions[findIndex - 1]

      return {
        previousQuestion,
        nextQuestion,
      }})

  const clock = ref(new Date())

  const timer = computed(() => {
    if(!hasResponseIdentity.value){
      return 0
    }
    const time_limit = new Date()
    time_limit.setHours(0);
    time_limit.setMinutes(0);
    time_limit.setSeconds(0);
    time_limit.setMilliseconds(0);
    time_limit.setSeconds(parseInt(questionnaire.value.time_limit))
    //@ts-ignore
    const diffTime  = clock.value - new Date(response.value.created_at)
    const currentTime = new Date()
    currentTime.setHours(0);
    currentTime.setMinutes(0);
    currentTime.setSeconds(0);
    currentTime.setMilliseconds(0);
    currentTime.setMilliseconds(diffTime)
    //@ts-ignore
    const currentDiffInLimit = time_limit - currentTime
    const result = new Date()
    result.setHours(0);
    result.setMinutes(0);
    result.setSeconds(0);
    result.setMilliseconds(0);
    result.setMilliseconds(currentDiffInLimit)


    if(currentDiffInLimit < 1){
      return -1
    }

    return `${result.getHours()}:${result.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2})}:${result.getSeconds()}`
  })

  const currentIndex = computed(() => questionnaire.value.questions.findIndex( item => item.id == question.value.id))

  const selectAnswer = (question_id: number, answer: string) => {
    const question = response.value.question_responses.find(item=> question_id == item.question_id)
    //@ts-ignore
    if(question){
      question.answer_keys.push(answer);
    }
  }

  const clearAnswer = (question_id: number) => {
    const question = response.value.question_responses.find(item=> question_id == item.question_id)
    //@ts-ignore
    if(question){
      question.answer_keys = []
    }
  }

  const submit = () => {
    loading.value = true
    $respondent.submitResponse().then(() => {
      router.push({name: 'response.success', params: {questionnaire_id: questionnaire.value.id}})
      loading.value = false
      showSubmit.value = false
    })

  }

  const review = () => {
    //@ts-ignore
    response.value.reviewed = true
    router.push({name: 'response.review', params: {questionnaire_id: questionnaire.value.id}})
  }

  const currentAnswer : any = computed(() => response.value.question_responses.find(item => item.question_id == question.value.id)?.answer_keys)

  const isSelected = computed(() => (answer: Answer) => currentAnswer.value.length > 0 && currentAnswer.value.some((item: any) => item == answer.text) ? true : false)


  return {links, first_question, last_question, timer, clock, currentIndex, selectAnswer, currentAnswer, currentResponseQuestion, submit, review, loading, clearAnswer, isSelected, showSubmit}
}
