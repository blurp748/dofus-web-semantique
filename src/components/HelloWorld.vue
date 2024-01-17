<script setup>
import {onMounted, ref} from 'vue'
import Graph from "../controllers/Graph.js";
import {getComputedOntology} from "../utils.js";

defineProps({
  msg: String,
})

const t = ref(null);
onMounted(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvas = t.value;
  canvas.width = width;
  canvas.height = height;

  const {elements, relations} = getComputedOntology()
  console.log(elements, relations);
  const g = new Graph(elements, relations);
  //
  // canvas.style.width = width + 'px';
  // canvas.style.height = height + 'px';
  //

  g.$onInit();


})

</script>

<template>
    <canvas ref="t" id="myCanvas"></canvas>
</template>

<style scoped>

#myCanvas {

}
</style>
