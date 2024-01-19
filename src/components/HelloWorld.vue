<script setup>
import {computed, onMounted, ref, reactive, watchEffect} from 'vue'
import Graph from "../controllers/Graph.js";
import {getComputedOntology, depthFirstSearch} from "../utils.js";

defineProps({
  msg: String,
})

let depthRange = ref(1)
let searchText = ref("bouftou")


const t = ref(null);
onMounted(() => {
  const width = window.innerWidth;
  const height = window.innerHeight - (window.innerHeight/6);
  const canvas = t.value;
  canvas.width = width;
  canvas.height = height;
  
  watchEffect(() => {
    const ontology = getComputedOntology()
    const selectedNode = searchText.value.toLowerCase().replaceAll(" ", "_")
    if(ontology.elements[selectedNode]) {
      const {elements, relations} = depthFirstSearch(selectedNode, getComputedOntology(), depthRange.value)
      const g = new Graph(elements, relations, canvas, selectedNode);
      g.$onInit()
    }
  })
})

</script>

<template>
  <section>
    <hgroup>
      <h1>DofusMonsters</h1>
      <h3>&nbsp;Search for a node
        <label class="input">
          <input class="input__field" type="text" placeholder="Node name" v-model="searchText"/>
        </label>
        <label class="input">
          <input type="range" min="1" max="5" step="1" v-model="depthRange">
          {{ depthRange }}
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

