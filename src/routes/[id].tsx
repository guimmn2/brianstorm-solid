import { For, createResource, onMount } from "solid-js"
import { RouteDataArgs, createRouteAction, createRouteData, useParams, useRouteData } from "solid-start"
import { pb } from "~/pocketbase"

type Suggestion = {
    id: string,
    description: string,
    votes: number
}

export default function BrainstormPage() {
    const params = useParams()
    const [suggestions, { mutate, refetch }] = createResource(async () => {
        //fetch list
        const response = await pb.collection('suggestions').getFullList({
            filter: `brainstormId = "${params.id}"`
        })
        let suggestions: Suggestion[] = []
        response.forEach(rec => {
            suggestions.push({
                id: rec.id,
                description: rec.suggestion,
                votes: rec.votes
            })
        })
        return suggestions
    })

    //subscribe to chnages
    //had to use onMount so the subscription only runs in the client
    onMount(() => pb.collection('suggestions').subscribe('*', ({ action, record }) => {
        if (record.brainstormId != params.id) {
            return
        }
        if (action === "create") {
            mutate([...suggestions()!, { description: record.suggestion, votes: record.votes, id: record.id } as Suggestion])
        }
        else if (action === "update") {
            mutate(suggestions()!.map(item => {
                if (item.id === record.id) {
                    return {
                        id: item.id,
                        description: item.description,
                        votes: record.votes
                    } as Suggestion
                }
                return item
            }))
        }
    }))

    return (
        <>
            <For each={suggestions()}>
                {
                    (sug) =>
                        <>
                            <p>{sug.description}</p>
                            <p>{sug.votes}</p>
                            <button onClick={async () => {
                                const response = await pb.collection('suggestions').update(sug.id, {
                                    suggestion: sug.description,
                                    votes: sug.votes + 1,
                                    brainstormId: params.id
                                })
                                if (response) {
                                    console.log('vote with sucess')
                                }
                            }}>vote</button>
                        </>
                }
            </For>
        </>
    )
}
