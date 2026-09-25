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

const momentLabels: Record<string, string> = {
  matin: 'Matin',
  'apres-midi': 'Après-midi',
  soir: 'Soir'
}

const moments = [
  { key: 'matin', label: 'Matin', hours: '08:00 – 12:00', emoji: '🌅' },
  { key: 'apres-midi', label: 'Après-midi', hours: '12:00 – 18:00', emoji: '🌤️' },
  { key: 'soir', label: 'Soir', hours: '18:00 – 00:00', emoji: '🌙' }
]

const moodOrder = ['Heureux', 'Bien', 'Moyen', 'Fatigué', 'Énervé']
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

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))

const formatShortDate = (dayKey: string) =>
  new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' })
    .format(parseDayKey(dayKey))
    .replace('.', '')

const getEntryDayKey = (entry: MoodEntry) => entry.dayKey || localDayKey(new Date(entry.createdAt))

const entriesForDay = (dayKey: string) =>
  entries.value.filter(entry => getEntryDayKey(entry) === dayKey)

const todayEntries = computed(() => entriesForDay(todayKey.value))

const moodStats = computed(() => {
  const counts = new Map<string, { name: string; emoji: string; count: number }>()
  for (const entry of entries.value) {
    const current = counts.get(entry.moodName)
    if (current) current.count += 1
    else counts.set(entry.moodName, { name: entry.moodName, emoji: entry.emoji, count: 1 })
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)
})

const maxCount = computed(() => Math.max(1, ...moodStats.value.map(item => item.count)))

const weekDays = computed(() => {
  const date = new Date(todayDate.value)
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + mondayOffset)

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

const year = computed(() => todayDate.value.getFullYear())
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

const yearEntries = computed(() => entries.value.filter(entry => getEntryDayKey(entry).startsWith(`${year.value}-`)))
const yearMoodStats = computed(() => {
  const counts = new Map<string, number>()
  yearEntries.value.forEach(entry => counts.set(entry.moodName, (counts.get(entry.moodName) || 0) + 1))
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, emoji: moodEmojis[name] || '🙂', count }))
})
const yearDominant = computed(() => yearMoodStats.value[0] || null)

const currentMomentEntry = (moment: string) =>
  todayEntries.value.find(entry => entry.moment === moment) || null

const dailyMoodNames = computed(() => todayEntries.value.map(entry => entry.moodName))

const wellbeingAdvice = computed(() => {
  const moods = dailyMoodNames.value
  if (!moods.length) {
    return {
      title: 'Commence doucement',
      text: 'Note ton humeur au fil de la journée. Cela te permettra de mieux voir comment ta journée évolue.'
    }
  }
  if (moods.includes('Énervé')) {
    return {
      title: 'Prends un peu de recul',
      text: 'Si ta journée est chargée, accorde-toi quelques minutes au calme, respire et fais une vraie pause avant de repartir.'
    }
  }
  if (moods.includes('Fatigué')) {
    return {
      title: 'Écoute ton rythme',
      text: 'La fatigue est un bon rappel pour ralentir un peu. Essaie de garder un moment calme pour souffler et récupérer.'
    }
  }
  if (moods.includes('Moyen')) {
    return {
      title: 'Un petit moment pour toi',
      text: 'Ta journée semble plutôt moyenne. Une petite pause, une activité agréable ou quelques minutes loin des écrans peuvent faire du bien.'
    }
  }
  if (moods.every(mood => mood === 'Heureux')) {
    return {
      title: 'Profite de ce bon moment',
      text: 'Ta journée semble lumineuse. Prends le temps de savourer ce qui te fait du bien.'
    }
  }
  return {
    title: 'Continue à t’écouter',
    text: 'Ta journée évolue, et c’est normal. Garde simplement un petit moment pour toi et note ce que tu ressens quand tu en as envie.'
  }
})
</script>

