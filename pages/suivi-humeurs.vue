<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'] })

type MoodEntry = {
  id: string
  moodName: string
  emoji: string
  moment: string
  exactTime: string | null
  dayKey: string | null
  createdAt: string
  updatedAt: string
  film: string
}

type ViewMode = 'jour' | 'semaine' | 'annee'

const { data, pending, error } = await useFetch<MoodEntry[]>('/api/suivi-humeurs')
const entries = computed(() => data.value || [])
const activeView = ref<ViewMode>('jour')

const moments = [
  { key: 'matin', label: 'Matin', hours: '08:00 – 12:00', emoji: '🌅' },
  { key: 'apres-midi', label: 'Après-midi', hours: '12:00 – 18:00', emoji: '🌤️' },
  { key: 'soir', label: 'Soir', hours: '18:00 – 00:00', emoji: '🌙' }
]

const moodEmojis: Record<string, string> = {
  Heureux: '🤩',
  Bien: '😌',
  Moyen: '😐',
  Fatigué: '😴',
  Énervé: '😡'
}

const pad = (value: number) => String(value).padStart(2, '0')
const localDayKey = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const parseDayKey = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const todayKey = computed(() => localDayKey())
const todayDate = computed(() => parseDayKey(todayKey.value))

const getEntryDayKey = (entry: MoodEntry) => entry.dayKey || localDayKey(new Date(entry.createdAt))
const entriesForDay = (dayKey: string) => entries.value.filter(entry => getEntryDayKey(entry) === dayKey)
const todayEntries = computed(() => entriesForDay(todayKey.value))

const currentMomentEntry = (moment: string) =>
  todayEntries.value.find(entry => entry.moment === moment) || null

const dailyMoodNames = computed(() => todayEntries.value.map(entry => entry.moodName))

const wellbeingAdvice = computed(() => {
  const moods = dailyMoodNames.value
  if (!moods.length) return {
    title: 'Commence doucement',
    text: 'Note ton humeur au fil de la journée pour voir simplement comment elle évolue.'
  }
  if (moods.includes('Énervé')) return {
    title: 'Prends un peu de recul',
    text: 'Si ta journée est chargée, accorde-toi quelques minutes au calme avant de repartir.'
  }
  if (moods.includes('Fatigué')) return {
    title: 'Écoute ton rythme',
    text: 'La fatigue peut être l’occasion de ralentir un peu et de garder un moment pour souffler.'
  }
  if (moods.includes('Moyen')) return {
    title: 'Un petit moment pour toi',
    text: 'Une pause, une activité agréable ou quelques minutes loin des écrans peuvent faire du bien.'
  }
  if (moods.every(mood => mood === 'Heureux')) return {
    title: 'Profite de ce bon moment',
    text: 'Ta journée semble lumineuse. Prends le temps de savourer ce qui te fait du bien.'
  }
  return {
    title: 'Continue à t’écouter',
    text: 'Ta journée évolue, et c’est normal. Note ce que tu ressens quand tu en as envie.'
  }
})

const weekDays = computed(() => {
  const date = new Date(todayDate.value)
  const day = date.getDay()
  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day))

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(date)
    current.setDate(date.getDate() + index)
    const key = localDayKey(current)
    const dayEntries = entriesForDay(key)
    return {
      key,
      label: new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(current).replace('.', ''),
      date: current.getDate(),
      entries: dayEntries,
      mood: dayEntries[dayEntries.length - 1] || null
    }
  })
})

const weekEntries = computed(() => weekDays.value.flatMap(day => day.entries))
const weekMoodStats = computed(() => {
  const counts = new Map<string, { name: string; emoji: string; count: number }>()
  for (const entry of weekEntries.value) {
    const current = counts.get(entry.moodName)
    if (current) current.count += 1
    else counts.set(entry.moodName, { name: entry.moodName, emoji: entry.emoji, count: 1 })
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)
})
const weekDominant = computed(() => weekMoodStats.value[0] || null)

