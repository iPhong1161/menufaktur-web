const SLUG_IMAGE_MAP: Record<string, string> = {
  // Real course slugs
  "italienische-klassiker":       "/images/courses/pasta-manufaktur.png",
  "spanische-klassiker":          "/images/courses/pasta-manufaktur.png",
  "franzoesische-klassiker":      "/images/courses/wein-wild-herbst.png",
  "hessische-kueche":             "/images/courses/after-work-cooking.png",
  "thaiaendische-kueche":         "/images/courses/thai-street-food.png",
  "indische-kueche":              "/images/courses/thai-street-food.png",
  "vegetarische-kueche":          "/images/courses/plant-based-gourmet.png",
  "vegane-kueche":                "/images/courses/plant-based-gourmet.png",
  "nudeln-selbstgemacht":         "/images/courses/pasta-manufaktur.png",
  "risotto-pasta-gnocchi":        "/images/courses/pasta-manufaktur.png",
  "steak-schnitzel-und-co":       "/images/courses/perfect-steak.png",
  "saucen-und-fonds":             "/images/courses/perfect-steak.png",
  "hackfleisch":                  "/images/courses/perfect-steak.png",
  "einmaleins-der-kueche":        "/images/courses/after-work-cooking.png",
  "die-schnelle-kueche":          "/images/courses/after-work-cooking.png",
  "von-kopf-bis-fuss-fisch":      "/images/courses/sushi-masterclass.png",
  "spargel-satt":                 "/images/courses/plant-based-gourmet.png",
  "festtagsbraten":               "/images/courses/wein-wild-herbst.png",
  "haeppchen-fingerfood-tapas":   "/images/courses/patisserie-macarons.png",
  "tuerkisch-griechische-kueche": "/images/courses/thai-street-food.png",
  "vegetarische-meze":            "/images/courses/plant-based-gourmet.png",
  "suesser-frankreich":           "/images/courses/patisserie-macarons.png",
  // Seeded placeholder slugs
  "kunst-der-pasta-manufaktur":         "/images/courses/pasta-manufaktur.png",
  "wein-wild-herbstliches-menue":       "/images/courses/wein-wild-herbst.png",
  "plant-based-gourmet-vegan":          "/images/courses/plant-based-gourmet.png",
  "perfect-steak-grillen-braten":       "/images/courses/perfect-steak.png",
  "franzoesische-patisserie-macarons":  "/images/courses/patisserie-macarons.png",
  "sushi-masterclass-maki-nigiri":      "/images/courses/sushi-masterclass.png",
  "quick-healthy-after-work-cooking":   "/images/courses/after-work-cooking.png",
  "sauerteig-geheimnisse-brot-backen":  "/images/courses/sauerteig-brot.png",
  "thai-street-food-wuerzig-authentisch": "/images/courses/thai-street-food.png",
}

const DEFAULT = "/images/courses/pasta-manufaktur.png"

export function courseImageSrc(slug: string, photoUrl?: string | null): string {
  if (photoUrl) return photoUrl
  return SLUG_IMAGE_MAP[slug] ?? DEFAULT
}
