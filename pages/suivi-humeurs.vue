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

const moodStats = computed(() => {
  const counts = new Map<string, { name: string; emoji: string; count: number }>()
  for (const entry of entries.value) {
    const current = counts.get(entry.moodName)
    if (current) current.count += 1
    else counts.set(entry.moodName, { name: entry.moodName, emoji: entry.emoji, count: 1 })
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)
})

const dominantMood = computed(() => moodStats.value[0] || null)
const lastEntry = computed(() => entries.value[0] || null)
const maxCount = computed(() => Math.max(1, ...moodStats.value.map(item => item.count)))
</script>

<template>
  <section class="tracking-page">
    <div class="page-heading">
      <span class="eyebrow"><span></span> mon suivi</span>
      <h1>Mon humeur<br><i>dans le temps.</i></h1>
      <p>Un petit regard sur ce que tu ressens, sans jugement.</p>
    </div>

    <div v-if="pending" class="mood-loading">Ton suivi arrive…</div>
    <div v-else-if="error" class="mood-error">Impossible de charger ton suivi.</div>

    <div v-else-if="!entries.length" class="tracking-empty">
      <span>◔</span>
      <h2>Pas encore d’humeur enregistrée.</h2>
      <p>Choisis ton humeur pour commencer ton suivi.</p>
      <NuxtLink to="/choisir-humeurs" class="primary-button">Choisir mon humeur <span>→</span></NuxtLink>
    </div>

    <template v-else>
      <div class="tracking-summary">
        <div class="tracking-stat">
          <span class="tracking-stat-label">HUMEURS NOTÉES</span>
          <strong>{{ entries.length }}</strong>
          <small>au total</small>
        </div>
        <div class="tracking-stat">
          <span class="tracking-stat-label">DERNIÈRE HUMEUR</span>
          <strong>{{ lastEntry?.emoji }} {{ lastEntry?.moodName }}</strong>
          <small>{{ lastEntry ? formatDate(lastEntry.createdAt) : '' }}</small>
        </div>
        <div class="tracking-stat">
          <span class="tracking-stat-label">LA PLUS PRÉSENTE</span>
          <strong>{{ dominantMood?.emoji }} {{ dominantMood?.name }}</strong>
          <small>{{ dominantMood?.count }} fois</small>
        </div>
      </div>

      <div class="tracking-content">
        <section class="tracking-card">
          <div class="tracking-card-heading">
            <div>
              <span class="eyebrow"><span></span> répartition</span>
              <h2>Ce qui revient<br><i>le plus souvent.</i></h2>
            </div>
          </div>

          <div class="mood-bars">
            <div v-for="item in moodStats" :key="item.name" class="mood-bar">
              <div class="mood-bar-label">
                <span>{{ item.emoji }} {{ item.name }}</span>
                <strong>{{ item.count }}</strong>
              </div>
              <div class="mood-bar-track">
                <span :style="{ width: ((item.count / maxCount) * 100) + '%' }"></span>
              </div>
            </div>
          </div>
        </section>

        <section class="tracking-card">
          <div class="tracking-card-heading">
            <div>
              <span class="eyebrow"><span></span> historique</span>
              <h2>Les dernières<br><i>humeurs.</i></h2>
            </div>
            <NuxtLink to="/choisir-humeurs" class="tracking-add">+ Ajouter</NuxtLink>
          </div>

          <div class="tracking-list">
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
      </div>
    </template>
  </section>
</template>
