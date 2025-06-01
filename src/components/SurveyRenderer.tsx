"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SurveyQuestionType, SurveyValue } from "@/types";

type Props = {
  item: SurveyQuestionType;
  value: SurveyValue;
  lang?: "en" | "ch";
  onChange: (val: SurveyValue) => void;
  questionNumber: number;
};

export function SurveyRenderer({
  item,
  value,
  lang = "en",
  onChange,
  questionNumber,
}: Props) {
  if (item.qnType === "multi-select") {
    const current = Array.isArray(value) ? value : [];

    return (
      <div className="space-y-4">
        <Label className="text-xl flex-wrap">
          <span className="mr-2">{`Q${questionNumber}.`}</span>
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
                  onChange(newVal);
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
    return (
      <div className="space-y-2">
        <Label className="text-xl flex-wrap">
          <span className="mr-2">{`Q${questionNumber}.`}</span>
          <span>{item.question[lang]}</span>
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
          <span>{item.question[lang]}</span>
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
          <span>{item.question[lang]}</span>
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

  return null;
}
