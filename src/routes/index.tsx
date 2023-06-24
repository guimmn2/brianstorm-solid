import { Title, createRouteAction, redirect } from "solid-start";
import { pb } from "~/pocketbase";

export default function Home() {
  const [subject, setSubject] = createRouteAction(async (form: FormData) => {
    const subject = form.get("subject") as string
    const response = await pb.collection('brainstorms').create({ title: subject })
    if (response) {
      return redirect(`${response.id}`)
    }
    else {
      console.error("something went wrong")
    }
  })

  return (
    <main class="flex flex-col justify-center h-80 text-5xl">
      <Title>Brianstorm</Title>
      <h1 class="mb-4 self-center">What do you wish to Brainstorm ?</h1>
      <setSubject.Form>
        <input
          class="w-full h-12 px-4 py-2 text-lg rounded-lg shadow-lg"
          type="text"
          name="subject"
          placeholder="what do you wish to brainstorm ?"
        />
      </setSubject.Form>
    </main>
  );
}