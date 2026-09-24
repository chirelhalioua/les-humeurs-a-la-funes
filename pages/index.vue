<script setup lang="ts">
const moods = [
  { emoji:'🤩', name:'Heureux', tone:'gold', note:'plein d’énergie' },
  { emoji:'😌', name:'Bien', tone:'sage', note:'ça roule' },
  { emoji:'😐', name:'Moyen', tone:'sand', note:'sans plus' },
  { emoji:'😢', name:'Pas top', tone:'peach', note:'journée compliquée' },
  { emoji:'😡', name:'Nul', tone:'cocoa', note:'j’ai besoin d’air' }
]
</script>

<template>
  <section class="home">
    <div class="home-copy">
      <div class="eyebrow"><span></span> le baromètre du jour</div>
      <h1>Alors…<br><i>comment ça va ?</i></h1>
      <p class="intro">Pas besoin de trouver les bons mots. Choisis simplement l’humeur qui te ressemble aujourd’hui.</p>
      <NuxtLink to="/choisir-humeurs" class="primary-button">Déposer mon humeur <span>↗</span></NuxtLink>
      <p class="microcopy">Une minute pour toi. Rien de plus.</p>
    </div>

    <div class="mood-orbit" aria-label="Les cinq humeurs">
      <div class="orbit-ring"></div>
      <div class="mood-center">
        <span class="center-face">☺</span>
        <small>aujourd’hui</small>
      </div>
      <NuxtLink
        v-for="(mood, i) in moods"
        :key="mood.name"
        :to="'/choisir-humeurs'"
        class="mood-bubble"
        :class="['bubble-'+i, 'tone-'+mood.tone]"
        :aria-label="mood.name"
      >
        <span class="bubble-emoji">{{ mood.emoji }}</span>
        <strong>{{ mood.name }}</strong>
      </NuxtLink>
    </div>

    <div class="funes-note">
      <span class="ticket">★</span>
      <span><b>Petit clin d’œil à Louis de Funès</b><br>Parce qu’une émotion peut aussi être… franchement expressive.</span>
    </div>
  </section>

  <section class="home-lower">
    <div><span class="number">01</span><b>Je ressens</b><p>Je choisis l’humeur qui correspond le mieux à mon moment.</p></div>
    <div><span class="number">02</span><b>Je regarde</b><p>Mon suivi m’aide à voir mes évolutions sans me juger.</p></div>
    <div><span class="number">03</span><b>Je respire</b><p>Un espace simple, personnel, et à mon rythme.</p></div>
  </section>
</template>