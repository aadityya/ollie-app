import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useStore } from '../store/useStore';
import {
  getLast7DaysSummaries,
  getAverage,
  getHigh,
  getLow,
  getDayLabel,
} from '../utils/helpers';
import { DropletIcon, PoopIcon, BreastFeedIcon, DiaperIcon, MoonIcon } from './Icons';

export function InsightsPage() {
  const logs = useStore((s) => s.logs);
  const summaries = getLast7DaysSummaries(logs);

  const chartData = summaries.map((s) => ({
    day: getDayLabel(s.date),
    pee: s.peeCount,
    poop: s.poopCount,
    feedings: s.feedingCount,
    feedingMins: s.totalFeedingMinutes,
    leftMins: s.leftFeedingMinutes,
    rightMins: s.rightFeedingMinutes,
    diapers: s.diaperChangeCount,
    sleepHrs: Math.round((s.totalSleepMinutes / 60) * 10) / 10,
  }));

  const peeValues = summaries.map((s) => s.peeCount);
  const poopValues = summaries.map((s) => s.poopCount);
  const feedingValues = summaries.map((s) => s.feedingCount);
  const feedingMinValues = summaries.map((s) => s.totalFeedingMinutes);
  const diaperValues = summaries.map((s) => s.diaperChangeCount);
  const sleepValues = summaries.map((s) => s.totalSleepMinutes);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold text-warm-brown">Weekly Insights</h2>
        <p className="text-xs text-warm-gray">Last 7 days at a glance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2">
        <StatBadge icon={<DropletIcon size={20} />} label="Avg Pee" value={`${getAverage(peeValues)}`} color="bg-sky/20" />
        <StatBadge icon={<PoopIcon size={20} />} label="Avg Poop" value={`${getAverage(poopValues)}`} color="bg-peach/25" />
        <StatBadge icon={<BreastFeedIcon size={20} />} label="Avg Feeds" value={`${getAverage(feedingValues)}`} color="bg-lavender/20" />
        <StatBadge icon={<DiaperIcon size={20} />} label="Avg Diapers" value={`${getAverage(diaperValues)}`} color="bg-sky/15" />
        <StatBadge
          icon={<MoonIcon size={20} />}
          label="Avg Sleep"
          value={`${Math.round(getAverage(sleepValues) / 60 * 10) / 10}h`}
          color="bg-sunshine/20"
        />
        <StatBadge
          icon={<BreastFeedIcon size={20} />}
          label="Avg Feed Time"
          value={`${getAverage(feedingMinValues)}m`}
          color="bg-lavender/15"
        />
      </div>

      {/* Pee & Poop Chart */}
      <ChartCard title="Pee & Poop" subtitle="Daily counts">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFE0CC" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8D6E63' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8D6E63' }} axisLine={false} tickLine={false} width={24} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #FFD6E0',
                borderRadius: '12px',
                fontSize: '12px',
                fontFamily: 'Nunito',
              }}
            />
            <Bar dataKey="pee" fill="#B8DCF5" radius={[4, 4, 0, 0]} name="Pee" />
            <Bar dataKey="poop" fill="#A1887F" radius={[4, 4, 0, 0]} name="Poop" />
          </BarChart>
        </ResponsiveContainer>
        <HighLowRow label="Pee" high={getHigh(peeValues)} low={getLow(peeValues)} avg={getAverage(peeValues)} />
        <HighLowRow label="Poop" high={getHigh(poopValues)} low={getLow(poopValues)} avg={getAverage(poopValues)} />
      </ChartCard>

      {/* Feeding Chart */}
      <ChartCard title="Feeding" subtitle="Minutes per day (Left vs Right)">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barGap={1}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFE0CC" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8D6E63' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#8D6E63' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #FFD6E0',
                borderRadius: '12px',
                fontSize: '12px',
                fontFamily: 'Nunito',
              }}
            />
            <Bar dataKey="leftMins" fill="#D4B8EB" radius={[4, 4, 0, 0]} name="Left (min)" stackId="feed" />
            <Bar dataKey="rightMins" fill="#E8D5F5" radius={[4, 4, 0, 0]} name="Right (min)" stackId="feed" />
          </BarChart>
        </ResponsiveContainer>
        <HighLowRow label="Total mins" high={getHigh(feedingMinValues)} low={getLow(feedingMinValues)} avg={getAverage(feedingMinValues)} />
      </ChartCard>

      {/* Sleep Chart */}
      <ChartCard title="Sleep" subtitle="Hours per day">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8D5F5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#E8D5F5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFE0CC" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8D6E63' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#8D6E63' }} axisLine={false} tickLine={false} width={24} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #FFD6E0',
                borderRadius: '12px',
                fontSize: '12px',
                fontFamily: 'Nunito',
              }}
            />
            <Area
              type="monotone"
              dataKey="sleepHrs"
              stroke="#D4B8EB"
              strokeWidth={2.5}
              fill="url(#sleepGrad)"
              name="Sleep (hrs)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <HighLowRow
          label="Sleep hrs"
          high={Math.round(getHigh(sleepValues) / 60 * 10) / 10}
          low={Math.round(getLow(sleepValues) / 60 * 10) / 10}
          avg={Math.round(getAverage(sleepValues) / 60 * 10) / 10}
        />
      </ChartCard>

      {/* Diaper Chart */}
      <ChartCard title="Diaper Changes" subtitle="Daily count">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFE0CC" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8D6E63' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8D6E63' }} axisLine={false} tickLine={false} width={24} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #FFD6E0',
                borderRadius: '12px',
                fontSize: '12px',
                fontFamily: 'Nunito',
              }}
            />
            <Bar dataKey="diapers" fill="#B8DCF5" radius={[6, 6, 0, 0]} name="Changes" />
          </BarChart>
        </ResponsiveContainer>
        <HighLowRow label="Changes" high={getHigh(diaperValues)} low={getLow(diaperValues)} avg={getAverage(diaperValues)} />
      </ChartCard>

      <div className="text-center pb-4">
        <p className="text-xs text-warm-gray/60">You're doing great, mama!</p>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-blush/10">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-warm-brown">{title}</h3>
        <p className="text-xs text-warm-gray">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function StatBadge({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={`${color} rounded-xl p-2.5 flex flex-col items-center gap-1`}>
      {icon}
      <span className="text-lg font-bold text-warm-brown leading-tight">{value}</span>
      <span className="text-[10px] text-warm-gray font-medium">{label}</span>
    </div>
  );
}

function HighLowRow({
  label,
  high,
  low,
  avg,
}: {
  label: string;
  high: number;
  low: number;
  avg: number;
}) {
  return (
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-blush/10 text-xs">
      <span className="text-warm-gray font-medium">{label}</span>
      <div className="flex gap-3">
        <span className="text-mint-dark font-semibold">High: {high}</span>
        <span className="text-sky-dark font-semibold">Low: {low}</span>
        <span className="text-rose font-semibold">Avg: {avg}</span>
      </div>
    </div>
  );
}
