-- Seed data for MindLog application

-- Profile ID to be used
-- 'b0e0e902-3488-4c10-9621-fffde048923c'

-- Emotion Tags
INSERT INTO "emotion_tags" ("profile_id", "name", "color", "category", "is_default") VALUES
(null, '기쁨', '#10B981', 'positive', true),
(null, '행복', '#3B82F6', 'positive', true),
(null, '감사', '#8B5CF6', 'positive', true),
(null, '설렘', '#F59E0B', 'positive', true),
(null, '슬픔', '#6B7280', 'negative', true),
(null, '분노', '#EF4444', 'negative', true),
(null, '불안', '#F97316', 'negative', true),
(null, '걱정', '#84CC16', 'negative', true),
(null, '평온', '#06B6D4', 'neutral', true),
(null, '무관심', '#64748B', 'neutral', true),
-- Custom tags
('b0e0e902-3488-4c10-9621-fffde048923c', '성취감', '#4CAF50', 'positive', false),
('b0e0e902-3488-4c10-9621-fffde048923c', '피곤함', '#795548', 'negative', false),
('b0e0e902-3488-4c10-9621-fffde048923c', '만족', '#FFC107', 'positive', false);

-- Diaries
INSERT INTO "diaries" ("profile_id", "date", "short_content", "situation", "reaction", "physical_sensation", "desired_reaction", "gratitude_moment", "self_kind_words") VALUES
('b0e0e902-3488-4c10-9621-fffde048923c', '2025-09-15', '새로운 프로젝트를 시작한 흥미진진한 하루', '오늘 새로운 웹 개발 프로젝트를 시작했다. 처음에는 막막했지만 점점 재미있어지고 있다.', '처음엔 걱정이 많았지만 차근차근 해나가니 할 수 있을 것 같다.', '가벼운 긴장감', '계속해서 배우고 성장하는 것', '새로운 도전을 할 수 있음에 감사', '잘하고 있어, 계속 나아가자!'),
('b0e0e902-3488-4c10-9621-fffde048923c', '2025-09-14', '친구와의 오랜만의 만남', '대학 친구와 2년만에 만났다.', '정말 반가웠고 옛 추억이 많이 생각났다.', '따뜻한 마음', '소중한 인연을 이어가는 것', '오랜 친구가 있음에 감사', '너의 우정은 소중해'),
('b0e0e902-3488-4c10-9621-fffde048923c', '2025-09-13', '힘들었던 하루지만 배운 게 많았다', '업무가 많아서 스트레스를 많이 받았다.', '힘들었지만 새로운 것을 배울 수 있어서 의미있었다.', '어깨 통증', '스트레스를 현명하게 관리하는 것', '어려움을 통해 성장할 수 있음에 감사', '잘 이겨냈어, 대단해!'),
('b0e0e902-3488-4c10-9621-fffde048923c', '2025-09-09', '가족과 함께한 따뜻한 저녁', '오랜만에 가족 모두가 함께 저녁을 먹었다.', '평범하지만 소중한 시간이었다.', '편안함', '가족과의 시간을 더 많이 보내는 것', '사랑하는 가족이 있음에 감사', '가족은 너의 힘이야'),
('b0e0e902-3488-4c10-9621-fffde048923c', '2025-09-11', '운동을 시작한 첫날', '헬스장에 등록하고 첫 운동을 했다.', '몸은 힘들었지만 기분이 좋았다.', '근육통', '꾸준히 운동하는 습관을 들이는 것', '건강을 챙길 수 있음에 감사', '시작이 반이다, 잘했어!');


-- Diary Tags (linking diaries and emotion_tags)
-- Assuming diary_id and emotion_tag_id start from 1 and increment
INSERT INTO "diary_tags" ("diary_id", "emotion_tag_id") VALUES
(1, 1), -- 일기 1 (새로운 프로젝트) - 기쁨
(1, 4), -- 일기 1 - 설렘
(1, 9), -- 일기 1 - 평온
(2, 2), -- 일기 2 (친구 만남) - 행복
(2, 3), -- 일기 2 - 감사
(3, 5), -- 일기 3 (힘든 하루) - 슬픔
(3, 7), -- 일기 3 - 불안
(3, 3), -- 일기 3 - 감사
(4, 3), -- 일기 4 (가족 저녁) - 감사
(4, 9), -- 일기 4 - 평온
(5, 1), -- 일기 5 (운동 시작) - 기쁨
(5, 4); -- 일기 5 - 설렘

-- Notification Settings
INSERT INTO "notification_settings" ("profile_id", "is_enabled", "reminder_times", "custom_message", "push_subscription") VALUES
('b0e0e902-3488-4c10-9621-fffde048923c', true, ARRAY['09:00:00', '21:00:00'], '오늘 기분은 어떠신가요? 잠시 시간을 내어 되돌아보세요.', '{"endpoint": "https://example.com/push", "keys": {"p256dh": "key", "auth": "auth_key"}}');
