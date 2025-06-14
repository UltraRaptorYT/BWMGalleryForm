import { useState } from "react";
import { toast } from "sonner";
import { SurveyQuestionType, SurveyValue } from "@/types";

type SubmitHookProps = {
  survey: SurveyQuestionType[];
  submitUrl: string;
  storageKey?: string;
};

export function useSurveySubmit({
  survey,
  submitUrl = "/api/submit",
  storageKey = "surveyForm",
}: SubmitHookProps) {
  const [responses, setResponses] = useState<Record<string, SurveyValue>>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : {};
      }
      return {};
    }
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateResponse = (key: string, val: SurveyValue) => {
    const updated = { ...responses, [key]: val };
    setResponses(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  const handleSubmit = async () => {
    const incomplete = survey.some((item) => {
      if (item.qnType === "info" || item.required === false) return false;
      const val = responses[item.key];
      switch (item.qnType) {
        case "multi-select":
          return !Array.isArray(val) || val.length === 0;
        case "text":
          return typeof val !== "string" || val.trim() === "";
        case "rating":
          return typeof val !== "number";
        case "boolean":
          return typeof val !== "boolean";
        case "radio":
          return typeof val !== "string" || val.trim() === "";
        default:
          return false;
      }
    });

    if (incomplete) {
      toast.error("请完整填写所有问题 / Please complete all questions.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses,
          keys: survey.map((q) => q.key),
        }),
      });

      if (!res.ok) throw new Error();

      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }

      setSubmitted(true);
      toast.success("提交成功 / Submitted successfully!");
    } catch {
      toast.error(
        "提交失败，请稍后重试 / Submission failed. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    responses,
    updateResponse,
    handleSubmit,
    submitting,
    submitted,
  };
}
