<template>
    <div class="cards-list">
        <q-card
            v-for="item in items"
            :key="item.id"
            flat
            bordered
            tag="a"
            :href="item.href"
            :target="item.target"
            :rel="item.target === '_blank' ? 'noopener noreferrer' : undefined"
            class="feature-card feature-card--link text-white"
        >
            <q-card-section class="feature-row">
                <div class="feature-icon" :class="item.textClass">
                    <q-icon :name="item.icon" size="28px" />
                </div>

                <div class="feature-content">
                    <div class="feature-kicker" :class="item.textClass">
                        {{ item.id }} · {{ item.kicker }}
                    </div>

                    <div class="feature-title">
                        {{ item.title }}
                    </div>

                    <div class="feature-subtitle text-grey-5">
                        {{ item.subtitle }}
                    </div>
                </div>

                <div class="feature-action" :class="`bg-${item.color}`" aria-hidden="true">
                    <q-icon name="chevron_right" size="24px" color="black" />
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import type { CardMenuItem } from './componentTypes';

defineProps<{
    items: CardMenuItem[];
}>();
</script>

<style scoped>
.cards-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.feature-card {
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.09) 0%,
        rgba(255, 255, 255, 0.06) 100%
    );
    backdrop-filter: blur(10px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.feature-card--link {
    display: block;
    text-decoration: none;
    transition:
        transform 0.18s ease,
        border-color 0.18s ease,
        background 0.18s ease,
        box-shadow 0.18s ease;
}

.feature-card--link:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.2);
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0.08) 100%
    );
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.26);
}

.feature-card--link:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.55);
    outline-offset: 4px;
}

.feature-row {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 22px 20px 22px 24px;
}

.feature-icon {
    width: 48px;
    min-width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.feature-content {
    flex: 1;
    min-width: 0;
}

.feature-kicker {
    margin-bottom: 4px;
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.04em;
}

.feature-title {
    font-size: clamp(1.55rem, 2.8vw, 2.2rem);
    line-height: 1.1;
    font-weight: 800;
}

.feature-subtitle {
    margin-top: 6px;
    font-size: 1rem;
    line-height: 1.35;
}

.feature-action {
    width: 56px;
    height: 56px;
    min-width: 56px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.18s ease;
}

.feature-card--link:hover .feature-action {
    transform: translateX(2px);
}

@media (max-width: 640px) {
    .feature-row {
        padding: 18px 16px;
        gap: 14px;
    }

    .feature-title {
        font-size: 1.35rem;
    }

    .feature-subtitle {
        font-size: 0.92rem;
    }

    .feature-action {
        width: 48px;
        height: 48px;
        min-width: 48px;
    }
}
</style>
