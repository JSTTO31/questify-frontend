import { Question, Questionnaire } from '@/store/questionnaire'
import { Response } from '@/store/respondent'
import axios from 'axios'
import Result from './classes/QuestionnaireResult'
export const api = axios.create({
  baseURL: process.env.backend_api_url + '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export function showError(validator: any, error_message = ""){
  if(validator.$invalid && validator.$dirty){
      return error_message.length > 0 ? error_message :  validator.$errors[0].$message
  }

  return ""
}

api.interceptors.response.use((response) => {
  return response;
}, error => {
  if(error.response.status == 401){
    localStorage.removeItem('user')
    location.reload()
  }
  return Promise.reject(error)
})

export interface links{
  url: null | string,
  label: string;
  active: boolean
}


export interface PaginationOption{
  "current_page": number,
  "first_page_url": string,
  "from": number,
  "last_page": number,
  "last_page_url": string,
  "links": links[];
  "next_page_url": string
  "path": string,
  "per_page": number,
  "prev_page_url": string,
  "to": number,
  "total": number
}


export const getPdfBytesResults = async (questionnaire: Questionnaire, questions: Question[], respondent: Response, score = 0, numberOfPoints = 0) => {

  const result = new Result(questionnaire, questions, respondent, score, numberOfPoints)

  await result.configure()
  result.process()


  return  await result.save()
}
