import { Record } from "pocketbase"
import { For, Show, createResource, createSignal, onMount } from "solid-js"
import { createRouteAction, createRouteData, redirect, useParams, useRouteData } from "solid-start"
import { pb } from "~/pocketbase"

type Suggestion = {
    id: string,
    description: string,
    votes: number
}

export function routeData() {
    const theme = createRouteData(async () => {
        const response = await pb.collection('brainstorms').getFirstListItem(`id = "${useParams().id}"`)
        if (response) {
            return response.title
        }
        //else error ?
    })
    return theme
}

export default function BrainstormPage() {
    const params = useParams()
    const theme = useRouteData<typeof routeData>()
    const [addingSuggestion, suggest] = createRouteAction(suggestFn)
    const [voting, vote] = createRouteAction(voteFn)
    const [suggestions, { mutate }] = createResource(async () => {
        //fetch list
        const response = await pb.collection('suggestions').getFullList({
            filter: `brainstormId = "${params.id}"`,
            expand: 'brainstormId'
        })
        //parse
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
    //had to use onMount `so the subscription only runs in the client
    //--
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
    //--

    let inputRef!: HTMLInputElement
    return (
        <>
            <h1>{theme()}</h1>
            <For each={orderedSuggestions()}>
                {
                    (sug) =>
                        <vote.Form>
                            <input type="hidden" name="brainstormId" value={params.id}/>
                            <input type="hidden" name="id" value={sug.id} />
                            <input type="text" name="suggestion" value={sug.description} />
                            <input type="text" name="votes" value={sug.votes} />
                            <input type="submit" value="vote" />
                        </vote.Form>
                }
            </For>
            <suggest.Form onSubmit={() => setTimeout(() => inputRef.value = "")}>
                <input type="hidden" name="brainstormId" value={params.id} />
                <label for="suggestion">Add suggestion</label>
                <input ref={inputRef} type="text" name="suggestion" id="suggestion" disabled={addingSuggestion.pending} />
            </suggest.Form>
        </>
    )
}

async function suggestFn(form: FormData) {
    const brainstormId = form.get('brainstormId') as string
    console.log(brainstormId)
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

async function voteFn(form: FormData) {
    const recordId = form.get('id') as string
    const suggestion = form.get('suggestion') as string
    const incrementedVotes = Number(form.get('votes') as string) + 1
    const brainstormId = form.get('brainstormId') as string
    console.log(brainstormId)

    const data = {
        suggestion: suggestion,
        votes: incrementedVotes,
        brainstormId: brainstormId
    }
    
    const response = await pb.collection('suggestions').update(recordId, data)
    if (response) {
        return redirect(useParams().id)
    }
}
