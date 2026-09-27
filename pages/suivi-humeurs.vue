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
      count: monthEntries.length,
      dominant: dominant ? { name: dominant[0], emoji: moodEmojis[dominant[0]] || '🙂' } : null
    }
  })
)

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
      <p>Un espace pour regarder ce que tes humeurs te montrent, sans transformer ta journée en tableau de statistiques.</p>
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
          <p>Un coup d’œil sur tes journées, puis un petit repère pour comprendre ce qui revient.</p>
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
            <span>{{ weekFilledDays }}/7 jours renseignés</span>
            <span>{{ weekEntries.length }} humeur{{ weekEntries.length > 1 ? 's' : '' }} notée{{ weekEntries.length > 1 ? 's' : '' }}</span>
          </div>
        </section>

        <section class="insight-card insight-sage">
          <div class="insight-mark">👀</div>
          <div>
            <span class="eyebrow"><span></span> ce que je remarque</span>
            <h3>Ta semaine commence à prendre forme.</h3>
            <p>{{ weekInsight }}</p>
          </div>
        </section>

        <section v-if="weekEntries.length" class="tracking-card mood-distribution">
          <div class="tracking-card-heading">
            <span class="eyebrow"><span></span> mes humeurs</span>
            <h2>Ce qui revient<br><i>cette semaine.</i></h2>
          </div>
          <div class="mood-bars">
            <div v-for="item in weekMoodStats" :key="item.name" class="mood-bar">
              <div class="mood-bar-label">
                <span>{{ item.emoji }} {{ item.name }}</span>
                <strong>{{ item.count }}</strong>
              </div>
              <div class="mood-bar-track"><span :style="{ width: ((item.count / Math.max(1, ...weekMoodStats.map(item => item.count))) * 100) + '%' }"></span></div>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="tracking-view">
        <div class="tracking-view-intro">
          <span class="eyebrow"><span></span> janvier → décembre · {{ year }}</span>
          <h2>Mon année</h2>
          <p>Une vue d’ensemble légère pour voir les grands repères de ton année.</p>
        </div>

        <section ref="yearFlowRef" class="year-flow">
          <div class="year-flow-line" aria-hidden="true"></div>
          <div
            v-for="month in monthSummaries"
            :key="month.month"
            :ref="month.month === currentMonth ? setCurrentMonthRef : undefined"
            class="year-flow-month"
            :class="{ 'has-data': month.count, current: month.month === currentMonth }"
          >
            <span class="year-flow-dot">{{ month.dominant?.emoji || '·' }}</span>
            <div class="year-flow-content">
              <strong>{{ month.label }}</strong>
              <small>{{ month.count ? month.count + ' humeur' + (month.count > 1 ? 's' : '') : 'Pas noté' }}</small>
            </div>
          </div>
        </section>

        <div class="year-overview">
          <div><strong>{{ yearFilledDays }}</strong><span>jours renseignés</span></div>
          <div><strong>{{ yearEntries.length }}</strong><span>humeurs notées</span></div>
          <div><strong>{{ yearDominant ? yearDominant.emoji : '—' }}</strong><span>{{ yearDominant ? yearDominant.name : 'à découvrir' }}</span></div>
        </div>

        <section class="insight-card insight-gold">
          <div class="insight-mark">✨</div>
          <div>
            <span class="eyebrow"><span></span> mes repères</span>
            <h3>Une année qui se dessine petit à petit.</h3>
            <p>{{ yearInsight }}</p>
          </div>
        </section>

        <section v-if="yearEntries.length" class="tracking-card mood-distribution">
          <div class="tracking-card-heading">
            <span class="eyebrow"><span></span> vue d’ensemble</span>
            <h2>Mes humeurs<br><i>au fil de l’année.</i></h2>
          </div>
          <div class="mood-bars">
            <div v-for="item in yearMoodStats" :key="item.name" class="mood-bar">
              <div class="mood-bar-label">
                <span>{{ item.emoji }} {{ item.name }}</span>
                <strong>{{ item.count }}</strong>
              </div>
              <div class="mood-bar-track"><span :style="{ width: ((item.count / Math.max(1, ...yearMoodStats.map(item => item.count))) * 100) + '%' }"></span></div>
            </div>
          </div>
          <p class="tracking-disclaimer">Ces chiffres correspondent uniquement aux humeurs que tu as enregistrées.</p>
        </section>
      </div>
    </div>
  </section>
</template>
