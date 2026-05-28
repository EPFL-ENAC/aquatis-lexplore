<template>
    <q-header class="header">
        <div class="header__inner">
            <div class="header__top">
                <div class="header__logo">
                    <img src="/logo.svg" alt="AQUATIS logo" />
                </div>

                <q-btn-toggle
                    v-model="locale"
                    unelevated
                    rounded
                    no-caps
                    class="header__langs"
                    toggle-text-color="black"
                    text-color="white"
                    :options="languageOptions"
                />
            </div>

            <q-separator dark class="header__separator" />

            <div class="header__stats">
                <div class="live">
                    <span class="live__dot" />
                    <span>{{ t('live') }}</span>
                    <span class="live__time">{{
                        formatTime(weatherStore.data?.timestamps.at(-1), locale)
                    }}</span>
                </div>

                <div class="stats">
                    <div class="stat">
                        <div class="stat__label">{{ t('headerAirTemp') }}</div>
                        <DialValue
                            :value="weatherStore.data?.airTemperature.at(-1) ?? 0"
                            :size="104"
                            :min-value="-10"
                            :max-value="30"
                            unit="°C"
                        />
                    </div>
                    <div class="stat">
                        <div class="stat__label">{{ t('headerWaterTemp') }}</div>
                        <DialValue
                            :value="lakeStore.data?.surfaceTemperature.at(-1) ?? 0"
                            :size="104"
                            :min-value="-10"
                            :max-value="30"
                            unit="°C"
                        />
                    </div>
                    <div class="stat">
                        <div class="stat__label">{{ t('headerWind') }}</div>
                        <div class="stat__row">
                            <WindCompass
                                :wind-direction-deg="
                                    weatherStore.data?.windDirectionDegrees.at(-1) ?? 0
                                "
                                :wind-speed="weatherStore.data?.windSpeed.at(-1) ?? 0"
                                :size="104"
                            />
                            <DialValue
                                :value="weatherStore.data?.windSpeed.at(-1) ?? 0"
                                :size="104"
                            />
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat__label">{{ t('headerWave') }}</div>
                        <DialValue
                            :value="(buoyStore.data?.height.at(-1) ?? 0) * 100"
                            :size="104"
                            :max-value="25"
                            unit="cm"
                        />
                    </div>
                </div>
            </div>
        </div>
    </q-header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useWeatherStore, useLakeStore, useBuoyStore } from 'src/stores/lexplore';
import { formatTime } from 'src/utils/format';
import WindCompass from './WindCompass.vue';
import DialValue from './DialValue.vue';

const weatherStore = useWeatherStore();
const lakeStore = useLakeStore();
const buoyStore = useBuoyStore();
const { locale, t } = useI18n();

const languageOptions = [
    { label: 'FR', value: 'fr' },
    { label: 'EN', value: 'en-US' },
    { label: 'DE', value: 'de' },
    { label: 'IT', value: 'it' },
];
</script>

<style scoped lang="scss">
.header {
    background: linear-gradient(90deg, #02181d, #05343c, #02181d);
    color: white;
}

.header__inner {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.header__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.header__logo {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    color: #00c6df;
}

.header__brand {
    font-weight: 700;
    line-height: 1;
}

.header__subtitle {
    line-height: 1.1;
}

.header__langs {
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
}

.header__separator {
    opacity: 0.25;
}

.header__stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;
}

.live {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    width: fit-content;
    background: rgba(255, 255, 255, 0.06);
}

.live__dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: coral;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}

.live__time {
    padding-left: 0.75rem;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.stats {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
}

.stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.stat__row {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.stat__label {
    opacity: 0.6;
    font-weight: 600;
}

.stat__value {
    font-weight: 700;
    color: #fff;
    font-size: 2rem;
    line-height: 1;
}

.unit {
    font-weight: 400;
    font-size: 1.1rem;
    color: var(--q-primary);
}
</style>
