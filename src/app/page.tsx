"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SurveyQuestionType } from "@/types";
import { SurveyRenderer } from "@/components/SurveyRenderer";
import { useSurveySubmit } from "@/hooks/useSurveySubmit";

const survey: SurveyQuestionType[] = [
  {
    qnType: "info",
    key: "intro",
    message: {
      en: `Hi and welcome! Thanks so much for being here. We invited you because we believe art has a
special way of reaching people — stirring emotions, bringing up memories, or even helping us
feel a little lighter inside.
There’s no right or wrong answer today—just your thoughts and feelings. Whatever you share
stays anonymous and helps us better understand how art can touch people’s hearts and support
emotional healing.`,
      ch: `您好，欢迎来到今天的活动！很感谢您抽空来参加。我们相信艺术有一种特殊的力量，能
触动内心、唤起回忆，甚至让人感觉轻松一些。
这里没有标准答案，只需说出您真实的感受就好。所有分享都会保密，我们希望透过这样
的交流，更了解艺术是怎么影响人、疗愈心灵的。`,
    },
  },
  {
    question: {
      en: "What did you feel before the exhibition?",
      ch: "展览前你有什么感受？",
    },
    qnType: "multi-select",
    key: "before",
    selectionOptions: [
      { en: "Excited", ch: "兴奋" },
      { en: "Anxious", ch: "焦虑" },
      { en: "Happy", ch: "开心" },
      { en: "Confused", ch: "困惑" },
      { en: "Hopeful", ch: "充满希望" },
      { en: "Overwhelmed", ch: "不知所措" },
      { en: "Inspired", ch: "受到启发" },
      { en: "Indifferent", ch: "无动于衷" },
      { en: "Grateful", ch: "感激" },
      { en: "Curious", ch: "好奇" },
    ],
  },
  {
    question: {
      en: "How do you feel after the exhibition?",
      ch: "展览后你有什么感受？",
    },
    qnType: "multi-select",
    key: "after",
    selectionOptions: [
      { en: "Excited", ch: "兴奋" },
      { en: "Anxious", ch: "焦虑" },
      { en: "Happy", ch: "开心" },
      { en: "Confused", ch: "困惑" },
      { en: "Hopeful", ch: "充满希望" },
      { en: "Overwhelmed", ch: "不知所措" },
      { en: "Inspired", ch: "受到启发" },
      { en: "Indifferent", ch: "无动于衷" },
      { en: "Grateful", ch: "感激" },
      { en: "Curious", ch: "好奇" },
    ],
  },
  {
    question: {
      en: "Your Message",
      ch: "留言",
    },
    qnType: "text",
    placeholder: { en: "Write your thoughts...", ch: "placeholder" },
    key: "message",
  },
  {
    question: {
      en: "Any feedback?",
      ch: "其他意见",
    },
    qnType: "text",
    placeholder: { en: "Write your thoughts...", ch: "placeholder" },
    key: "feedback",
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
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: "url('/background.jpeg')",
          backgroundRepeat: "repeat",
          backgroundSize: "contain",
        }}
      />
      <Card className="relative z-10 w-full max-w-2xl shadow-xl p-6 bg-white">
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
