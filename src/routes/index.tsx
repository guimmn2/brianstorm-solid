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
    <main>
      <Title>Brianstorm</Title>
      <div class="flex flex-col ml-12 mt-12">
      <h1 class="text-5xl mt-4">What do you wish to Brainstorm?</h1>
        <setSubject.Form class="mt-4">
          <input
            type="text"
            name="subject"
            class="px-4 py-2 text-lg bg-gray-200 rounded-lg w-10/12 h-12"
            placeholder="What do you wish to brainstorm?"
          />
          <input 
          type="submit" 
          value="GO"
          class="bg-orange-500 rounded-lg w-1/12 h-12 ml-4 text-white text-lg hover:bg-orange-700 font-bold cursor-pointer"
          />
        </setSubject.Form>
      </div>
    </main>
  )
}