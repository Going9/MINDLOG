CREATE VIEW diary_with_emotion_tags AS
SELECT 
  d.id,
  d.profile_id,
  d.date,
  d.short_content,
  d.situation,
  d.reaction,
  d.physical_sensation,
  d.desired_reaction,
  d.gratitude_moment,
  d.self_kind_words,
  d.image_url,
  d.is_deleted,
  d.created_at,
  d.updated_at,
  -- Completion calculation
  (
    CASE WHEN d.short_content IS NOT NULL AND trim(d.short_content) != '' THEN 1 ELSE 0 END +
    CASE WHEN d.situation IS NOT NULL AND trim(d.situation) != '' THEN 1 ELSE 0 END +
    CASE WHEN d.reaction IS NOT NULL AND trim(d.reaction) != '' THEN 1 ELSE 0 END +
    CASE WHEN d.physical_sensation IS NOT NULL AND trim(d.physical_sensation) != '' THEN 1 ELSE 0 END +
    CASE WHEN d.desired_reaction IS NOT NULL AND trim(d.desired_reaction) != '' THEN 1 ELSE 0 END +
    CASE WHEN d.gratitude_moment IS NOT NULL AND trim(d.gratitude_moment) != '' THEN 1 ELSE 0 END +
    CASE WHEN d.self_kind_words IS NOT NULL AND trim(d.self_kind_words) != '' THEN 1 ELSE 0 END
  ) AS completed_steps,
  7 AS total_steps,
  -- Emotion tags as JSON aggregation
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', et.id,
          'name', et.name,
          'color', et.color,
          'category', et.category,
          'isDefault', et.is_default
        )
      )
      FROM diary_tags dt
      JOIN emotion_tags et ON dt.emotion_tag_id = et.id
      WHERE dt.diary_id = d.id
    ),
    '[]'::jsonb
  ) AS emotion_tags
FROM diaries d
WHERE d.is_deleted = false;


-- ● 한 번에 모든 데이터를 가져오는 방식이 더 효율적인 이유들이
--   있습니다:

--   1. N+1 쿼리 문제 해결

--   // 기존 방식 (비효율적)
--   // 1. 다이어리 목록 조회 (1번 쿼리)
--   // 2. 각 다이어리마다 감정 태그 조회 (N번 쿼리)
--   // 총 1+N번의 쿼리 실행

--   // 뷰 방식 (효율적)
--   // 1번의 쿼리로 모든 데이터 조회

--   2. 네트워크 왕복 시간 단축

--   - 여러 쿼리 = 여러 번의 네트워크 왕복
--   - 단일 쿼리 = 1번의 네트워크 왕복
--   - 특히 클라우드 환경에서는 레이턴시가 큰 차이

--   3. 데이터베이스 최적화 활용

--   -- 데이터베이스가 한 번에 최적화된 실행계획 생성
--   -- 조인, 인덱스, 캐시를 효율적으로 활용
--   -- 메모리에서 한 번에 처리

--   4. 코드 단순성

--   // 기존: 복잡한 조립 로직
--   const diaries = await getDiaries();
--   const tags = await getTagsForDiaries(diaryIds);
--   const assembled = assembleDiariesWithTags(diaries, tags);

--   // 뷰: 단순한 조회
--   const diariesWithTags = await getFromView();

--   5. 일관성 보장

--   - 단일 트랜잭션에서 모든 데이터 조회
--   - 데이터 조회 중간에 변경사항이 반영될 위험 없음

--   6. 데이터베이스 서버 활용

--   - 애플리케이션 서버보다 데이터베이스가 데이터 처리에 최적화됨
--   - JSON 집계, 계산 등을 DB에서 처리하는 것이 더 효율적

--   다만 단점도 있습니다:
--   - 메모리 사용량이 클 수 있음 (대량 데이터시)
--   - 캐싱 전략이 복잡해질 수 있음

--   하지만 일반적인 웹 애플리케이션에서는 성능상 이점이 훨씬
--   큽니다.