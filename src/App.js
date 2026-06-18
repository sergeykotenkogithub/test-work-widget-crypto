import React, { useState } from 'react';
import './App.css';

// Content data for each question
const contentData = {
  1: {
    title: "Какие основные риски и компромиссы вы видите? Что бы вы уточнили у постановщика задачи до начала проектирования?",
    sections: [
      {
        type: "paragraph",
        content: "Ключевая сложность не в UI-сложности, а в согласованности состояния в условиях нестабильных данных: курс меняется, лимиты зависят от пары, комиссия динамическая."
      },
      {
        type: "paragraph",
        content: "Пользователь вводит сумму, параллельно обновляется курс — итоговая сумма меняется «под рукой». Если пользователь уже прочитал значение и нажимает «Обменять», данные могут быть устаревшими. Это и UX-проблема, и потенциальная бизнес-проблема."
      },
      {
        type: "paragraph",
        content: "Пока пользователь думает на экране подтверждения, курс продолжает обновляться. Нужно решить: замораживаем курс на время сессии подтверждения или показываем live-данные с предупреждением?"
      },
      {
        type: "paragraph",
        content: "Криптовалюты имеют разное количество знаков после запятой (BTC — 8, ETH — 18 в wei, стейбл коины — 2–6). Арифметика на float приведёт к ошибкам округления, нужна работа с BigInt или специализированными библиотеками (decimal.js, bignumber.js)."
      },
      {
        type: "paragraph",
        content: "Слишком частые запросы — нагрузка на сервер и мигающий UI. Слишком редкие — пользователь видит неактуальные данные."
      },
      {
        type: "paragraph",
        content: "Комиссия сервиса. Должна быть прозрачной для пользователя (показывать до подтверждения)."
      },
      {
        type: "paragraph",
        content: "Нулевые суммы, отрицательные значения, превышение лимитов, смена пары во время загрузки курса."
      },
      {
        type: "heading",
        level: 3,
        content: "Что бы вы уточнили у постановщика задачи до начала проектирования?"
      },
      {
        type: "paragraph",
        content: "Как именно происходит обмен на бэкенде — по курсу, зафиксированному в момент нажатия «Обменять», или по рыночному на момент исполнения? Это определяет, нужен ли механизм «заморозки» курса (quote/lock)."
      },
      {
        type: "paragraph",
        content: "Есть ли авторизация? Виджет встроен в авторизованную зону или доступен анонимно?"
      },
      {
        type: "paragraph",
        content: "Каков бизнес-критичный сценарий: обмен «отдаю X» или «хочу получить Y»? Нужно ли поле ввода с обеих сторон?"
      },
      {
        type: "paragraph",
        content: "Какой N в «обновляется раз в N секунд» — это конфигурируемый параметр или константа?"
      }
    ]
  },
  2: {
    title: "Разбейте задачу на этапы. Укажите порядок, в котором вы бы реализовывали функциональность. Обоснуйте приоритеты.",
    sections: [
      {
        type: "paragraph",
        content: "Договориться об API-контрактах, написать моки. Это позволяет фронтенду работать независимо от готовности бэкенда."
      },
      {
        type: "paragraph",
        content: "Список валют → выбор пары → статичный курс → ввод суммы → итоговое значение → кнопка «Обменять»."
      },
      {
        type: "paragraph",
        content: "Подключить polling или WebSocket, реализовать обновление итоговой суммы, индикацию обновления."
      },
      {
        type: "paragraph",
        content: "Валидация и лимиты"
      },
      {
        type: "paragraph",
        content: "Экран подтверждения и результата. Полный флоу с обработкой ошибок на каждом шаге."
      },
      {
        type: "paragraph",
        content: "Оптимизация (debounce на ввод суммы, кеширование курса)."
      },
      {
        type: "paragraph",
        content: "UX-полировка"
      },
      {
        type: "paragraph",
        content: "A11y. Анимации, skeleton-загрузка, мобильная адаптация, клавиатурная навигация"
      },
      {
        type: "paragraph",
        content: "Тесты"
      },
      {
        type: "heading",
        level: 3,
        content: "Приоритет такой потому, что этапы 2–3 дают наибольшую бизнес-ценность при наименьшей неопределённости. Этапы 4–5 требуют финального контракта с бэкендом, поэтому идут позже."
      },
      {
        type: "paragraph",
        content: "Кратко: Важно договориться с бэком, разобраться с api, подготовить нужные данные, реализовать корректное обновление, отработать ошибки и закончить полировкой, основной аспект на бизнес ценностях."
      }
    ]
  },
  3: {
    title: "Архитектура и стейт-менеджмент.",
    sections: [
      {
        type: "heading",
        level: 3,
        content: "Какие компоненты вы бы выделили?"
      },
      {
        type: "paragraph",
        content: "ExchangeWidget (корень)"
      },
      {
        type: "paragraph",
        content: "I── CurrencySelector (Выбор валют с поиском, иконкой, балансом )"
      },
      {
        type: "paragraph",
        content: "│   │   ├── FromCurrency"
      },
      {
        type: "paragraph",
        content: "│   │   └── ToCurrency"
      },
      {
        type: "paragraph",
        content: "├── AmountInput (инпут с форматированием, маской, валидацией)"
      },
      {
        type: "paragraph",
        content: "├── RateDisplay (текущий курс, время последнего обновления, индикатор staleness)"
      },
      {
        type: "paragraph",
        content: "├── SwapButton (иконка ⇄, доступна всегда кроме загрузки)"
      },
      {
        type: "paragraph",
        content: "├── ExchangeSummary (итого, комиссия, вы получите)"
      },
      {
        type: "paragraph",
        content: "├── ExchangeButton (кнопка «Обменять», блокируется при невалидном состоянии)"
      },
      {
        type: "paragraph",
        content: "├── ConfirmationScreen (модал или новый экран)"
      },
      {
        type: "paragraph",
        content: "└── ResultScreen (успех/ошибка)"
      },
      {
        type: "heading",
        level: 3,
        content: "UI-примитивы (Search + Select, Input, Button, Skeleton, Toast) — переиспользуемые, без бизнес-логики."
      },
      {
        type: "heading",
        level: 3,
        content: "Как бы организовали хранение и передачу состояния?"
      },
      {
        type: "paragraph",
        content: "Для виджета такого масштаба я бы выбрал локальный стейт + React Context (или Zustand, если виджет часть крупного приложения с общим стором). Избегал бы Redux — избыточен для изолированного виджета."
      },
      {
        type: "paragraph",
        content: "Стейт сессии обмена (Откуда, куда, какое поле является главным)"
      },
      {
        type: "paragraph",
        content: "Стейт рыночных данных (То, что приходит с сервера )"
      },
      {
        type: "paragraph",
        content: "UI (разные состояния, ошибок, успеха итд, может для уведомлений также понадобиться)"
      },
      {
        type: "paragraph",
        content: "Деривативные значения (итоговая сумма, сообщения валидации, доступность кнопки) — вычисляются через useMemo/селекторы, не хранятся в стейте."
      },
      {
        type: "heading",
        level: 3,
        content: "Какую структуру файлов/модулей предложите?"
      },
      {
        type: "pre",
        content: "src/\n      components/\nwidgets/\n                CurrencySelector/\n           FromCurrency/\n           ToCurrency/\n                AmountInput/\n                RateDisplay/\n                ConfirmationScreen/\n               ResultScreen/\nshared/\n        Input/\n        Skeleton/\n    Button/\n    SearchSelect (используется в FromCurrency и  ToCurrency)\n    Modal/\n    Toast/    \n      hooks/\n        useExchangeRate.ts     # polling / WS подписка\n        useExchangeSession.ts  # логика сессии, swap, вычисление итогов\n        useExchangeSubmit.ts   # submit flow, статусы\n      store/\n        exchangeSlice.ts       # или context\n      api/\n        exchangeApi.ts         # типизированные вызовы\n        exchangeApi.mock.ts    # моки для разработки\n      utils/\n        currencyMath.ts        # арифметика с Decimal\n        formatters.ts          # форматирование сумм, курсов\n      types/\n        exchange.types.ts"
      },
      {
        type: "heading",
        level: 3,
        content: "Валидация входящих значений"
      },
      {
        type: "heading",
        content: "Валидацию делю на два уровня:"
      },
      {
        type: "paragraph",
        content: "Уровень ввода (мгновенная): запрет нечисловых символов, ограничение знаков после запятой в зависимости от выбранной валюты, обрезка ведущих нулей."
      },
      {
        type: "paragraph",
        content: "Уровень бизнес-логики (debounced, ~300ms): проверка на min/max по лимитам пары, проверка баланса (если есть), проверка что сумма > 0. Сообщения об ошибках показываются не сразу при вводе, а после blur или с задержкой — чтобы не раздражать пользователя в процессе набора."
      }
    ]
  },
  4: {
    title: "Взаимодействие с бэкэндом",
    sections: [
      {
        type: "heading",
        level: 3,
        content: "Эндпоинты"
      },
      {
        type: "paragraph",
        content: "GET /v1/currencies"
      },
      {
        type: "paragraph",
        content: "Список доступных валют. Запрашивается один раз при инициализации, кешируется."
      },
      {
        type: "paragraph",
        content: "GET /v1/pairs/{from}/{to}/rate"
      },
      {
        type: "paragraph",
        content: "Текущий курс и условия для конкретной пары. Опрашивается с интервалом (polling) или через WS."
      },
      {
        type: "paragraph",
        content: "POST /v1/exchange/quote"
      },
      {
        type: "paragraph",
        content: "Получить «заморозку» курса перед подтверждением. Вызывается при нажатии «Обменять» (до экрана подтверждения)."
      },
      {
        type: "paragraph",
        content: "POST /v1/exchange/execute"
      },
      {
        type: "paragraph",
        content: "Исполнить обмен по зафиксированному quoteId."
      },
      {
        type: "heading",
        level: 3,
        content: "Договорённости с бэкендом:"
      },
      {
        type: "paragraph",
        content: "Единый формат ошибок с машиночитаемым code (QUOTE_EXPIRED, INSUFFICIENT_BALANCE, PAIR_UNAVAILABLE, AMOUNT_BELOW_MIN, AMOUNT_ABOVE_MAX). Фронтенд маппит коды на локализованные сообщения."
      },
      {
        type: "paragraph",
        content: "Все числа — строки, не float. Это обязательное условие для криптовалютной арифметики."
      },
      {
        type: "paragraph",
        content: "expiresAt в ответе курса — фронтенд отображает таймер и превентивно обновляет курс заранее, не дожидаясь истечения."
      },
      {
        type: "paragraph",
        content: "Договориться о WebSocket-канале как альтернативе polling для rate-обновлений (эффективнее по трафику). Если WS недоступен — fallback на polling."
      },
      {
        type: "paragraph",
        content: "Уточнить идемпотентность /exchange/execute — можно ли безопасно повторить запрос при сетевой ошибке (нужен idempotencyKey в запросе)."
      },
      {
        type: "paragraph",
        content: "Использовать ETag или Last-Modified для кеширования курсов."
      }
    ]
  },
  5: {
    title: "UX и состояния интерфейса:",
    sections: [
      {
        type: "heading",
        level: 3,
        content: "Как виджет должен вести себя во время загрузки данных (курс, лимиты)?"
      },
      {
        type: "paragraph",
        content: "При первичной загрузке (список валют) — skeleton-заглушки вместо селектов, виджет не интерактивен. Нет смысла показывать пустые дропдауны."
      },
      {
        type: "paragraph",
        content: "При обновлении курса — не блокировать ввод. Показывать тонкий индикатор (пульсирующая точка рядом с курсом, или subtle shimmer на поле результата). Пересчёт итоговой суммы происходит автоматически."
      },
      {
        type: "paragraph",
        content: "При нажатии “Обменять” (запрос quote) — кнопка переходит в состояние loading, остальной UI доступен для чтения"
      },
      {
        type: "paragraph",
        content: "Если курс «протух» (не обновлялся дольше expiresAt) — показывать предупреждение “Курс устарел, обновляем…” и блокировать кнопку до получения свежего курса."
      },
      {
        type: "heading",
        level: 3,
        content: "Как отображать ошибки (сетевые, валидационные, бизнес-логика)?"
      },
      {
        type: "paragraph",
        content: "Ошибка валидации поля (сумма < min)Inline под полем ввода, красный текст."
      },
      {
        type: "paragraph",
        content: "Пара недоступна Banner внутри виджета, не модал."
      },
      {
        type: "paragraph",
        content: "Сетевая ошибка при получении курса Non-blocking toast + retry-кнопка. Ошибка исполнения обмена."
      },
      {
        type: "paragraph",
        content: "Экран результата с объяснением и CTAQuote expiredInline в экране подтверждения + авто-обновление."
      },
      {
        type: "paragraph",
        content: "Важно: Ошибки никогда не “застревают” без способа выхода — всегда есть кнопка retry или возврата."
      },
      {
        type: "heading",
        level: 3,
        content: "Как обеспечить отзывчивость на мобильных устройствах?"
      },
      {
        type: "heading",
        level: 4,
        content: "Мобильная адаптация"
      },
      {
        type: "paragraph",
        content: "Виджет должен корректно работать в ширине от 320px."
      },
      {
        type: "paragraph",
        content: "На мобильных числовая клавиатура вместо стандартной (inputmode=\"decimal\")."
      },
      {
        type: "paragraph",
        content: "Экран подтверждения — fullscreen на мобильных, модал на десктопе."
      },
      {
        type: "paragraph",
        content: "Кнопка swap — достаточно большая touch-зона (минимум 44×44px по гайдлайнам Apple/Google)."
      },
      {
        type: "paragraph",
        content: "Не использовать hover-состояния как единственный способ донести информацию."
      },
      {
        type: "heading",
        level: 4,
        content: "Доступность (a11y)"
      },
      {
        type: "paragraph",
        content: "Все интерактивные элементы доступны с клавиатуры, логичный tabIndex."
      },
      {
        type: "paragraph",
        content: "Селекты — либо нативные <select>, либо кастомные с полной ARIA-разметкой (role=\"combobox\", aria-expanded, aria-activedescendant)."
      },
      {
        type: "paragraph",
        content: "AmountInput имеет явный <label>, связанный через htmlFor/id."
      },
      {
        type: "paragraph",
        content: "Динамически обновляемый курс и итоговая сумма — в aria-live=\"polite\" регионе, чтобы скринридер зачитывал обновления, но не прерывал пользователя."
      },
      {
        type: "paragraph",
        content: "Кнопка swap имеет aria-label=\"Поменять валюты местами\" (иконка без текста)."
      },
      {
        type: "paragraph",
        content: "Сообщения об ошибках связаны с полями через aria-describedby."
      },
      {
        type: "paragraph",
        content: "Цветовые индикаторы (красный = ошибка) дублируются иконкой или текстом — не полагаемся только на цвет."
      }
    ]
  },
  6: {
    title: "Сложности и edge-кейсы",
    sections: [
      {
        type: "heading",
        level: 3,
        content: "Какие потенциальные проблемы вы видите? Как бы вы их решали"
      },
      {
        type: "paragraph",
        content: "Оба поля ввода как «ведущие». Если реализовывать ввод «хочу получить Y», нужно обратное вычисление с учётом комиссии. Это нетривиально, если комиссия взимается «сверху» или «снизу» суммы по-разному. Нужно явно договориться с бэкендом и уточнить у продукта — нужна ли такая функциональность."
      },
      {
        type: "paragraph",
        content: "Пользователь меняет валюту в процессе ввода суммы. При смене пары лимиты и курс меняются — введённая сумма может оказаться вне лимитов. Решение: не сбрасывать введённое значение, но сразу показать валидационную ошибку с новыми лимитами."
      },
      {
        type: "paragraph",
        content: "Состояние «pending» у транзакции. Некоторые обмены (особенно cross-chain) могут занимать минуты. Нужен экран ожидания с polling статуса транзакции, а не просто «спасибо, готово»."
      },
      {
        type: "paragraph",
        content: "Одновременные вкладки / дублирование сессий. Если пользователь открыл виджет в двух вкладках и начал обмен в обоих — возможен конфликт. Минимальное решение: при успешном execute в одной вкладке, вторая при попытке execute получит ошибку бэкенда (quoteId уже использован). Фронтенд должен gracefully обработать этот кейс."
      },
      {
        type: "paragraph",
        content: "Нулевые и «копеечные» суммы. Пользователь может ввести 0.000001 BTC, что даст копейки USDT и может быть ниже min fee. Валидация должна покрывать случай, когда сумма формально в лимитах, но после комиссии получатель получает 0 или отрицательное значение."
      },
      {
        type: "paragraph",
        content: "Недоступная пара. Не все пары могут поддерживаться. Если пользователь выбирает комбинацию, для которой нет рынка — нужно понятное сообщение, а не 404."
      },
      {
        type: "paragraph",
        content: "Потеря соединения. Если polling/WS прерывается, курс начинает «протухать». Нужен offline-индикатор и запрет на отправку формы с устаревшим курсом."
      }
    ]
  },
  7: {
    title: "Вопросы",
    sections: [
      {
        type: "heading",
        level: 3,
        content: "Какие уточняющие вопросы вы бы задали перед началом работы? Укажите, к кому бы они были адресованы (дизайн, бэкенд, продукт, бизнес)."
      },
      {
        type: "heading",
        level: 4,
        content: "К продукту:"
      },
      {
        type: "paragraph",
        content: "Нужен ли ввод суммы «получаю» (обратное направление), или только «отдаю»?"
      },
      {
        type: "paragraph",
        content: "Какой сценарий при истечении quote на экране подтверждения — автообновить и показать новый курс, или вернуть пользователя на форму?"
      },
      {
        type: "paragraph",
        content: "Есть ли баланс пользователя, который нужно показывать и валидировать на фронтенде?"
      },
      {
        type: "paragraph",
        content: "Виджет — встраиваемый (iframe/web component) или часть SPA?"
      },
      {
        type: "heading",
        level: 4,
        content: "К бэкенду:"
      },
      {
        type: "paragraph",
        content: "Какой механизм обновления курса предпочтительнее — WebSocket или polling? Какой интервал?"
      },
      {
        type: "paragraph",
        content: "Все числовые значения будут приходить строками?"
      },
      {
        type: "paragraph",
        content: "Будет ли idempotencyKey на /execute для безопасных ретраев?"
      },
      {
        type: "paragraph",
        content: "Как обрабатывается асинхронный обмен (pending) — polling статуса или webhook/push?"
      },
      {
        type: "paragraph",
        content: "Какова логика fee — удерживается из суммы «отдаю» или добавляется сверху?"
      },
      {
        type: "heading",
        level: 4,
        content: "К дизайну:"
      },
      {
        type: "paragraph",
        content: "Есть ли готовая дизайн-система, или нужно проектировать компоненты с нуля?"
      },
      {
        type: "paragraph",
        content: "Как выглядит экран подтверждения — модал, drawer, или отдельная страница?"
      },
      {
        type: "paragraph",
        content: "Есть ли анимация swap-кнопки и перехода между экранами?"
      },
      {
        type: "paragraph",
        content: "Какое поведение на мобильных при открытии клавиатуры — виджет скроллится или сжимается?"
      },
      {
        type: "heading",
        level: 4,
        content: "К бизнесу:"
      },
      {
        type: "paragraph",
        content: "Нужна ли локализация (несколько языков, форматы чисел по локали)?"
      },
      {
        type: "paragraph",
        content: "Планируется ли аналитика событий (GTM, amplitude) — нужно ли сразу закладывать tracking?"
      }
    ]
  }
};

function App() {
  const [activeItem, setActiveItem] = useState(1);

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>HR Answers</h1>
          <p>Технические ответы для интервью</p>
        </div>
        <ul className="sidebar-nav">
          {[1, 2, 3, 4, 5, 6, 7].map(num => (
            <li key={num}>
              <button
                type="button"
                className={activeItem === num ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(num);
                }}
              >
                <span className="question-number">{num}.</span>
                {contentData[num].title.split('\n')[0]}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        {contentData[activeItem] && (
          <div>
            <h1>{contentData[activeItem].title}</h1>
            {contentData[activeItem].sections.map((section, index) => {
              switch (section.type) {
                case 'heading':
                  const HeadingTag = `h${section.level}`;
                  return <HeadingTag key={index}>{section.content}</HeadingTag>;
                case 'paragraph':
                  return <p key={index}>{section.content}</p>;
                case 'pre':
                  return <pre key={index}>{section.content}</pre>;
                default:
                  return null;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;