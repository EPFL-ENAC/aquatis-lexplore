<template>
    <q-layout view="hHh LpR lFf">
        <AppHeader />

        <q-drawer v-model="leftDrawerOpen" :breakpoint="0" :width="314" bordered />

        <q-page-container>
            <q-page class="leman-page text-white">
                <div class="layout-content">
                    <div class="page-shell">
                        <router-view />
                    </div>

                    <footer class="app-footer">
                        <div class="footer-logos">
                            <img
                                v-for="logo in logos"
                                :key="logo.name"
                                :src="logo.src"
                                :alt="logo.name"
                                class="footer-logo"
                            />
                        </div>
                    </footer>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from 'src/components/AppHeader.vue';

const leftDrawerOpen = ref(false);

const logos = [
    { name: 'Eawag', src: '/logos/eawag.svg' },
    { name: 'UNIL', src: '/logos/unil.svg' },
    { name: 'EPFL', src: '/logos/epfl_blue.svg' },
    { name: 'Université de Genève', src: '/logos/unige.svg' },
    { name: 'CARRTEL', src: '/logos/carrtel.svg' },
];
</script>

<style scoped lang="scss">
.leman-page {
    min-height: 100vh;
    background:
        radial-gradient(circle at top center, rgba(0, 210, 255, 0.14), transparent 38%),
        linear-gradient(180deg, #073640 0%, #03161b 55%, #00090c 100%);
}

.layout-content {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.page-shell {
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    padding: 4rem;
    flex: 1;
}

.app-footer {
    width: 100%;
    padding: 32px 24px 40px;
}

.footer-logos {
    max-width: 1080px;
    margin: 0 auto;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 28px;
    flex-wrap: wrap;
}

.footer-logo {
    height: 28px;
    width: auto;
    object-fit: contain;
    opacity: 0.9;
}

@media (max-width: 640px) {
    .page-shell {
        padding: 36px 16px 24px;
    }

    .app-footer {
        padding: 24px 16px 32px;
    }

    .footer-logos {
        gap: 20px;
        padding-top: 20px;
    }

    .footer-logo {
        height: 22px;
    }
}
</style>
