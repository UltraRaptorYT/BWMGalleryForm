'use client'

import { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const emotions = [
  "Excited", "Anxious", "Happy", "Confused", "Hopeful",
  "Overwhelmed", "Inspired", "Indifferent", "Grateful", "Curious",
]
const emotionsCN = [
  "兴奋", "焦虑", "开心", "困惑", "充满希望",
  "不知所措", "受到启发", "无动于衷", "感激", "好奇"
]

export default function ExhibitionFormPage() {
  const [step, setStep] = useState(0)
  const [before, setBefore] = useState<string[]>([])
  const [after, setAfter] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const totalSteps = 4

  useEffect(() => {
    const saved = localStorage.getItem('exhibitionForm')
    if (saved) {
      const parsed = JSON.parse(saved)
      setBefore(parsed.before || [])
      setAfter(parsed.after || [])
      setMessage(parsed.message || "")
      setFeedback(parsed.feedback || "")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('exhibitionForm', JSON.stringify({ before, after, message, feedback }))
  }, [before, after, message, feedback])

  const toggleEmotion = (type: "before" | "after", emotion: string) => {
    const list = type === "before" ? before : after
    const setList = type === "before" ? setBefore : setAfter
    setList(
      list.includes(emotion)
        ? list.filter(e => e !== emotion)
        : [...list, emotion]
    )
  }

  const handleSubmit = async () => {
    if (before.length === 0 || after.length === 0 || !message.trim() || !feedback.trim()) {
      alert("请完整填写所有问题 / Please complete all questions.")
      return
    }

    setSubmitting(true)
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ before, after, message, feedback }),
    })

    if (res.ok) {
      localStorage.removeItem('exhibitionForm')
      setSubmitted(true)
    } else {
      alert("提交失败，请稍后重试")
    }
    setSubmitting(false)
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <Label>Q1. What did you feel <b>before</b> the exhibition? / 展览<b>前</b>你有什么感受？</Label>
            <div className="grid grid-cols-2 gap-2">
              {emotions.map((emotion, i) => (
                <label key={`before-${emotion}`} className="flex items-center gap-2">
                  <Checkbox
                    checked={before.includes(emotion)}
                    onCheckedChange={() => toggleEmotion("before", emotion)}
                  />
                  {emotion} / {emotionsCN[i]}
                </label>
              ))}
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <Label>Q2. How do you feel <b>after</b> the exhibition? / 展览<b>后</b>你有什么感受？</Label>
            <div className="grid grid-cols-2 gap-2">
              {emotions.map((emotion, i) => (
                <label key={`after-${emotion}`} className="flex items-center gap-2">
                  <Checkbox
                    checked={after.includes(emotion)}
                    onCheckedChange={() => toggleEmotion("after", emotion)}
                  />
                  {emotion} / {emotionsCN[i]}
                </label>
              ))}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-2">
            <Label>Q3. 留言 (Your Message)</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="写下你的想法..."
            />
          </div>
        )
      case 3:
        return (
          <div className="space-y-2">
            <Label>Q4. Any feedback? / 其他意见</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="We appreciate your feedback!"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main
      className="relative flex items-center justify-center p-4 bg-gray-100 overflow-hidden"
      style={{ minHeight: 'var(--full-height)' }}
    >
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: "url('/background.jpeg')",
          backgroundRepeat: "repeat",
          backgroundSize: "contain",
        }}
      />

      <Card className="relative z-10 w-full max-w-xl shadow-xl p-6 bg-white">
        <CardContent>
          {submitted ? (
            <div className="text-center text-xl font-semibold text-green-600">
              🎉 Thank you for your feedback!<br />
              🎉 感谢你的反馈！
            </div>
          ) : (
            <>
              {renderStep()}

              <div className="mt-6 flex justify-between">
                {step > 0 && (
                  <Button variant="secondary" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                {step < totalSteps - 1 ? (
                  <Button onClick={() => setStep(step + 1)} className='ml-auto'>Next</Button>
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
  )
}
