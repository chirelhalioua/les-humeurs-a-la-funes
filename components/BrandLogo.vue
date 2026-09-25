<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <svg
    class="brand-logo"
    viewBox="0 0 430 118"
    role="img"
    aria-labelledby="brand-title brand-desc"
    v-bind="$attrs"
  >
    <title id="brand-title">Les Humeurs à la Funes</title>
    <desc id="brand-desc">Logo typographique et théâtral des Humeurs à la Funes.</desc>

    <!-- Nouveau concept : médaillon cinéma + bulles d'humeur, sans visage -->
    <g transform="translate(8 9)">
      <circle cx="50" cy="50" r="44" fill="var(--cocoa)"/>
      <circle cx="50" cy="50" r="35" fill="var(--paper)" stroke="var(--gold)" stroke-width="3"/>

      <!-- rideau de théâtre stylisé -->
      <path d="M27 28h46v8c-5-3-9-3-13 0-4 3-8 3-13 0-5-3-9-3-13 0-4 3-6 3-7 3Z"
        fill="var(--peach)"/>
      <path d="M29 36c3 4 5 8 5 13v18h32V49c0-5 2-9 5-13"
        fill="none" stroke="var(--cocoa)" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 43v23M50 43v23M60 43v23"
        stroke="var(--sage)" stroke-width="3" stroke-linecap="round"/>

      <!-- bulles représentant les humeurs -->
      <circle cx="23" cy="76" r="7" fill="var(--gold)"/>
      <circle cx="75" cy="76" r="7" fill="var(--sage)"/>
      <circle cx="50" cy="80" r="5" fill="var(--peach)"/>
      <path d="M19 87l-5 6M81 87l5 6" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/>
    </g>

    <text x="112" y="52"
      fill="var(--cocoa)"
      font-family="Sora, Inter, Arial, sans-serif"
      font-size="34"
      font-weight="800"
      letter-spacing="-1.8">Les Humeurs</text>

    <path d="M114 66h72" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/>

    <text x="114" y="91"
      fill="var(--brown)"
      font-family="Caveat, Inter, cursive"
      font-size="27"
      font-weight="600">à la Funes</text>

    <circle cx="257" cy="84" r="4" fill="var(--gold)"/>
    <circle cx="272" cy="84" r="4" fill="var(--peach)"/>
    <circle cx="287" cy="84" r="4" fill="var(--sage)"/>
  </svg>
</template>
