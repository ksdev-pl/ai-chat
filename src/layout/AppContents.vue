<script setup lang="ts">
import {computed, ref} from 'vue';
import OpenAI from 'openai';

const input = ref('');
const numOfInputRows = ref(1);

const isSendBtnEnabled = computed(() => input.value?.trim().length > 0);

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function onClick() {
  alert(openai.apiKey);
}
</script>

<template>
  <div class="flex flex-1 flex-col overflow-auto">
    <main class="flex-1 p-4 overflow-auto">
      <div class="bg-gray-100 p-2 rounded mb-4 mr-20">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et imperdiet mauris. Proin lobortis tortor quis urna dictum, sed tincidunt mauris consectetur. Ut id viverra magna. Sed sodales iaculis risus a pulvinar. Curabitur consequat massa vitae risus eleifend sollicitudin. Donec vel enim leo. Morbi nec lectus luctus libero ultricies tempus. Suspendisse eget convallis quam. Phasellus mi libero, faucibus varius fringilla in, placerat nec dolor. Praesent quis dolor sed magna dignissim fermentum. Suspendisse tempor quis eros eu hendrerit. Integer finibus et urna id pulvinar. </div>
      <div class="bg-gray-50 p-2 rounded ml-20"> Nulla at purus eget nisi varius fermentum ut sit amet sapien. Cras aliquam sapien pulvinar mi gravida imperdiet. Duis fermentum augue ex, ut vestibulum sem egestas in. In sed posuere erat. In ut lacinia turpis. In accumsan, tortor vitae tincidunt commodo, sem arcu tincidunt erat, nec facilisis mauris metus ac magna. Duis ullamcorper diam quis elit fermentum pharetra. Suspendisse sed magna id sem condimentum tincidunt id sit amet elit. Phasellus lacus velit, sollicitudin sit amet nibh a, dignissim maximus tellus. Nulla in suscipit eros. Ut porta velit in enim scelerisque, a egestas neque sollicitudin. Nulla metus elit, ultricies non turpis vitae, placerat mollis libero. Nulla pellentesque, libero sed dictum luctus, sapien lectus pretium ligula, ac volutpat nisi mauris in diam. Quisque sed massa in velit finibus ornare. Ut hendrerit metus vitae nulla interdum, mattis dignissim orci finibus.

        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur in blandit sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce diam neque, ullamcorper ut risus nec, eleifend scelerisque velit. Morbi varius sem nec leo lacinia, vel cursus tortor tincidunt. Sed semper est id est lacinia, vel ullamcorper dui mattis. Quisque sit amet tempus mi. </div>
    </main>
    <div class="flex w-full p-4">
      <textarea class="bg-gray-100 flex-grow p-2"
                :rows="numOfInputRows"
                placeholder="Input"
                @focusin="numOfInputRows = 10"
                @focusout="numOfInputRows = 1"
                v-model="input"/>
      <button class="ml-2 p-2 rounded bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:outline active:outline-2 active:outline-blue-500 disabled:bg-gray-100 disabled:text-gray-300 text-white"
              @click="onClick"
              :disabled="!isSendBtnEnabled">
        Send
      </button>
    </div>
  </div>
</template>
