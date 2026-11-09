import type { Route } from "./+types/home"
import { useLoaderData } from "react-router"
import { getLanguage, translator } from "~/lib/i18n"
import { useEffect, useId, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  Camera,
  Plus,
  X,
} from "lucide-react"

const assetBase =
  "https://cdn.wdgtsrc.com/408ca0ccc19412119d2bbc6f7b83f91e8400634/resize_landing/"
const portrait = `${assetBase}1718664571385_jpg/source.webp`
const previews = [1, 2, 3].map(
  (n) => `${assetBase}${encodeURIComponent(`крок ${n}_jpg`)}/source.webp`
)
const payment = "https://secure.wayforpay.com/button/"
const offers = [
  {
    name: "STANDARD",
    price: 11,
    note: "Читати й відчувати підтримку",
    link: "bafabfb75b10c",
    features: [
      "Книжка у форматі PDF",
      "Закрита група підтримки",
      "Запитання за матеріалами книжки",
    ],
  },
  {
    name: "PREMIUM",
    price: 31,
    note: "Додати особистий зворотний зв’язок",
    link: "b4a5157e0632f",
    features: [
      "Усе з пакета STANDARD",
      "Одна індивідуальна онлайн-зустріч",
      "Допомога зі створенням або доопрацюванням самопрезентації",
    ],
  },
  {
    name: "VIP",
    price: 51,
    note: "Більше простору для особистої роботи",
    link: "b89264964793d",
    features: [
      "Книжка PDF, група та запитання",
      "Дві індивідуальні зустрічі",
      "Допомога із самопрезентацією",
      "Розбір арттерапевтичної практики",
      "Підтримка зі складними переживаннями під час читання",
    ],
  },
]
const questions = [
  {
    q: "Це паперова чи електронна книжка?",
    a: "Це електронна книжка-практикум українською мовою: 48 сторінок у форматі PDF. Її можна читати на телефоні, планшеті або комп’ютері. Для письмової роботи можна роздрукувати потрібні сторінки.",
  },
  {
    q: "Як я отримаю книжку після оплати?",
    a: "PDF доступний автоматично одразу після успішної оплати через WayForPay. Доставка фізичного примірника не потрібна.",
  },
  {
    q: "Чи потрібен досвід публічних виступів?",
    a: "Ні. Практикум підійде, якщо ви лише починаєте розповідати про свою справу або хочете по-новому сформулювати вже знайому самопрезентацію. Рухайтеся у власному темпі й повертайтеся до вправ за потреби.",
  },
  {
    q: "Чи достатньо самої книжки без підтримки?",
    a: "Так. PDF — самостійний завершений продукт для роботи над самопрезентацією. Група та індивідуальні зустрічі входять лише до відповідних пакетів і є додатковим форматом підтримки.",
  },
  {
    q: "Який пакет обрати?",
    a: "Оберіть PDF за 5 €, якщо хочете працювати самостійно. STANDARD додає групу та можливість ставити запитання. PREMIUM — одну індивідуальну онлайн-зустріч, VIP — дві зустрічі та розбір арттерапевтичної практики. Деталі підтримки можна уточнити в авторки через Instagram.",
  },
]
export function loader({ request }: { request: Request }) {
  return { language: getLanguage(request) }
}
export function meta({ loaderData }: Route.MetaArgs) {
  const en = loaderData?.language === "en"
  return [
    {
      title: en
        ? "A Confident Self-Introduction in 5 Steps — Anna Voronova"
        : "Впевнена самопрезентація за 5 кроків — Анна Воронова",
    },
    {
      name: "description",
      content: en
        ? "Anna Voronova’s 48-page Ukrainian workbook. Create your self-introduction in five steps. PDF for €5 with optional support packages."
        : "48-сторінкова книжка-практикум Анни Воронової. Створіть власну самопрезентацію за 5 кроків. PDF українською за 5 € та додаткові формати підтримки.",
    },
  ]
}
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className={`faq-item ${open ? "is-open" : ""}`}>
      <h3>
        <button
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          {question}
          <Plus size={18} aria-hidden="true" />
        </button>
      </h3>
      <div
        id={id}
        className="faq-answer"
        role="region"
        aria-labelledby={`${id}-button`}
        inert={!open}
      >
        <div>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  )
}
export default function Home() {
  const { language } = useLoaderData<typeof loader>()
  const t = translator(language)
  const [preview, setPreview] = useState<number | null>(null)
  const isPreviewOpen = preview !== null
  const [direction, setDirection] = useState("next")
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const heroTouchStart = useRef<{ x: number; y: number } | null>(null)
  const heroSwiped = useRef(false)
  const mainRef = useRef<HTMLElement>(null)
  const [tabletPage, setTabletPage] = useState(0)
  const [heroPage, setHeroPage] = useState(0)
  const [heroDirection, setHeroDirection] = useState("next")
  const turnPage = (delta: number) => {
    setDirection(delta > 0 ? "next" : "previous")
    setPreview((page) =>
      page === null ? null : (page + delta + previews.length) % previews.length
    )
  }
  const turnHeroPage = (delta: number) => {
    setHeroDirection(delta > 0 ? "next" : "previous")
    setHeroPage((page) => (page + delta + previews.length) % previews.length)
  }
  const openPreview = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setDirection("next")
    setPreview(index)
  }
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const elements = mainRef.current?.querySelectorAll(
      ".section-intro, .situation-grid article, .inside-heading, .preview-card, .author-portrait, .author-copy, .main-offer, .support-heading, .support-offer, .faq-section, .tablet-copy, .tablet-showcase, .closing-band .section-wrap"
    )
    if (!elements || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    const revealAll = () =>
      elements.forEach((element) => element.classList.add("revealed"))
    if (!media.matches)
      elements.forEach((element, index) => {
        // Never hide content already visible on first render.
        if (element.getBoundingClientRect().top >= window.innerHeight) {
          element.classList.add("scroll-reveal")
          if (
            element.matches(
              ".preview-card, .support-offer, .situation-grid article"
            )
          ) {
            ;(element as HTMLElement).style.setProperty(
              "--reveal-delay",
              `${(index % 3) * 65}ms`
            )
          }
          observer.observe(element)
        }
      })
    media.addEventListener("change", revealAll)
    return () => {
      observer.disconnect()
      revealAll()
      media.removeEventListener("change", revealAll)
    }
  }, [language])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (isPreviewOpen) {
      dialog?.showModal()
      const old = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = old
        dialog?.close()
        triggerRef.current?.focus()
      }
    }
  }, [isPreviewOpen])
  return (
    <>
      <a className="skip-link" href="#main">
        {t("Перейти до змісту")}
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#"
          aria-label={t("Анна Воронова — на початок")}
        >
          <BookOpen size={26} strokeWidth={1.5} />
          <span>
            {t("анна воронова")}
            <span className="brand-star" aria-hidden="true">
              ✳
            </span>
          </span>
        </a>
        <nav aria-label={t("Основна навігація")}>
          <a href="#inside">{t("Про книжку")}</a>
          <a href="#author">{t("Про авторку")}</a>
        </nav>
        <div className="header-actions">
          <a className="pill header-cta" href="#buy">
            {t("Отримати книжку")}
            <ArrowRight size={15} />
          </a>
        </div>
      </header>
      <main id="main" ref={mainRef}>
        <section className="hero section-wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span /> {t("КНИЖКА-ПРАКТИКУМ · УКРАЇНСЬКОЮ")}
            </p>
            <h1>
              <span className="hero-line">навколо багато</span>
              <span className="hero-line">облич та голосів.</span>
              <span className="hero-line">
                <span className="underline-mark">почути мають саме тебе.</span>
              </span>
            </h1>
            <p className="hero-description">
              Навколо багато облич та голосів, але почути, запам’ятати й
              обрати мають саме тебе.
            </p>
            <div className="hero-actions">
              <a className="pill" href={`${payment}bde00061852d1`}>
                Отримати PDF
                <ArrowRight size={17} />
              </a>
              <a className="text-link hero-inside-link" href="#inside">
                Зазирнути всередину
                <ArrowDown size={14} />
              </a>
              <span className="hero-value">за 5 євро — цінності на 5 🍋</span>
            </div>
          </div>
          <div className="hero-visual">
            <span className="outline-star" aria-hidden="true">
              ✳
            </span>
            <div className="hero-tablet-scene">
              <div className="hero-tablet-device">
                <span className="hero-tablet-camera" aria-hidden="true" />
                <div className="hero-tablet-screen">
                  <div className="hero-tablet-app-bar">
                    <BookOpen size={14} />
                    <span>ваш практикум</span>
                    <span>PDF</span>
                  </div>
                  <button
                    className="hero-tablet-page"
                    onPointerDown={(e) => {
                      if (e.pointerType === "mouse" && e.button !== 0) return
                      heroSwiped.current = false
                      heroTouchStart.current = {
                        x: e.clientX,
                        y: e.clientY,
                      }
                    }}
                    onPointerUp={(e) => {
                      const start = heroTouchStart.current
                      heroTouchStart.current = null
                      if (!start) return
                      const dx = e.clientX - start.x
                      const dy = e.clientY - start.y
                      if (
                        Math.abs(dx) > 42 &&
                        Math.abs(dx) > Math.abs(dy) * 1.35
                      ) {
                        heroSwiped.current = true
                        turnHeroPage(dx < 0 ? 1 : -1)
                      }
                    }}
                    onPointerCancel={() => {
                      heroTouchStart.current = null
                    }}
                    onClick={(e) => {
                      if (heroSwiped.current) {
                        heroSwiped.current = false
                        e.preventDefault()
                        return
                      }
                      openPreview(heroPage, e.currentTarget)
                    }}
                    aria-label={`Збільшити фрагмент книжки: крок ${heroPage + 1}`}
                  >
                    <img
                      key={heroPage}
                      className={`hero-tablet-page-image hero-page-${heroDirection}`}
                      src={previews[heroPage]}
                      alt={`Сторінка практикуму — крок ${heroPage + 1}`}
                      fetchPriority="high"
                      width="420"
                      height="594"
                    />
                    <span className="hero-tablet-swipe-hint" aria-hidden="true">
                      ↔
                    </span>
                  </button>
                  <div
                    className="hero-tablet-pagination"
                    role="group"
                    aria-label="Оберіть сторінку практикуму"
                  >
                    <button
                      type="button"
                      onClick={() => turnHeroPage(-1)}
                      aria-label="Попередня сторінка"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <div className="hero-tablet-dots">
                      {previews.map((_, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => {
                            setHeroDirection(index > heroPage ? "next" : "previous")
                            setHeroPage(index)
                          }}
                          aria-pressed={heroPage === index}
                          aria-label={`Фрагмент ${index + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => turnHeroPage(1)}
                      aria-label="Наступна сторінка"
                    >
                      <ArrowRight size={14} />
                    </button>
                    <span aria-live="polite">
                      {heroPage + 1} / {previews.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="paper-sticker">
              <span>для тебе, якщо...</span>
              <strong>
                хочеш говорити
                <br />
                впевнено.
              </strong>
              <span className="sticker-heart" aria-hidden="true">
                ♡
              </span>
            </div>
            <span className="handwritten bottom-caption">
              {t("маленькі кроки. важливі зміни.")}
            </span>
          </div>
        </section>
        <div className="facts-strip section-wrap">
          <span>
            <strong>5</strong> {t("кроків до самопрезентації")}
          </span>
          <span>
            <strong>48</strong> {t("сторінок для вашої історії")}
          </span>
          <span>
            <BookOpen size={21} strokeWidth={1.3} />{" "}
            {t("практика у власному темпі")}
          </span>
          <span className="handwritten">{t("почніть із себе ♡")}</span>
        </div>
        <section
          className="for-you section-wrap"
          aria-labelledby="for-you-title"
        >
          <div className="section-intro">
            <span className="handwritten">впізнаєш себе?</span>
            <h2 id="for-you-title">
              ЦЯ КНИГА ДЛЯ ТЕБЕ, <span className="orange-text">ЯКЩО ТИ:</span>
            </h2>
            <p>
              Ти можеш бути на різному етапі, але спільне одне: хочеться
              говорити про себе впевнено, зрозуміло й по-своєму.
            </p>
          </div>
          <div className="situation-grid">
            {[
              {
                n: "01",
                title: "Ти змінила напрям діяльності або почала нову справу",
                text: "Тобі досі незручно розповідати про себе й свої послуги або ти просто не знаєш, як робити це впевнено.",
              },
              {
                n: "02",
                title: "Ти практикуюча експертка",
                text: "Ти знаєш, що маєш досвід і знання, але не завжди можеш передати свою цінність словами так, щоб люди зрозуміли, чому варто обрати саме тебе.",
              },
              {
                n: "03",
                title: "Ти працюєш у кількох напрямках",
                text: "Ти хочеш об’єднати їх у зрозумілу самопрезентацію — без перевантаження зайвою інформацією та з фокусом на потребах своєї аудиторії.",
              },
              {
                n: "04",
                title: "Твої слова не чіпляють аудиторію",
                text: "Тебе слухають, але не запам’ятовують, не рекомендують і не поспішають ставати твоїми клієнтами.",
              },
              {
                n: "05",
                title: "Тобі бракує впевненості",
                text: "Внутрішня критика, страх оцінювання чи хвилювання заважають говорити вільно, проявляти експертність і бути помітною.",
              },
            ].map((item) => (
              <article key={item.n}>
                <span className="situation-number">{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="quiet-note">
            Тобі не потрібно ставати кимось іншим, щоб тебе почули.
          </p>
        </section>
        <section
          className="outcomes-section section-wrap"
          aria-labelledby="outcomes-title"
        >
          <div className="section-intro outcomes-intro">
            <span className="handwritten">крок за кроком</span>
            <h2 id="outcomes-title">
              Книга <span className="orange-text">допоможе тобі:</span>
            </h2>
            <p className="outcomes-lead">
              <strong>Це не просто PDF-книга, яку ти прочитаєш і відкладеш.</strong>
              <br />
              Це покроковий шлях, у якому ти:
            </p>
          </div>
          <div className="outcomes-grid">
            {[
              "наведеш лад у думках",
              "створиш власну самопрезентацію за чіткою структурою з п’яти кроків",
              "отримаєш конкретні формули, які допоможуть говорити про себе зрозуміло, чітко й без розмитих формулювань",
              "зрозумієш, у чому твоя унікальність і чим ти відрізняєшся від інших",
              "донесеш свою цінність так, щоб за перші секунди привернути увагу й залишитися в пам’яті",
            ].map((outcome, index) => (
              <article key={outcome}>
                <span className="outcome-number">0{index + 1}</span>
                <p>{outcome}.</p>
              </article>
            ))}
          </div>
        </section>
        <section id="inside" className="inside-section">
          <div className="section-wrap">
            <div className="inside-heading">
              <div>
                <span className="handwritten">опис книги</span>
                <h2>
                  48 сторінок
                  <br />
                  <span className="orange-text">реальної практики.</span>
                </h2>
              </div>
              <p>
                Книга написана на основі курсу та авторського майстермайнду
                «Впевнена самопрезентація», який пройшли понад 100 учасниць.
                Тому вона максимально практична й побудована на реальних
                кейсах.
              </p>
            </div>
            <div className="book-description-copy">
              <div className="book-page-count">
                <strong>48</strong>
                <span>сторінок</span>
              </div>
              <p className="book-description-lead">
                Книга складається з трьох частин:
              </p>
              <ul className="book-parts">
                <li>
                  <span>01</span>
                  <p>Теорія і практика зі створення самопрезентації.</p>
                </li>
                <li>
                  <span>02</span>
                  <p>
                    Три арттерапевтичні практики, які допоможуть пройти
                    внутрішні страхи й обмеження.
                  </p>
                </li>
                <li>
                  <span>03</span>
                  <p>
                    Живі історії головної героїні, у яких ти точно себе
                    впізнаєш.
                  </p>
                </li>
              </ul>
            </div>
            <div className="book-reader">
              <span className="handwritten">гортай свій практикум ↴</span>
              <div className="tablet-showcase">
                <div className="tablet-device">
                  <span className="tablet-camera" aria-hidden="true" />
                  <div className="tablet-screen">
                    <div className="tablet-app-bar">
                      <BookOpen size={14} />
                      <span>ваш практикум</span>
                      <span>PDF</span>
                    </div>
                    <button
                      className="tablet-page"
                      onClick={(e) => openPreview(tabletPage, e.currentTarget)}
                      aria-label={`Збільшити фрагмент книжки: крок ${tabletPage + 1}`}
                    >
                      <img
                        key={tabletPage}
                        className="tablet-page-image"
                        src={previews[tabletPage]}
                        alt={`Сторінка практикуму — крок ${tabletPage + 1}`}
                        loading="lazy"
                        width="420"
                        height="594"
                      />
                      <span className="tablet-zoom">
                        <Plus size={15} />
                      </span>
                    </button>
                    <div
                      className="tablet-pagination"
                      role="group"
                      aria-label="Оберіть сторінку практикуму"
                    >
                      {previews.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setTabletPage(index)}
                          aria-pressed={tabletPage === index}
                          aria-label={`Фрагмент ${index + 1}`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </button>
                      ))}
                      <span aria-live="polite">{tabletPage + 1} / 3</span>
                    </div>
                  </div>
                </div>
                <span className="handwritten tablet-footnote">
                  торкнися цифри. перегорни далі.
                </span>
              </div>
            </div>
            <div className="preview-grid">
              {previews.map((src, index) => (
                <button
                  key={src}
                  className="preview-card"
                  aria-label={`${t("Збільшити фрагмент книжки: крок")} ${index + 1}`}
                  onClick={(e) => {
                    openPreview(index, e.currentTarget)
                  }}
                >
                  <div className="preview-image">
                    <img
                      src={src}
                      alt={`${t("Сторінка практикуму — крок")} ${index + 1}`}
                      loading="lazy"
                      width="420"
                      height="594"
                    />
                    <span className="expand-icon">
                      <Plus size={18} />
                    </span>
                  </div>
                  <span>
                    {t("Фрагмент")} {String(index + 1).padStart(2, "0")}{" "}
                    <ArrowRight size={15} />
                  </span>
                </button>
              ))}
            </div>
            <div className="inside-bottom">
              <span className="handwritten">
                гортай свій практикум ↗
              </span>
              <p>
                Погортай фрагменти, щоб побачити, як виглядає робота
                всередині.
              </p>
            </div>
          </div>
        </section>
        <section className="tablet-section" aria-labelledby="tablet-title">
          <div className="tablet-dot-field" aria-hidden="true" />
          <div className="section-wrap tablet-layout">
            <div className="tablet-copy">
              <span className="handwritten">бути поруч — більше, ніж продати</span>
              <h2 id="tablet-title">
                Книга є завершеним
                <br />
                <span className="orange-text">продуктом.</span>
              </h2>
              <p>
                Але я хочу створити формат «бути поруч», а не просто продати
                книгу.
                <br />
                Ти можеш придбати книгу, а разом із нею — мою підтримку.
              </p>
              <span className="tablet-format">
                <Check size={15} />
                Обери формат, який тобі найкраще підійде.
              </span>
              <a className="pill" href="#buy">
                Обрати свій формат
                <ArrowRight size={17} />
              </a>
            </div>
            <div className="tablet-showcase">
              <span className="handwritten tablet-annotation">
                {language === "en"
                  ? "a peek at your next chapter ↴"
                  : "зазирніть у свій наступний крок ↴"}
              </span>
              <span className="tablet-spark" aria-hidden="true">
                ✳
              </span>
              <div className="tablet-device">
                <span className="tablet-camera" aria-hidden="true" />
                <div className="tablet-screen">
                  <div className="tablet-app-bar">
                    <BookOpen size={14} />
                    <span>
                      {language === "en" ? "your workbook" : "ваш практикум"}
                    </span>
                    <span>PDF</span>
                  </div>
                  <button
                    className="tablet-page"
                    onClick={(e) => openPreview(tabletPage, e.currentTarget)}
                    aria-label={`${t("Збільшити фрагмент книжки: крок")} ${tabletPage + 1}`}
                  >
                    <img
                      key={tabletPage}
                      className="tablet-page-image"
                      src={previews[tabletPage]}
                      alt={`${t("Сторінка практикуму — крок")} ${tabletPage + 1}`}
                      loading="lazy"
                      width="420"
                      height="594"
                    />
                    <span className="tablet-zoom">
                      <Plus size={15} />
                    </span>
                  </button>
                  <div
                    className="tablet-pagination"
                    role="group"
                    aria-label={
                      language === "en"
                        ? "Choose a sample page"
                        : "Оберіть сторінку практикуму"
                    }
                  >
                    {previews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setTabletPage(index)}
                        aria-pressed={tabletPage === index}
                        aria-label={`${t("Фрагмент")} ${index + 1}`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </button>
                    ))}
                    <span aria-live="polite">{tabletPage + 1} / 3</span>
                  </div>
                </div>
              </div>
              <span className="handwritten tablet-footnote">
                {language === "en"
                  ? "tap a number. turn a page."
                  : "торкніться цифри. гортайте далі."}
              </span>
            </div>
          </div>
        </section>
        <section id="author" className="author-section section-wrap">
          <div className="author-portrait">
            <img
              src={portrait}
              alt={t("Анна Воронова, авторка книжки-практикуму")}
              loading="lazy"
              width="480"
              height="560"
            />
            <span className="portrait-label handwritten">
              {t("будемо знайомі, Анна ♡")}
            </span>
          </div>
          <div className="author-copy">
            <span className="eyebrow">{t("АВТОРКА ПРАКТИКУМУ")}</span>
            <h2>
              {t("поруч із вами —")}
              <br />
              {t("Анна Воронова")}
              <span className="orange-text">.</span>
            </h2>
            <p>
              {t(
                "Підприємниця, арткоуч і терапевтка. Представниця Business Woman у Португалії та експертка зі створення впевненої самопрезентації."
              )}
            </p>
            <p>
              {t(
                "Ця книжка виросла з авторського курсу та роботи з жінками, які вчаться говорити про себе й проявлятися у своїй справі. Тут є простір для практики, власного темпу та чесного знайомства із собою."
              )}
            </p>
            <div className="author-stats">
              <div>
                <strong>30+</strong>
                <span>
                  {t("майстермайндів")}
                  <br />
                  {t("із самопрезентації")}
                </span>
              </div>
              <div>
                <strong>100+</strong>
                <span>
                  {t("жінок в індивідуальній")}
                  <br />
                  {t("роботі з авторкою")}
                </span>
              </div>
            </div>
            <a
              className="text-link"
              href="https://www.instagram.com/anna_voronova_star/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Camera size={16} /> {t("Познайомитися в Instagram")}{" "}
              <ArrowRight size={15} />
            </a>
          </div>
        </section>
        <section id="buy" className="purchase-section section-wrap">
          <div className="section-intro">
            <span className="handwritten">
              обери свій формат
            </span>
            <h2>
              Обери свій формат підтримки
              <span className="orange-text">.</span>
            </h2>
            <p>
              Книга є завершеним продуктом. Ти можеш придбати її самостійно
              або разом із моєю підтримкою.
              <br />
              Обери формат, який тобі найкраще підійде.
            </p>
          </div>
          <div className="main-offer">
            <div className="offer-icon">
              <BookOpen size={39} strokeWidth={1} />
              <span className="handwritten">{t("для роботи із собою")}</span>
            </div>
            <div className="main-offer-copy">
              <span className="eyebrow">{t("КНИЖКА-ПРАКТИКУМ · PDF")}</span>
              <h3>
                {t("ваша самопрезентація")}
                <br />
                {t("починається тут.")}
              </h3>
              <p>
                П’ять кроків, практичні завдання та арттерапевтичні вправи.
              </p>
              <span className="small-check">
                <Check size={15} /> {t("Для самостійної роботи")}
              </span>
            </div>
            <div className="main-offer-action">
              <span className="price">
                5 <small>€</small>
              </span>
              <span className="one-payment">{t("одноразова оплата")}</span>
              <a className="pill" href={`${payment}bde00061852d1`}>
                {t("Купити PDF")}
                <ArrowRight size={17} />
              </a>
              <span className="payment-note">
                {t("Доступ одразу після оплати")}
              </span>
            </div>
          </div>
          <div className="support-heading">
            <h3>{t("хочеться пройти цей шлях разом?")}</h3>
            <span className="handwritten">{t("оберіть свою підтримку ↴")}</span>
          </div>
          <div className="offer-grid">
            {offers.map((offer) => (
              <article className="support-offer" key={offer.name}>
                <span className="eyebrow">{offer.name}</span>
                <span className="support-price">
                  {offer.price} <small>€</small>
                </span>
                <p className="offer-note">{t(offer.note)}</p>
                <ul>
                  {offer.features.map((feature) => (
                    <li key={t(feature)}>
                      <Check size={14} />
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>
                <a className="pill" href={`${payment}${offer.link}`}>
                  <span>{`${t("Обрати")} ${offer.name}`}</span>{" "}
                  <ArrowRight size={15} />
                </a>
              </article>
            ))}
          </div>
          <p className="checkout-note">
            {t(
              "Усі пакети оплачуються через WayForPay. PDF входить до кожного пакета."
            )}
          </p>
        </section>
        <section
          className="faq-section section-wrap"
          aria-labelledby="faq-title"
        >
          <div>
            <span className="handwritten">{t("ще кілька відповідей")}</span>
            <h2 id="faq-title">
              {t("перед першим")}
              <br />
              {t("кроком")}
              <span className="orange-text">.</span>
            </h2>
            <p>
              {t("Залишилися запитання?")}
              <br />
              <a
                href="https://www.instagram.com/anna_voronova_star/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Напишіть Анні в Instagram ↗")}
              </a>
            </p>
          </div>
          <div className="faq-list">
            {questions.map((item) => (
              <FaqItem key={item.q} question={t(item.q)} answer={t(item.a)} />
            ))}
          </div>
        </section>
        <section className="closing-band">
          <div className="section-wrap">
            <span className="handwritten">{t("вам є що сказати.")}</span>
            <h2>{t("нехай вас почують.")}</h2>
            <a className="pill" href={`${payment}bde00061852d1`}>
              {t("Почати з книжки за 5 €")}
              <ArrowRight size={17} />
            </a>
            <span className="closing-note">
              {t("своїми словами. у своєму темпі.")}
            </span>
          </div>
        </section>
      </main>
      <footer className="site-footer section-wrap">
        <a className="brand" href="#">
          {t("анна воронова")}
          <span className="brand-star" aria-hidden="true">
            ✳
          </span>
        </a>
        <p>{t("книжка-практикум для вашої впевненості")}</p>
        <div>
          <a
            href="https://www.instagram.com/anna_voronova_star/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram ↗
          </a>
          <a
            href="https://t.me/businesswomanportugal"
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram ↗
          </a>
        </div>
      </footer>
      <dialog
        ref={dialogRef}
        className="preview-dialog"
        onCancel={(e) => {
          e.preventDefault()
          setPreview(null)
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setPreview(null)
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault()
            turnPage(1)
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault()
            turnPage(-1)
          }
        }}
        aria-label={
          preview !== null
            ? `${t("Фрагмент книжки — крок")} ${preview + 1}`
            : t("Фрагмент книжки")
        }
      >
        <button
          className="dialog-close"
          onClick={() => setPreview(null)}
          aria-label={t("Закрити фрагмент")}
          autoFocus
        >
          <X size={22} />
        </button>
        {preview !== null && (
          <div className="gallery-content">
            <div
              className="gallery-page"
              onTouchStart={(e) => {
                touchStart.current = {
                  x: e.changedTouches[0].clientX,
                  y: e.changedTouches[0].clientY,
                }
              }}
              onTouchEnd={(e) => {
                const start = touchStart.current
                touchStart.current = null
                if (!start) return
                const dx = e.changedTouches[0].clientX - start.x
                const dy = e.changedTouches[0].clientY - start.y
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
                  turnPage(dx < 0 ? 1 : -1)
              }}
            >
              <img
                key={preview}
                className={`gallery-image page-${direction}`}
                src={previews[preview]}
                alt={`${t("Збільшена сторінка практикуму — крок")} ${preview + 1}`}
              />
            </div>
            <div className="gallery-controls">
              <button
                onClick={() => turnPage(-1)}
                aria-label={
                  language === "en" ? "Previous preview" : "Попередній фрагмент"
                }
              >
                <ArrowLeft size={20} />
              </button>
              <span role="status" aria-live="polite" aria-atomic="true">
                {t("Фрагмент")} {preview + 1} / {previews.length}
              </span>
              <button
                onClick={() => turnPage(1)}
                aria-label={
                  language === "en" ? "Next preview" : "Наступний фрагмент"
                }
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
