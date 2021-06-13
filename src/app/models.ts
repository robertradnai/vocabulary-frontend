
export interface PickQuestionsResponse {
    quizList: QuizEntry[]
}

export interface QuizEntry {
    question: MultipleChoiceQuiz,
    flashcard: Flashcard,
}

export interface MultipleChoiceQuiz {
    rowKey: number,
    instructionHeader: string,
    instructionContent: string,
    optionsHeader: string,
    options: string[],
    correctAnswerIndices: number[]
}

export interface Flashcard {
    lang1: string,
    lang2: string,
    remarks: string,
    lang1Header: string,
    lang2Header: string,
    remarksHeader: string
}

export enum QuizDialogState {
    Intro,
    Question,
    Flashcard,
    Summary
}

export interface SharedListsResponse {
    availableWordListId: number
    wordListDisplayName: string
    description: string
    lang1: string
    lang2: string
    isAddedToUserWordLists: boolean
    userWordListId: number
}