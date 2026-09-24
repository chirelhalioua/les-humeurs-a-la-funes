<script setup lang="ts">
const moods = [
  { emoji:'🤩', name:'Heureux', tone:'gold' },
  { emoji:'😌', name:'Bien', tone:'sage' },
  { emoji:'😐', name:'Moyen', tone:'sand' },
  { emoji:'😴', name:'Fatigué', tone:'peach' },
  { emoji:'😡', name:'Énervé', tone:'cocoa' }
]
</script>

<template>
  <section class="home">
    <div class="home-copy">
      <div class="eyebrow"><span></span> Les Humeurs à la Funes</div>
      <h1>On fait le point<br><i>sur ton humeur ?</i></h1>
      <p class="intro">Un petit moment pour dire comment tu vas, sans avoir besoin de trouver les bons mots.</p>
      <NuxtLink to="/choisir-humeurs" class="primary-button">Choisir mon humeur <span>↗</span></NuxtLink>
      <p class="microcopy">Simple. Rapide. Sans jugement.</p>
    </div>

    <div class="home-funes">
      <div class="funes-card">
        <div class="funes-topline"><span>★</span> LE PETIT MOT DU JOUR</div>
        <div class="funes-portrait" aria-hidden="true">
          <span class="portrait-head">•ᴗ•</span>
          <span class="portrait-bow">⌁</span>
        </div>
        <blockquote>« Le rire, c’est ce dont on a besoin avant toute chose. »</blockquote>
        <cite>— Louis de Funès</cite>
        <p class="quote-source">Entretien, 1971</p>
      </div>
      <div class="film-stamp">LES<br>HUMEURS<br>À LA FUNES</div>
    </div>

    <div class="mood-strip" aria-label="Les cinq humeurs">
      <NuxtLink
        v-for="mood in moods"
        :key="mood.name"
        to="/choisir-humeurs"
        class="mood-chip"
        :class="'tone-'+mood.tone"
      >
        <span>{{ mood.emoji }}</span>
        <strong>{{ mood.name }}</strong>
      </NuxtLink>
    </div>

    <div class="home-lower">
      <div><span class="number">01</span><b>Je ressens</b><p>Je choisis l’humeur qui me ressemble.</p></div>
      <div><span class="number">02</span><b>Je regarde</b><p>Je retrouve mon évolution dans le temps.</p></div>
      <div><span class="number">03</span><b>Je respire</b><p>Un espace personnel, à mon rythme.</p></div>
    </div>
  </section>
</template>