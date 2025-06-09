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
      en: "Your Name",
      ch: "您的姓名",
    },
    qnType: "text",
    placeholder: { en: "Name", ch: "姓名" },
    key: "name",
    required: true,
  },
  {
    qnType: "radio",
    key: "gender",
    question: {
      en: "Your Gender",
      ch: "您的性别",
    },
    options: [
      { value: "male", label: { en: "Male", ch: "男" } },
      { value: "female", label: { en: "Female", ch: "女" } },
    ],
  },
  {
    question: {
      en: "Your Occupation",
      ch: "您的职业",
    },
    qnType: "text",
    placeholder: { en: "Occupation", ch: "职业" },
    key: "occupation",
  },
  {
    question: {
      en: "Are you a member of BWM?",
      ch: "请问您是寺院的学院吗？",
    },
    qnType: "boolean",
    key: "student",
  },
  {
    question: {
      en: "What were you feeling when you first saw the artwork?",
      ch: "一开始看到作品时，您有什么感觉？",
    },
    qnType: "multi-select",
    key: "firstTimeEmotionalImpact",
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
  },
  {
    question: {
      en: "Did your feelings change as you spent more time with it?",
      ch: "随著观赏的时间变长，这些感受有改变吗？",
    },
    qnType: "boolean",
    key: "feelingChangeEmotionalImpact",
  },
  {
    question: {
      en: "Did any of the pieces bring up strong emotions or remind you of something personal?",
      ch: "有没有哪件作品让您情绪特别强烈，或让您想起自己生活中的某些经历？",
    },
    qnType: "boolean",
    key: "artEmotionsEmotionalImpact",
  },
  {
    question: {
      en: "Did the art help you notice anything inside yourself you hadn’t realized before?",
      ch: "这些作品有没有让您发现自己内心一些没注意过的想法或感受？",
    },
    qnType: "boolean",
    key: "innerSelfInnerResonance",
  },
  {
    question: {
      en: "If yes, can you share a bit about that?",
      ch: "如果有，您願意簡單分享一下嗎？",
    },
    qnType: "text",
    placeholder: {
      en: "Feel free to share your thoughts...",
      ch: "請簡單分享您的想法或感受…",
    },
    required: false,
    key: "innerSelfTrue",
  },
  {
    question: {
      en: "Why do you think this piece connected (or didn’t connect) with you?",
      ch: "您觉得为什么这件作品会（或不会）让您产生共鸣？",
    },
    qnType: "text",
    placeholder: { en: "Reason", ch: "原因" },
    key: "artPieceInnerResonance",
  },
  {
    question: {
      en: "Did you feel calm, comforted, or gain any new insight while looking at the art?",
      ch: "在观赏过程中，您有感到平静、安慰，或产生什么新的想法吗？",
    },
    qnType: "boolean",
    key: "gainNewInsightSenseOfHealing",
  },
  {
    question: {
      en: "Was there anything that felt especially healing to you?",
      ch: "哪个部分让您特别有疗愈的感觉？",
    },
    qnType: "text",
    placeholder: { en: "Reason", ch: "原因" },
    key: "artPieceSenseOfHealing",
  },
  {
    question: {
      en: "Do you usually look for certain messages or feelings in art?",
      ch: "您平常会从艺术作品中寻找某些讯息或情感吗？",
    },
    qnType: "boolean",
    key: "artAppreciationSenseOfHealing",
  },
  {
    question: {
      en: "Did this experience make you think about your relationships—family, friends, or community?",
      ch: "有没有哪个作品，让您想到与家人、朋友或社区的关系？",
    },
    qnType: "boolean",
    key: "thinkRelationshipsAndLifeReflection",
  },
  {
    question: {
      en: "Did it inspire you to think or live a little differently?",
      ch: "看完之后，是否让您对生活或人际关系有些新的想法或改变？",
    },
    qnType: "boolean",
    key: "changeRelationshipsAndLifeReflection",
  },
  {
    question: {
      en: "Is there anything else you’d like to share from your experience today?",
      ch: "今天的体验里，还有没有什么是您想补充或分享的？",
    },
    qnType: "text",
    placeholder: { en: "Reason", ch: "原因" },
    key: "anyClosingThoughts",
  },
  {
    question: {
      en: "If we offer more events like this in the future, what would you hope to experience?",
      ch: "如果以后再办类似的活动，您会希望有什么样的内容或感受？",
    },
    qnType: "boolean",
    key: "futureEventsClosingThoughts",
  },

  {
    question: {
      en: "On a scale from 1 to 10, how emotionally meaningful was this experience for you?",
      ch: "您认为本次展览在多大程度上符合您对「疗愈人心、给人希望」主题的期待？",
    },
    qnType: "rating",
    key: "optionalRating",
    scale: {
      min: 1,
      max: 10,
      labelMin: { en: "Very Unmeaningful", ch: "完全不符合" },
      labelMax: { en: "Very Meaningful", ch: "完全符合" },
    },
    required: false,
  },
  {
    question: {
      en: "Would you be interested in joining a similar healing art session again?",
      ch: "您会想再参加类似的艺术疗愈活动吗？",
    },
    qnType: "boolean",
    key: "optionalEvent",
    required: false,
  },
];

export default function SurveyFormPage() {
  const [lang, setLang] = useState<"en" | "ch">("ch");
  const [step, setStep] = useState(0);

  const storageKey = "surveyForm";

  const { responses, updateResponse, handleSubmit, submitting, submitted } =
    useSurveySubmit({
      survey,
      submitUrl: "/api/submit?submitType=survey",
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
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          onClick={() => setLang(lang === "en" ? "ch" : "en")}
        >
          {lang === "en" ? "中文" : "EN"}
        </Button>
      </div>

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
                lang={lang}
                onChange={(val) => updateResponse(survey[step].key, val)}
                questionNumber={step + 1}
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
