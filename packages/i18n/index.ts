import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type SupportedLocale = 'en' | 'el' | 'ru'

export interface TranslationKey {
  id: string
  key: string
  category: string
  context?: string
  description?: string
}

export interface Translation {
  id: string
  translationKeyId: string
  locale: SupportedLocale
  value: string
  isPlural?: boolean
  pluralRule?: 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
  lastUpdated: string
  version: number
}

export interface LocalizationConfig {
  defaultLocale: SupportedLocale
  fallbackLocale: SupportedLocale
  supportedLocales: SupportedLocale[]
  autoDetect: boolean
  persistUserPreference: boolean
}

export interface PluralRules {
  [locale: string]: {
    cardinal: (n: number) => 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
    ordinal: (n: number) => 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
  }
}

export class I18nManager {
  private config: LocalizationConfig
  private translations: Map<string, Map<SupportedLocale, Translation>> = new Map()
  private currentLocale: SupportedLocale
  private pluralRules: PluralRules

  constructor(config?: Partial<LocalizationConfig>) {
    this.config = {
      defaultLocale: 'en',
      fallbackLocale: 'en',
      supportedLocales: ['en', 'el', 'ru'],
      autoDetect: true,
      persistUserPreference: true,
      ...config
    }

    this.currentLocale = this.config.defaultLocale
    this.pluralRules = this.initializePluralRules()
    
    this.initializeTranslations()
    
    if (this.config.autoDetect && typeof window !== 'undefined') {
      this.detectUserLocale()
    }
  }

  private initializePluralRules(): PluralRules {
    return {
      en: {
        cardinal: (n: number) => n === 1 ? 'one' : 'other',
        ordinal: (n: number) => {
          const mod10 = n % 10
          const mod100 = n % 100
          if (mod10 === 1 && mod100 !== 11) return 'one'
          if (mod10 === 2 && mod100 !== 12) return 'two'
          if (mod10 === 3 && mod100 !== 13) return 'few'
          return 'other'
        }
      },
      el: {
        cardinal: (n: number) => n === 1 ? 'one' : 'other',
        ordinal: (n: number) => 'other'
      },
      ru: {
        cardinal: (n: number) => {
          const mod10 = n % 10
          const mod100 = n % 100
          if (mod10 === 1 && mod100 !== 11) return 'one'
          if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few'
          return 'many'
        },
        ordinal: (n: number) => 'other'
      }
    }
  }

  private async initializeTranslations() {
    try {
      await this.loadCoreTranslations()
      await this.loadDatabaseTranslations()
    } catch (error) {
      console.error('Failed to initialize translations:', error)
    }
  }

