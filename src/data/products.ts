import weapon1 from "@/assets/weapon1.svg";
import weapon2 from "@/assets/weapon2.svg";
import weapon3 from "@/assets/weapon3.svg";
import weapon4 from "@/assets/weapon4.svg";
import car1 from "@/assets/car1.svg";
import car2 from "@/assets/car2.svg";
import car3 from "@/assets/car3.svg";
import character1 from "@/assets/character1.svg";

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "weapons" | "cars" | "characters" | "accessories";
  categoryAr: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const products: Product[] = [
  {
    id: "1",
    name: "Neon Strike AR",
    nameAr: "بندقية نيون سترايك",
    price: 29.99,
    originalPrice: 49.99,
    image: weapon1,
    category: "weapons",
    categoryAr: "أسلحة",
    description: "سكن بندقية هجومية مع إضاءة نيون زرقاء مذهلة. تصميم مستقبلي مع تأثيرات ضوئية متحركة.",
    rarity: "legendary",
  },
  {
    id: "2",
    name: "Shadow Blade",
    nameAr: "نصل الظل الذهبي",
    price: 19.99,
    image: weapon2,
    category: "weapons",
    categoryAr: "أسلحة",
    description: "سكين قتالي ذهبي مع شفرة متوهجة. تصميم فريد بتأثيرات نارية.",
    rarity: "epic",
  },
  {
    id: "3",
    name: "Blood Sniper",
    nameAr: "قناص الدم",
    price: 34.99,
    originalPrice: 44.99,
    image: weapon3,
    category: "weapons",
    categoryAr: "أسلحة",
    description: "سكن قناص بتمويه أحمر وأسود مميز. دقة عالية وتصميم مرعب.",
    rarity: "rare",
  },
  {
    id: "4",
    name: "Diamond Pistol",
    nameAr: "مسدس الماس",
    price: 24.99,
    image: weapon4,
    category: "weapons",
    categoryAr: "أسلحة",
    description: "مسدس مطلي بالذهب ومرصع بالألماس. أناقة وقوة في آن واحد.",
    rarity: "legendary",
  },
  {
    id: "5",
    name: "Purple Storm",
    nameAr: "العاصفة البنفسجية",
    price: 39.99,
    originalPrice: 59.99,
    image: car1,
    category: "cars",
    categoryAr: "سيارات",
    description: "سيارة رياضية خارقة بتصميم بنفسجي مع خطوط سباق نيون. سرعة وأناقة.",
    rarity: "legendary",
  },
  {
    id: "6",
    name: "Blue Lightning",
    nameAr: "البرق الأزرق",
    price: 44.99,
    image: car2,
    category: "cars",
    categoryAr: "سيارات",
    description: "سيارة فائقة السرعة مع إضاءة سفلية زرقاء. تصميم مستقبلي مذهل.",
    rarity: "epic",
  },
  {
    id: "7",
    name: "Neon Rider",
    nameAr: "الراكب النيوني",
    price: 27.99,
    image: car3,
    category: "cars",
    categoryAr: "سيارات",
    description: "دراجة نارية سايبربانك مع أضواء نيون متعددة الألوان.",
    rarity: "rare",
  },
  {
    id: "8",
    name: "Cyber Warrior",
    nameAr: "المحارب السايبر",
    price: 49.99,
    originalPrice: 69.99,
    image: character1,
    category: "characters",
    categoryAr: "شخصيات",
    description: "سكن شخصية محارب مدرع مع قناع متوهج أزرق. حماية ومظهر مخيف.",
    rarity: "legendary",
  },
];

export const categories = [
  { id: "all", nameAr: "الكل" },
  { id: "weapons", nameAr: "أسلحة" },
  { id: "cars", nameAr: "سيارات" },
  { id: "characters", nameAr: "شخصيات" },
  { id: "accessories", nameAr: "إكسسوارات" },
];
