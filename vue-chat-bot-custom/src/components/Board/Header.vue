<template lang="pug">
.qkb-board-header
  slot(name="header")
    .qkb-board-header__title {{ botTitle }}
  div.qkb-board-header__close(@click="$emit('close-bot')")
    img(
      :src="iconCloseSrc"
      width="24"
      height="24"
    )
</template>
<script>
export default {
  props: {
    botTitle: {
      type: String,
      default: 'Chatbot'
    },

    iconCloseSrc: {
      type: String,
      default: "/icons/arrow-down-invert.svg",
    }
  }
}
</script>
