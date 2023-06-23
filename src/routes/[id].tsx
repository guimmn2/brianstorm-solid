import { For, createResource, onMount } from "solid-js"
import { createRouteAction, redirect, useParams } from "solid-start"
import { pb } from "~/pocketbase"

type Suggestion = {
    id: string,
    description: string,
    votes: number
}

export default function BrainstormPage() {
    const params = useParams()
    const [addingSuggestion, suggest] = createRouteAction(suggestFn)
    const [suggestions, { mutate }] = createResource(async () => {
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
    
    const orderedSuggestions = () => suggestions()?.sort((a, b) => b.votes - a.votes)

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
            <For each={orderedSuggestions()}>
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
            <suggest.Form>
                <input type="hidden" name="brainstormId" value={params.id} />
                <label for="suggestion">Add suggestion</label>
                <input type="text" name="suggestion" id="suggestion" />
            </suggest.Form>
        </>
    )
}

async function suggestFn(form: FormData) {
    const brainstormId = form.get('brainstormId') as string
    const suggestion = form.get('suggestion') as string
    const response = await pb.collection('suggestions').create({
        brainstormId: brainstormId,
        suggestion: suggestion,
        votes: 0
    })
    if (response) {
        return redirect(useParams().id)
    }
}
