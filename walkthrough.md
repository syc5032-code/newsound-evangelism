# 뉴사운드교회 노방전도 대시보드 - 쌍따옴표 단독 줄바꿈 방지 및 타이포그래피 볼드 임팩트 강화 보고서

모바일 및 다양한 기기에서 쌍따옴표(`”`)가 마지막 줄에 혼자 외롭게 떨어져 나오는 현상을 완벽히 방지하고, 성경 구절이 한눈에 더욱 웅장하고 선명하게 들어오도록 폰트 크기 및 볼드 웨이트를 대폭 강화하였습니다.

---

## 🛠️ 수정 완료 내역

1. **🚫 쌍따옴표(`”`) 단독 줄바꿈 완벽 해결**
   - 따옴표를 단어와 완벽히 결합(`“오직`, `하시니라”`)하여 화면 너비가 좁아져도 따옴표 혼자 다음 줄로 넘어가지 않고 단어와 함께 자연스럽게 정렬되도록 수정하였습니다.
   - `word-break: keep-all` (`break-keep`) 속성을 적용하여 한글 단어가 음절 중간에서 어색하게 끊어지지 않습니다.

2. **🔤 폰트 시인성 및 볼드 임팩트 대폭 강화**
   - 폰트 두께: `font-extrabold` (두껍고 묵직한 하이엔드 볼드)
   - 폰트 크기: `text-2xl sm:text-3xl md:text-4xl lg:text-[44px]`
   - 행간(Line-height)을 가장 단정하고 긴장감 있게(`leading-[1.32]`) 다듬어 첫 화면 진입 시 말씀이 시야에 압도적으로 각인되도록 업그레이드하였습니다.

---

## 🌐 실시간 확인 링크

- **🚀 Vercel 배포 주소**: [https://temporary-fleet-cerulean-d5nuvpk.vercel.app](https://temporary-fleet-cerulean-d5nuvpk.vercel.app)
- **💻 로컬 개발 서버**: [http://localhost:5173/](http://localhost:5173/)
- **📦 GitHub 저장소**: [https://github.com/syc5032-code/newsound-evangelism](https://github.com/syc5032-code/newsound-evangelism)
