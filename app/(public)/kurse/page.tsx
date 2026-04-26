import type { Metadata } from "next"
import { CourseFiltersAndGrid } from "@/components/course/CourseFiltersAndGrid"
import { COURSES } from "@/lib/data/courses"

export const metadata: Metadata = {
  title: "Kurskatalog — menufaktur",
  description:
    "Entdecken Sie unsere Kochkurse in Frankfurt-Bornheim. Pasta, Steak, Sushi, Patisserie und mehr — seit 2007.",
}

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

      <CourseFiltersAndGrid courses={COURSES} />
    </div>
  )
}
