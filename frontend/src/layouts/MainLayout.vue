<template>
    <q-layout view="hHh LpR lFf">
        <AppHeader />

        <q-drawer v-model="leftDrawerOpen" :breakpoint="0" :width="314" bordered />

        <q-page-container>
            <q-page class="leman-page text-white">
                <div class="page-shell">
                    <router-view />
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from 'src/components/AppHeader.vue';

const leftDrawerOpen = ref(false);
</script>

<style scoped lang="scss">
.leman-page {
    min-height: 100vh;
    background:
        radial-gradient(circle at top center, rgba(0, 210, 255, 0.14), transparent 38%),
        linear-gradient(180deg, #073640 0%, #03161b 55%, #00090c 100%);
}

.page-shell {
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
    padding: 4rem;
}

@media (max-width: 640px) {
    .page-shell {
        padding: 36px 16px 24px;
    }
}
</style>