  private async loadCoreTranslations() {
    const coreTranslations = {
      // Authentication & Auth
      'auth.login': {
        en: 'Sign In',
        el: 'Σύνδεση',
        ru: 'Войти'
      },
      'auth.register': {
        en: 'Sign Up',
        el: 'Εγγραφή',
        ru: 'Регистрация'
      },
      'auth.logout': {
        en: 'Sign Out',
        el: 'Αποσύνδεση',
        ru: 'Выйти'
      },
      'auth.email': {
        en: 'Email',
        el: 'Email',
        ru: 'Электронная почта'
      },
      'auth.password': {
        en: 'Password',
        el: 'Κωδικός πρόσβασης',
        ru: 'Пароль'
      },
      'auth.confirmPassword': {
        en: 'Confirm Password',
        el: 'Επιβεβαίωση κωδικού',
        ru: 'Подтвердите пароль'
      },
      'auth.forgotPassword': {
        en: 'Forgot Password?',
        el: 'Ξεχάσατε τον κωδικό;',
        ru: 'Забыли пароль?'
      },
      'auth.socialLogin': {
        en: 'Continue with {provider}',
        el: 'Συνέχεια με {provider}',
        ru: 'Войти через {provider}'
      },
      'auth.createAccount': {
        en: 'Create Account',
        el: 'Δημιουργία λογαριασμού',
        ru: 'Создать аккаунт'
      },
      'auth.alreadyHaveAccount': {
        en: 'Already have an account?',
        el: 'Έχετε ήδη λογαριασμό;',
        ru: 'Уже есть аккаунт?'
      },
      'auth.dontHaveAccount': {
        en: "Don't have an account?",
        el: 'Δεν έχετε λογαριασμό;',
        ru: 'Нет аккаунта?'
      },

      // Navigation & UI
      'nav.dashboard': {
        en: 'Dashboard',
        el: 'Κεντρικός πίνακας',
        ru: 'Панель управления'
      },
      'nav.jobs': {
        en: 'Jobs',
        el: 'Θέσεις εργασίας',
        ru: 'Вакансии'
      },
      'nav.applications': {
        en: 'Applications',
        el: 'Αιτήσεις',
        ru: 'Заявки'
      },
      'nav.messages': {
        en: 'Messages',
        el: 'Μηνύματα',
        ru: 'Сообщения'
      },
      'nav.profile': {
        en: 'Profile',
        el: 'Προφίλ',
        ru: 'Профиль'
      },
      'nav.settings': {
        en: 'Settings',
        el: 'Ρυθμίσεις',
        ru: 'Настройки'
      },
      'nav.billing': {
        en: 'Billing',
        el: 'Χρεώσεις',
        ru: 'Биллинг'
      },
      'nav.analytics': {
        en: 'Analytics',
        el: 'Αναλυτικά',
        ru: 'Аналитика'
      },
      'nav.candidates': {
        en: 'Candidates',
        el: 'Υποψήφιοι',
        ru: 'Кандидаты'
      },
      'nav.help': {
        en: 'Help',
        el: 'Βοήθεια',
        ru: 'Помощь'
      },

      // Job-related
      'job.title': {
        en: 'Job Title',
        el: 'Τίτλος θέσης',
        ru: 'Название должности'
      },
      'job.description': {
        en: 'Job Description',
        el: 'Περιγραφή θέσης',
        ru: 'Описание работы'
      },
      'job.company': {
        en: 'Company',
        el: 'Εταιρεία',
        ru: 'Компания'
      },
      'job.location': {
        en: 'Location',
        el: 'Τοποθεσία',
        ru: 'Местоположение'
      },
      'job.salary': {
        en: 'Salary',
        el: 'Μισθός',
        ru: 'Зарплата'
      },
      'job.type': {
        en: 'Job Type',
        el: 'Τύπος εργασίας',
        ru: 'Тип работы'
      },
      'job.category': {
        en: 'Category',
        el: 'Κατηγορία',
        ru: 'Категория'
      },
      'job.experience': {
        en: 'Experience Level',
        el: 'Επίπεδο εμπειρίας',
        ru: 'Уровень опыта'
      },
      'job.skills': {
        en: 'Required Skills',
        el: 'Απαιτούμενες δεξιότητες',
        ru: 'Необходимые навыки'
      },
      'job.apply': {
        en: 'Apply Now',
        el: 'Υποβολή αίτησης',
        ru: 'Подать заявку'
      },
      'job.applied': {
        en: 'Applied',
        el: 'Υποβλήθηκε αίτηση',
        ru: 'Заявка подана'
      },
      'job.saved': {
        en: 'Saved',
        el: 'Αποθηκευμένη',
        ru: 'Сохранено'
      },
      'job.postJob': {
        en: 'Post Job',
        el: 'Δημοσίευση θέσης',
        ru: 'Разместить вакансию'
      },
      'job.editJob': {
        en: 'Edit Job',
        el: 'Επεξεργασία θέσης',
        ru: 'Редактировать вакансию'
      },
      'job.deleteJob': {
        en: 'Delete Job',
        el: 'Διαγραφή θέσης',
        ru: 'Удалить вакансию'
      },

      // Application status
      'application.pending': {
        en: 'Pending',
        el: 'Σε εκκρεμότητα',
        ru: 'В ожидании'
      },
      'application.reviewed': {
        en: 'Reviewed',
        el: 'Εξετάστηκε',
        ru: 'Рассмотрено'
      },
      'application.interviewing': {
        en: 'Interviewing',
        el: 'Συνέντευξη',
        ru: 'Интервью'
      },
      'application.offered': {
        en: 'Offered',
        el: 'Προσφέρθηκε',
        ru: 'Предложение получено'
      },
      'application.hired': {
        en: 'Hired',
        el: 'Προσλήφθηκε',
        ru: 'Нанят'
      },
      'application.rejected': {
        en: 'Rejected',
        el: 'Απορρίφθηκε',
        ru: 'Отклонено'
      },

      // User types
      'userType.individual': {
        en: 'Job Seeker',
        el: 'Αναζητητής εργασίας',
        ru: 'Соискатель'
      },
      'userType.company': {
        en: 'Employer',
        el: 'Εργοδότης',
        ru: 'Работодатель'
      },

      // Experience levels
      'experience.entry': {
        en: 'Entry Level',
        el: 'Αρχάριος',
        ru: 'Начальный уровень'
      },
      'experience.mid': {
        en: 'Mid Level',
        el: 'Μεσαίο επίπεδο',
        ru: 'Средний уровень'
      },
      'experience.senior': {
        en: 'Senior Level',
        el: 'Υψηλό επίπεδο',
        ru: 'Старший уровень'
      },
      'experience.executive': {
        en: 'Executive',
        el: 'Ανώτατο στέλεχος',
        ru: 'Руководящий'
      },

      // Work styles
      'workStyle.remote': {
        en: 'Remote',
        el: 'Εξ αποστάσεως',
        ru: 'Удаленно'
      },
      'workStyle.hybrid': {
        en: 'Hybrid',
        el: 'Μικτό',
        ru: 'Гибридно'
      },
      'workStyle.onsite': {
        en: 'On-site',
        el: 'Στο γραφείο',
        ru: 'В офисе'
      },

      // Job types
      'jobType.fullTime': {
        en: 'Full-time',
        el: 'Πλήρης απασχόληση',
        ru: 'Полная занятость'
      },
      'jobType.partTime': {
        en: 'Part-time',
        el: 'Μερική απασχόληση',
        ru: 'Частичная занятость'
      },
      'jobType.contract': {
        en: 'Contract',
        el: 'Συμβόλαιο',
        ru: 'Контракт'
      },
      'jobType.freelance': {
        en: 'Freelance',
        el: 'Ελεύθερος επαγγελματίας',
        ru: 'Фриланс'
      },
      'jobType.temporary': {
        en: 'Temporary',
        el: 'Προσωρινή',
        ru: 'Временная'
      },
      'jobType.internship': {
        en: 'Internship',
        el: 'Πρακτική άσκηση',
        ru: 'Стажировка'
      },

      // Common actions
      'action.save': {
        en: 'Save',
        el: 'Αποθήκευση',
        ru: 'Сохранить'
      },
      'action.cancel': {
        en: 'Cancel',
        el: 'Ακύρωση',
        ru: 'Отменить'
      },
      'action.delete': {
        en: 'Delete',
        el: 'Διαγραφή',
        ru: 'Удалить'
      },
      'action.edit': {
        en: 'Edit',
        el: 'Επεξεργασία',
        ru: 'Редактировать'
      },
      'action.create': {
        en: 'Create',
        el: 'Δημιουργία',
        ru: 'Создать'
      },
      'action.update': {
        en: 'Update',
        el: 'Ενημέρωση',
        ru: 'Обновить'
      },
      'action.submit': {
        en: 'Submit',
        el: 'Υποβολή',
        ru: 'Отправить'
      },
      'action.search': {
        en: 'Search',
        el: 'Αναζήτηση',
        ru: 'Поиск'
      },
      'action.filter': {
        en: 'Filter',
        el: 'Φίλτρο',
        ru: 'Фильтр'
      },
      'action.share': {
        en: 'Share',
        el: 'Κοινοποίηση',
        ru: 'Поделиться'
      },
      'action.download': {
        en: 'Download',
        el: 'Κατέβασμα',
        ru: 'Скачать'
      },
      'action.upload': {
        en: 'Upload',
        el: 'Ανέβασμα',
        ru: 'Загрузить'
      },
      'action.view': {
        en: 'View',
        el: 'Προβολή',
        ru: 'Просмотр'
      },
      'action.close': {
        en: 'Close',
        el: 'Κλείσιμο',
        ru: 'Закрыть'
      },
      'action.open': {
        en: 'Open',
        el: 'Άνοιγμα',
        ru: 'Открыть'
      },

      // Status messages
      'status.loading': {
        en: 'Loading...',
        el: 'Φόρτωση...',
        ru: 'Загрузка...'
      },
      'status.saving': {
        en: 'Saving...',
        el: 'Αποθήκευση...',
        ru: 'Сохранение...'
      },
      'status.success': {
        en: 'Success!',
        el: 'Επιτυχία!',
        ru: 'Успешно!'
      },
      'status.error': {
        en: 'Error occurred',
        el: 'Παρουσιάστηκε σφάλμα',
        ru: 'Произошла ошибка'
      },
      'status.notFound': {
        en: 'Not found',
        el: 'Δεν βρέθηκε',
        ru: 'Не найдено'
      },
      'status.noResults': {
        en: 'No results found',
        el: 'Δεν βρέθηκαν αποτελέσματα',
        ru: 'Результатов не найдено'
      },

      // Notifications
      'notification.newMessage': {
        en: 'You have a new message',
        el: 'Έχετε νέο μήνυμα',
        ru: 'У вас новое сообщение'
      },
      'notification.applicationReceived': {
        en: 'New application received',
        el: 'Νέα αίτηση ελήφθη',
        ru: 'Получена новая заявка'
      },
      'notification.statusUpdated': {
        en: 'Application status updated',
        el: 'Η κατάσταση της αίτησης ενημερώθηκε',
        ru: 'Статус заявки обновлен'
      },

      // Subscription & Billing
      'billing.plan': {
        en: 'Plan',
        el: 'Πλάνο',
        ru: 'План'
      },
      'billing.upgrade': {
        en: 'Upgrade',
        el: 'Αναβάθμιση',
        ru: 'Обновить'
      },
      'billing.downgrade': {
        en: 'Downgrade',
        el: 'Υποβάθμιση',
        ru: 'Понизить'
      },
      'billing.monthly': {
        en: 'Monthly',
        el: 'Μηνιαίο',
        ru: 'Ежемесячно'
      },
      'billing.yearly': {
        en: 'Yearly',
        el: 'Ετήσιο',
        ru: 'Ежегодно'
      },
      'billing.invoice': {
        en: 'Invoice',
        el: 'Τιμολόγιο',
        ru: 'Счет'
      },

      // Time & Dates
      'time.now': {
        en: 'now',
        el: 'τώρα',
        ru: 'сейчас'
      },
      'time.minute': {
        en: '{count} minute ago',
        el: 'πριν από {count} λεπτό',
        ru: '{count} минуту назад'
      },
      'time.minutes': {
        en: '{count} minutes ago',
        el: 'πριν από {count} λεπτά',
        ru: '{count} минут назад'
      },
      'time.hour': {
        en: '{count} hour ago',
        el: 'πριν από {count} ώρα',
        ru: '{count} час назад'
      },
      'time.hours': {
        en: '{count} hours ago',
        el: 'πριν από {count} ώρες',
        ru: '{count} часов назад'
      },
      'time.day': {
        en: '{count} day ago',
        el: 'πριν από {count} ημέρα',
        ru: '{count} день назад'
      },
      'time.days': {
        en: '{count} days ago',
        el: 'πριν από {count} ημέρες',
        ru: '{count} дней назад'
      }
    }

    // Store translations in memory
    for (const [key, localeMap] of Object.entries(coreTranslations)) {
      const translationMap = new Map<SupportedLocale, Translation>()
      
      for (const [locale, value] of Object.entries(localeMap)) {
        translationMap.set(locale as SupportedLocale, {
          id: `${key}_${locale}`,
          translationKeyId: key,
          locale: locale as SupportedLocale,
          value: value,
          lastUpdated: new Date().toISOString(),
          version: 1
        })
      }
      
      this.translations.set(key, translationMap)
    }
  }

