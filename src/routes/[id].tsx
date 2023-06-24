import { For, Show, createResource, onMount } from "solid-js"
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
        <div class="flex flex-col ml-12 mt-12">
            <h1 class="text-5xl mt-4 mb-8">{theme()} ?</h1>
            <For each={orderedSuggestions()}>
                {
                    (sug) =>
                        <vote.Form class="mb-4 text-2xl">
                            <input type="hidden" name="brainstormId" value={params.id} />
                            <input type="hidden" name="id" value={sug.id} />
                            <input 
                            class="w-8/12"
                            type="text" name="suggestion" value={sug.description} readonly/>
                            <input 
                            class="w-2/12"
                            type="text" name="votes" value={sug.votes} readonly/>
                            <input 
                            class="rounded-lg w-24 h-12 ml-4 text-white text-md hover:bg-black font-bold cursor-pointer bg-slate-500"
                            type="submit" value="+" />
                        </vote.Form>
                }
            </For>
            <suggest.Form class="mt-4" onSubmit={() => setTimeout(() => inputRef.value = "")}>
                <input type="hidden" name="brainstormId" value={params.id} />
                <label class="mr-4" for="suggestion">Add suggestion</label>
                <input 
                ref={inputRef} 
                type="text" 
                name="suggestion" 
                id="suggestion" 
                disabled={addingSuggestion.pending} 
                class="px-4 py-2 text-lg bg-gray-200 rounded-lg w-10/12 h-12"
                />
            </suggest.Form>
        </div>
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

async function voteFn(form: FormData) {
    const recordId = form.get('id') as string
    const suggestion = form.get('suggestion') as string
    const incrementedVotes = Number(form.get('votes') as string) + 1
    const brainstormId = form.get('brainstormId') as string

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
