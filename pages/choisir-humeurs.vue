<script setup lang="ts">
type Mood = {
  key: string
  emoji: string
  name: string
  quote: string
  film: string
  image: string
  tone: string
}

type MoodEntry = {
  id: string
  moodKey: string
  moodName: string
  emoji: string
  moment: string
  exactTime: string | null
  dayKey: string | null
  createdAt: string
  updatedAt: string
}

const { data, pending, error } = await useFetch<Mood[]>('/api/humeurs')
const moods = computed(() => data.value || [])
const currentIndex = ref(0)
const selected = ref<Mood | null>(null)
const saving = ref(false)
const saveError = ref('')
const saved = ref(false)
const loadingToday = ref(false)
const todayEntries = ref<MoodEntry[]>([])

const moments = [
  { key: 'matin', label: 'Matin', hours: '08:00 – 12:00', emoji: '☀️' },
  { key: 'apres-midi', label: 'Après-midi', hours: '12:00 – 18:00', emoji: '🌤️' },
  { key: 'soir', label: 'Soir', hours: '18:00 – 00:00', emoji: '🌙' }
]

const getCurrentMoment = () => {
  const hour = new Date().getHours()
  if (hour >= 18) return 'soir'
  if (hour >= 12) return 'apres-midi'
  return 'matin'
}

const moment = ref(getCurrentMoment())
const exactTime = ref('')

const currentMood = computed(() => moods.value[currentIndex.value] || null)
const currentEntry = computed(() =>
  todayEntries.value.find(entry => entry.moment === moment.value) || null
)
const isEditing = computed(() => Boolean(currentEntry.value))

const todayKey = () => new Intl.DateTimeFormat('sv-SE').format(new Date())

const syncCurrentMoment = () => {
  const entry = currentEntry.value
  exactTime.value = entry?.exactTime || ''

  if (!entry) {
    selected.value = null
    saved.value = false
    return
  }

  const index = moods.value.findIndex(mood => mood.key === entry.moodKey)
  if (index >= 0) {
    currentIndex.value = index
    selected.value = moods.value[index] || null
  }
  saved.value = false
}

const loadTodayEntries = async () => {
  loadingToday.value = true
  try {
    const entries = await $fetch<MoodEntry[]>('/api/suivi-humeurs')
    const key = todayKey()
    todayEntries.value = entries.filter(entry => entry.dayKey === key)
    syncCurrentMoment()
  } catch (e: any) {
    if (e?.statusCode !== 401 && e?.data?.statusCode !== 401) {
      console.error('Impossible de charger les humeurs du jour.', e)
    }
  } finally {
    loadingToday.value = false
  }
}

watch(moment, syncCurrentMoment)

onMounted(loadTodayEntries)

const swipeStartX = ref<number | null>(null)
const swipeStartY = ref<number | null>(null)
const swiping = ref(false)

const handleSwipeStart = (event: TouchEvent) => {
  const touch = event.touches[0]
  if (!touch) return
  swipeStartX.value = touch.clientX
  swipeStartY.value = touch.clientY
  swiping.value = false
}

const handleSwipeMove = (event: TouchEvent) => {
  if (swipeStartX.value === null || swipeStartY.value === null) return
  const touch = event.touches[0]
  if (!touch) return
  const dx = touch.clientX - swipeStartX.value
  const dy = touch.clientY - swipeStartY.value
  if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
    swiping.value = true
    event.preventDefault()
  }
}

const handleSwipeEnd = (event: TouchEvent) => {
  if (swipeStartX.value === null || swipeStartY.value === null) return
  const touch = event.changedTouches[0]
  if (!touch) return
  const dx = touch.clientX - swipeStartX.value
  const dy = touch.clientY - swipeStartY.value
  if (Math.abs(dx) >= 55 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    if (dx < 0) nextMood()
    else previousMood()
  }
  swipeStartX.value = null
  swipeStartY.value = null
  window.setTimeout(() => { swiping.value = false }, 0)
}

const goTo = (index: number) => {
  if (!moods.value.length) return
  currentIndex.value = (index + moods.value.length) % moods.value.length
  selected.value = null
}
const nextMood = () => goTo(currentIndex.value + 1)
const previousMood = () => goTo(currentIndex.value - 1)
const selectCurrent = () => {
  if (currentMood.value) {
    selected.value = currentMood.value
    saveError.value = ''
    saved.value = false
  }
}

