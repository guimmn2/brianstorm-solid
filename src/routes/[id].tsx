import { createSignal } from "solid-js"
import { createRouteAction, createRouteData, refetchRouteData, useParams } from "solid-start"
import { pb } from "~/pocketbase"

type Suggestion = {
    id: string,
    description: string,
    votes: number
}

export default function BrainstormPage() {
    const params = useParams()
    const suggestions = createRouteData(async () => {
        const records = await pb.collection('suggestions').getFullList({
            filter: `brainstormId = "${params.id}"`
        })
        let suggestions: Suggestion[] = []
        records.forEach(r => {
            suggestions.push({
                id: r.id,
                description: r.suggestion,
                votes: r.vote
            })
        })
        return suggestions
    })
    
    pb.collection('suggestions').subscribe('*', () => refetchRouteData())
    
    return (
        <>
        <h1>Page {params.id}</h1>
        <pre>{JSON.stringify(suggestions())}</pre>
        </>
    )
}