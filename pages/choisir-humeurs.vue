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

const { data, pending, error } = await useFetch<Mood[]>('/api/humeurs')
const moods = computed(() => data.value || [])
const currentIndex = ref(0)
const selected = ref<Mood | null>(null)
const saving = ref(false)
const saveError = ref('')
const saved = ref(false)
const moment = ref('matin')
const exactTime = ref('')
const moments = [
  { key: 'matin', label: 'Matin', hours: '06:00 – 11:59', emoji: '☀️' },
  { key: 'apres-midi', label: 'Après-midi', hours: '12:00 – 17:59', emoji: '🌤️' },
  { key: 'soir', label: 'Soir', hours: '18:00 – 23:59', emoji: '🌙' }
]
const currentMood = computed(() => moods.value[currentIndex.value] || null)

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
        exactTime: exactTime.value
      }
    })
    saved.value = true
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
      <span class="eyebrow"><span></span> maintenant</span>
      <h1>Quelle tête fait<br><i>ta journée ?</i></h1>
      <p>Fais défiler les humeurs et choisis celle qui te ressemble.</p>
    </div>

    <div v-if="pending" class="mood-loading">
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
              <span v-if="selected?.key === currentMood.key" class="selected-label">Humeur choisie ✓</span>
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
          <p v-if="selected">Choisis le moment où tu ressens cette humeur.</p>
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
          </button>
        </div>
        <label class="exact-time">
          Heure précise <span>(facultatif)</span>
          <input v-model="exactTime" type="time" :disabled="!selected">
        </label>
        <p v-if="saveError" class="mood-save-error">{{ saveError }}</p>
        <button type="button" class="mood-final-save" :disabled="!selected || saving" @click="saveMood">
          {{ saving ? 'Enregistrement…' : 'Enregistrer mon humeur' }} <span>→</span>
        </button>
      </div>
    </template>
  </section>
</template>
