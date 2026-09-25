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
    <desc id="brand-desc">Logo souriant et chaleureux des Humeurs à la Funes.</desc>

    <g transform="translate(8 7)">
      <circle cx="50" cy="51" r="42" fill="var(--sage)"/>
      <ellipse cx="70" cy="83" rx="42" ry="20" fill="var(--sand)"/>
      <circle cx="69" cy="58" r="39" fill="var(--paper)" stroke="var(--cocoa)" stroke-width="6"/>

      <path d="M52 53c2-8 13-10 18-2 5-8 15-6 18 2"
        fill="none" stroke="var(--cocoa)" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M49 68c7 12 24 16 37 8"
        fill="none" stroke="var(--cocoa)" stroke-width="6" stroke-linecap="round"/>
      <path d="M84 75c5 4 7 9 6 16"
        fill="none" stroke="var(--cocoa)" stroke-width="5.5" stroke-linecap="round"/>

      <circle cx="28" cy="79" r="11" fill="var(--gold)" stroke="var(--paper)" stroke-width="4"/>
      <path d="M103 19l9-15M120 35l15-5M119 51l17 3"
        fill="none" stroke="var(--gold)" stroke-width="6" stroke-linecap="round"/>
    </g>

    <text x="145" y="54"
      fill="var(--cocoa)"
      font-family="Sora, Inter, Arial, sans-serif"
      font-size="36"
      font-weight="800"
      letter-spacing="-1.8">Les Humeurs</text>

    <rect x="205" y="75" width="24" height="4" rx="2" fill="var(--gold)"/>
    <text x="238" y="82"
      fill="var(--cocoa)"
      font-family="Inter, Arial, sans-serif"
      font-size="20"
      font-weight="500"
      letter-spacing="-0.5">à la Funes</text>
    <rect x="360" y="75" width="24" height="4" rx="2" fill="var(--gold)"/>
  </svg>
</template>
