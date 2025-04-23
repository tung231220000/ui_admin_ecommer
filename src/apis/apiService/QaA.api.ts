import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';
import { QaA } from '@/@types/QaA';

export type CreateQaAPayload = {
  questionAndAnswerInput: {
    question: string;
    answer: string;
  };
};

type CreateQaAResponse = {
  data: {
    createQuestionAndAnswer: QaA;
  };
} & RESTErrorResponse;

type GetQaAsResponse = {
  data: {
    questionsAndAnswers: QaA[];
  };
} & RESTErrorResponse;

export type UpdateQaAPayload = {
  questionAndAnswerInput: {
    _id: string;
    question: string;
    answer: string;
  };
};

type UpdateQaAResponse = {
  data: {
    updateQuestionAndAnswer: QaA;
  };
} & RESTErrorResponse;

export type DeleteQaAPayload = {
  questionAndAnswerInput: {
    _id: string;
  };
};

type DeleteQaAResponse = {
  data: {
    deleteQuestionAndAnswer: QaA;
  };
} & RESTErrorResponse;

export type DeleteManyQaAsPayload = {
  questionAndAnswerInput: {
    _ids: string[];
  };
};

type DeleteManyQaAsResponse = {
  data: {
    deleteManyQuestionsAndAnswers: string;
  };
} & RESTErrorResponse;

const ApiQaARepository = {
  async createQaA(variables: CreateQaAPayload): Promise<CreateQaAResponse> {
    const { data } = await apiBackend.post<CreateQaAResponse>('/create-QaA', {
      variables,
    });

    return data;
  },
  async fetchQaAs(): Promise<GetQaAsResponse> {
    const { data } = await apiBackend.get<GetQaAsResponse>('/QaAs', {});

    return data;
  },
  async updateQaA(variables: UpdateQaAPayload): Promise<UpdateQaAResponse> {
    const { data } = await apiBackend.post<UpdateQaAResponse>('/update-QaA', {
      variables,
    });

    return data;
  },
  async deleteQaA(variables: DeleteQaAPayload): Promise<DeleteQaAResponse> {
    const { data } = await apiBackend.post<DeleteQaAResponse>('/detele-QaA', {
      variables,
    });

    return data;
  },
  async deleteManyQaAs(variables: DeleteManyQaAsPayload): Promise<DeleteManyQaAsResponse> {
    const { data } = await apiBackend.post<DeleteManyQaAsResponse>('/detele-QaAs', {
      variables,
    });

    return data;
  },
};

export default ApiQaARepository;
