// import { fetchWords } from "@/lib/mongoose/actions/fetchWords";

export default async function Main() {
  // const cet4 = await fetchWords();
  // console.log(">> cet4: ", cet4);

  return (
    <section className="py-2 px-4 ">
      <div>Translation</div>

      <div className="gap-2 flex flex-col md:flex-row">
        <div className="card">
          <div>中：你好呀</div>
          <div>英：。。。</div>
        </div>

        <div className="card">
          <div>Good job!</div>
        </div>
      </div>
    </section>
  );
}
