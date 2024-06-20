<template>
  <div class="oauth-container">
    
  </div>
</template>


<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { useRouter } from "vue-router";

import { defineComponent } from "vue";

const getQueryParams = (name: string) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
}

const state = reactive({
  // errGif: new URL(`../../assets/images/401.gif`, import.meta.url).href,
  ewizardClap:
  "https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646",
  dialogVisible: false,
});

const { ewizardClap, dialogVisible } = toRefs(state);

const router = useRouter();

const back = () => {
  router.back();
}

onMounted(() => {
  const code = getQueryParams('code')
  console.log('code:', code)
})

</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;

  .pan-back-btn {
    color: #fff;
    background: #008489;
    border: none !important;
  }

  .pan-gif {
    display: block;
    margin: 0 auto;
  }

  .pan-img {
    display: block;
    width: 100%;
    margin: 0 auto;
  }

  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }

  .list-unstyled {
    font-size: 14px;

    li {
      padding-bottom: 5px;
    }

    a {
      color: #008489;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
