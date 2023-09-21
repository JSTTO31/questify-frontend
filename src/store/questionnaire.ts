import { api } from "@/composables/useUtilities";
import { defineStore } from "pinia";

export interface Answer{
  id?: number;
  index: number;
  text: string;
  created_at?: string;
  updated_at?: string;
}

export interface Question{
  id?: number;
  random_id?: number,
  index?: number,
  questionnaire_id?: number;
  text: string;
  type: any;
  answers: Answer[];
  points: number;
  answer_keys: string[]
  shuffle: boolean
  created_at?: string;
  updated_at?: string;
}

export interface Questionnaire{
  id: number;
  title: string;
  subtitle: string;
  shuffle: boolean,
  accept_responses: boolean
  time_limit: string
  link: string
  questions: Question[]
  created_at: string;
  updated_at: string;
}

export const useQuestionnaireStore = defineStore('questionnaire', {
  state: () => ({
    questionnaire: {} as Questionnaire,
    questionnaires: [] as Questionnaire[],
    selectedQuestion: {} as Question
  }),
  actions: {
    async getAll(){
      try {
        const response = await api.get('/questionnaires')
        this.questionnaires = response.data
        return response
      } catch (error) {
        console.log(error)
      }
    },
    async store(questionnaire: {title: string, subtitle: string}){
      try {
        const response = await api.post('/questionnaires', questionnaire)
        return response
      } catch (error) {
        console.log(error)
      }
    },
    async update(questionnaire: Questionnaire){
      try {
        const response = api.put('/questionnaires/' + questionnaire.id, {...questionnaire})
        localStorage.setItem('questionnaire', JSON.stringify(questionnaire))

        return response;
      } catch (error) {
        console.log(error)
      }
    },
    async get(questionnaire_id: number){
      try {
        const response = await api.get('/questionnaires/' + questionnaire_id)
        this.questionnaire = response.data;
        return response;
      } catch (error) {
        console.log(error)
      }
    },
    async add_question(question: Question){
      try {
        const response = await api.post(`/questionnaire/${this.questionnaire.id}/questions`, {...question})

        return response
      } catch (error) {
        console.log(error);

      }
    },
    async update_question(question: Question){
      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/` + question.index, {...question})
        return response
      } catch (error) {
        console.log(error);

      }
    },
    async remove_question(question_index: number){
      try {
        const response = await api.delete(`/questionnaire/${this.questionnaire.id}/questions/` + question_index)

        return response
      } catch (error) {
        console.log(error);

      }
    },
    async add_answer(question_index: number, answer: Answer){
      try {
        const response = await api.post(`/questionnaire/${this.questionnaire.id}/question/${question_index}`, {...answer})
        return response
      } catch (error) {
        console.log(error);

      }
    },
    async update_answer(question_index: number, answer: Answer){
      try {
        const response = await api.put(`questionnaire/${this.questionnaire.id}/question/${question_index}/answer/` + answer.index, {...answer})
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async remove_answer(question_index: number, answer_index: number){
      try {
        const response = await api.delete(`/questionnaire/${this.questionnaire.id}/question/${question_index}/answer/${answer_index}`)

        return response
      } catch (error) {
        console.log(error);

      }
    },

  }
})
