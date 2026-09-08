# 나눔카드 이미지 에셋 요청서 (Grok용)

나눔카드는 모임에서 카드를 뽑아 대화를 시작하는 파스텔 톤 웹앱입니다.
아래 에셋을 생성한 뒤, 파일명 그대로 `public/assets/` 폴더에 넣으면 코드 수정 없이 바로 적용됩니다.

## 공통 스타일 가이드

- **무드**: 부드러운 3D 클레이(soft clay render) 아이콘. iOS 앱 아이콘처럼 볼륨감 있고 광택은 은은하게
- **팔레트**: 파스텔 라벤더 `#B9A9F7`, 피치 코랄 `#FF9F8E`, 민트 `#8ED6C0`, 스카이 `#7CB4EF`, 선셋 골드 `#FFC46B`, 잉크 네이비 `#322E56`
- **배경**: 반드시 **투명 배경(PNG, alpha)** — 그라데이션 카드 위에 올라갑니다
- **금지**: 이모지 스타일 그대로 복제, 텍스트/글자 포함, 사실적 사진풍, 강한 그림자
- **형태**: 단일 오브젝트 중심, 실루엣이 명확하게. 아이콘은 정사각형 캔버스 중앙에 여백 10% 정도

## 요청 에셋 목록

### 1. `icon-icebreak.png` — 아이스브레이킹 덱 아이콘
- 크기: 512×512, 투명 배경
- 내용: 서로 겹친 말풍선 두 개 (대화 시작을 상징)
- 색: 피치 코랄 계열 + 크림 화이트
- 프롬프트 예시:
  > Soft 3D clay render icon of two overlapping rounded speech bubbles, pastel peach coral and cream white, subtle glossy finish, centered on transparent background, no text, minimal cute style

### 2. `icon-balance.png` — 밸런스 게임 덱 아이콘
- 크기: 512×512, 투명 배경
- 내용: 양팔 저울 (선택의 갈림길)
- 색: 민트 + 스카이 블루 계열
- 프롬프트 예시:
  > Soft 3D clay render icon of a cute balance scale with two small trays, pastel mint and sky blue, subtle glossy finish, centered on transparent background, no text, minimal style

### 3. `icon-word.png` — 말씀 나눔 덱 아이콘
- 크기: 512×512, 투명 배경
- 내용: 올리브 가지를 문 비둘기 (성령, 평화)
- 색: 라벤더 + 화이트 계열
- 프롬프트 예시:
  > Soft 3D clay render icon of a gentle white dove holding a small olive branch, pastel lavender accents, subtle glossy finish, centered on transparent background, no text, minimal style

### 4. `icon-custom.png` — 나만의 카드 덱 아이콘
- 크기: 512×512, 투명 배경
- 내용: 카드 위에 얹힌 연필과 반짝임 (직접 만들기)
- 색: 선셋 골드 + 코랄 계열
- 프롬프트 예시:
  > Soft 3D clay render icon of a small pencil writing on a blank card with tiny sparkles, pastel golden yellow and coral, subtle glossy finish, centered on transparent background, no text, minimal style

### 5. `logo.png` — 앱 로고 (선택)
- 크기: 1024×1024, 투명 배경
- 내용: 물음표가 그려진 카드 두 장이 비스듬히 겹친 모양 (QuestionCard 앱 아이콘 참고)
- 색: 라벤더→피치 그라데이션 카드, 도트 패턴 은은하게
- 프롬프트 예시:
  > Soft 3D clay render of two overlapping rounded playing cards, front card pastel coral pink with a subtle question mark, back card lavender purple, tiny dot pattern, glossy finish, centered on transparent background, no text

### 6. `og-image.png` — 링크 공유 미리보기 (선택)
- 크기: 1200×630, 불투명 배경
- 내용: 라벤더→피치 파스텔 그라데이션 배경 중앙에 5번 로고 배치, 주변에 은은한 빛망울
- 프롬프트 예시:
  > Wide banner, dreamy pastel gradient background from lavender to peach with soft bokeh light, two overlapping 3D clay question cards floating in the center, no text, soft airy atmosphere

## 적용 방법

1. 생성된 이미지를 위 파일명으로 저장
2. 프로젝트의 `public/assets/` 폴더에 복사 (폴더가 없으면 생성)
3. 새로고침하면 홈 화면 덱 카드에 아이콘이 나타남 (파일이 없는 동안은 자동으로 숨겨짐)
