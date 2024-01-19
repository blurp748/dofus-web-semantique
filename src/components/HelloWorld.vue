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
  const height = window.innerHeight - (window.innerHeight/6);
  const canvas = t.value;
  canvas.width = width;
  canvas.height = height;

  const {elements, relations} = getComputedOntology()
  console.log(elements, relations);
  const g = new Graph(elements, relations);

  g.$onInit();


})

</script>

<template>
  <section>
    <hgroup>
      <h1>DofusMonsters</h1>
      <h3>&nbsp;Search for a node
        <label class="input">
          <input class="input__field" type="text" placeholder=" " />
          <span class="input__label">Some Fancy Label</span>
        </label>
        <button>Search</button></h3>
    </hgroup>
    <canvas ref="t" id="myCanvas"></canvas>
  </section>
</template>

<style scoped>

h3{
  display: flex;
  gap:16px;
}

canvas{
  margin-top: 3em;
}
button{
  background-color:blue;
  color:red;
}
</style>

