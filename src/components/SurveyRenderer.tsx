"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SurveyQuestionType, SurveyValue } from "@/types";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  item: SurveyQuestionType;
  value: SurveyValue;
  lang?: "en" | "ch";
  showBothLangs?: boolean;
  onChange: (val: SurveyValue) => void;
  questionNumber: number;
};

export function SurveyRenderer({
  item,
  value,
  lang = "en",
  onChange,
  showBothLangs,
  questionNumber,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderText = (
    text: { en: string; ch: string },
    showBothLangs?: boolean,
    lang: "en" | "ch" = "en",
    required: boolean = false
  ) => {
    if (showBothLangs) {
      return (
        <div className="flex flex-col w-full">
          <span className="whitespace-nowrap w-full">{text.ch}</span>
          <span className="w-full">
            {text.en}
            {required !== false && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
      );
    }
    return (
      <>
        <span>{text[lang]}</span>
        {required !== false && <span className="text-red-500 ml-1">*</span>}
      </>
    );
  };

  if (item.qnType === "multi-select") {
    if (!mounted) return null;

    const current = Array.isArray(value) ? value : [];

    return (
      <div className="space-y-4">
        <Label className="text-xl flex-wrap">
          {!showBothLangs && (
            <span className="mr-2">{`Q${questionNumber}.`}</span>
          )}
          <span>
            {renderText(item.question, showBothLangs, lang, item.required)}
          </span>
        </Label>

        <div className="grid grid-cols-2 gap-2">
          {(item.selectionOptions || []).map((opt) => (
            <label
              key={`${item.key}-${opt.en}`}
              className="flex items-center gap-3 text-lg leading-6"
            >
              <Checkbox
                checked={current.includes(opt.en)}
                onCheckedChange={() => {
                  const newVal = current.includes(opt.en)
                    ? current.filter((e) => e !== opt.en)
                    : [...current, opt.en];
                  onChange(newVal);
                }}
                className="peer sr-only" // hide checkbox but keep it accessible
              />
              <Heart
                strokeWidth={3}
                className={`w-8 h-8 transition-all duration-200
              ${
                current.includes(opt.en)
                  ? "text-red-500 fill-red-500"
                  : "text-blue-300"
              }`}
              />
              {renderText(opt, showBothLangs, lang)}
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
          {!showBothLangs && (
            <span className="mr-2">{`Q${questionNumber}.`}</span>
          )}
          <span>
            {renderText(item.question, showBothLangs, lang, item.required)}
          </span>
        </Label>
        <Textarea
          className={cn(
            "text-lg placeholder:text-lg md:text-lg h-36 bg-white/75 border-blue-300",
            item.key === "name" &&
              "font-cursive md:text-3xl text-center placeholder:text-3xl text-3xl"
          )}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={item.placeholder?.[lang]}
        />
      </div>
    );
  }

  if (item.qnType === "rating" && item.scale) {
    const { min, max, labelMin, labelMax } = item.scale;
    const current = typeof value === "number" ? value : 0;

    return (
      <div className="space-y-4">
        <Label className="text-xl flex-wrap">
          {!showBothLangs && (
            <span className="mr-2">{`Q${questionNumber}.`}</span>
          )}
          <span>
            {renderText(item.question, showBothLangs, lang, item.required)}
          </span>
        </Label>
        <div className="flex items-center gap-4 justify-center">
          <span className="text-base text-gray-600">{labelMin[lang]}</span>
          <div className="flex gap-4">
            {Array.from({ length: max - min + 1 }, (_, i) => {
              const val = i + min;
              return (
                <label key={val} className="flex flex-col items-center">
                  <input
                    type="radio"
                    name={item.key}
                    value={val}
                    checked={current === val}
                    onChange={() => onChange(val)}
                  />
                  <span className="text-base">{val}</span>
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
    const current = typeof value === "boolean" ? value : null;
    return (
      <div className="space-y-4">
        <Label className="text-xl flex-wrap">
          {!showBothLangs && (
            <span className="mr-2">{`Q${questionNumber}.`}</span>
          )}
          <span>
            {renderText(item.question, showBothLangs, lang, item.required)}
          </span>
        </Label>
        <div className="flex gap-6 text-lg justify-center">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name={item.key}
              value="true"
              checked={current === true}
              onChange={() => onChange(true)}
            />
            {lang === "en" ? "Yes" : "是"}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={item.key}
              value="false"
              checked={current === false}
              onChange={() => onChange(false)}
            />
            {lang === "en" ? "No" : "否"}
          </label>
        </div>
      </div>
    );
  }

  if (item.qnType === "info") {
    return (
      <div className="text-left text-xl p-4">
        <p>{renderText(item.message, showBothLangs, lang)}</p>
      </div>
    );
  }

  if (item.qnType === "radio") {
    const current = typeof value === "string" ? value : "";

    return (
      <div className="space-y-4">
        <Label className="text-xl flex-wrap">
          {!showBothLangs && (
            <span className="mr-2">{`Q${questionNumber}.`}</span>
          )}
          <span>
            {renderText(item.question, showBothLangs, lang, item.required)}
          </span>
        </Label>
        <div className="flex gap-6 text-lg justify-center">
          {item.options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name={item.key}
                value={opt.value}
                checked={current === opt.value}
                onChange={() => onChange(opt.value)}
              />
              {opt.label[lang]}
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
