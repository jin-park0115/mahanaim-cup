'use client';
import Link from 'next/link';
import LiquidGlass from 'liquid-glass-react';

// 화면 아래에 떠 있는 리퀴드 글래스 탭 바. 효과는 여기 한 군데만.
// 라이브러리가 translate(-50%,-50%)로 중심을 잡으므로 left/top은 바의 '중심' 좌표
// ponytail: Safari(아이폰 전부)·Firefox는 굴절 없이 블러만 보임(라이브러리 한계)
export function GlassNav({ path, division }: { path: '/' | '/scorers'; division: string }) {
  const tabs = [
    ['/', '경기·순위'],
    ['/scorers', '득점왕'],
  ] as const;
  return (
    <LiquidGlass
      overLight
      cornerRadius={999}
      padding="6px"
      displacementScale={48}
      blurAmount={0.08}
      saturation={150}
      elasticity={0.2}
      style={{ position: 'fixed', left: '50%', top: 'calc(100dvh - 48px)', zIndex: 20 }}
    >
      <nav className="flex gap-1 text-sm font-bold">
        {tabs.map(([href, label]) => (
          <Link
            key={href}
            href={`${href}?d=${division}`}
            className={`rounded-full px-5 py-2.5 whitespace-nowrap ${path === href ? 'bg-slate-900 text-white' : 'text-slate-800'}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </LiquidGlass>
  );
}
