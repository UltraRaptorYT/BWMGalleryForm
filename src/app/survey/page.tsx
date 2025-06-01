"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { SurveyQuestionType, SurveyValue } from "@/types";
import { SurveyRenderer } from "@/components/SurveyRenderer";

// Dynamic Survey Definition
const survey: SurveyQuestionType[] = [
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

  const renderStep = () => {
    const item = survey[step];

    if (item.qnType === "multi-select") {
      const current = Array.isArray(responses[item.key])
        ? (responses[item.key] as string[])
        : [];

      return (
        <div className="space-y-4">
          <Label className="text-xl flex-wrap">
            <span>{`Q${step + 1}.`}</span>
            <span>{item.question[lang]}</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {(item.selectionOptions || []).map((opt) => (
              <label
                key={`${item.key}-${opt.en}`}
                className="flex items-center gap-2 text-lg"
              >
                <Checkbox
                  checked={current.includes(opt.en)}
                  onCheckedChange={() => {
                    const newVal = current.includes(opt.en)
                      ? current.filter((e) => e !== opt.en)
                      : [...current, opt.en];
                    setResponses((r) => ({ ...r, [item.key]: newVal }));
                  }}
                />
                {opt[lang]}
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (item.qnType === "text") {
      const value =
        typeof responses[item.key] === "string"
          ? (responses[item.key] as string)
          : "";

      return (
        <div className="space-y-2">
          <Label className="text-xl flex-wrap">
            <span>{`Q${step + 1}.`}</span>
            <span>{item.question[lang]}</span>
          </Label>
          <Textarea
            className="text-lg placeholder:text-lg md:text-lg h-36"
            value={value}
            onChange={(e) =>
              setResponses((r) => ({ ...r, [item.key]: e.target.value }))
            }
            placeholder={item.placeholder[lang]}
          />
        </div>
      );
    }

    if (item.qnType === "rating") {
      const { min, max, labelMin, labelMax } = item.scale;
      const current =
        typeof responses[item.key] === "number"
          ? (responses[item.key] as number)
          : 0;

      return (
        <div className="space-y-4">
          <Label className="text-xl flex-wrap">
            <span>{`Q${step + 1}.`}</span>
            <span>{item.question[lang]}</span>
          </Label>
          <div className="flex items-center gap-4">
            <span className="text-base text-gray-600">{labelMin[lang]}</span>
            <div className="flex gap-4">
              {Array.from({ length: max - min + 1 }, (_, i) => {
                const value = i + min;
                return (
                  <label
                    key={value}
                    className="flex flex-col items-center text-lg"
                  >
                    <input
                      type="radio"
                      name={item.key}
                      value={value}
                      checked={current === value}
                      onChange={() =>
                        setResponses((r) => ({ ...r, [item.key]: value }))
                      }
                    />
                    <span className="text-sm">{value}</span>
                  </label>
                );
              })}
            </div>
            <span className="text-base text-gray-600">{labelMax[lang]}</span>
          </div>
        </div>
      );
    }

    if (item.qnType === "boolean") {
      const current =
        typeof responses[item.key] === "boolean" ? responses[item.key] : null;

      return (
        <div className="space-y-4">
          <Label className="text-xl flex-wrap">
            <span>{`Q${step + 1}.`}</span>
            <span>{item.question[lang]}</span>
          </Label>
          <div className="flex gap-6 text-lg">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={item.key}
                value="true"
                checked={current === true}
                onChange={() =>
                  setResponses((r) => ({ ...r, [item.key]: true }))
                }
              />
              {lang === "en" ? "Yes" : "是"}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={item.key}
                value="false"
                checked={current === false}
                onChange={() =>
                  setResponses((r) => ({ ...r, [item.key]: false }))
                }
              />
              {lang === "en" ? "No" : "否"}
            </label>
          </div>
        </div>
      );
    }

    return null;
  };

  const handleSubmit = async () => {
    const incomplete = survey.some((item) => {
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

      <Card className="relative z-10 w-full max-w-xl shadow-xl p-6 bg-white">
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