const moodColors: Record<string, string> = {
  Heureux: '#E7BD58',
  Bien: '#A9B89D',
  Moyen: '#DED0B6',
  Fatigué: '#E7A58E',
  Énervé: '#392B24'
}

const donutSegments = (stats: Array<{ name: string; emoji: string; count: number }>) => {
  const total = stats.reduce((sum, item) => sum + item.count, 0)
  if (!total) return []
  const radius = 26
  const circumference = 2 * Math.PI * radius
  let offset = 0
  return stats.map(item => {
    const length = (item.count / total) * circumference
    const segment = {
      ...item,
      percent: Math.round((item.count / total) * 100),
      color: moodColors[item.name] || '#A9B89D',
      dasharray: `${length} ${circumference - length}`,
      dashoffset: -offset
    }
    offset += length
    return segment
  })
}

const weekFilledDays = computed(() => weekDays.value.filter(day => day.entries.length).length)

const weekInsight = computed(() => {
  if (!weekEntries.value.length) return 'Ta semaine commencera à se dessiner dès que tu enregistreras quelques humeurs.'
  if (weekDominant.value) {
    return `Cette semaine, tu as surtout noté ${weekDominant.value.emoji} ${weekDominant.value.name}, avec ${weekDominant.value.count} enregistrement${weekDominant.value.count > 1 ? 's' : ''}. ${weekFilledDays.value} jour${weekFilledDays.value > 1 ? 's' : ''} sur 7 comportent au moins une humeur.`
  }
  return 'Continue à noter tes humeurs pour faire apparaître tes repères.'
})

const year = computed(() => todayDate.value.getFullYear())
const currentMonth = computed(() => todayDate.value.getMonth())
const yearFlowRef = ref<HTMLElement | null>(null)
const currentMonthRef = ref<HTMLElement | null>(null)
const setCurrentMonthRef = (el: Element | null) => {
  currentMonthRef.value = el as HTMLElement | null
}

const centerCurrentMonth = async () => {
  await nextTick()
  requestAnimationFrame(() => {
    const flow = yearFlowRef.value
    const month = currentMonthRef.value
    if (flow && month) {
      flow.scrollLeft = Math.max(0, month.offsetLeft - (flow.clientWidth - month.offsetWidth) / 2)
    }
  })
}

watch(activeView, (view) => {
  if (view === 'annee') centerCurrentMonth()
})

onMounted(() => {
  if (activeView.value === 'annee') centerCurrentMonth()
})

const monthSummaries = computed(() =>
  Array.from({ length: 12 }, (_, month) => {
    const keyPrefix = `${year.value}-${pad(month + 1)}-`
    const monthEntries = entries.value.filter(entry => getEntryDayKey(entry).startsWith(keyPrefix))
    const counts = new Map<string, number>()
    monthEntries.forEach(entry => counts.set(entry.moodName, (counts.get(entry.moodName) || 0) + 1))
    const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
    return {
      month,
      label: new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(new Date(year.value, month, 1)).replace('.', ''),
      fullLabel: new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(year.value, month, 1)),
      count: monthEntries.length,
      dominant: dominant ? { name: dominant[0], emoji: moodEmojis[dominant[0]] || '🙂' } : null
    }
  })
)

const selectedYearMonth = ref(todayDate.value.getMonth())

const selectedMonthSummary = computed(() =>
  monthSummaries.value[selectedYearMonth.value]
)

const selectedMonthEntries = computed(() => {
  const prefix = `${year.value}-${pad(selectedYearMonth.value + 1)}-`
  return entries.value.filter(entry => getEntryDayKey(entry).startsWith(prefix))
})

const changeYearMonth = (direction: number) => {
  selectedYearMonth.value = Math.min(11, Math.max(0, selectedYearMonth.value + direction))
}

