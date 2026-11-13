-- schema.sql 다음에 실행. 4팀 풀리그 1개(division='middle' 하나만 사용) → 3·4위전(3위 vs 4위), 결승(1위 vs 2위)
-- 대진이 포스터로 정해져 있어 추첨 없이 슬롯에 팀을 바로 배정한다. 1구장 = 블랙 구장, 2구장 = 화이트 구장

insert into teams (division, name) values
  ('middle', '블랙'),
  ('middle', '핑크'),
  ('middle', '그린'),
  ('middle', '레드');

insert into players (team_id, name)
select t.id, p.name
from (values
  ('블랙', '김동준'), ('블랙', '민승준'), ('블랙', '박준영'), ('블랙', '원종준'),
  ('블랙', '정진욱'), ('블랙', '최승도'), ('블랙', '최준영'),
  ('핑크', '조은수'), ('핑크', '안현'), ('핑크', '이정욱'), ('핑크', '원종민'),
  ('핑크', '박성진'), ('핑크', '이인서'), ('핑크', '최현욱'),
  ('그린', '권승훈'), ('그린', '김기협'), ('그린', '최광수'), ('그린', '이원규'),
  ('그린', '임경민'), ('그린', '전영호'), ('그린', '조원근'), ('그린', '이우현(이든)'),
  ('레드', '권정환'), ('레드', '박상현'), ('레드', '박진'), ('레드', '신이삭'),
  ('레드', '오민우'), ('레드', '이해준'), ('레드', '함은성')
) p(team, name)
join teams t on t.division = 'middle' and t.name = p.team;

-- 슬롯 1~4 = 블랙·핑크·그린·레드
insert into slots (division, number, "group", team_id)
select 'middle', s.number, 'A', t.id
from (values (1, '블랙'), (2, '핑크'), (3, '그린'), (4, '레드')) s(number, team)
join teams t on t.division = 'middle' and t.name = s.team;

insert into matches (division, stage, "group", court, start_time, home_slot_id, away_slot_id)
select 'middle', 'group', 'A', m.court, m.start_time::time, h.id, a.id
from (values
  (1, '10:10', 1, 2), -- 블랙 vs 핑크
  (2, '10:10', 3, 4), -- 그린 vs 레드
  (1, '10:30', 1, 3), -- 블랙 vs 그린
  (2, '10:30', 2, 4), -- 핑크 vs 레드
  (1, '10:50', 1, 4), -- 블랙 vs 레드
  (2, '10:50', 2, 3)  -- 핑크 vs 그린
) m(court, start_time, home, away)
join slots h on h.division = 'middle' and h.number = m.home
join slots a on a.division = 'middle' and a.number = m.away;

insert into matches (division, stage, court, start_time, home_source, away_source) values
  ('middle', 'third', 1, '11:15', 'A:3', 'A:4'),
  ('middle', 'final', 1, '11:30', 'A:1', 'A:2');
