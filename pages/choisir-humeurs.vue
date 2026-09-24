<script setup lang="ts">
const moods = [
  { emoji:'🤩', name:'Heureux', phrase:'Tout va plutôt très bien.', tone:'gold' },
  { emoji:'😌', name:'Bien', phrase:'Une bonne journée, simplement.', tone:'sage' },
  { emoji:'😐', name:'Moyen', phrase:'Ni vraiment bien, ni vraiment mal.', tone:'sand' },
  { emoji:'😢', name:'Pas top', phrase:'J’ai connu des jours plus simples.', tone:'peach' },
  { emoji:'😡', name:'Nul', phrase:'Là, clairement, c’est compliqué.', tone:'cocoa' }
]
const selected = ref('')
</script>

<template>
  <section class="mood-page">
    <div class="page-heading">
      <span class="eyebrow"><span></span> maintenant</span>
      <h1>Quelle tête fait<br><i>ta journée ?</i></h1>
      <p>Choisis simplement celle qui te ressemble.</p>
    </div>

    <div class="mood-grid">
      <button
        v-for="mood in moods"
        :key="mood.name"
        class="mood-tile"
        :class="[selected===mood.name ? 'selected' : '', 'tone-'+mood.tone]"
        type="button"
        @click="selected=mood.name"
      >
        <span class="tile-emoji">{{ mood.emoji }}</span>
        <span class="tile-content"><strong>{{ mood.name }}</strong><small>{{ mood.phrase }}</small></span>
        <span class="tile-check">{{ selected===mood.name ? '✓' : '↗' }}</span>
      </button>
    </div>

    <div v-if="selected" class="selection-bar">
      <span>Ton humeur : <b>{{ selected }}</b></span>
      <button type="button">Enregistrer <span>→</span></button>
    </div>
  </section>
</template>