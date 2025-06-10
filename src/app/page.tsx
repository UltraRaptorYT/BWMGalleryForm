"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SurveyQuestionType } from "@/types";
import { SurveyRenderer } from "@/components/SurveyRenderer";
import { useSurveySubmit } from "@/hooks/useSurveySubmit";
import BookFlip from "@/components/BookFlip";

const survey: SurveyQuestionType[] = [
  {
    question: {
      en: "Please leave your name",
      ch: "请留下您的名字",
    },
    qnType: "text",
    placeholder: { en: "A gentle trace of your presence.", ch: "请留下您的名字" },
    key: "name",
    required: true,
  },
  {
    question: {
      en: "What blossomed in your heart after the exhibition?",
      ch: "参展后，心中绽放了什么感触？",
    },
    qnType: "multi-select",
    key: "after",
    selectionOptions: [
      { en: "Warmth", ch: "温暖" },
      { en: "Optimism", ch: "乐观" },
      { en: "Peace", ch: "平静" },
      { en: "Gratitude", ch: "感恩" },
      { en: "Hope", ch: "希望" },
      { en: "Inspired", ch: "激励" },
      { en: "Joy", ch: "喜悦" },
      { en: "Ease", ch: "轻松" },
    ],
    required: true,
  },
  {
    question: {
      en: "Reflections",
      ch: "留言",
    },
    qnType: "text",
    placeholder: { en: "Pen your thoughts to the artist", ch: "placeholder" },
    key: "message",
    required: false,
  },
];

export default function FeedbackFormPage() {
  const [step, setStep] = useState(0);

  const storageKey = "feedbackForm";

  const { responses, updateResponse, handleSubmit, submitting, submitted } =
    useSurveySubmit({
      survey,
      submitUrl: "/api/submit?submitType=feedback",
      storageKey: storageKey,
    });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(responses));
  }, [responses]);

  return (
    <main
      className="relative flex items-center justify-center p-4 bg-gray-100 overflow-hidden"
      style={{ minHeight: "var(--full-height)" }}
    >
      <div className="absolute inset-0 z-0 surveyBG" />
      <BookFlip>
        <div className="w-full">
          {submitted ? (
            <div className="text-center text-xl font-semibold">
              谢谢您的参与！
              <br />
              Your participation is greatly appreciated!
            </div>
          ) : (
            <>
              <SurveyRenderer
                item={survey[step]}
                value={responses[survey[step].key]}
                onChange={(val) => updateResponse(survey[step].key, val)}
                questionNumber={step + 1}
                showBothLangs={true}
              />
              <div className="mt-6 flex justify-between">
                {step > 0 && (
                  <Button variant="secondary" onClick={() => setStep(step - 1)}>
                    Back / 上
                  </Button>
                )}
                {step < survey.length - 1 ? (
                  <Button onClick={() => setStep(step + 1)} className="ml-auto">
                    Next / 下
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit / 提交"}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </BookFlip>
    </main>
  );
}
