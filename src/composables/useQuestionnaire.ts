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
    const question = {
      index: (questionnaire.value.questions[questionnaire.value.questions.length - 1]?.index || 0) + 1 ,
      random_id: Math.random() * 1000,
      text: 'Question',
      points: 1,
      answer_keys: [],
      auto_check: false,
      type,
      answers: [],
      group: null
    }

    questionnaire.value.questions.push(question)

    $questionnaire.$patch({
          //@ts-ignore
          trigger: 'add question',
          data: {
            question: questionnaire.value.questions[questionnaire.value.questions.length - 1],
            questionnaire: questionnaire.value
          },
    })
    //@ts-ignore
    const index = questionnaire.value.questions.length - 1
    selectedQuestion.value = questionnaire.value.questions[index]
  }

  const remove_question = (question: Question) => {
    questionnaire.value.questions = questionnaire.value.questions.filter(item => item.index != question.index)
    $questionnaire.$patch({
      //@ts-ignore
            trigger: 'remove question',
            data: {
              question: question,
              questionnaire: questionnaire.value
            },
      })

      if(selectedQuestion.value.index == question.index){
        selectedQuestion.value = {} as Question
      }

  }

  const remove_questions = (questions: Question[]) => {
    questionnaire.value.questions = questionnaire.value.questions.filter(item => !questions.some(innerItem => innerItem.index == item.index))
    $questionnaire.$patch({
      //@ts-ignore
            trigger: 'remove questions',
            data: {
              questions: questions,
              questionnaire: questionnaire.value
            },
      })

    if(questions.some(item => item.index == selectedQuestion.value.index)){
      selectedQuestion.value = {} as Question
    }

  }

  const update_question = (question_index: number, data: Question) => {

    const question = questionnaire.value.questions.find(item => item.index == question_index)
    if(question){
      question.text = data.text
      question.type = data.type
      question.answer_keys = data.answer_keys
      question.auto_check = data.auto_check
      question.points = data.points
      question.group = data.group
      $questionnaire.$patch({
        //@ts-ignore
            trigger: 'update question',
            data: {
              question: question,
              questionnaire: questionnaire.value
            },
      })
    }
  }

  const update_questions = (questions: Question[]) => {
    questionnaire.value.questions = questionnaire.value.questions.map(item => {
      const question = questions.find(innerItem => innerItem.index == item.index)

      if(question){
        return question
      }

      return item;
    })

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
    questionnaire.value.questions = questionnaire.value.questions.map(item => ({...item, group: item.group == group_name ? null : item.group}))

    $questionnaire.$patch({
      //@ts-ignore
          trigger: 'remove group',
          data: {
            group_name,
            questionnaire: questionnaire.value
          },
    })

  }

  const add_answer = (external: Question) => {
    const question = questionnaire.value.questions.find(item => item.index == external.index)
    if(question){
      const answer = {
        index: (question.answers[question.answers.length - 1]?.index ||  0) + 1,
        random_id: Math.random() * 1000,
        text: 'Answer'
      }

      question.answers.push(answer)

      $questionnaire.$patch({
            //@ts-ignore
            trigger: 'add answer',
            data: {
              question,
              questionnaire: questionnaire.value,
              answer: question.answers[question.answers.length - 1]
            },
      })
    }
  }

  const remove_answer = (question_index: number, answer: Answer) => {
    const question = questionnaire.value.questions.find(item => item.index == question_index)

    if(question){
      question.answers = question.answers.filter(item => item.index != answer.index)
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
    const answer_local = question?.answers.find(item => item.index == answer.index)

    if(answer_local){
      answer_local.text = answer.text
      $questionnaire.$patch({
        //@ts-ignore
        trigger: 'update answer',
        data: {
          question,
          answer: answer_local,
          questionnaire: questionnaire.value,
        },
      })
    }
  }

  const group_questions = (questions: Question[], group_name: string) => {
    questionnaire.value.questions = questionnaire.value.questions.map(item => questions.some(innerItem => innerItem.index == item.index) ?  ({...item, group: group_name}) : item)

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
