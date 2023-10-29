import { api } from "@/composables/useUtilities";
import { defineStore } from "pinia";
import { Question, Questionnaire } from "./questionnaire";

export interface QuestionResponse{
  id?: number;
  questionnaire_id: number;
  response_id: number;
  question_id: number;
  answer_keys: string[];
  marked: boolean
  question: Question
  status: string
  created_at?: string;
  updated_at?: string;
}

export interface Response{
  id: number;
  questionnaire_id: number
  ip_address: number
  question_responses: QuestionResponse[]
  reviewed?: boolean
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export const useRespondentStore = defineStore('respondent', {
  state: () => ({
    questionnaire: {} as Questionnaire,
    question: {} as Question,
    response: {} as Response,
    answer_keys: [] as Question[],
    times_up: false
  }),
  getters: {
    hasResponseIdentity: (state) => Object.keys(state.response).length > 0
  },
  actions: {
    async getQuestionnaire(questionnaire_id: number){
      try {
        const response = await api.get('/response/questionnaires/' + questionnaire_id)
        console.log(response.data);

        this.questionnaire = response.data

        this.questionnaire.questions = this.questionnaire.questions.reduce((arr:Question[], question) => {

          if(question.group){
            //@ts-ignore
            const group_exists = arr.find(item => !!item.group_name && item.group_name == question.group)

            if(group_exists){
              //@ts-ignore
              group_exists.questions.push(question)
              return arr
            }

            arr.push({
              //@ts-ignore
              group_name: question.group,
              index: question.index,
              questions: [question],
              marked:false
            })
            return arr
          }

          arr.push(question);
          return arr
        },[])

        sessionStorage.setItem('questionnaire.' + questionnaire_id, JSON.stringify(response.data))
        return response;
      } catch (error) {
        console.log(error)
        return error
      }
    },
    async getAnwerKeys(questionnaire_id: number){
      try {
        const response = await api.get(`/response/questionnaires/${questionnaire_id}/answer-keys`)
        this.answer_keys = response.data
        return response;
      } catch (error) {
        console.log(error)
        return error
      }
    },
    async createResponse(){
      try {
        const response = await api.post('/questionnaire/' + this.questionnaire.id + '/responses')
        this.response = response.data

        // PUSH QUESTIONS
        //@ts-ignore
        this.response.question_responses = this.questionnaire.questions.filter(item => !item.group_name).map(question => ({
          questionnaire_id: this.questionnaire.id,
          response_id: this.response.id,
          question_id: question.id,
          answer_keys: [],
          marked: false
        }))

        // PUSH GROUP QUESTION
        //@ts-ignore
        this.questionnaire.questions.forEach((question) => {
          //@ts-ignore
          if(question.group_name){
            //@ts-ignore
            this.response.question_responses.push(...question.questions.map((item) => ({
              questionnaire_id: this.questionnaire.id,
              response_id: this.response.id,
              question_id: item.id,
              answer_keys: [],
              marked: false
            })))
          }
        })
        sessionStorage.removeItem('response.' + this.questionnaire.id)
        sessionStorage.setItem('response.' + this.questionnaire.id, JSON.stringify(response.data))

        return response;
      } catch (error) {
        return error
      }
    },
    async submitResponse(){
      try {
        const response = await api.post(`responses/${this.response.id}/submit`, {response_questions:
        //@ts-ignore
        this.response.question_responses.filter(item => !item.group_name)})
        this.response.submitted_at = (new Date()).toDateString()
        sessionStorage.setItem('response.' + this.questionnaire.id, JSON.stringify(this.response))

        return response;
      } catch (error) {
        console.log(error);
      }
    },
    async download(){
      try {
        const response = await api.get('/response/result/download')
        return response
      } catch (error) {
        console.log(error)
      }
    }
  }
})
