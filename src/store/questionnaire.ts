import { PaginationOption, api } from "@/composables/useUtilities";
import { defineStore } from "pinia";
import { QuestionResponse, Response } from "./respondent";

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
  auto_check: boolean
  response_questions?: QuestionResponse[]
  group: string | null;
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
  limit: number
  link: string
  questions: Question[]
  responses_count?: number;
  questions_count?: number;
  passing_score: number;
  created_at: string;
  updated_at: string;
}

export const useQuestionnaireStore = defineStore('questionnaire', {
  state: () => ({
    questionnaire: {} as Questionnaire,
    questionnaires: [] as Questionnaire[],
    selectedQuestion: {} as Question,
    respondent: {} as Response,
    response_paginate_options: {} as PaginationOption,
    history: []
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
        const response = await api.put('/questionnaires/' + questionnaire.id, {...questionnaire})
        //@ts-ignore
        this.questionnaire = {...this.questionnaire, ...response.data}
        this.questionnaires = this.questionnaires.map(item => item.id == questionnaire.id ? {...this.questionnaire, ...response.data} : item)
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

        return Promise.reject(error)
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
    async update_questions(questions: [Question]){
      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/update`, {questions})
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
    async remove_questions(questions: Question[]){
      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/remove`, {questions})

        return response
      } catch (error) {
        console.log(error);

      }
    },
    async group(group_name: string, questions: Question[]){
      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/group`, {group: group_name, questions})
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async remove_group(group_name: string){
      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/remove-group`, {group_name})
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

    async get_response(page = 1){
      try{
        const response = await api.get(`/questionnaire/${this.questionnaire.id}/response?page=` + page)
        const {response: data, paginate_options} = response.data
        this.respondent = data
        this.response_paginate_options = paginate_options
        return response;
      }catch(err){
        return Promise.reject(err)
      }
    },

    async delete(questionnaire_id: number){
      try {
        const response = await api.delete("/questionnaires/" + questionnaire_id)
        this.questionnaires = this.questionnaires.filter(item => item.id == questionnaire_id)
        return response;
      } catch (error) {
        return Promise.reject(error)
      }
    }

  }
})
