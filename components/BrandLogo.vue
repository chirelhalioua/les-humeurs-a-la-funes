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
    <desc id="brand-desc">Logo cinéma des Humeurs à la Funes avec clap de tournage.</desc>

    <!-- Clap cinéma : symbole immédiatement identifiable -->
    <g transform="translate(8 10)">
      <circle cx="50" cy="49" r="43" fill="var(--sage-soft)"/>
      
      <!-- corps du clap -->
      <rect x="18" y="43" width="64" height="47" rx="7"
        fill="var(--paper)" stroke="var(--cocoa)" stroke-width="4"/>
      
      <!-- bande du clap -->
      <path d="M15 39 L25 23 L83 23 L88 39 Z"
        fill="var(--cocoa)" stroke="var(--cocoa)" stroke-width="3" stroke-linejoin="round"/>
      <path d="M29 24 L40 39 M49 24 L60 39 M69 24 L80 39"
        stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/>

      <!-- petit bouton -->
      <circle cx="73" cy="70" r="5" fill="var(--gold)"/>
      
      <!-- lignes de cinéma -->
      <path d="M29 55h27M29 65h19M29 75h25"
        stroke="var(--sage)" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="67" cy="61" r="3" fill="var(--peach)"/>
      <circle cx="67" cy="70" r="3" fill="var(--sage)"/>
      <circle cx="67" cy="79" r="3" fill="var(--gold)"/>
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
