import { Answer, Question, Questionnaire } from "@/store/questionnaire";
import { QuestionResponse, Response } from "@/store/respondent";
import { rgb, PDFDocument, StandardFonts } from "pdf-lib";

class Result {
  pdfDoc:  any;
  margin:  any;
  font_color:  any;
  current_height:  any;
  page_height:  any;
  page_width:  any;
  space_top:  any;
  current_page:  any;
  form:  any;
  helvetica:  any;
  helvetica_bold:  any;
  questionnaire: Questionnaire
  respondent: Response
  score: number
  numberOfPoints: number
  questions: Question[]

  constructor(questionnaire: Questionnaire, questions: Question[], respondent: Response, score = 0, numberOfPoints = 0){
    this.margin =  65;
    this.font_color = rgb(.3, .3, .3);
    this.current_height = 1056;
    this.page_height = 1056;
    this.page_width = 768;
    this.space_top = 50;
    this.current_page = {} as Object;
    this.form = {} as Object;
    this.helvetica = {} as any;
    this.helvetica_bold = {} as any;
    this.questionnaire = questionnaire
    this.respondent = respondent
    this.score = score
    this.numberOfPoints = numberOfPoints
    this.questions = questions
  }


  async configure(){
    this.pdfDoc = await PDFDocument.create()
    this.helvetica = await this.pdfDoc.embedFont(StandardFonts.Helvetica)
    this.helvetica_bold = await this.pdfDoc.embedFont(StandardFonts.HelveticaBold)
    this.add_new_page()
  }

  add_new_page(){
    this.current_page = this.pdfDoc.addPage()
    this.current_page.setSize(this.page_width, this.page_height)
    this.current_height = this.page_height
  }

  display_question(question: Question, index: number){
    const indent = (!question.group ? 0 : 15)
    const margin = this.margin + indent
    const space_top = 15
    //@ts-ignore
    const line_space = Math.floor((question.group_name ? question.group_name : question.text).length / (85)) - 1
    let position_y = this.current_height -= (13 + space_top)

    if(this.current_height <= 50){
      this.add_new_page()
      position_y = this.current_height -= this.space_top + 13
    }

    //@ts-ignore
    this.current_page.drawText((index + 1) + ". " + (!question.group_name ? question.text : question.group_name), {
      x: margin,
      y: position_y,
      maxWidth: this.page_width - this.margin * 2,
      size: 14,
      font: this.helvetica_bold,
      color: this.font_color
    })

    this.current_height -= line_space > 0 ? ((25 + space_top) * line_space - 1) : 0
    this.current_height -= 10
  }

  display_answer_text(current_response: QuestionResponse, question: Question){
    const currentQuestion = this.questions.find(item => item.id ==current_response.question_id)
    const indent = (currentQuestion && currentQuestion.group ? 15 : 0)
    const margin = this.margin + indent
    const space_top = 15
    //@ts-ignore
    const line_space = Math.floor((question.group_name ? question.group_name : question.text).length / (85)) - 1
    let position_y = this.current_height -= (13 + space_top)
    const form = this.pdfDoc.getForm()
    const textField = form.createTextField("response." + Math.random() * 100)
    textField.setText(current_response.answer_keys[0])

    if(this.current_height <= 50){
      this.add_new_page()
      position_y = this.current_height -= this.space_top + 13
    }

    //@ts-ignore
    textField.addToPage(this.current_page, {
      x: margin,
      y: position_y - 3,
      height: 15,
      width: this.page_width - this.margin * 2,
      font: this.helvetica,
      color: this.font_color
    })

    this.current_height -= line_space > 0 ? ((25 + space_top) * line_space - 1) : 0
    this.current_height -= 10
  }

