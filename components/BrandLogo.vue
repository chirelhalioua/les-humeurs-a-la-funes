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
    <desc id="brand-desc">Logo des Humeurs à la Funes avec un clap de cinéma dans un médaillon rond.</desc>

    <!-- Médaillon rond conservé + clap inspiré de l'emoji cinéma -->
    <g transform="translate(7 8)">
      <circle cx="52" cy="51" r="48" fill="var(--sage-soft)"/>
      <circle cx="52" cy="51" r="48" fill="none" stroke="var(--cocoa)" stroke-width="4"/>

      <!-- clap de tournage : silhouette proche de 🎬 -->
      <g transform="translate(13 13)">
        <!-- charnière / corps -->
        <rect x="11" y="39" width="56" height="45" rx="11"
          fill="var(--paper)" stroke="var(--cocoa)" stroke-width="5"/>

        <!-- clap supérieur ouvert -->
        <path d="M7 38 L17 17 Q18 14 22 14 H69 Q72 14 73 17 L80 35 Q81 38 77 38 Z"
          fill="var(--cocoa)" stroke="var(--cocoa)" stroke-width="3" stroke-linejoin="round"/>

        <!-- bandes diagonales caractéristiques du clap -->
        <path d="M24 16 L36 35 M42 16 L54 35 M60 16 L72 35"
          fill="none" stroke="var(--gold)" stroke-width="6" stroke-linecap="round"/>

        <!-- ligne de séparation du clap -->
        <path d="M12 40h54" stroke="var(--cocoa)" stroke-width="5" stroke-linecap="round"/>

        <!-- détails minimalistes dans le clap -->
        <path d="M23 54h25M23 64h18M23 74h25"
          stroke="var(--sage)" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="57" cy="55" r="3.5" fill="var(--peach)"/>
        <circle cx="57" cy="65" r="3.5" fill="var(--sage)"/>
        <circle cx="57" cy="75" r="3.5" fill="var(--gold)"/>
      </g>
    </g>

    <text x="124" y="52"
      fill="var(--cocoa)"
      font-family="Sora, Inter, Arial, sans-serif"
      font-size="34"
      font-weight="800"
      letter-spacing="-1.8">Les Humeurs</text>

    <path d="M126 66h72" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/>

    <text x="126" y="91"
      fill="var(--brown)"
      font-family="Caveat, Inter, cursive"
      font-size="27"
      font-weight="600">à la Funes</text>

    <circle cx="268" cy="84" r="4" fill="var(--gold)"/>
    <circle cx="283" cy="84" r="4" fill="var(--peach)"/>
    <circle cx="298" cy="84" r="4" fill="var(--sage)"/>
  </svg>
</template>
