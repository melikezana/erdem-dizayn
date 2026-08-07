# Implementation Plan: Cinematic Editorial Architectural Experience

Transform the Erdem Dizayn & Mekanik website into an award-grade, editorial digital architectural presentation with a cinematic 3D opening sequence, interactive 3D villa presentation, scroll storytelling, technical reveal mode, editorial service stack, full-bleed project presentation, minimal process flow, and deep navy CTA.

## User Review Required

> [!IMPORTANT]
> The experience relies on a continuous Three.js canvas setup to smoothly transition the GLB model (`/models/erdem-villa.glb`) through the intro, hero, statement 01, and technical blueprint reveal sections without re-instantiating WebGL contexts.

> [!NOTE]
> All Turkish typography, diacritics (`DİZAYN`, `MEKANİK`, `SIHHİ`), brand copies, and slogan ("Tasarımdan Uygulamaya Güvenilir Çözümler.") adhere strictly to the requested editorial tone and exact wording.

## Proposed Changes

### Styling & Design System

#### [MODIFY] [globals.css](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/app/globals.css)
- Refine background color tokens to pure architectural ivory `#F6F2EA` and deep navy `#102B49`.
- Define fluid clamp font sizes for display headings (`clamp(3.5rem, 8vw, 8.5rem)`), statement typography, and technical line indicators.
- Add clip-path / mask transition animation classes for opening text reveal.
- Ensure custom scrollbar and scroll snap / scroll-linked storytelling styling.

---

### Opening Sequence & Header Navigation

#### [NEW] [OpeningIntro.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/ui/OpeningIntro.tsx)
- Implement full-screen ivory (`#F6F2EA`) opening overlay (3–4 sec duration).
- Feature huge masked display typography: **ERDEM** occupying a major portion of viewport.
- Masked clip reveal text animation synchronized with GLB 3D model rising from below behind typography.
- Smooth transition fading into minimal header navbar (`ERDEM DİZAYN & MEKANİK`).

#### [MODIFY] [Navbar.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/layout/Navbar.tsx)
- Clean, ultra-minimal top navigation bar.
- Brand label: `ERDEM DİZAYN & MEKANİK`.
- Links: `Hakkımızda`, `Hizmetler`, `Projeler`, `İletişim`.
- CTA: `Projenizi Konuşalım`.

---

### Interactive 3D Architectural Scene & Storytelling

#### [MODIFY] [ArchitecturalModel.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/three/ArchitecturalModel.tsx)
- Enhance `/models/erdem-villa.glb` rendering: studio lighting setup, warm highlights, soft floor contact shadows.
- Add **Technical Reveal Mode**: support wireframe/edges highlight and blueprint shader effect when scroll reaches the technical section.
- Implement smooth pointer-controlled camera/model yaw (horizontal pointer) and elevation (vertical pointer) without auto-rotation.

#### [MODIFY] [HeroScene.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/three/HeroScene.tsx)
- Adapt Canvas for smooth scroll tracking and section state updates (Intro -> Hero -> Statement 01 -> Technical Reveal).
- Cap DPR at 2 for high DPI screens while retaining high performance.

---

### Page Sections & Storytelling Flow

#### [MODIFY] [Hero.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/sections/Hero.tsx)
- Integrate Hero copy:
  - Headline: *“Bir yapıyı yalnızca tasarlamıyoruz. Nasıl yaşayacağını da kurguluyoruz.”*
  - Supporting: *“Erdem Dizayn & Mekanik; mimari tasarım, mühendislik ve uygulamayı tek bir sistem içinde buluşturur. Çizginin estetiğini, yapının işleyişiyle tamamlar.”*
  - Small tag: `TASARIM · MÜHENDİSLİK · UYGULAMA`
  - Primary CTA: `Yapıyı Keşfet` | Secondary CTA: `Projeleri Gör`.
- Direct GLB 3D embedding into the viewport background (no cards or bounding boxes).

#### [NEW] [StatementOne.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/sections/StatementOne.tsx)
- Feature huge editorial typography: *“Mimari, görünen yüzdür. Mühendislik ise onu yaşanabilir kılan sistemdir.”*
- Spacing & whitespace emphasis; model shifts subtly in background.

#### [NEW] [TechnicalReveal.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/sections/TechnicalReveal.tsx)
- Controlled transition of GLB model to architectural technical x-ray / line presentation state.
- Interactive architectural discipline badges: `MİMARİ`, `MEKANİK`, `HVAC`, `SIHHİ TESİSAT`, `YANGIN`, `UYGULAMA` with refined line graphics.

#### [NEW] [StatementTwo.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/sections/StatementTwo.tsx)
- Large headline: *“Estetik ile işlev arasında seçim yapmıyoruz. İkisini aynı projede çözüyoruz.”*
- Supporting copy: *“Her mimari kararın arkasında uygulanabilirlik; her mühendislik kararının merkezinde ise insan vardır.”*

#### [MODIFY] [Services.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/sections/Services.tsx)
- Scroll-driven editorial service presentation (01 to 08):
  - `01 MİMARİ TASARIM`, `02 İÇ MİMARİ`, `03 MEKANİK PROJELENDİRME`, `04 ISITMA VE SOĞUTMA`, `05 HAVALANDIRMA`, `06 SIHHİ TESİSAT`, `07 YANGIN SİSTEMLERİ`, `08 UYGULAMA VE TAAHHÜT`.
- Highlight prominent service per scroll milestone with large index numbers and minimal line accents.

#### [MODIFY] [Projects.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/sections/Projects.tsx)
- Section intro: *“Çizgiden yapıya. Fikirden gerçeğe.”* | Label: `SEÇİLİ PROJELER`.
- Full-bleed near-full-width project compositions with metadata: Proje, Konum, Yıl, Disiplin.
- Cinematic image hover & parallax reveal effect.

#### [MODIFY] [Process.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/sections/Process.tsx)
- Headline: *“Her iyi yapı, doğru bir süreçle başlar.”*
- Sequence (01 to 07): `Keşif` -> `Analiz` -> `Konsept` -> `Projelendirme` -> `Mühendislik` -> `Uygulama` -> `Teslim`.
- Clean typography + interconnecting vector lines + scroll animations.

#### [MODIFY] [ContactCTA.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/components/sections/ContactCTA.tsx)
- Deep navy background `#102B49`.
- Headline: *“İyi bir proje, doğru soruyla başlar. Sizinkini konuşalım.”*
- Supporting copy: *“Projenizi, ihtiyaçlarınızı ve hayal ettiğiniz mekânı birlikte değerlendirelim.”*
- Primary action: `Projenizi Anlatın →`
- Secondary links: `WhatsApp`, `E-posta`, `İletişim`.

---

### Data Files & Master Page Layout

#### [MODIFY] [services.ts](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/data/services.ts)
- Update exact copy for services 01–08.

#### [MODIFY] [page.tsx](file:///c:/Users/Melikezana/Desktop/erdem-dizayn/src/app/page.tsx)
- Assemble components into a unified scroll narrative.

---

## Verification Plan

### Automated Verification
- Run `npm run lint` to check for ESLint / TypeScript errors.
- Run `npm run build` to verify static page generation & bundle compilation without warnings or errors.

### Manual Verification
- Test opening sequence (3-4 seconds ivory screen with giant masked **ERDEM** typography and GLB villa emerging).
- Verify mouse movement camera yaw and elevation in Hero.
- Verify scroll storytelling flow through Statement 01, Technical Blueprint Reveal, Statement 02, Services 01-08, Selected Projects, Process 01-07, and Navy Contact CTA.
- Test responsive layout on mobile, tablet, and desktop viewports.
