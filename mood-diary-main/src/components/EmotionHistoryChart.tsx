import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { DiaryType } from "types/diary-types";
import { emotionToScore, scoreToLabel } from "utils/emotion-score";
import { getStringDate } from "utils/get-string-date";

type Props = { diaries: DiaryType[]; days?: number };

function formatDate(ts: number) {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}`;
}

export default function EmotionHistoryChart({ diaries, days = 30 }: Props) {
  const data = useMemo(() => {
    if (!diaries?.length) return [];

    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));

    const byDay = new Map<string, number[]>();
    diaries.forEach((d) => {
      const dt = new Date(d.createdDate);
      if (dt < start || dt > end) return;
      const key = getStringDate(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime());
      const arr = byDay.get(key) ?? [];
      arr.push(emotionToScore(d.emotion));
      byDay.set(key, arr);
    });

    const points: { date: string; score: number | null }[] = [];
    for (let i = 0; i < days; i++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + i);
      const key = getStringDate(new Date(cur.getFullYear(), cur.getMonth(), cur.getDate()).getTime());
      const arr = byDay.get(key);
      const avg = arr && arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
      points.push({ date: formatDate(cur.getTime()), score: avg });
    }

    return points;
  }, [diaries, days]);

  return (
    <div className="mt-6 p-4 rounded-md bg-btnLight dark:bg-btnDark dark:text-white">
      <div className="mb-3 font-semibold">Mood history (last {days} days)</div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[-2, 2]} ticks={[-2, -1, 0, 1, 2]} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: any) =>
                value == null ? ["No data", "Mood"] : [`${Number(value).toFixed(2)} (${scoreToLabel(Number(value))})`, "Avg score"]
              }
              labelFormatter={(label) => `Date: ${label}`}
            />
            <ReferenceLine y={0} stroke="#aaa" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3498db"
              strokeWidth={3}
              dot={{ r: 2 }}
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs opacity-80">Scale: Terrible(-2) … Bad(-1) … Normal(0) … Good(1) … Happy(2)</div>
    </div>
  );
}
