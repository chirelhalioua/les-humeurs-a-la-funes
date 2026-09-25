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
    <desc id="brand-desc">Logo des Humeurs à la Funes avec un clap de cinéma inspiré de l'emoji 🎬.</desc>

    <g transform="translate(7 8)">
      <!-- médaillon rond -->
      <circle cx="52" cy="51" r="48" fill="var(--sage-soft)"/>
      <circle cx="52" cy="51" r="48" fill="none" stroke="var(--cocoa)" stroke-width="4"/>

      <!-- clap 🎬 : corps rectangulaire arrondi + battant supérieur ouvert -->
      <g transform="translate(0 -18) scale(1.3)">
        <!-- corps -->
        <rect x="12" y="38" width="58" height="48" rx="10"
          fill="var(--paper)" stroke="var(--cocoa)" stroke-width="5"/>

        <!-- battant inférieur / charnière -->
        <path d="M14 39H68"
          fill="none" stroke="var(--cocoa)" stroke-width="5" stroke-linecap="round"/>

        <!-- battant supérieur : vraie forme de clap, incliné comme 🎬 -->
        <g transform="rotate(-13 40 36)">
          <rect x="7" y="25" width="66" height="17" rx="4"
            fill="var(--cocoa)"/>
          <!-- bandes diagonales -->
          <path d="M20 27l11 13M40 27l11 13M60 27l11 13"
            fill="none" stroke="var(--gold)" stroke-width="6" stroke-linecap="round"/>
        </g>

        <!-- petite charnière visible -->
        <circle cx="17" cy="40" r="4.5" fill="var(--gold)"/>

        <!-- détails du clap -->
        <circle cx="22" cy="55" r="3.5" fill="var(--peach)"/>
        <circle cx="22" cy="65" r="3.5" fill="var(--sage)"/>
        <circle cx="22" cy="75" r="3.5" fill="var(--gold)"/>
        <path d="M29 54h26M29 64h18M29 74h26"
          stroke="var(--sage)" stroke-width="3.5" stroke-linecap="round"/>
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
