export type SurveyQuestionType =
  | {
      qnType: "text";
      key: string;
      question: { en: string; ch: string };
      placeholder: { en: string; ch: string };
    }
  | {
      qnType: "multi-select";
      key: string;
      question: { en: string; ch: string };
      selectionOptions: { en: string; ch: string }[];
    }
  | {
      qnType: "rating";
      key: string;
      question: { en: string; ch: string };
      scale: {
        min: number;
        max: number;
        labelMin: { en: string; ch: string };
        labelMax: { en: string; ch: string };
      };
    }
  | {
      qnType: "boolean";
      key: string;
      question: { en: string; ch: string };
    };

export type SurveyValue = string | number | string[] | boolean;
