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
const moment = ref('matin')
const exactTime = ref('08:00')
const moments = [
  { key: 'matin', label: 'Matin', hours: '06:00 – 11:59', emoji: '☀️' },
  { key: 'apres-midi', label: 'Après-midi', hours: '12:00 – 17:59', emoji: '🌤️' },
  { key: 'soir', label: 'Soir', hours: '18:00 – 23:59', emoji: '🌙' }
]
const currentMood = computed(() => moods.value[currentIndex.value] || null)

const goTo = (index: number) => {
  if (!moods.value.length) return
  currentIndex.value = (index + moods.value.length) % moods.value.length
  selected.value = null
}
const nextMood = () => goTo(currentIndex.value + 1)
const previousMood = () => goTo(currentIndex.value - 1)
const selectCurrent = () => {
  if (currentMood.value) selected.value = currentMood.value
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
          @click="selectCurrent"
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
              <span v-else class="choose-label">Toucher pour choisir</span>
              <button v-if="selected?.key === currentMood.key" type="button" class="slide-save" @click.stop>
                Enregistrer <span>→</span>
              </button>
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

      <div class="mood-time">
        <div class="mood-time-heading">
          <span class="eyebrow"><span></span> à quel moment ?</span>
          <p>Choisis le moment où tu ressens cette humeur.</p>
        </div>
        <div class="moment-options">
          <button
            v-for="item in moments"
            :key="item.key"
            type="button"
            class="moment-option"
            :class="{ active: moment === item.key }"
            @click="moment = item.key"
          >
            <span class="moment-emoji">{{ item.emoji }}</span>
            <strong>{{ item.label }}</strong>
            <small>{{ item.hours }}</small>
          </button>
        </div>
        <label class="exact-time">
          Heure précise
          <input v-model="exactTime" type="time">
        </label>
      </div>
    </template>
  </section>
</template>
