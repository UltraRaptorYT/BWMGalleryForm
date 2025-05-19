'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const [before, setBefore] = useState<string[]>([])
  const [after, setAfter] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [feedback, setFeedback] = useState("")
  const router = useRouter()

  const toggleEmotion = (type: "before" | "after", emotion: string) => {
    const list = type === "before" ? before : after
    const setList = type === "before" ? setBefore : setAfter

    if (list.includes(emotion)) {
      setList(list.filter(e => e !== emotion))
    } else {
      setList([...list, emotion])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ before, after, message, feedback })
    })

    if (res.ok) {
      router.push('/thanks')
    } else {
      alert("提交失败，请重试。")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-2xl shadow-xl p-6">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <Label>Q1. What did you feel <b>before</b> the exhibition? / 展览<b>前</b>你有什么感受？</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
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

            <div>
              <Label>Q2. How do you feel <b>after</b> the exhibition? / 展览<b>后</b>你有什么感受？</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
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

            <div>
              <Label htmlFor="message">Q3. 留言 (Your Message)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="写下你的想法..."
              />
            </div>

            <div>
              <Label htmlFor="feedback">Q4. Any feedback? / 其他意见</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="We appreciate your feedback!"
              />
            </div>

            <Button type="submit" className="w-full mt-2">Submit / 提交</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

