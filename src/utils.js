import {ontology} from './data.js'
export function getComputedOntology() {
    let elements = {}
    let relations = {} 

    for(const concept of ontology) {
        const source_key = concept.source.toLowerCase().replace(" ", "_");
        const target_key = concept.target.toLowerCase().replace(" ", "_");

        if (!elements[source_key]) {
            elements[source_key] = {name: concept.source}
            relations[source_key] = []
        }
        if (!elements[target_key]) {
            elements[target_key] = {name: concept.target}
            relations[target_key] = []
        }

        relations[source_key].push({target: target_key, relation: concept.relation, direction: "FROM"})
        relations[target_key].push({target: source_key, relation: concept.relation, direction: "TO"})
    }

    return { elements, relations }
}

export function depthFirstSearch(start, ontology, maxDepth = 3,  visited = {}, depth = 0 ) {
    if (depth > maxDepth) {
        return { elements: {}, relations: {} }
    }; // Limit depth to maxDepth

    visited[start] = true; // Mark node as visited

    let subgraph = { elements: { [start]: ontology.elements[start] }, relations: { [start]: [] } };

    for (let edge of ontology.relations[start]) { // For each relation of the node
        if (!visited[edge.target]) { // If the target node has not been visited
            let deeperSubgraph = depthFirstSearch(edge.target, ontology, maxDepth, visited, depth + 1); // Recurse on the target
            subgraph.elements = { ...subgraph.elements, ...deeperSubgraph.elements };
            subgraph.relations = { ...subgraph.relations, ...deeperSubgraph.relations };
            subgraph.relations[start].push(edge);
            subgraph.relations[edge.target] = subgraph.relations[edge.target] || [];
            subgraph.relations[edge.target].push({ target: start, relation: edge.relation, direction: edge.direction === 'FROM' ? 'TO' : 'FROM' });
        }
    }

    return subgraph;
}