  private async loadDatabaseTranslations() {
    try {
      const { data: translations } = await supabase
        .from('translations')
        .select('*')
      
      if (translations) {
        for (const translation of translations) {
          if (!this.translations.has(translation.translation_key_id)) {
            this.translations.set(translation.translation_key_id, new Map())
          }
          
          this.translations.get(translation.translation_key_id)!.set(
            translation.locale,
            {
              id: translation.id,
              translationKeyId: translation.translation_key_id,
              locale: translation.locale,
              value: translation.value,
              isPlural: translation.is_plural,
              pluralRule: translation.plural_rule,
              lastUpdated: translation.last_updated,
              version: translation.version
            }
          )
        }
      }
    } catch (error) {
      console.error('Failed to load database translations:', error)
    }
  }

  private detectUserLocale() {
    // Check user preference in localStorage
    if (this.config.persistUserPreference) {
      const savedLocale = localStorage.getItem('user-locale') as SupportedLocale
      if (savedLocale && this.config.supportedLocales.includes(savedLocale)) {
        this.currentLocale = savedLocale
        return
      }
    }

    // Detect from browser
    const browserLocale = navigator.language.split('-')[0] as SupportedLocale
    if (this.config.supportedLocales.includes(browserLocale)) {
      this.currentLocale = browserLocale
    }
  }

