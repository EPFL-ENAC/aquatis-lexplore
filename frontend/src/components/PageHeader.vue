<template>
    <header :style="{ '--title-scale': titleScale }">
        <div class="eyebrow text-primary">{{ props.eyebrow }}</div>
        <h1 class="hero-title">
            <slot />
        </h1>
        <p class="hero-subtitle text-grey-5">
            <slot name="subtitle" />
        </p>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    eyebrow: string;
    level: 1 | 2;
}>();

const titleScale = computed(() => (props.level === 1 ? 1 : 0.8));
</script>

<style scoped>
.eyebrow {
    margin-bottom: 18px;
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.08em;
}

.hero-title {
    margin: 0;
    max-width: 720px;
    font-size: calc(var(--title-scale, 1) * clamp(3rem, 7vw, 5.4rem));
    line-height: 0.95;
    font-weight: 800;
    letter-spacing: -0.04em;
}

.hero-subtitle {
    max-width: 660px;
    margin: 26px 0 52px;
    font-size: 1.45rem;
    line-height: 1.35;
    font-weight: 400;
}

.qr-wrap {
    display: flex;
    justify-content: center;
    padding: 120px 0 24px;
}

.qr-card {
    width: 126px;
    height: 126px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.05) 100%
    );
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.qr-label {
    font-size: 0.95rem;
    font-weight: 500;
}

@media (max-width: 640px) {
    .page-shell {
        padding: 36px 16px 24px;
    }

    .hero-subtitle {
        margin: 20px 0 36px;
        font-size: 1.1rem;
    }

    .qr-wrap {
        padding-top: 72px;
    }
}
</style>
