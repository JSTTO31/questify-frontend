import { Answer, Question, Questionnaire, useQuestionnaireStore } from "@/store/questionnaire"
import { storeToRefs } from "pinia"


export default () => {
  const $questionnaire = useQuestionnaireStore()
  const types = [
    {
      label: 'Multiple Choice',
      value: 'multiple',
      icon: 'mdi-radiobox-marked',
    },
    {
      label: 'Checkboxes',
      value: 'check',
      icon: 'mdi-checkbox-marked',

    },
    {
      label: 'Selection',
      value: 'select',
      icon: 'mdi-chevron-down',
    },
    {
      label: 'Text',
      value: 'text',
      icon: 'mdi-text',
    },
    {
      label: 'Paragraph',
      value: 'paragraph',
      icon: 'mdi-text-long',
    },
    {
      label: 'Drag and Drop',
      value: 'drag',
      icon: 'mdi-drag',
    },
  ]
  const {questionnaire, selectedQuestion} = storeToRefs(useQuestionnaireStore())
  const getCurrentIcon = (value: string) => types.find(item => item.value == value)?.icon


  const add_question = (type = 'sentence') => {
    const last_question_index = questionnaire.value.questions.slice()[questionnaire.value.questions.length - 1]?.index || 0
    const question = {
      index: last_question_index + 1 ,
      random_id: Math.random() * 1000,
      text: 'Question',
      points: 1,
      answer_keys: [],
      auto_check: false,
      type,
      answers: [],
      group: null
    }
    $questionnaire.$patch({
          //@ts-ignore
          trigger: 'add question',
          data: {
            question,
            questionnaire: questionnaire.value
          },
    })
    //@ts-ignore
    // selectedQuestion.value = questionnaire.value.questions[last_question_index + 1 ]
  }

  const remove_question = (question: Question) => {
    $questionnaire.$patch({
      //@ts-ignore
            trigger: 'remove question',
            data: {
              question: question,
              questionnaire: questionnaire.value
            },
      })
  }

  const remove_questions = (questions: Question[]) => {
    $questionnaire.$patch({
      //@ts-ignore
            trigger: 'remove questions',
            data: {
              questions: questions,
              questionnaire: questionnaire.value
            },
      })
  }

  const update_question = (question: Question) => {
    $questionnaire.$patch({
      //@ts-ignore
          trigger: 'update question',
          data: {
            question: question,
            questionnaire: questionnaire.value
          },
    })
  }

  const update_questions = (questions: Question[]) => {

    $questionnaire.$patch({
      //@ts-ignore
          trigger: 'update questions',
          data: {
            questions,
            questionnaire: questionnaire.value
          },
    })
  }

  const remove_group = (group_name: string) => {
    $questionnaire.$patch({
      //@ts-ignore
          trigger: 'remove group',
          data: {
            group_name,
            questionnaire: questionnaire.value
          },
    })

  }

  const add_answer = (question: Question) => {
    const answer = {
      index: (question.answers[question.answers.length - 1]?.index || 0) + 1,
      random_id: Math.random() * 1000,
      text: 'Answer'
    }
    $questionnaire.$patch({
          //@ts-ignore
          trigger: 'add answer',
          data: {
            question,
            questionnaire: questionnaire.value,
            answer,
          },
    })
  }

  const remove_answer = (question_index: number, answer: Answer) => {
    const question = questionnaire.value.questions.find(item => item.index == question_index)

    if(question){
      $questionnaire.$patch({
        //@ts-ignore
        trigger: 'remove answer',
        data: {
          question,
          answer,
          questionnaire: questionnaire.value,
        },
      })
    }
  }

  const update_answer = (question_index: number, answer: Answer) => {
    const question = questionnaire.value.questions?.find(item => item.index == question_index)

    if(question){
      $questionnaire.$patch({
        //@ts-ignore
        trigger: 'update answer',
        data: {
          question,
          answer,
          questionnaire: questionnaire.value,
        },
      })
    }
  }

  const group_questions = (questions: Question[], group_name: string) => {
    $questionnaire.$patch({
       //@ts-ignore
       trigger: 'group',
       data: {
         questions,
         group_name,
         questionnaire: questionnaire.value,
       },
    })
  }



  return {add_question, remove_question, types, selectedQuestion, getCurrentIcon, update_question, add_answer,remove_answer, update_answer, remove_group, group_questions, remove_questions, update_questions}
}
