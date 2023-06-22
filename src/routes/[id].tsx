import { useParams } from "solid-start"

export default function BrainstormPage() {
    const params = useParams()
    return (
        <h1>Page {params.id}</h1>
    )
}