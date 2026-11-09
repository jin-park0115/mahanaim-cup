import { loadDivision, parseDivision, stageLabel } from '@/lib/data.ts';
import { Header, MatchCard, StandingsTable, Team } from './ui.tsx';

export default async function Home({ searchParams }: PageProps<'/'>) {
  const d = await loadDivision(parseDivision((await searchParams).d));
  // 시간순: 3·4위전(11:15) → 결승(11:30)
  const knockout = (['semi', 'third', 'final'] as const).flatMap((stage) => d.views.filter((v) => v.match.stage === stage));

  return (
    <>
      <Header division={d.division} path="/" />

      {d.podium && (
        <section className="mt-4 rounded-2xl bg-gradient-to-br from-amber-100 to-white p-4 shadow-sm">
          <h2 className="mb-2 font-bold">최종 순위</h2>
          <ol className="space-y-1 text-lg">
            {d.podium.map((name, i) => (
              <li key={i}>
                {['🥇', '🥈', '🥉'][i]} <Team name={name} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {d.groups.map((g) => {
        const games = d.views.filter((v) => v.match.stage === 'group' && v.match.group === g);
        // 포스터처럼 같은 시간 경기를 1R·2R·3R로 묶음
        const rounds = [...new Set(games.map((v) => v.match.start_time))];
        return (
          <section key={g} className="mt-6">
            <h2 className={H2}>{g === d.groups[0] && d.groups.length === 1 ? '풀리그 순위' : d.groupLabel(g)}</h2>
            <StandingsTable s={d.standings[g]} slotLabel={d.slotLabel} />
            <h2 className={`${H2} mt-6`}>경기</h2>
            <div className="space-y-4">
              {rounds.map((t, i) => (
                <div key={t}>
                  <p className="mb-1.5 text-sm font-black text-pink-600">
                    {i + 1}R <span className="font-semibold text-slate-400">{t.slice(0, 5)}</span>
                  </p>
                  <div className="space-y-2">
                    {games
                      .filter((v) => v.match.start_time === t)
                      .map((v) => (
                        <MatchCard key={v.match.id} v={v} playerName={d.playerName} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {knockout.length > 0 && (
        <section className="mt-6">
          <h2 className={H2}>순위 결정전</h2>
          <div className="space-y-2">
            {knockout.map((v) => (
              <MatchCard key={v.match.id} v={v} playerName={d.playerName} title={stageLabel(v.match)} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

const H2 = "mb-2 flex items-center gap-2 text-lg font-bold before:h-5 before:w-1 before:rounded-full before:bg-pink-500 before:content-['']";
