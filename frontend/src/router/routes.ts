import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('pages/IndexPage.vue'),
            },
            {
                path: '/liveData',
                children: [
                    {
                        path: '',
                        component: () => import('pages/liveData/LiveDataPickerPage.vue'),
                    },
                    {
                        path: 'temperatureOverDepth',
                        component: () => import('pages/liveData/TemperatureOverDepthPage.vue'),
                    },
                    {
                        path: 'zooplanctonDepth',
                        component: () => import('pages/liveData/ZooplanctonDepthPage.vue'),
                    },
                    {
                        path: 'algaeConcentrationOverDepth',
                        component: () =>
                            import('pages/liveData/AlgaeConcertrationOverDepthPage.vue'),
                    },
                ],
            },
            {
                path: '/changes',
                children: [
                    {
                        path: '',
                        component: () => import('pages/changes/ChangesPickerPage.vue'),
                    },
                    {
                        path: 'windChange',
                        component: () => import('pages/changes/WindChangePage.vue'),
                    },
                ],
            },
            {
                path: '/games',
                children: [
                    {
                        path: '',
                        component: () => import('pages/games/GamePickerPage.vue'),
                    },
                    {
                        path: 'planctonGame',
                        component: () => import('pages/games/PlanctonGamePage.vue'),
                    },
                    {
                        path: 'temperatureOverDepthGame',
                        component: () => import('pages/games/TemperatureOverDepthGame.vue'),
                    },
                ],
            },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
