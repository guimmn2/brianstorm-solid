import { Title, createRouteAction, redirect } from "solid-start";
import { pb } from "~/pocketbase";

export default function Home() {
  const [subject, setSubject] = createRouteAction(async (form: FormData) => {
    const subject = form.get("subject") as string
    const response = await pb.collection('brainstorms').create({ title: subject })
    console.log(response.id)
    if (response) {
      redirect(`${response.id}`)
    }
    else {
      console.error("something went wrong")
    }
  })

  return (
    <main>
      <Title>Brianstorm</Title>
      <h1 class="text-5xl">What do you wish to Brainstorm ?</h1>
      <setSubject.Form>
        <input 
        class="text-5xl"
        type="text" 
        name="subject" 
        placeholder="coolest waterparks to visit..."
        />
      </setSubject.Form>
    </main>
  );
}