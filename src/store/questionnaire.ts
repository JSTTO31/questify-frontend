import { PaginationOption, api } from "@/composables/useUtilities";
import { defineStore } from "pinia";
import { QuestionResponse, Response } from "./respondent";

export interface Answer{
  id?: number;
  question_id?: number;
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

export interface History{
  label: string;
  undo: Function,
  redo: Function,
  triggered: boolean
}

export const useQuestionnaireStore = defineStore('questionnaire', {
  state: () => ({
    questionnaire: {} as Questionnaire,
    questionnaires: [] as Questionnaire[],
    selectedQuestion: {} as Question,
    respondent: {} as Response,
    response_paginate_options: {} as PaginationOption,
    history: [] as History[]
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
      console.log(questionnaire);

      try {
        const response = await api.put('/questionnaires/' + questionnaire.id, {...questionnaire})
        //@ts-ignore
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
      this.questionnaire.questions = [...this.questionnaire.questions, question]
      this.selectedQuestion = question

      try {
        const response = await api.post(`/questionnaire/${this.questionnaire.id}/questions`, {...question})
        return response
      } catch (error) {
        console.log(error);

      }
    },
    async add_questions(questions: Question[]){
      this.questionnaire.questions = [...this.questionnaire.questions, ...questions]

      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/add`, {questions})

        return response
      } catch (error) {
        console.log(error);

      }
    },
    async update_question(question: Question){
      this.questionnaire.questions = this.questionnaire.questions.map(item => item.index == question.index ? question : item)

      if(this.selectedQuestion.index == question.index){
        this.selectedQuestion = question
      }

      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/` + question.index, {...question})
        return response
      } catch (error) {
        console.log(error);

      }
    },
    async update_questions(questions: Question[]){
      this.questionnaire.questions = this.questionnaire.questions.map(item => {
        const question = questions.find(innerItem => innerItem.index == item.index)

        if(question){
          return question
        }

        return item;
      })
      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/update`, {questions})
        return response
      } catch (error) {
        console.log(error);

      }
    },
    async remove_question(question_index: number){
      this.questionnaire.questions = this.questionnaire.questions.filter(item => item.index != question_index)

      if(this.selectedQuestion.index == question_index){
        this.selectedQuestion = {} as Question
      }

      try {
        const response = await api.delete(`/questionnaire/${this.questionnaire.id}/questions/` + question_index)
        return response
      } catch (error) {
        console.log(error);

      }
    },
    async remove_questions(questions: Question[]){
      this.questionnaire.questions = this.questionnaire.questions.filter(item => !questions.some(innerItem => innerItem.index == item.index))

      if(questions.some(item => item.index == this.selectedQuestion.index)){
        this.selectedQuestion = {} as Question
      }

      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/remove`, {questions})

        return response
      } catch (error) {
        console.log(error);

      }
    },
    async group(group_name: string, questions: Question[]){
      this.questionnaire.questions = this.questionnaire.questions.map(item => questions.some(innerItem => innerItem.index == item.index) ?  ({...item, group: group_name}) : item)
      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/group`, {group: group_name, questions})
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async remove_group(group_name: string){
      this.questionnaire.questions = this.questionnaire.questions.map(item => ({...item, group: item.group == group_name ? null : item.group}))
      try {
        const response = await api.put(`/questionnaire/${this.questionnaire.id}/questions/remove-group`, {group_name})
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async add_answer(question_index: number, answer: Answer){
      this.questionnaire.questions =  this.questionnaire.questions.map(item => item.index == question_index ? ({...item, answers: [...item.answers, answer]} ): item)
      if(this.selectedQuestion.index == question_index){
        this.selectedQuestion.answers.push(answer)
      }
      try {
        const response = await api.post(`/questionnaire/${this.questionnaire.id}/question/${question_index}`, {...answer})
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async add_answers(question_index: number, answers: Answer[]){
      const question = this.questionnaire.questions.find(item => item.index == question_index)

      if(!question){
        return
      }

      question.answers = [...question.answers, ...answers]

      try {
        const response = await api.post(`/questionnaire/${this.questionnaire.id}/question/${question_index}/add`, {answers})
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async update_answer(question_index: number, answer: Answer){
      this.questionnaire.questions = this.questionnaire.questions.map(item =>
        item.index == question_index ? ({...item, answers: item.answers.map(item => item.index == answer.index ? answer : item)} ): item)

      if(this.selectedQuestion.index == question_index){
        this.selectedQuestion.answers = this.selectedQuestion.answers.map(item => item.index == answer.index ? answer : item)
      }

      try {
        const response = await api.put(`questionnaire/${this.questionnaire.id}/question/${question_index}/answer/` + answer.index, {...answer})
        return response
      } catch (error) {
        console.log(error);
      }
    },
    async remove_answer(question_index: number, answer_index: number){
      this.questionnaire.questions =  this.questionnaire.questions.map(item => item.index == question_index ? ({...item, answers: [...item.answers.filter(answer => answer.index != answer_index)]} ): item)

      if(this.selectedQuestion.index == question_index){
        this.selectedQuestion.answers = this.selectedQuestion.answers.filter(item => item.index != answer_index)
      }

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
        this.questionnaires = this.questionnaires.filter(item => item.id != questionnaire_id)
        return response;
      } catch (error) {
        return Promise.reject(error)
      }
    }

  }
})
