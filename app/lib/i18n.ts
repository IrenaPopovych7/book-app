export type Language = "uk" | "en"
export function getLanguage(request: Request): Language {
  // English is temporarily disabled while the Ukrainian workbook experience is
  // being refined. Keep the query parameter harmless and always render Ukrainian.
  void request
  return "uk"
}
const english: Record<string, string> = {
  "Перейти до змісту": "Skip to content",
  "Анна Воронова — на початок": "Anna Voronova — home",
  "анна воронова": "anna voronova",
  "Основна навігація": "Main navigation",
  "Про книжку": "The workbook",
  "Про авторку": "The author",
  "Отримати книжку": "Get the workbook",
  "КНИЖКА-ПРАКТИКУМ · УКРАЇНСЬКОЮ": "A PRACTICAL WORKBOOK · IN UKRAINIAN",
  "ваша історія.": "your story.",
  "ваш голос.": "your voice.",
  "ваша впевненість.": "your confidence.",
  "Розкажіть про себе та свою справу так, щоб вас почули. Створіть власну самопрезентацію за 5 кроків — без чужих сценаріїв, своїми словами.":
    "Introduce yourself and your work in a way that connects. Build your own self-introduction in five steps — in your words, without someone else’s script.",
  "Отримати PDF за 5 €": "Get the PDF for €5",
  "Зазирнути всередину": "Take a look inside",
  "48 сторінок · PDF одразу після оплати":
    "48 pages · PDF available after payment",
  "знайомство з собою ↴": "a little closer to yourself ↴",
  "Обкладинка книжки Анни Воронової «Як створити впевнену самопрезентацію за 5 кроків»":
    "Cover of Anna Voronova’s Ukrainian workbook, How to Create a Confident Self-Introduction in 5 Steps",
  "для кого?": "who is it for?",
  "для вас.": "for you.",
  "справжньої.": "the real you.",
  "маленькі кроки. важливі зміни.": "small steps. meaningful changes.",
  "кроків до самопрезентації": "steps to your self-introduction",
  "сторінок для вашої історії": "pages for your story",
  "практика у власному темпі": "practice at your own pace",
  "почніть із себе ♡": "start with yourself ♡",
  "знайомо, правда?": "sounds familiar?",
  "про свою справу — багато.": "you know your work.",
  "про себе —": "but introducing yourself?",
  "ніби вперше.": "a different story.",
  "Ви знаєте, що робите і чим можете допомогти. Та коли звучить «розкажіть про себе», слова раптом губляться.":
    "You know what you do and how you can help. Yet when someone says “tell me about yourself,” the words suddenly disappear.",
  "На знайомстві": "Meeting someone new",
  "Хочеться розповісти про себе впевнено, а виходить коротке «ну, я займаюся…».":
    "You want to introduce yourself with confidence, but all that comes out is “well, I sort of do…”.",
  "У розмові з клієнтом": "Talking to a client",
  "Складно пояснити цінність своєї роботи просто, чітко й без відчуття, що ви себе вихваляєте.":
    "It’s hard to explain the value of your work clearly and simply without feeling like you’re showing off.",
  "На новому етапі": "Starting a new chapter",
  "Ваша справа змінилася. Хочеться знайти слова, які відображають вас сьогодні.":
    "Your work has changed. You want to find words that reflect who you are today.",
  "Не потрібно ставати кимось іншим, щоб бути почутою.":
    "You don’t have to become someone else to be heard.",
  "не просто прочитати — спробувати": "more than reading — a little doing",
  "місце для ваших": "a little space for",
  "слів і відкриттів": "your words and discoveries",
  "«Як створити впевнену самопрезентацію за 5 кроків» — практикум із покроковою роботою, запитаннями до себе й арттерапевтичними вправами.":
    "How to Create a Confident Self-Introduction in 5 Steps is a Ukrainian-language workbook with guided practice, self-reflection prompts, and art-therapy exercises.",
  Фрагмент: "Preview",
  "Збільшити фрагмент книжки: крок": "Enlarge workbook preview: step",
  "Сторінка практикуму — крок": "Workbook page — step",
  "Фрагмент книжки — крок": "Workbook preview — step",
  "Фрагмент книжки": "Workbook preview",
  "Збільшена сторінка практикуму — крок": "Enlarged workbook page — step",
  "погортайте, перш ніж обрати ↗": "have a look before you choose ↗",
  "Працюйте із текстом самопрезентації, досліджуйте внутрішні бар’єри та знаходьте опору у власному досвіді.":
    "Work on your self-introduction, explore what holds you back, and draw on the strength of your own experience.",
  "Анна Воронова, авторка книжки-практикуму":
    "Anna Voronova, author of the workbook",
  "будемо знайомі, Анна ♡": "hello, I’m Anna ♡",
  "АВТОРКА ПРАКТИКУМУ": "MEET THE AUTHOR",
  "поруч із вами —": "here beside you —",
  "Анна Воронова": "Anna Voronova",
  "Підприємниця, арткоуч і терапевтка. Представниця Business Woman у Португалії та експертка зі створення впевненої самопрезентації.":
    "Entrepreneur, art coach, and therapist. Business Woman representative in Portugal and a specialist in confident self-introductions.",
  "Ця книжка виросла з авторського курсу та роботи з жінками, які вчаться говорити про себе й проявлятися у своїй справі. Тут є простір для практики, власного темпу та чесного знайомства із собою.":
    "This workbook grew out of Anna’s course and her work with women learning to talk about themselves and show up in their businesses. It offers space to practise at your own pace and get to know yourself honestly.",
  майстермайндів: "mastermind sessions",
  "із самопрезентації": "on self-introductions",
  "жінок в індивідуальній": "women supported",
  "роботі з авторкою": "in individual work",
  "Познайомитися в Instagram": "Meet Anna on Instagram",
  "ваш наступний маленький крок": "your next small step",
  "почніть свою історію": "start your story",
  "Книжка — завершений практикум для самостійної роботи.":
    "The workbook is a complete resource for independent practice.",
  "А якщо хочеться підтримки, можна обрати її додатково.":
    "If you’d like some support, you can add it along the way.",
  "для роботи із собою": "a little time for yourself",
  "КНИЖКА-ПРАКТИКУМ · PDF": "PRACTICAL WORKBOOK · PDF",
  "ваша самопрезентація": "your self-introduction",
  "починається тут.": "starts here.",
  "48 сторінок українською. П’ять кроків, практичні завдання та арттерапевтичні вправи.":
    "48 pages in Ukrainian. Five steps, practical activities, and art-therapy exercises.",
  "Для самостійної роботи": "For independent practice",
  "одноразова оплата": "one-time payment",
  "Купити PDF": "Buy the PDF",
  "Доступ одразу після оплати": "Available immediately after payment",
  "хочеться пройти цей шлях разом?": "would you like some company?",
  "оберіть свою підтримку ↴": "find your kind of support ↴",
  Обрати: "Choose",
  "Усі пакети оплачуються через WayForPay. PDF входить до кожного пакета.":
    "All packages are paid through WayForPay. Every package includes the Ukrainian PDF.",
  "Читати й відчувати підтримку": "Read with a little support",
  "Додати особистий зворотний зв’язок": "Add personal feedback",
  "Більше простору для особистої роботи": "More space for personal exploration",
  "Книжка у форматі PDF": "Ukrainian PDF workbook",
  "Закрита група підтримки": "Private support group",
  "Запитання за матеріалами книжки": "Ask questions about the workbook",
  "Усе з пакета STANDARD": "Everything in STANDARD",
  "Одна індивідуальна онлайн-зустріч": "One individual online session",
  "Допомога зі створенням або доопрацюванням самопрезентації":
    "Help creating or refining your self-introduction",
  "Книжка PDF, група та запитання":
    "Ukrainian PDF, group access, and questions",
  "Дві індивідуальні зустрічі": "Two individual sessions",
  "Допомога із самопрезентацією": "Help with your self-introduction",
  "Розбір арттерапевтичної практики": "Review of an art-therapy exercise",
  "Підтримка зі складними переживаннями під час читання":
    "Support with difficult feelings that arise while reading",
  "ще кілька відповідей": "a few more answers",
  "перед першим": "before your",
  кроком: "first step",
  "Залишилися запитання?": "Still have questions?",
  "Напишіть Анні в Instagram ↗": "Message Anna on Instagram ↗",
  "Це паперова чи електронна книжка?":
    "Is this a printed book or a digital workbook?",
  "Це електронна книжка-практикум українською мовою: 48 сторінок у форматі PDF. Її можна читати на телефоні, планшеті або комп’ютері. Для письмової роботи можна роздрукувати потрібні сторінки.":
    "This is a 48-page digital workbook in Ukrainian, provided as a PDF. Read it on your phone, tablet, or computer, or print the pages you’d like to write on. The English website does not include an English edition of the workbook.",
  "Як я отримаю книжку після оплати?": "How will I receive the workbook?",
  "PDF доступний автоматично одразу після успішної оплати через WayForPay. Доставка фізичного примірника не потрібна.":
    "The PDF is available automatically after successful payment through WayForPay. There is no physical book to ship.",
  "Чи потрібен досвід публічних виступів?":
    "Do I need public-speaking experience?",
  "Ні. Практикум підійде, якщо ви лише починаєте розповідати про свою справу або хочете по-новому сформулювати вже знайому самопрезентацію. Рухайтеся у власному темпі й повертайтеся до вправ за потреби.":
    "No. Use the workbook whether you’re introducing your work for the first time or refreshing an introduction you already use. Move at your own pace and revisit the exercises whenever you need to.",
  "Чи достатньо самої книжки без підтримки?":
    "Can I use the workbook without extra support?",
  "Так. PDF — самостійний завершений продукт для роботи над самопрезентацією. Група та індивідуальні зустрічі входять лише до відповідних пакетів і є додатковим форматом підтримки.":
    "Yes. The PDF is a complete, standalone resource for working on your self-introduction. Group access and individual sessions are optional and included only in the relevant packages.",
  "Який пакет обрати?": "Which package should I choose?",
  "Оберіть PDF за 5 €, якщо хочете працювати самостійно. STANDARD додає групу та можливість ставити запитання. PREMIUM — одну індивідуальну онлайн-зустріч, VIP — дві зустрічі та розбір арттерапевтичної практики. Деталі підтримки можна уточнити в авторки через Instagram.":
    "Choose the €5 PDF to work independently. STANDARD adds group access and questions. PREMIUM includes one individual online session; VIP includes two sessions and a review of an art-therapy exercise. Contact Anna on Instagram to confirm support details and available session languages before purchasing.",
  "вам є що сказати.": "you have something to say.",
  "нехай вас почують.": "let your voice be heard.",
  "Почати з книжки за 5 €": "Start with the workbook for €5",
  "своїми словами. у своєму темпі.": "your words. your own pace.",
  "книжка-практикум для вашої впевненості":
    "a practical workbook for your confidence",
  "Закрити фрагмент": "Close preview",
}
export function translator(language: Language) {
  return (text: string) => (language === "en" ? (english[text] ?? text) : text)
}
