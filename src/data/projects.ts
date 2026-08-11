import type { PortfolioProject } from "@/types/projects";

export interface ProjectItem extends PortfolioProject {
  id: string;
  image: string;
  published: boolean;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "vadi-premium-konutlari",
    slug: "vadi-premium-konutlari",
    title: "Vadi Premium Konutları",
    type: "Konut",
    location: "İstanbul, Sarıyer",
    image: "/images/project-1.jpg",
    images: ["/images/project-1.jpg"],
    summary:
      "Yaşam alanı, ıslak hacimler ve mekanik altyapı kararları birlikte ele alınan kapsamlı konut yenileme çalışması.",
    services: ["İç mimari tasarım", "Tadilat / yenileme", "Mekanik koordinasyon"],
    seo: {
      metaTitle: "Vadi Premium Konutları İç Mimari Projesi | Erdem Dizayn",
      metaDescription:
        "Sarıyer'de iç mimari tasarım, yenileme ve mekanik koordinasyonun birlikte çözüldüğü premium konut projesini inceleyin.",
      openGraphImage: "/images/project-1.jpg",
    },
    published: true,
  },
  {
    id: "panora-is-merkezi",
    slug: "panora-is-merkezi",
    title: "Panora İş Merkezi",
    type: "Ofis / Ticari Alan",
    location: "Ankara, Çankaya",
    image: "/images/project-2.jpg",
    images: ["/images/project-2.jpg"],
    summary:
      "Yoğun kullanıma uygun, okunaklı planlama ve kontrollü uygulama akışıyla tamamlanan ticari alan düzenlemesi.",
    services: ["Ofis planlama", "Uygulama yönetimi", "Mekanik çözümler"],
    seo: {
      metaTitle: "Panora İş Merkezi Ofis Tasarım Projesi | Erdem Dizayn",
      metaDescription:
        "Ankara'da ofis planlama, uygulama yönetimi ve mekanik çözüm kararlarını birleştiren ticari alan düzenlemesini keşfedin.",
      openGraphImage: "/images/project-2.jpg",
    },
    published: true,
  },
  {
    id: "artisan-loft-residence",
    slug: "artisan-loft-residence",
    title: "Artisan Loft & Residence",
    type: "İç Mimari",
    location: "İzmir, Urla",
    image: "/images/project-3.jpg",
    images: ["/images/project-3.jpg"],
    summary:
      "Malzeme seçimi, özel detaylar ve ferah yerleşim kararlarıyla geliştirilen loft residence iç mekan projesi.",
    services: ["İç mimari konsept", "Malzeme seçimi", "Özel detay çözümleri"],
    seo: {
      metaTitle: "Artisan Loft & Residence İç Mekan Projesi | Erdem Dizayn",
      metaDescription:
        "Urla'da malzeme seçimi, özel detaylar ve ferah yerleşim kararlarıyla tasarlanan loft residence projesini görüntüleyin.",
      openGraphImage: "/images/project-3.jpg",
    },
    published: true,
  },
  {
    id: "arge-inovasyon-merkezi",
    slug: "arge-inovasyon-merkezi",
    title: "Ar-Ge ve İnovasyon Merkezi",
    type: "Mekanik Uygulama",
    location: "Kocaeli, Gebze",
    image: "/images/project-4.jpg",
    images: ["/images/project-4.jpg"],
    summary:
      "Teknik ihtiyaçların görünür mimari kararlarla çakışmadan çözüldüğü mekanik uygulama ve saha koordinasyonu.",
    services: ["Mekanik uygulama", "Saha takibi", "Teknik koordinasyon"],
    seo: {
      metaTitle: "Ar-Ge ve İnovasyon Merkezi Mekanik Uygulama | Erdem Dizayn",
      metaDescription:
        "Gebze'de teknik koordinasyon, mekanik uygulama ve saha takibini mimari bütünlükle ele alan proje detayını inceleyin.",
      openGraphImage: "/images/project-4.jpg",
    },
    published: true,
  },
];

export function getPublishedProjects() {
  return PROJECTS_DATA.filter((project) => project.published);
}

export function getProjectBySlug(slug: string) {
  return getPublishedProjects().find((project) => project.slug === slug) ?? null;
}
