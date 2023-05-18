<script lang="ts">
  import '../public/wasm/wasm_exec';

  import {writable} from "svelte/store";

  import wasmInit from '../public/wasm/shamir.wasm?init';
  import {onMount} from "svelte";

  import {getShamir} from "$lib/shamir";
  import type {Shamir} from "$lib/shamir";
  import Card from "../components/card/Card.svelte";

  let shamir: Shamir;

  onMount(() => {
    const go = new window.Go();
    wasmInit(go.importObject).then(instance => {
          go.run(instance);
          shamir = getShamir();
        }
    ).catch(err => {
      console.error(err)
    });
  })

  interface Secret {
    id: number;
    value: Uint8Array;
  }

  let cards: Secret[];
  const cardStore = writable<Secret[]>([]);
  cardStore.subscribe(c => {
    cards = c;
  })

  function addCard() {
    cardStore.update(cards => [
      ...cards,
      {
        id: nextID(),
        value: new Uint8Array([]),
      } as Secret,
    ]);
  }

  function removeCard(id) {
    cardStore.update(c => c.filter(card => card.id !== id));
  }

  let idCounter = 0;

  function nextID() {
    return idCounter++;
  }

  function shamirSplit() {
    let value = cards[0].value;

    shamir.split(value, 5, 3).then(shares => {
      cardStore.set(shares.map(v => ({
        id: nextID(),
        value: v,
      })))
    }).catch(err => {
      console.error(err)
    });
  }

  function shamirCombine() {
    let values = cards.map(c => c.value);

    shamir.combine(...values).then(secret => {
      cardStore.set([{
        id: nextID(),
        value: secret,
      }])
    }).catch(err => {
      console.error(err)
    });
  }
</script>

<div class="container">
    <h1 class="header">Pass Share</h1>
    <div class="navbar">
        {#if cards.length === 1 && cards[0].value.length > 0}
            <button on:click={shamirSplit}>Split</button>
        {/if}
        {#if cards.length > 2}
            <button on:click={shamirCombine}>Combine</button>
        {/if}
    </div>
    <div class="main">
        {#each cards as card}
            <Card bind:value={card.value} on:remove={() => removeCard(card.id)}></Card>
        {/each}
        <button class="add-button" on:click={addCard}>Add</button>
    </div>
    <div class="footer">
        Copyright 2023 Josef Mende
    </div>
</div>

<style>
    .add-button {
        margin-top: 10px;
    }

    /* Layout */
    .container {
        display: grid;
        grid-template-columns: 1fr [content-start] min(100vw, 1200px) [content-end] 1fr;
        grid-template-rows: auto auto 1fr;
        min-height: calc(100vh + 10rem);
    }

    .container > * {
        grid-column: content;
    }

    .container > *:last-child, .container > *:first-child {
        grid-column: 1/span 3;
    }

    .header {
        grid-row: 1;
        background-color: #f1f1f1;
        padding: 20px;
    }

    .navbar {
        grid-row: 2;
        background-color: #333;
        color: #fff;
        padding: 10px;
    }

    .main {
        grid-row: 3;
        padding: 20px;
    }

    .footer {
        background-color: #f1f1f1;
        padding: 20px;
    }
</style>
