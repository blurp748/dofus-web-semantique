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