const yearEntries = computed(() =>
  entries.value.filter(entry => getEntryDayKey(entry).startsWith(`${year.value}-`))
)

const yearMoodStats = computed(() => {
  const counts = new Map<string, number>()
  yearEntries.value.forEach(entry => counts.set(entry.moodName, (counts.get(entry.moodName) || 0) + 1))
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, emoji: moodEmojis[name] || '🙂', count }))
})

const yearDominant = computed(() => yearMoodStats.value[0] || null)
const yearDonut = computed(() => donutSegments(yearMoodStats.value.map(item => ({ ...item, emoji: item.emoji }))))
const yearFilledDays = computed(() => new Set(yearEntries.value.map(entry => getEntryDayKey(entry))).size)

const yearInsight = computed(() => {
  if (!yearEntries.value.length) return 'Ton année commencera à se dessiner dès que tu enregistreras des humeurs.'
  return `Tu as enregistré ${yearEntries.value.length} humeur${yearEntries.value.length > 1 ? 's' : ''} sur ${yearFilledDays.value} jour${yearFilledDays.value > 1 ? 's' : ''} en ${year.value}. ${yearDominant.value ? `L’humeur la plus présente est ${yearDominant.value.emoji} ${yearDominant.value.name}.` : ''}`
})
</script>

<template>
  <section class="tracking-page">
    <div class="page-heading">
      <span class="eyebrow"><span></span> mon suivi</span>
      <h1>Mon humeur<br><i>dans le temps.</i></h1>
      <p>Un espace pour prendre le temps de t’écouter, comprendre ton rythme et repérer les moments où tu te sens le mieux.</p>
    </div>

    <div v-if="pending" class="mood-loading">Ton suivi arrive…</div>
    <div v-else-if="error" class="mood-error">Impossible de charger ton suivi.</div>

    <div v-else>
      <div class="tracking-tabs" role="tablist" aria-label="Période du suivi">
        <button :class="{ active: activeView === 'jour' }" @click="activeView = 'jour'">
          <strong>Aujourd’hui</strong><span>Ma journée</span>
        </button>
        <button :class="{ active: activeView === 'semaine' }" @click="activeView = 'semaine'">
          <strong>Cette semaine</strong><span>Mes repères</span>
        </button>
        <button :class="{ active: activeView === 'annee' }" @click="activeView = 'annee'">
          <strong>Cette année</strong><span>Mon évolution</span>
        </button>
      </div>

      <div v-if="activeView === 'jour'" class="tracking-view">
        <div class="tracking-view-intro">
          <span class="eyebrow"><span></span> aujourd’hui · {{ new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(todayDate) }}</span>
          <h2>Ma journée</h2>
          <p>Trois petits repères pour voir comment ton humeur évolue au fil de la journée.</p>
        </div>

        <div v-if="!todayEntries.length" class="tracking-empty">
          <span>◔</span>
          <h2>Ta journée commence ici.</h2>
          <p>Tu n’as pas encore noté ton humeur aujourd’hui.</p>
          <NuxtLink to="/choisir-humeurs" class="primary-button">Choisir mon humeur <span>→</span></NuxtLink>
        </div>

        <template v-else>
          <div class="tracking-day-action">
            <NuxtLink to="/choisir-humeurs" class="tracking-add">Mettre à jour</NuxtLink>
          </div>

          <div class="daily-moments">
            <article v-for="item in moments" :key="item.key" class="daily-moment" :class="{ filled: currentMomentEntry(item.key) }">
              <div class="daily-moment-top">
                <span class="daily-moment-icon">{{ item.emoji }}</span>
                <div>
                  <strong>{{ item.label }}</strong>
                  <small>{{ item.hours }}</small>
                </div>
              </div>
              <div v-if="currentMomentEntry(item.key)" class="daily-mood">
                <span>{{ currentMomentEntry(item.key)?.emoji }}</span>
                <strong>{{ currentMomentEntry(item.key)?.moodName }}</strong>
              </div>
              <div v-else class="daily-moment-empty">Pas encore noté</div>
            </article>
          </div>

          <section class="insight-card">
            <div class="insight-mark">💛</div>
            <div>
              <span class="eyebrow"><span></span> ce que ta journée raconte</span>
              <h3>{{ wellbeingAdvice.title }}</h3>
              <p>{{ wellbeingAdvice.text }}</p>
            </div>
          </section>
        </template>
      </div>

      <div v-else-if="activeView === 'semaine'" class="tracking-view">
        <div class="tracking-view-intro">
          <span class="eyebrow"><span></span> lundi → dimanche</span>
          <h2>Ma semaine</h2>
          <p>Une petite pause pour regarder ta semaine avec recul et mieux comprendre ce qui revient dans ton quotidien.</p>
        </div>

        <section class="tracking-card week-card">
          <div class="week-grid">
            <div v-for="day in weekDays" :key="day.key" class="week-day" :class="{ today: day.key === todayKey }">
              <strong>{{ day.label }}</strong>
              <span>{{ day.date }}</span>
              <div class="week-day-mood">{{ day.mood?.emoji || '·' }}</div>
              <small>{{ day.mood?.moodName || 'Pas noté' }}</small>
            </div>
          </div>

          <div class="week-meta">
            <span>{{ weekFilledDays }}/7 jours où tu as pris un moment pour toi</span>
            <span v-if="weekDominant">Ton humeur la plus présente : {{ weekDominant.emoji }} {{ weekDominant.name }}</span>
            <span v-else>Ta semaine se dessinera ici, à ton rythme.</span>
          </div>
        </section>

        <section class="insight-card insight-sage">
          <div class="insight-mark">👀</div>
          <div>
            <span class="eyebrow"><span></span> ce que ma semaine raconte</span>
            <h3>{{ weekDominant ? weekDominant.emoji + " " + weekDominant.name : "Ma semaine commence à prendre forme." }}</h3>
            <p>{{ weekInsight }}</p>
            <div v-if="weekDominant" class="funes-reference">
              <span>Dans la filmographie</span>
              <strong>{{ weekEntries.find(entry => entry.moodName === weekDominant.name)?.film || 'Une scène de Louis de Funès' }}</strong>
            </div>
          </div>
        </section>

      </div>

      <div v-else class="tracking-view">
        <div class="tracking-view-intro">
          <span class="eyebrow"><span></span> janvier → décembre · {{ year }}</span>
          <h2>Mon année</h2>
          <p>Quelques traces de ton année pour mieux voir ton rythme, tes moments forts et ceux où tu as eu besoin de souffler.</p>
        </div>

        <section ref="yearFlowRef" class="year-flow">
          <div class="year-flow-line" aria-hidden="true"></div>
          <div
            v-for="month in monthSummaries"
            :key="month.month"
            :ref="month.month === currentMonth ? setCurrentMonthRef : undefined"
            class="year-flow-month"
            :class="{ 'has-data': month.count, current: month.month === currentMonth, selected: month.month === selectedYearMonth }"
            @click="selectedYearMonth = month.month"
          >
            <span class="year-flow-dot">{{ month.dominant?.emoji || '·' }}</span>
            <div class="year-flow-content">
              <strong>{{ month.label }}</strong>
              <small>{{ month.count ? month.count + ' humeur' + (month.count > 1 ? 's' : '') : 'Pas noté' }}</small>
            </div>
          </div>
        </section>

        <section class="month-focus">
          <button class="month-focus-arrow" type="button" :disabled="selectedYearMonth === 0" @click="changeYearMonth(-1)" aria-label="Mois précédent">←</button>
          <div class="month-focus-main">
            <div class="month-focus-heading">
              <div>
                <span class="eyebrow"><span></span> mois sélectionné</span>
                <h3>{{ selectedMonthSummary.fullLabel }}</h3>
              </div>
              <span v-if="selectedMonthSummary.dominant" class="month-focus-mood">{{ selectedMonthSummary.dominant.emoji }}</span>
            </div>
            <p v-if="selectedMonthEntries.length">
              {{ selectedMonthEntries.length }} humeur{{ selectedMonthEntries.length > 1 ? 's' : '' }} enregistrée{{ selectedMonthEntries.length > 1 ? 's' : '' }} ce mois-ci.
              <template v-if="selectedMonthSummary.dominant"> L’humeur la plus présente est {{ selectedMonthSummary.dominant.emoji }} {{ selectedMonthSummary.dominant.name }}.</template>
            </p>
            <p v-else>Aucune humeur enregistrée ce mois-ci.</p>

            <div class="month-focus-facts">
              <span>{{ selectedMonthEntries.length }} humeur{{ selectedMonthEntries.length > 1 ? 's' : '' }} enregistrée{{ selectedMonthEntries.length > 1 ? 's' : '' }} ce mois-ci</span>
              <strong v-if="selectedMonthSummary.dominant">{{ selectedMonthSummary.dominant.emoji }} {{ selectedMonthSummary.dominant.name }}</strong>
            </div>
          </div>
          <button class="month-focus-arrow" type="button" :disabled="selectedYearMonth === 11" @click="changeYearMonth(1)" aria-label="Mois suivant">→</button>
        </section>

        <section class="insight-card insight-gold year-reflection">
          <div class="insight-mark">✨</div>
          <div>
            <span class="eyebrow"><span></span> ce que mon année raconte</span>
            <h3>{{ yearEntries.length ? "Une année faite de petits moments." : "Ton année attend ses premiers souvenirs." }}</h3>
            <p>{{ yearEntries.length ? "Tu as pris le temps de noter ton humeur " + yearFilledDays + " jour" + (yearFilledDays > 1 ? "s" : "") + ". Regarde surtout les périodes où tu t’es senti bien, fatigué ou plus tendu : elles peuvent t’aider à mieux comprendre ton rythme." : "Quelques humeurs suffiront déjà à faire apparaître des repères. Il n’y a rien à réussir ici." }}</p>
            <div v-if="yearDominant" class="funes-reference">
              <span>La scène qui revient le plus</span>
              <strong>{{ yearEntries.find(entry => entry.moodName === yearDominant.name)?.film || 'Une scène de Louis de Funès' }}</strong>
            </div>
          </div>
        </section>

        <section v-if="yearEntries.length" class="tracking-card mood-distribution">
          <div class="tracking-card-heading">
            <span class="eyebrow"><span></span> mes traces de l’année</span>
            <h2>Ce qui revient<br><i>au fil des mois.</i></h2>
          </div>
          <div class="donut-layout">
            <div class="mood-donut" aria-hidden="true">
              <svg viewBox="0 0 120 120">
                <circle class="donut-track" cx="60" cy="60" r="26" />
                <circle
                  v-for="item in yearDonut"
                  :key="item.name"
                  class="donut-segment"
                  cx="60" cy="60" r="26"
                  :stroke="item.color"
                  :stroke-dasharray="item.dasharray"
                  :stroke-dashoffset="item.dashoffset"
                />
              </svg>
              <div class="donut-center"><strong>{{ yearEntries.length }}</strong><span>humeurs</span></div>
            </div>
            <div class="donut-legend">
              <div v-for="item in yearDonut" :key="item.name" class="donut-legend-item">
                <span class="donut-dot" :style="{ background: item.color }"></span>
                <span class="donut-name">{{ item.emoji }} {{ item.name }}</span>
                <strong>{{ item.percent }}%</strong>
              </div>
            </div>
          </div>
          <p class="tracking-disclaimer">Ces chiffres correspondent uniquement aux humeurs que tu as enregistrées.</p>
        </section>
      </div>
    </div>
  </section>
</template>