<template>
  <section class="tracking-page">
    <div class="page-heading">
      <span class="eyebrow"><span></span> mon suivi</span>
      <h1>Mon humeur<br><i>dans le temps.</i></h1>
      <p>Retrouve simplement ce que tu as ressenti, aujourd’hui, cette semaine ou cette année.</p>
    </div>

    <div v-if="pending" class="mood-loading">Ton suivi arrive…</div>
    <div v-else-if="error" class="mood-error">Impossible de charger ton suivi.</div>

    <div v-else>
      <div class="tracking-tabs" role="tablist" aria-label="Période du suivi">
        <button :class="{ active: activeView === 'jour' }" @click="activeView = 'jour'">
          <strong>Aujourd’hui</strong><span>Suivi journalier</span>
        </button>
        <button :class="{ active: activeView === 'semaine' }" @click="activeView = 'semaine'">
          <strong>Cette semaine</strong><span>Suivi hebdomadaire</span>
        </button>
        <button :class="{ active: activeView === 'annee' }" @click="activeView = 'annee'">
          <strong>Cette année</strong><span>Suivi annuel</span>
        </button>
      </div>

      <div v-if="activeView === 'jour'" class="tracking-view">
        <div class="tracking-view-intro">
          <span class="eyebrow"><span></span> aujourd’hui · {{ new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(todayDate) }}</span>
          <h2>Ma journée</h2>
          <p>Voici les moments de la journée où tu as déjà noté ton humeur.</p>
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

          <section class="wellbeing-card">
            <div class="wellbeing-icon">💛</div>
            <div>
              <span class="eyebrow"><span></span> une petite idée pour toi</span>
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
          <p>Une vue simple pour voir comment tes humeurs ont évolué au fil des jours.</p>
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
        </section>

        <div class="tracking-summary compact">
          <div class="tracking-stat">
            <span class="tracking-stat-label">JOURS RENSEIGNÉS</span>
            <strong>{{ weekDays.filter(day => day.entries.length).length }}/7</strong>
            <small>cette semaine</small>
          </div>
          <div class="tracking-stat">
            <span class="tracking-stat-label">HUMEURS NOTÉES</span>
            <strong>{{ weekEntries.length }}</strong>
            <small>au total</small>
          </div>
          <div class="tracking-stat">
            <span class="tracking-stat-label">LA PLUS PRÉSENTE</span>
            <strong>{{ weekDominant ? weekDominant.emoji + ' ' + weekDominant.name : '—' }}</strong>
            <small>{{ weekDominant ? weekDominant.count + ' fois' : 'Pas encore assez de données' }}</small>
          </div>
        </div>

        <section class="tracking-card">
          <div class="tracking-card-heading">
            <div>
              <span class="eyebrow"><span></span> répartition</span>
              <h2>Les humeurs de<br><i>ma semaine.</i></h2>
            </div>
          </div>
          <div v-if="!weekEntries.length" class="tracking-inline-empty">Aucune humeur n’a encore été notée cette semaine.</div>
          <div v-else class="mood-bars">
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
          <p>Une vue d’ensemble de tes humeurs mois après mois.</p>
        </div>

        <section class="year-months">
          <article v-for="month in monthSummaries" :key="month.month" class="year-month" :class="{ 'has-data': month.count }">
            <strong>{{ month.label }}</strong>
            <span v-if="month.dominant">{{ month.dominant.emoji }}</span>
            <span v-else class="year-month-empty">·</span>
            <small>{{ month.count ? month.count + ' humeur' + (month.count > 1 ? 's' : '') : 'Pas noté' }}</small>
          </article>
        </section>

        <div class="tracking-summary compact">
          <div class="tracking-stat">
            <span class="tracking-stat-label">JOURS RENSEIGNÉS</span>
            <strong>{{ new Set(yearEntries.map(entry => getEntryDayKey(entry))).size }}</strong>
            <small>cette année</small>
          </div>
          <div class="tracking-stat">
            <span class="tracking-stat-label">HUMEURS NOTÉES</span>
            <strong>{{ yearEntries.length }}</strong>
            <small>au total</small>
          </div>
          <div class="tracking-stat">
            <span class="tracking-stat-label">LA PLUS PRÉSENTE</span>
            <strong>{{ yearDominant ? yearDominant.emoji + ' ' + yearDominant.name : '—' }}</strong>
            <small>{{ yearDominant ? yearDominant.count + ' fois' : 'Pas encore assez de données' }}</small>
          </div>
        </div>

        <section class="tracking-card">
          <div class="tracking-card-heading">
            <div>
              <span class="eyebrow"><span></span> repère annuel</span>
              <h2>Ce qui revient<br><i>le plus souvent.</i></h2>
            </div>
          </div>
          <div v-if="!yearEntries.length" class="tracking-inline-empty">Ton année commencera à se dessiner dès que tu enregistreras des humeurs.</div>
          <div v-else class="mood-bars">
            <div v-for="item in yearMoodStats" :key="item.name" class="mood-bar">
              <div class="mood-bar-label">
                <span>{{ item.emoji }} {{ item.name }}</span>
                <strong>{{ item.count }}</strong>
              </div>
              <div class="mood-bar-track"><span :style="{ width: ((item.count / Math.max(1, ...yearMoodStats.map(item => item.count))) * 100) + '%' }"></span></div>
            </div>
          </div>
          <p v-if="yearEntries.length" class="tracking-disclaimer">Ces chiffres correspondent uniquement aux humeurs que tu as enregistrées.</p>
        </section>
      </div>
    </div>
  </section>
</template>
