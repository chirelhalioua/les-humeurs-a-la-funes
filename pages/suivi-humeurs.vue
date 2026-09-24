<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'] })

type MoodEntry = {
  id: string
  moodName: string
  emoji: string
  moment: string
  exactTime: string | null
  createdAt: string
  film: string
}

const { data, pending, error } = await useFetch<MoodEntry[]>('/api/suivi-humeurs')
const entries = computed(() => data.value || [])

const momentLabels: Record<string, string> = {
  matin: 'Matin',
  'apres-midi': 'Après-midi',
  soir: 'Soir'
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
</script>

<template>
  <section class="tracking-page">
    <div class="page-heading">
      <span class="eyebrow"><span></span> mon suivi</span>
      <h1>Mon humeur<br><i>dans le temps.</i></h1>
      <p>Retrouve ici les humeurs que tu as enregistrées.</p>
    </div>

    <div v-if="pending" class="mood-loading">Ton suivi arrive…</div>
    <div v-else-if="error" class="mood-error">Impossible de charger ton suivi.</div>

    <div v-else-if="!entries.length" class="tracking-empty">
      <span>◔</span>
      <h2>Pas encore d’humeur enregistrée.</h2>
      <p>Choisis ton humeur pour commencer ton suivi.</p>
      <NuxtLink to="/choisir-humeurs" class="primary-button">Choisir mon humeur <span>→</span></NuxtLink>
    </div>

    <div v-else class="tracking-list">
      <article v-for="entry in entries" :key="entry.id" class="tracking-entry">
        <div class="tracking-entry-emoji">{{ entry.emoji }}</div>
        <div class="tracking-entry-main">
          <strong>{{ entry.moodName }}</strong>
          <span>{{ momentLabels[entry.moment] }}<template v-if="entry.exactTime"> · {{ entry.exactTime }}</template></span>
        </div>
        <time>{{ formatDate(entry.createdAt) }}</time>
      </article>
    </div>
  </section>
</template>