  // Public API methods
  public t(key: string, params?: { [key: string]: any }, locale?: SupportedLocale): string {
    const targetLocale = locale || this.currentLocale
    const translations = this.translations.get(key)
    
    if (!translations) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }

    let translation = translations.get(targetLocale)
    
    // Fallback to default locale if translation not found
    if (!translation && targetLocale !== this.config.fallbackLocale) {
      translation = translations.get(this.config.fallbackLocale)
    }
    
    if (!translation) {
      console.warn(`Translation not found for key: ${key}, locale: ${targetLocale}`)
      return key
    }

    let result = translation.value

    // Handle parameter substitution
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue))
      }
    }

    return result
  }

  public plural(key: string, count: number, params?: { [key: string]: any }, locale?: SupportedLocale): string {
    const targetLocale = locale || this.currentLocale
    const pluralRule = this.pluralRules[targetLocale]?.cardinal(count) || 'other'
    
    // Try to find plural-specific translation
    const pluralKey = `${key}.${pluralRule}`
    const translations = this.translations.get(pluralKey)
    
    if (translations) {
      return this.t(pluralKey, { count, ...params }, locale)
    }
    
    // Fallback to base key
    return this.t(key, { count, ...params }, locale)
  }

  public setLocale(locale: SupportedLocale) {
    if (!this.config.supportedLocales.includes(locale)) {
      console.warn(`Unsupported locale: ${locale}`)
      return
    }

    this.currentLocale = locale

    if (this.config.persistUserPreference && typeof window !== 'undefined') {
      localStorage.setItem('user-locale', locale)
    }

    // Trigger locale change event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }))
    }
  }

  public getCurrentLocale(): SupportedLocale {
    return this.currentLocale
  }

  public getSupportedLocales(): SupportedLocale[] {
    return [...this.config.supportedLocales]
  }

  public async addTranslation(key: string, locale: SupportedLocale, value: string, context?: string) {
    try {
      // Add to database
      const { data, error } = await supabase
        .from('translations')
        .insert({
          translation_key_id: key,
          locale,
          value,
          context,
          last_updated: new Date().toISOString(),
          version: 1
        })
        .select()
        .single()

      if (error) throw error

      // Update local cache
      if (!this.translations.has(key)) {
        this.translations.set(key, new Map())
      }

      this.translations.get(key)!.set(locale, {
        id: data.id,
        translationKeyId: key,
        locale,
        value,
        lastUpdated: data.last_updated,
        version: data.version
      })

      return true
    } catch (error) {
      console.error('Failed to add translation:', error)
      return false
    }
  }

  public async updateTranslation(key: string, locale: SupportedLocale, value: string) {
    try {
      const { error } = await supabase
        .from('translations')
        .update({
          value,
          last_updated: new Date().toISOString(),
          version: supabase.rpc('increment_version')
        })
        .eq('translation_key_id', key)
        .eq('locale', locale)

      if (error) throw error

      // Update local cache
      const translations = this.translations.get(key)
      if (translations && translations.has(locale)) {
        const existing = translations.get(locale)!
        translations.set(locale, {
          ...existing,
          value,
          lastUpdated: new Date().toISOString(),
          version: existing.version + 1
        })
      }

      return true
    } catch (error) {
      console.error('Failed to update translation:', error)
      return false
    }
  }

  public getTranslationKeys(): string[] {
    return Array.from(this.translations.keys())
  }

  public getLocaleData(locale: SupportedLocale): Map<string, Translation> {
    const result = new Map<string, Translation>()
    
    for (const [key, translations] of this.translations) {
      const translation = translations.get(locale)
      if (translation) {
        result.set(key, translation)
      }
    }
    
    return result
  }

  public async exportTranslations(locale?: SupportedLocale): Promise<{ [key: string]: string }> {
    const result: { [key: string]: string } = {}
    const targetLocales = locale ? [locale] : this.config.supportedLocales
    
    for (const targetLocale of targetLocales) {
      for (const [key, translations] of this.translations) {
        const translation = translations.get(targetLocale)
        if (translation) {
          const exportKey = locale ? key : `${key}.${targetLocale}`
          result[exportKey] = translation.value
        }
      }
    }
    
    return result
  }

  public formatDate(date: Date, locale?: SupportedLocale): string {
    const targetLocale = locale || this.currentLocale
    return new Intl.DateTimeFormat(targetLocale === 'el' ? 'el-GR' : targetLocale === 'ru' ? 'ru-RU' : 'en-US').format(date)
  }

  public formatCurrency(amount: number, currency: string = 'USD', locale?: SupportedLocale): string {
    const targetLocale = locale || this.currentLocale
    return new Intl.NumberFormat(targetLocale === 'el' ? 'el-GR' : targetLocale === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  public formatNumber(number: number, locale?: SupportedLocale): string {
    const targetLocale = locale || this.currentLocale
    return new Intl.NumberFormat(targetLocale === 'el' ? 'el-GR' : targetLocale === 'ru' ? 'ru-RU' : 'en-US').format(number)
  }

  public getRelativeTime(date: Date, locale?: SupportedLocale): string {
    const now = Date.now()
    const diff = now - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) {
      return this.t('time.now', {}, locale)
    } else if (minutes < 60) {
      return minutes === 1 
        ? this.t('time.minute', { count: minutes }, locale)
        : this.t('time.minutes', { count: minutes }, locale)
    } else if (hours < 24) {
      return hours === 1
        ? this.t('time.hour', { count: hours }, locale)
        : this.t('time.hours', { count: hours }, locale)
    } else {
      return days === 1
        ? this.t('time.day', { count: days }, locale)
        : this.t('time.days', { count: days }, locale)
    }
  }
}

// Global instance
export const i18n = new I18nManager()

// React hook
export function useTranslation() {
  const [locale, setLocale] = React.useState(i18n.getCurrentLocale())

  React.useEffect(() => {
    const handleLocaleChange = (event: CustomEvent) => {
      setLocale(event.detail.locale)
    }

    window.addEventListener('localeChanged', handleLocaleChange as EventListener)
    return () => window.removeEventListener('localeChanged', handleLocaleChange as EventListener)
  }, [])

  return {
    t: (key: string, params?: { [key: string]: any }) => i18n.t(key, params),
    plural: (key: string, count: number, params?: { [key: string]: any }) => i18n.plural(key, count, params),
    locale,
    setLocale: (newLocale: SupportedLocale) => i18n.setLocale(newLocale),
    formatDate: (date: Date) => i18n.formatDate(date),
    formatCurrency: (amount: number, currency?: string) => i18n.formatCurrency(amount, currency),
    formatNumber: (number: number) => i18n.formatNumber(number),
    getRelativeTime: (date: Date) => i18n.getRelativeTime(date)
  }
}

// Type-safe translation function for static usage
export const t = (key: string, params?: { [key: string]: any }, locale?: SupportedLocale) => {
  return i18n.t(key, params, locale)
}

export default i18n