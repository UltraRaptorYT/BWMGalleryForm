"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { SurveyQuestionType, SurveyValue } from "@/types";
import { SurveyRenderer } from "@/components/SurveyRenderer";

// Dynamic Survey Definition
const survey: SurveyQuestionType[] = [
  {
    qnType: "info",
    key: "intro",
    message: {
      en: "Welcome to our exhibition feedback form! Please answer a few questions to help us improve.",
      ch: "欢迎填写展览反馈表！请回答以下问题，帮助我们改进。",
    },
  },
  {
    question: {
      en: "Your Message",
      ch: "您如何描述本次「光影」摄影展的整体体验？",
    },
    qnType: "text",
    placeholder: { en: "Write your thoughts...", ch: "placeholder" },
    key: "describeExperience",
  },
  {
    question: {
      en: "How do you feel after the exhibition?",
      ch: "您认为本次展览在多大程度上符合您对「疗愈人心、给人希望」主题的期待？",
    },
    qnType: "rating",
    key: "rating",
    scale: {
      min: 1,
      max: 5,
      labelMin: { en: "完全不符合", ch: "完全不符合" },
      labelMax: { en: "完全符合", ch: "完全符合" },
    },
  },
  {
    question: {
      en: "Your Message",
      ch: "留言",
    },
    qnType: "text",
    key: "message",
    placeholder: { en: "Write your thoughts...", ch: "placeholder" },
  },
  {
    question: {
      en: "Any feedback?",
      ch: "其他意见",
    },
    qnType: "text",
    key: "feedback",
    placeholder: { en: "Write your thoughts...", ch: "placeholder" },
  },
  {
    question: {
      en: "Would you recommend this exhibition to others?",
      ch: "你会把这个展览推荐给别人吗？",
    },
    qnType: "boolean",
    key: "recommend",
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
];

export default function SurveyFormPage() {
  const [lang, setLang] = useState<"en" | "ch">("ch");
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, SurveyValue>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("surveyForm");
    if (saved) setResponses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("surveyForm", JSON.stringify(responses));
  }, [responses]);

  const handleSubmit = async () => {
    const incomplete = survey.some((item) => {
      if (item.qnType === "info") return false;
      const val = responses[item.key];
      if (item.qnType === "multi-select") {
        return !Array.isArray(val) || val.length === 0;
      }
      if (item.qnType === "text") {
        return typeof val !== "string" || val.trim() === "";
      }
      if (item.qnType === "rating") {
        return typeof val !== "number";
      }
      if (item.qnType === "boolean") {
        return typeof val !== "boolean";
      }
      return true;
    });

    if (incomplete) {
      toast.error("请完整填写所有问题 / Please complete all questions.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/submit?submitType=survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(responses),
    });

    if (res.ok) {
      localStorage.removeItem("surveyForm");
      setSubmitted(true);
      toast.success("提交成功 / Submitted successfully!");
    } else {
      toast.error(
        "提交失败，请稍后重试 / Submission failed. Please try again later."
      );
    }

    setSubmitting(false);
  };

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
                onChange={(val) =>
                  setResponses((r) => ({ ...r, [survey[step].key]: val }))
                }
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
