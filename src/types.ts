export type SurveyQuestionType =
  | {
      qnType: "text";
      key: string;
      question: { en: string; ch: string };
      placeholder: { en: string; ch: string };
      required?: boolean;
    }
  | {
      qnType: "multi-select";
      key: string;
      question: { en: string; ch: string };
      selectionOptions: { en: string; ch: string }[];
      required?: boolean;
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
      required?: boolean;
    }
  | {
      qnType: "boolean";
      key: string;
      question: { en: string; ch: string };
      required?: boolean;
    }
  | {
      qnType: "info";
      key: string;
      message: { en: string; ch: string };
    }
  | {
      qnType: "radio";
      key: string;
      question: { en: string; ch: string };
      options: { value: string; label: { en: string; ch: string } }[];
      required?: boolean;
    };

export type SurveyValue = string | number | string[] | boolean;
