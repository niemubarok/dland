<template>
  <section>
    <q-btn
      v-morph:btn:mygroup:300.resize="morphGroupModel"
      class="fixed-bottom-right q-mr-sm"
      style="margin-bottom: 70px"
      fab
      color="primary"
      size="xs"
      icon="add"
      @click="nextMorph"
    >
    </q-btn>

    <q-card
      v-morph:card1:mygroup:500.resize="morphGroupModel"
      class="fixed-bottom-right q-ma-md bg-grey-1"
      style="
        width: 70%;
        height: 60%;
        border-bottom-left-radius: 2em;
        z-index: 2;
      "
    >
      <q-banner class="text-grey-1 bg-brown-9 text-weight-bolder">
        <q-avatar
          size="20px"
          font-size="15px"
          color="teal"
          text-color="grey-2"
          icon="close"
          class="float-right cursor-pointer"
          @click="nextMorph"
        />
        {{ props.title }}
      </q-banner>

      <q-card-section class="text-h6">
        <slot name="form"></slot>
      </q-card-section>

      <q-card-actions align="right">
        <slot name="button"></slot>
      </q-card-actions>
    </q-card>
  </section>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  title: String,
});

const nextMorphStep = {
  btn: "card1",
  card1: "btn",
};
const morphGroupModel = ref("btn");
const nextMorph = () => {
  morphGroupModel.value = nextMorphStep[morphGroupModel.value];
  console.log(morphGroupModel.value);
};

defineExpose({
  nextMorph,
});
</script>
