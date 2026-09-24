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
const selected = ref<Mood | null>(null)

const selectMood = (mood: Mood) => {
  selected.value = mood
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

    <template v-else>
      <div class="mood-gallery">
        <button
          v-for="mood in moods"
          :key="mood.key"
          class="mood-choice"
          :class="['tone-' + mood.tone, { selected: selected?.key === mood.key }]"
          :data-quote="mood.quote"
          type="button"
          @click="selectMood(mood)"
        >
          <span class="choice-photo">
            <img
              v-if="mood.image"
              :src="mood.image"
              :alt="'Louis de Funès — ' + mood.name"
              loading="lazy"
            >
            <span v-else class="choice-emoji">{{ mood.emoji }}</span>
          </span>
          <span class="choice-info">
            <strong class="choice-name">{{ mood.emoji }} {{ mood.name }}</strong>
            <small class="choice-quote">« {{ mood.quote }} »</small>
          </span>
          <span class="choice-dot">{{ selected?.key === mood.key ? '✓' : '' }}</span>
        </button>
      </div>

      <Transition name="save-only">
        <div v-if="selected" class="selection-bar mood-save-only">
          <span>{{ selected.emoji }} <b>{{ selected.name }}</b></span>
          <button type="button">Enregistrer <span>→</span></button>
        </div>
      </Transition>

      <p v-if="!selected" class="mood-hint">Choisis ton humeur, puis enregistre-la.</p>
    </template>
  </section>
</template>
