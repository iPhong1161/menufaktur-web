import type { Metadata } from "next"
import { CourseFiltersAndGrid } from "@/components/course/CourseFiltersAndGrid"
import type { CatalogCourse } from "@/components/course/CatalogCourseCard"

export const metadata: Metadata = {
  title: "Kurskatalog — menufaktur",
  description:
    "Entdecken Sie unsere Kochkurse in Frankfurt-Bornheim. Pasta, Steak, Sushi, Patisserie und mehr — seit 2007.",
}

const COURSES: CatalogCourse[] = [
  {
    id: "1",
    slug: "kunst-der-pasta-manufaktur",
    title: "Die Kunst der Pasta-Manufaktur",
    dateFormatted: "12. Juni 2026",
    startTime: "18:00",
    location: "Frankfurt-Bornheim",
    price: 89,
    remainingCapacity: 4,
  },
  {
    id: "2",
    slug: "wein-wild-herbstliches-menue",
    title: "Wein & Wild: Herbstliches Menü",
    dateFormatted: "15. Juni 2026",
    startTime: "19:00",
    location: "Frankfurt-Bornheim",
    price: 125,
    remainingCapacity: 1,
  },
  {
    id: "3",
    slug: "plant-based-gourmet-vegan",
    title: "Plant-Based Gourmet: Vegan kochen",
    dateFormatted: "18. Juni 2026",
    startTime: "17:30",
    location: "Frankfurt-Bornheim",
    price: 95,
    remainingCapacity: 0,
  },
  {
    id: "4",
    slug: "perfect-steak-grillen-braten",
    title: "Perfect Steak: Grillen & Braten",
    dateFormatted: "22. Juni 2026",
    startTime: "18:30",
    location: "Frankfurt-Bornheim",
    price: 139,
    remainingCapacity: 6,
  },
  {
    id: "5",
    slug: "franzoesische-patisserie-macarons",
    title: "Französische Patisserie: Macarons",
    dateFormatted: "25. Juni 2026",
    startTime: "14:00",
    location: "Frankfurt-Bornheim",
    price: 79,
    remainingCapacity: 2,
  },
  {
    id: "6",
    slug: "sushi-masterclass-maki-nigiri",
    title: "Sushi Masterclass: Von Maki bis Nigiri",
    dateFormatted: "30. Juni 2026",
    startTime: "18:00",
    location: "Frankfurt-Bornheim",
    price: 109,
    remainingCapacity: 5,
  },
  {
    id: "7",
    slug: "quick-healthy-after-work-cooking",
    title: "Quick & Healthy: After-Work Cooking",
    dateFormatted: "02. Juli 2026",
    startTime: "19:00",
    location: "Frankfurt-Bornheim",
    price: 75,
    remainingCapacity: 8,
  },
  {
    id: "8",
    slug: "sauerteig-geheimnisse-brot-backen",
    title: "Sauerteig-Geheimnisse: Brot backen",
    dateFormatted: "05. Juli 2026",
    startTime: "10:00",
    location: "Frankfurt-Bornheim",
    price: 99,
    remainingCapacity: 1,
  },
  {
    id: "9",
    slug: "thai-street-food-wuerzig-authentisch",
    title: "Thai Street Food: Würzig & Authentisch",
    dateFormatted: "08. Juli 2026",
    startTime: "18:00",
    location: "Frankfurt-Bornheim",
    price: 85,
    remainingCapacity: 3,
  },
]

export default function KursePage() {
  return (
    <div className="pt-16 md:pt-20 pb-20 bg-light-beige min-h-screen">
      {/* Page header */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-wine-red leading-tight mb-5">
            Unsere Kurse
          </h1>
          <p className="text-lg text-dark/60 font-condensed leading-relaxed">
            Entdecken Sie die Vielfalt unserer Kochkurse in Frankfurt-Bornheim.
            Erleben Sie kulinarische Perfektion in einer Atmosphäre, die zum
            Verweilen und Genießen einlädt.
          </p>
        </div>
      </section>

      {/* Filters + grid (client component) */}
      <CourseFiltersAndGrid courses={COURSES} />
    </div>
  )
}
