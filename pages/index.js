import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [foodInput, setFoodInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ food: foodInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log(data)
      setResult(data.result);
      setFoodInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/hamburger.png" />
      </Head>

      <main className={styles.main}>
        <img src="/hamburger.png" className={styles.icon} />
        <h3>Name a Food</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="food"
            placeholder="Enter your favorite food"
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
          />
          <input type="submit" value="Generate Recipe" />
        </form>
        <div className={styles.result} dangerouslySetInnerHTML={{__html: result}}></div>
      </main>
    </div>
  );
}
