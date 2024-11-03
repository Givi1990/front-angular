export interface Option {
    id: number;                // Уникальный идентификатор варианта ответа
    option: string;            // Текст варианта ответа
    selected?: boolean;        // Опциональное свойство для отслеживания состояния выбора
}

export interface Question {
    id: number;                // Уникальный идентификатор
    questionText: string;      // Текст вопроса
    questionType: 'singleLine' | 'multiLine' | 'positiveInteger' | 'radio' | 'checkbox'; // Тип вопроса
    options?: Option[];        // Варианты ответа для радио-кнопок и чекбоксов
    selectedOption?: string | number[] | null; // Обновленный тип для выбранных вариантов
    surveyId?: number;         // Связь с опросом
    correctAnswer?: string;    // Поле для правильного ответа (если это викторина)
}

export interface Survey {
    id?: number;                // ID опроса (опционально при создании)
    title: string;             // Заголовок опроса
    description: string;       // Описание опроса
    theme: string;             // Тематика опроса
    imageUrl?: string;         // URL изображения (если есть)
    tags: string[];            // Массив тегов для опроса
    questions: Question[];     // Массив вопросов, входящих в опрос
    userId?: number;           // Добавлено для связи с пользователем
}

export interface Response {
    questionId: number;        // ID вопроса, на который дан ответ
    answerText: string | null; // Ответ на вопрос (строка или null, если ответ не задан)
    userId: number;            // ID пользователя, давшего ответ
    surveyId: number
}

export interface User {
    id: number;
    username: string;          // Имя пользователя
    email: string;             // Электронная почта пользователя
    password: string;          // Пароль пользователя
    isAdmin: boolean;          // Признак администратора
    isBlocked: boolean;        // Признак блокировки пользователя
    registrationDate: Date;    // Дата регистрации пользователя
    salesforce: boolean;
}

export interface LoginResponse {
    token: string;             // Токен авторизации
}

export interface ErrorResponse {
    message: string;           // Сообщение об ошибке
}


