<script setup lang="ts">
const moods = [
  { emoji:'🤩', name:'Heureux', phrase:'Tout va plutôt très bien.' },
  { emoji:'😌', name:'Bien', phrase:'Une bonne journée, simplement.' },
  { emoji:'😐', name:'Moyen', phrase:'Ni vraiment bien, ni vraiment mal.' },
  { emoji:'😢', name:'Pas top', phrase:'J’ai connu des jours plus simples.' },
  { emoji:'😡', name:'Nul', phrase:'Là, clairement, c’est compliqué.' }
]
const selected = ref('')
</script>

<template>
  <section class="mood-page">
    <div class="page-heading">
      <span class="eyebrow"><span></span> maintenant</span>
      <h1>Quelle tête fait<br><i>ta journée ?</i></h1>
      <p>Choisis sans réfléchir trop longtemps.</p>
    </div>
    <div class="mood-list">
      <button v-for="mood in moods" :key="mood.name" class="mood-row" :class="{selected:selected===mood.name}" @click="selected=mood.name">
        <span class="row-emoji">{{ mood.emoji }}</span><span class="row-name">{{ mood.name }}</span><span class="row-phrase">{{ mood.phrase }}</span><span class="row-arrow">↗</span>
      </button>
    </div>
    <div v-if="selected" class="selection-bar">
      <span>Ton humeur : <b>{{ selected }}</b></span>
      <button>Enregistrer <span>→</span></button>
    </div>
  </section>
</template>