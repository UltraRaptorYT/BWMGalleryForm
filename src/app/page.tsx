"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SurveyQuestionType } from "@/types";
import { SurveyRenderer } from "@/components/SurveyRenderer";
import { useSurveySubmit } from "@/hooks/useSurveySubmit";

const survey: SurveyQuestionType[] = [
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
      en: "Your message",
      ch: "留言",
    },
    qnType: "text",
    placeholder: { en: "Write your thoughts...", ch: "placeholder" },
    key: "message",
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

      <div className="perspective-near perspective-origin-center">
        <div className="transform-3d">
          <div className="cover"></div>
        </div>
      </div>
      <Card className="relative z-10 w-full max-w-2xl shadow-xl p-6 bg-white/45">
        <CardContent className="px-0 md:px-6">
          {submitted ? (
            <div className="text-center text-xl font-semibold text-green-600">
              🎉 Thank you for your feedback!
              <br />
              🎉 感谢你的反馈！
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
        </CardContent>
      </Card>
    </main>
  );
}
