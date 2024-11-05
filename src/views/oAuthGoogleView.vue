<script setup>
    import { ref } from 'vue'
    import { GoogleLogin } from 'vue3-google-login'
    const data = ref()
    const callback = (response) => {
    data.value = response.credential;
}
</script>

<template>
    <!-- <div>
        <button class="btn bg-gradient-info">Google</button>
    </div> -->
    <div>
    <GoogleLogin :callback="callback"/>
    <p>
      {{ data }}
    </p>
  </div>
</template>

<style lang="css" scoped>
    p 
    {
        margin-top: 12px;
        word-break: break-all;
    }
</style>