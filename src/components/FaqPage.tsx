import { useState } from 'react';
import Icon from '@/components/ui/icon';

const FAQ = [
  {
    q: 'Как начать квест?',
    a: 'Нажмите «Войти» в верхнем меню, введите номер телефона и пароль. После входа раздел «Путь» станет активным — начните с первой загадки.',
  },
  {
    q: 'Можно ли проходить квест без регистрации?',
    a: 'Нет. Для сохранения прогресса, участия в рейтинге и синхронизации с платформой Мастер путей требуется авторизация по номеру телефона.',
  },
  {
    q: 'Сколько попыток ответа на каждую загадку?',
    a: 'Неограниченно. Но каждый раз правильный ответ даёт 10 очков. Если вы воспользовались подсказкой — с финального результата за эту загадку вычитается 2 очка.',
  },
  {
    q: 'Что делать, если я застрял на загадке?',
    a: 'Нажмите «Показать подсказку» под текстом загадки. Это стоит −2 очка. Если и после подсказки сложно — попробуйте внимательнее изучить фото или описание.',
  },
  {
    q: 'Как обновляется рейтинг?',
    a: 'Рейтинг синхронизируется с платформой Мастер путей после каждого завершённого уровня. Обновление происходит в течение нескольких секунд.',
  },
  {
    q: 'Как получить PDF-путеводитель?',
    a: 'Путеводитель доступен на финальном экране после прохождения всех 15 загадок. Нажмите кнопку «Скачать путеводитель PDF».',
  },
  {
    q: 'Что такое ключ к интерактивной карте?',
    a: 'После завершения квеста вы получаете уникальный ключ — он открывает интерактивную карту с маршрутом по реальным локациям Усть-Илимска.',
  },
  {
    q: 'Как оплатить участие в квесте?',
    a: 'Квест бесплатный. Если хотите поддержать проект — воспользуйтесь кнопкой «Поддержать» в разделе «Путь» или перейдите по ссылке YooMoney.',
  },
  {
    q: 'Как связаться с администратором?',
    a: 'Перейдите в раздел «Контакты» и заполните форму обратной связи. Или воспользуйтесь кнопкой «Сообщить о проблеме» — ответим в течение 24 часов.',
  },
  {
    q: 'Что такое платформа «Мастер путей»?',
    a: 'Мастер путей — это платформа для создания квест-путешествий. Наш квест создан и управляется через эту платформу. Прогресс участников хранится на серверах Мастер путей.',
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>Частые вопросы</p>
        <h1 className="font-oswald font-bold text-4xl uppercase" style={{ color: 'white' }}>
          ЧаВо
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Ответы на самые популярные вопросы об участии в квесте
        </p>
      </div>

      <div className="space-y-2">
        {FAQ.map((item, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden transition-all duration-200"
            style={{
              backgroundColor: open === i ? 'var(--forest-mid)' : 'rgba(26,51,37,0.4)',
              border: open === i ? '1px solid rgba(64,195,176,0.2)' : '1px solid rgba(64,195,176,0.06)',
            }}
          >
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span
                className="text-sm font-medium pr-4"
                style={{ color: open === i ? 'white' : 'rgba(255,255,255,0.75)' }}
              >
                {item.q}
              </span>
              <Icon
                name={open === i ? 'ChevronUp' : 'ChevronDown'}
                size={16}
                style={{ color: open === i ? 'var(--teal)' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}
              />
            </button>
            {open === i && (
              <div
                className="px-5 pb-4 text-sm leading-relaxed animate-fade-in-fast"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="mt-8 p-5 rounded-xl flex items-start gap-4"
        style={{ backgroundColor: 'rgba(64,195,176,0.05)', border: '1px solid rgba(64,195,176,0.15)' }}
      >
        <Icon name="MessageCircle" size={18} style={{ color: 'var(--teal)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'white' }}>Не нашли ответ?</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Напишите нам через раздел «Контакты» — ответим быстро.
          </p>
        </div>
      </div>
    </div>
  );
}
