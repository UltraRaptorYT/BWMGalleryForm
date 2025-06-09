"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SurveyQuestionType, SurveyValue } from "@/types";

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
  const renderText = (
    text: { en: string; ch: string },
    showBothLangs?: boolean,
    lang: "en" | "ch" = "en"
  ) => (showBothLangs ? `${text.en} / ${text.ch}` : text[lang]);

  if (item.qnType === "multi-select") {
    const current = Array.isArray(value) ? value : [];

    return (
      <div className="space-y-4">
        <Label className="text-xl flex-wrap">
          <span className="mr-2">{`Q${questionNumber}.`}</span>
          <span>
            {renderText(item.question, showBothLangs, lang)}
            {item.required !== false && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </span>
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
                  onChange(newVal);
                }}
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
          <span className="mr-2">{`Q${questionNumber}.`}</span>
          <span>
            {renderText(item.question, showBothLangs, lang)}
            {item.required !== false && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </span>
        </Label>
        <Textarea
          className="text-lg placeholder:text-lg md:text-lg h-36"
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
          <span className="mr-2">{`Q${questionNumber}.`}</span>
          <span>
            {renderText(item.question, showBothLangs, lang)}
            {item.required !== false && (
              <span className="text-red-500 ml-1">*</span>
            )}
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
          <span className="mr-2">{`Q${questionNumber}.`}</span>
          <span>
            {renderText(item.question, showBothLangs, lang)}
            {item.required !== false && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </span>
        </Label>
        <div className="flex gap-6 text-lg justify-center">
          <label className="flex items-center gap-2">
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
          <span className="mr-2">{`Q${questionNumber}.`}</span>
          <span>
            {renderText(item.question, showBothLangs, lang)}
            {item.required !== false && (
              <span className="text-red-500 ml-1">*</span>
            )}
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
