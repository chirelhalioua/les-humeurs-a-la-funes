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
const selected = ref('')

const selectMood = (name: string) => {
  selected.value = name
}
</script>

<template>
  <section class="mood-page">
    <div class="page-heading">
      <span class="eyebrow"><span></span> maintenant</span>
      <h1>Quelle tête fait<br><i>ta journée ?</i></h1>
      <p>Choisis simplement celle qui te ressemble.</p>
    </div>

    <div v-if="pending" class="mood-loading">
      <span class="loading-dot"></span>
      Les humeurs arrivent…
    </div>

    <div v-else-if="error" class="mood-error">
      Impossible de charger les humeurs pour le moment.
    </div>

    <div v-else class="mood-grid">
      <button
        v-for="mood in moods"
        :key="mood.key"
        class="mood-tile"
        :class="[selected === mood.name ? 'selected' : '', 'tone-' + mood.tone]"
        type="button"
        @click="selectMood(mood.name)"
      >
        <img
          v-if="mood.image"
          class="tile-image"
          :src="mood.image"
          :alt="'Louis de Funès — ' + mood.name"
          loading="lazy"
        >

        <span v-else class="tile-emoji">{{ mood.emoji }}</span>

        <span class="tile-content">
          <strong><span class="mood-emoji">{{ mood.emoji }}</span>{{ mood.name }}</strong>
          <small class="mood-quote">« {{ mood.quote }} »</small>
          <small class="mood-film">🎬 {{ mood.film }}</small>
        </span>

        <span class="tile-check">{{ selected === mood.name ? '✓' : '↗' }}</span>
      </button>
    </div>

    <div v-if="selected" class="selection-bar">
      <span>Ton humeur : <b>{{ selected }}</b></span>
      <button type="button">Enregistrer <span>→</span></button>
    </div>
  </section>
</template>