const saveMood = async () => {
  if (!selected.value || saving.value) return
  saving.value = true
  saveError.value = ''
  try {
    await $fetch('/api/humeurs/save', {
      method: 'POST',
      body: {
        moodKey: selected.value.key,
        moodName: selected.value.name,
        emoji: selected.value.emoji,
        tone: selected.value.tone,
        quote: selected.value.quote,
        film: selected.value.film,
        image: selected.value.image,
        moment: moment.value,
        exactTime: exactTime.value,
        dayKey: todayKey()
      }
    })
    saved.value = true
    await loadTodayEntries()
    await navigateTo('/suivi-humeurs')
  } catch (e: any) {
    if (e?.statusCode === 401 || e?.data?.statusCode === 401) {
      await navigateTo('/connexion?redirect=/choisir-humeurs')
      return
    }
    saveError.value = e?.data?.statusMessage || 'Impossible d’enregistrer ton humeur.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="mood-page">
    <div class="page-heading">
      <span class="eyebrow"><span></span> aujourd’hui</span>
      <h1>Quelle tête fait<br><i>ta journée ?</i></h1>
      <p>Une humeur par moment de la journée. Tu peux la modifier à tout moment.</p>
    </div>

    <div v-if="pending || loadingToday" class="mood-loading">
      <span class="loading-dot"></span>
      Les humeurs arrivent…
    </div>

    <div v-else-if="error" class="mood-error">
      Impossible de charger les humeurs pour le moment.
    </div>

    <template v-else-if="currentMood">
      <div class="mood-carousel">
        <button class="carousel-arrow carousel-prev" type="button" aria-label="Humeur précédente" @click="previousMood">‹</button>

        <article
          class="mood-slide"
          :class="['tone-' + currentMood.tone, { selected: selected?.key === currentMood.key }]"
          @click="!swiping && selectCurrent"
          @touchstart.passive="handleSwipeStart"
          @touchmove="handleSwipeMove"
          @touchend="handleSwipeEnd"
        >
          <div class="slide-photo">
            <img
              v-if="currentMood.image"
              :src="currentMood.image"
              :alt="'Louis de Funès — ' + currentMood.name"
            >
            <span v-else>{{ currentMood.emoji }}</span>
          </div>

          <div class="slide-copy">
            <div class="slide-title">
              <span>{{ currentMood.emoji }}</span>
              <h2>{{ currentMood.name }}</h2>
            </div>
            <blockquote>« {{ currentMood.quote }} »</blockquote>
            <p class="slide-film">🎬 {{ currentMood.film }}</p>

            <div class="slide-action">
              <span v-if="selected?.key === currentMood.key" class="selected-label">
                {{ isEditing ? 'Humeur actuelle ✓' : 'Humeur choisie ✓' }}
              </span>
              <span v-else class="choose-label">① Toucher pour choisir cette humeur</span>
            </div>
          </div>
        </article>

        <button class="carousel-arrow carousel-next" type="button" aria-label="Humeur suivante" @click="nextMood">›</button>
      </div>

      <div class="carousel-dots" aria-label="Choisir une humeur">
        <button
          v-for="(mood, index) in moods"
          :key="mood.key"
          type="button"
          :class="{ active: index === currentIndex }"
          :aria-label="'Afficher ' + mood.name"
          @click="goTo(index)"
        ></button>
      </div>
      <div class="carousel-counter">{{ currentIndex + 1 }} / {{ moods.length }}</div>

      <div class="mood-time" :class="{ disabled: !selected }">
        <div class="mood-time-heading">
          <span class="eyebrow"><span></span> ② quand ?</span>
          <p v-if="selected">
            {{ isEditing ? 'Modifie ton humeur pour ce moment si tu le souhaites.' : 'Choisis le moment où tu ressens cette humeur.' }}
          </p>
          <p v-else>Choisis d’abord ton humeur ci-dessus.</p>
        </div>

        <div class="moment-options">
          <button
            v-for="item in moments"
            :key="item.key"
            type="button"
            class="moment-option"
            :class="{ active: moment === item.key }"
            @click="selected && (moment = item.key)"
          >
            <span class="moment-emoji">{{ item.emoji }}</span>
            <strong>{{ item.label }}</strong>
            <small>{{ item.hours }}</small>
            <span v-if="todayEntries.some(entry => entry.moment === item.key)" class="moment-saved">✓ noté</span>
          </button>
        </div>

        <label class="exact-time">
          Heure précise <span>(facultatif)</span>
          <input v-model="exactTime" type="time" :disabled="!selected">
        </label>

        <p v-if="currentEntry" class="mood-update-note">
          Ton humeur {{ moment === 'apres-midi' ? 'de l’après-midi' : moment }} est déjà notée. La prochaine sauvegarde la remplacera.
        </p>

        <p v-if="saveError" class="mood-save-error">{{ saveError }}</p>
        <button type="button" class="mood-final-save" :disabled="!selected || saving" @click="saveMood">
          {{ saving ? 'Enregistrement…' : isEditing ? 'Mettre à jour mon humeur' : 'Enregistrer mon humeur' }} <span>→</span>
        </button>
      </div>
    </template>
  </section>
</template>