  display_answer(answer: Answer, current_response: QuestionResponse){
    const currentQuestion = this.questions.find(item => item.id == answer.question_id)
    const indent = currentQuestion && currentQuestion.group ? 25 : 0
    const space_top = 15;
    const margin = this.margin + indent
    let position_y = this.current_height -= 13 + space_top
    const line_space = Math.floor(answer.text.length / 85) - 1
    const name = "checkbox." + answer.id
    const form = this.pdfDoc.getForm()
    const checkbox = form.createCheckBox(name)

    if(this.current_height <= 50){
      this.add_new_page()
      position_y = this.current_height -= this.space_top + 12
    }

    this.current_page.drawText(answer.text, {
      x: margin + 25,
      y: position_y,
      font: this.helvetica,
      size: 13,
      color: this.font_color,
      maxWidth: this.page_width - ((this.margin * 2) - 13)
    })

    checkbox.addToPage(this.current_page, {
      x: margin,
      y: position_y - 3,
      height: 13,
      width: 13,
      font: this.helvetica,
      color: this.font_color
    })

    if(current_response && current_response.answer_keys.some(key => key==answer.text)){
      form.getCheckBox(name).check()
    }

    form.flatten()

    this.current_height -= line_space > 0 ? ((25 + space_top) * line_space - 1) : 0

  }

  display_divider(){
    const position_y = this.current_height -= 15
    this.current_page.drawLine({
      start: { x: this.margin, y: position_y},
      end: { x: this.page_width - this.margin, y: position_y },
      thickness: .5,
      color: rgb(0.5, 0.5, 0.5),
    })
  }


  display_answer_key(key: number, answers: Answer[]){
    const currentQuestion = this.questions.find(item => item.id == answers[0].question_id)
    const indent = currentQuestion && currentQuestion.group ? 25 : 0
    const margin = this.margin + indent
    const space_top = 5
    let line_space = 0
    let position_y = this.current_height -= 13 + space_top

    const answer = answers.find((item) => item.index == key)

    if(answer){
      line_space = Math.floor(answer.text.length / 100) - 1
      if(this.current_height <= 50){
        this.add_new_page()
        position_y = this.current_height -= this.space_top + 13
      }

      //@ts-ignore
      this.current_page.drawText(answer.text, {
        x: margin,
        y: position_y,
        size: 14,
        font: this.helvetica,
        color: this.font_color,
        maxWidth: this.page_width - this.margin * 2
      })
    }

    this.current_height -= line_space > 0 ? ((25 + space_top) * line_space - 1) : 0
    this.current_height -= 10
  }

  display_answers(answers: Answer[], question: Question){
    if(answers){
      const current_response = this.respondent.question_responses.find(item => item.question_id == question.id)

      if((question.type == 'text' || question.type == 'paragraph') && current_response){
        this.display_answer_text(current_response, question)
      }else{
        answers.forEach((answer:Answer) => {
          //@ts-ignore
          this.display_answer(answer, current_response)
        })
      }

      const answer_keys = this.questions.find(item => item.id == question.id)?.answer_keys

      if(answer_keys){
        this.current_page.drawText("Answers:", {
          x: this.margin + (question.group ? 25 : 0),
          y: this.current_height -= 30,
          font: this.helvetica_bold,
          size: 13,
          color: this.font_color
        })


        answer_keys.forEach((key) => {
          this.display_answer_key(parseInt(key), answers)
        })
      }
    }
  }

  process(){
    // Title page
    this.current_page.drawText(this.questionnaire.title, {
      x: this.margin,
      y: this.current_height -= (this.space_top + 35),
      size: 35,
      maxWidth: this.page_width - this.margin * 2,
      //@ts-ignore
      font: this.helvetica_bold,
      lineHeight: 35 - 5,
      color: this.font_color,
    })

    // increase height
    this.current_height += 15

    // Name of the student, and score
    this.current_page.drawText('Name: Unknown Student' + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t Scores: " + this.score + "/" + this.numberOfPoints, {
      x: this.margin,
      y: this.current_height -= (this.space_top + 18),
      maxWidth: this.page_width - this.margin * 2,
      size: 16,
      font: this.helvetica,
      color: this.font_color,
    })

    // decrease height
    this.current_height -= 10


    // Displaying questions
    this.questionnaire.questions.forEach((question: Question, index: number) => {
      this.display_question(question, index)

      //@ts-ignore
      if(question.group_name){
        // @ts-ignore
        question.questions.forEach((question_group: Question, index: number) => {
          this.display_question(question_group, index)
          const answers = question_group.answers
          this.display_answers(answers, question_group)
        })
      }else{
        const answers = question.answers
        this.display_answers(answers, question)
      }

      this.display_divider()

      // decrease height
      this.current_height -= 10
    })

  }

  async save(){
    return await this.pdfDoc.saveAsBase64({dataUri: true})
  }
}




export default Result;
