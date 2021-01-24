export interface ChoiceQuiz {
    question: Question,
    flashcard: Flashcard,
    directives: QuizDirectives
}

export interface Question {
    options: string,
    rowKey: number,
    text: string
}

export interface Flashcard {
    lang1: string,
    lang2: string,
    remarks: string
}

export interface WordListAsChoice {
    wordCollectionDisplayName: string
    wordListDisplayName: string
    wordCollection: string
    wordList: string
}

export interface PickQuestionsResponse {
    quizList: ChoiceQuiz[]
}

export interface QuizDirectives {
    showFlashcard: boolean
    lang1_name: string
    lang2_name: string
}

export enum QuizDialogState {
    Intro,
    Question,
    Flashcard,
    Summary
}
