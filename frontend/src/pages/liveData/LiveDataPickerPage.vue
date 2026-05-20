<template>
    <div class="visual-menu">
        <q-card
            v-for="item in items"
            :key="item.title"
            flat
            bordered
            tag="a"
            :href="item.href"
            :target="item.target"
            :rel="item.target === '_blank' ? 'noopener noreferrer' : undefined"
            class="visual-card text-white"
        >
            <div class="visual-card__media">
                <q-img
                    v-if="item.image"
                    :src="item.image"
                    fit="contain"
                    no-spinner
                    class="visual-card__image"
                />

                <q-icon
                    v-else
                    :name="item.icon"
                    :class="item.accentTextClass || 'text-primary'"
                    size="56px"
                />
            </div>

            <div class="visual-card__content">
                <div class="visual-card__eyebrow" :class="item.accentTextClass || 'text-primary'">
                    {{ item.eyebrow }}
                </div>

                <div class="visual-card__title">
                    {{ item.title }}
                </div>
            </div>

            <div class="visual-card__action" :class="item.actionBgClass || 'bg-primary'">
                <q-icon name="chevron_right" size="24px" color="black" />
            </div>
        </q-card>
    </div>
</template>

<script setup lang="ts">
export type VisualCardMenuItem = {
    eyebrow: string;
    title: string;
    href: string;
    target?: '_self' | '_blank' | '_parent' | '_top';
    icon?: string;
    image?: string;
    accentTextClass?: string;
    actionBgClass?: string;
};

defineProps<{
    items: VisualCardMenuItem[];
}>();
</script>

<style scoped>
.visual-menu {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.visual-card {
    display: flex;
    align-items: stretch;
    min-height: 114px;
    border-radius: 24px;
    overflow: hidden;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.06) 100%);
    backdrop-filter: blur(10px);
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
    transition:
        transform 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease,
        background 0.18s ease;
}

.visual-card:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.22);
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0.07) 100%
    );
    box-shadow: 0 18px 38px rgba(0, 0, 0, 0.26);
}

.visual-card:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.55);
    outline-offset: 4px;
}

.visual-card__media {
    width: 124px;
    min-width: 124px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    background: rgba(0, 173, 199, 0.08);
    border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.visual-card__image {
    width: 100%;
    height: 100%;
    min-height: 72px;
}

.visual-card__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px 22px 20px 32px;
}

.visual-card__eyebrow {
    margin-bottom: 8px;
    font-size: 1rem;
    line-height: 1.1;
    font-weight: 800;
}

.visual-card__title {
    max-width: 360px;
    font-size: clamp(1.7rem, 3vw, 2.35rem);
    line-height: 0.98;
    font-weight: 800;
    letter-spacing: -0.03em;
}

.visual-card__action {
    width: 96px;
    min-width: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.visual-card__action::before {
    content: '';
    width: 48px;
    height: 48px;
    border-radius: 9999px;
    position: absolute;
    opacity: 0;
}

.visual-card__action .q-icon {
    width: 48px;
    height: 48px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: currentColor;
}

.visual-card__action.bg-primary .q-icon,
.visual-card__action.bg-warning .q-icon,
.visual-card__action.bg-negative .q-icon {
    background: transparent;
}

.visual-card__action.bg-primary {
    color: var(--q-primary);
}

.visual-card__action.bg-warning {
    color: var(--q-warning);
}

.visual-card__action.bg-negative {
    color: var(--q-negative);
}

.visual-card__action.bg-primary .q-icon,
.visual-card__action.bg-warning .q-icon,
.visual-card__action.bg-negative .q-icon {
    background: currentColor;
}

.visual-card__action .q-icon :deep(svg),
.visual-card__action .q-icon :deep(i) {
    color: #000;
}

.visual-card:hover .visual-card__action .q-icon {
    transform: translateX(2px);
}

.visual-card__action .q-icon {
    transition: transform 0.18s ease;
}

@media (max-width: 640px) {
    .visual-card {
        min-height: 96px;
    }

    .visual-card__media {
        width: 92px;
        min-width: 92px;
        padding: 14px;
    }

    .visual-card__content {
        padding: 16px 14px 16px 18px;
    }

    .visual-card__title {
        font-size: 1.5rem;
    }

    .visual-card__eyebrow {
        font-size: 0.92rem;
    }

    .visual-card__action {
        width: 72px;
        min-width: 72px;
    }

    .visual-card__action .q-icon {
        width: 42px;
        height: 42px;
    }
}
</style>
