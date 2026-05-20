<template>
    <div class="qr-wrap">
        <div class="qr-card">
            <q-icon name="qr_code_2" size="60px" color="primary" />
            <div class="qr-label text-primary">En savoir plus</div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
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
</style>
