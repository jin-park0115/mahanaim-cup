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
        <section className="mt-2 rounded-xl bg-gradient-to-br from-amber-100 to-white p-4 shadow-sm">
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

      {d.groups.map((g) => (
        <section key={g} className="mt-6">
          <h2 className="mb-2 text-lg font-bold">{d.groupLabel(g)}</h2>
          <StandingsTable s={d.standings[g]} slotLabel={d.slotLabel} />
          <div className="mt-3 space-y-2">
            {d.views
              .filter((v) => v.match.stage === 'group' && v.match.group === g)
              .map((v) => (
                <MatchCard key={v.match.id} v={v} playerName={d.playerName} />
              ))}
          </div>
        </section>
      ))}

      {knockout.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-bold">순위 결정전</h2>
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
