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
        this.questionnaire = response.data
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

        if(this.response.submitted_at){
          sessionStorage.setItem('response.' + this.questionnaire.id, JSON.stringify(response.data))
          window.location.reload()
          return response;
        }


        //@ts-ignore
        this.response.question_responses = this.questionnaire.questions.map(question => {
          return {
            questionnaire_id: this.questionnaire.id,
            response_id: this.response.id,
            question_id: question.id,
            answer_keys: question.answer_keys,
            marked: false
          }
        })

        sessionStorage.setItem('response.' + this.questionnaire.id, JSON.stringify(response.data))
        window.location.reload()
        return response;
      } catch (error) {
        console.log(error)
        return error
      }
    },
    async submitResponse(){
      try {
        const response = await api.post(`responses/${this.response.id}/submit`, {response_questions: this.response.question_responses})
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
