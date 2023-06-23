import { For, createResource, createSignal } from "solid-js"
import { RouteDataArgs, createRouteAction, createRouteData, refetchRouteData, useParams, useRouteData } from "solid-start"
import { pb } from "~/pocketbase"

type Suggestion = {
    id: string,
    description: string,
    votes: number
}

export function routeData({ params }: RouteDataArgs) {
    return createRouteData(async (key) => {
        console.log(key)
        const records = await pb.collection('suggestions').getFullList({
            filter: `brainstormId = "${params.id}"`
        })
        let suggestions: Suggestion[] = []
        records.forEach(r => {
            suggestions.push({
                id: r.id,
                description: r.suggestion,
                votes: r.votes
            })
        })
        return suggestions
    }, { key: ['suggestions'] })
}

export default function BrainstormPage() {
    const params = useParams()
    const suggestions = useRouteData<typeof routeData>()
    const [voting, vote] = createRouteAction(voteFn)
    /*
    const suggestions = createRouteData(async () => {
        const records = await pb.collection('suggestions').getFullList({
            filter: `brainstormId = "${params.id}"`
        })
        let suggestions: Suggestion[] = []
        records.forEach(r => {
            suggestions.push({
                id: r.id,
                description: r.suggestion,
                votes: r.votes
            })
        })
        return suggestions
    })
    */

    //this won't work on the server
    //pb.collection('suggestions').subscribe('*', () => refetchRouteData())

    return (
        <>
            <For each={suggestions()}>
                {(sug) =>
                    <>
                        <p>{sug.description}</p>
                        <p>{sug.votes}</p>
                        <vote.Form>
                            <input type="hidden" name="id" value={sug.id} />
                            <input type="submit" value="vote" />
                        </vote.Form>
                    </>
                }
            </For>
        </>
    )
}

async function voteFn(form: FormData) {
}
