import Link from 'next/link';
import { courtName, type Division, type MatchView } from '@/lib/data.ts';
import type { Standings } from '@/lib/standings.ts';

export function Header({ division, path }: { division: Division; path: '/' | '/scorers' }) {
  // 부문 1개라 탭 없음
  return (
    <header className="sticky top-0 z-10 -mx-4 bg-slate-100/95 px-4 pt-4 pb-3 backdrop-blur">
      <div className="mb-3 flex items-baseline justify-between">
        <Link href={`/?d=${division}`} className="text-xl font-bold">
          ⚽ 마하나임 <span className="text-pink-500">풋살대회</span>
        </Link>
        <nav className="flex gap-3 text-sm text-slate-600">
          <Link href={`/?d=${division}`} className={path === '/' ? 'font-bold text-slate-900' : ''}>
            경기·순위
          </Link>
          <Link href={`/scorers?d=${division}`} className={path === '/scorers' ? 'font-bold text-slate-900' : ''}>
            득점왕
          </Link>
        </nav>
      </div>
    </header>
  );
}

// 포스터 팀 색. 이름이 다르면(토너먼트 미정 '1위' 등) 색 없이 글자만
const TEAM_COLOR: Record<string, string> = {
  블랙: 'bg-neutral-900 text-white',
  핑크: 'bg-pink-400 text-white',
  그린: 'bg-green-700 text-white',
  레드: 'bg-red-600 text-white',
};

export function Team({ name }: { name: string }) {
  const c = TEAM_COLOR[name];
  return c ? <span className={`inline-block rounded-md px-2.5 py-0.5 font-bold ${c}`}>{name}</span> : <span>{name}</span>;
}

const CARD_ICON ={ yellow: '🟨', second_yellow: '🟨🟥', red: '🟥' } as const;
const min = (m: number | null) => (m === null ? '' : ` ${m}'`);

export function MatchCard({ v, playerName, title }: { v: MatchView; playerName: Map<number, string>; title?: string }) {
  const { match: m, score } = v;
  const events = (team: number | null) => [
    ...v.goals
      .filter((g) => g.scoring_team_id === team)
      .map((g) => (
        <li key={`g${g.id}`}>
          ⚽ {playerName.get(g.player_id)}
          {g.own_goal && ' (자책)'}
          {min(g.minute)}
        </li>
      )),
    ...v.cards
      .filter((c) => c.team_id === team)
      .map((c) => (
        <li key={`c${c.id}`}>
          {CARD_ICON[c.type]} {playerName.get(c.player_id)}
          {min(c.minute)}
        </li>
      )),
  ];
  const pk = m.home_pk !== null && m.away_pk !== null;

  return (
    <Link href={`/match/${m.id}`} className="block rounded-xl bg-white p-3 shadow-sm active:bg-slate-50">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>
          {title && <b className="mr-1 text-slate-700">{title}</b>}
          {m.start_time.slice(0, 5)} · {courtName(m.court)}
        </span>
        {m.status === 'live' && <span className="animate-pulse rounded bg-red-600 px-1.5 py-0.5 font-bold text-white">LIVE</span>}
        {m.status === 'finished' && <span>종료</span>}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <span className="truncate text-right font-semibold">
          <Team name={v.homeLabel} />
        </span>
        <span className="min-w-16 text-center text-2xl font-bold tabular-nums">
          {score ? `${score[0]} : ${score[1]}` : <span className="text-base text-slate-400">vs</span>}
        </span>
        <span className="truncate font-semibold">
          <Team name={v.awayLabel} />
        </span>
      </div>
      {pk && (
        <p className="text-center text-xs text-slate-500">
          승부차기 {m.home_pk} : {m.away_pk}
        </p>
      )}
      {(v.goals.length > 0 || v.cards.length > 0) && (
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] text-xs text-slate-600">
          <ul className="text-right">{events(v.home)}</ul>
          <span />
          <ul>{events(v.away)}</ul>
        </div>
      )}
    </Link>
  );
}

export function StandingsTable({ s, slotLabel }: { s: Standings; slotLabel: (slot: Standings['rows'][number]['slot']) => string }) {
  const cols = ['경기', '승', '무', '패', '득', '실', '득실', '승점', '매너'];
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-center text-sm tabular-nums">
        <thead className="bg-slate-50 text-xs text-slate-500">
          <tr>
            <th className="py-2 pl-3 text-left" colSpan={2}>
              팀
            </th>
            {cols.map((c) => (
              <th key={c} className="px-1 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {s.rows.map((r) => (
            <tr key={r.slot.id} className={`border-t border-slate-100 ${r.rank <= 2 && s.complete && !r.tied ? 'bg-emerald-50' : ''}`}>
              <td className="w-6 py-2 pl-3 text-slate-500" title={r.tied ? '완전 동률: 운영진 지정 필요' : undefined}>
                {r.rank}
                {r.tied && '='}
              </td>
              <td className="max-w-28 truncate pl-1 text-left font-semibold">
                <Team name={slotLabel(r.slot)} />
              </td>
              <td>{r.played}</td>
              <td>{r.won}</td>
              <td>{r.drawn}</td>
              <td>{r.lost}</td>
              <td>{r.goalsFor}</td>
              <td>{r.goalsAgainst}</td>
              <td>{r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}</td>
              <td className="font-bold">{r.points}</td>
              <td className={`pr-3 ${r.manner < 0 ? 'text-red-600' : ''}`}>{r.manner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
