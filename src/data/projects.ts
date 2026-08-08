export interface ProjectItem {
  id: string;
  title: string;
  type: string;
  location: string;
  image: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "vadi-premium-konutlari",
    title: "Vadi Premium Konutları",
    type: "Konut",
    location: "İstanbul, Sarıyer",
    image: "/images/project-1.jpg",
  },
  {
    id: "panora-is-merkezi",
    title: "Panora İş Merkezi",
    type: "Ofis / Ticari Alan",
    location: "Ankara, Çankaya",
    image: "/images/project-2.jpg",
  },
  {
    id: "artisan-loft-residence",
    title: "Artisan Loft & Residence",
    type: "İç Mimari",
    location: "İzmir, Urla",
    image: "/images/project-3.jpg",
  },
  {
    id: "arge-inovasyon-merkezi",
    title: "Ar-Ge ve İnovasyon Merkezi",
    type: "Mekanik Uygulama",
    location: "Kocaeli, Gebze",
    image: "/images/project-4.jpg",
  },
];
