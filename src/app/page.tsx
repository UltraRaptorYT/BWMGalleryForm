"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { SurveyQuestionType } from "@/types";

// Dynamic Survey Definition
const survey: SurveyQuestionType[] = [
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
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("feedbackForm");
    if (saved) setResponses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("feedbackForm", JSON.stringify(responses));
  }, [responses]);

  const renderStep = () => {
    const item = survey[step];

    if (item.qnType === "multi-select") {
      return (
        <div className="space-y-4">
          <Label className="text-xl flex-wrap">
            <span>{`Q${step + 1}.`}</span>
            <span>{item.question.en}</span>
            <span> / </span>
            <span>
              <b>{item.question.ch}</b>
            </span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {(item.selectionOptions || []).map((opt) => (
              <label
                key={`${item.key}-${opt.en}`}
                className="flex items-center gap-2 text-lg"
              >
                <Checkbox
                  checked={responses[item.key]?.includes(opt.en)}
                  onCheckedChange={() => {
                    const prev = responses[item.key] || [];
                    const newVal = prev.includes(opt.en)
                      ? prev.filter((e: string) => e !== opt.en)
                      : [...prev, opt.en];
                    setResponses((r) => ({ ...r, [item.key]: newVal }));
                  }}
                />
                {opt.en} / {opt.ch}
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (item.qnType === "text") {
      return (
        <div className="space-y-2">
          <Label className="text-xl flex-wrap">
            <span>{`Q${step + 1}.`}</span>
            <span>{item.question.en}</span>
            <span> / </span>
            <span>
              <b>{item.question.ch}</b>
            </span>
          </Label>
          <Textarea
            className="text-lg placeholder:text-lg md:text-lg h-36"
            value={responses[item.key] || ""}
            onChange={(e) =>
              setResponses((r) => ({ ...r, [item.key]: e.target.value }))
            }
            placeholder="Write your thoughts..."
          />
        </div>
      );
    }

    return null;
  };

  const handleSubmit = async () => {
    const incomplete = survey.some((item) => {
      const val = responses[item.key];
      if (item.qnType === "multi-select") return !val || val.length === 0;
      return !val || !val.trim();
    });

    if (incomplete) {
      toast.error("请完整填写所有问题 / Please complete all questions.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/submit?submitType=feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(responses),
    });

    if (res.ok) {
      localStorage.removeItem("feedbackForm");
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
              {renderStep()}
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
