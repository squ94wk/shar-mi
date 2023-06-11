<script lang="ts">
  import "@fontsource/roboto";
  import "@fontsource/noto-serif-display/400.css";

  import '../public/wasm/wasm_exec';

  import {writable} from "svelte/store";

  import wasmInit from '../public/wasm/shamir.wasm?init';
  import {onMount} from "svelte";

  import {getShamir} from "$lib/shamir";
  import type {Shamir} from "$lib/shamir";
  import Card from "../components/card/Card.svelte";
  import FormatPicker from "../components/FormatPicker.svelte";
  import {UTF8} from "$lib/format";

  let shamir: Shamir;

  let format = UTF8;

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

  function updateValue(id: number) {
    return (event: { detail: { value: Uint8Array } }) => {
      cardStore.update(cards => cards.map(c => {
        if (c.id === id) {
          c.value = event.detail.value;
        }
        return c
      }));
      console.log('handle', event);
    }
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
    <div class="header">
        <h1>&#x0283;ɦar mi</h1>
        <div>Split secrets into parts and share them as QR codes</div>
    </div>
    <div class="navbar">
        <FormatPicker bind:format={format}></FormatPicker>
        {#if cards.length === 1 && cards[0].value.length > 0}
            <button class="button" on:click={shamirSplit}>Split</button>
        {/if}
        {#if cards.length > 2}
            <button class="button" on:click={shamirCombine}>Combine</button>
        {/if}
    </div>
    <div class="main">
        {#each cards as card}
            <Card format={format}
                  value={card.value}
                  on:updateValue={updateValue(card.id)}
                  on:remove={() => removeCard(card.id)}>
            </Card>
        {/each}
        <button class="button" on:click={addCard}>Add</button>
    </div>
    <div class="footer">
        Copyright 2023 Josef Mende
    </div>
</div>

<style lang="scss">
  * {
    font-family: 'Roboto', sans-serif;
  }

  /* Layout */
  .container {
    display: grid;
    grid-template-columns: 1fr [content-start] min(100vw, 1200px) [content-end] 1fr;
    grid-template-rows: auto auto 1fr;
    min-height: calc(100vh + 10rem);

    > * {
      grid-column: content;
    }
  }

  .header {
    grid-row: 1;
    grid-column: 1 / span 3;
    padding: 40px;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: #f1f1f1;

    h1 {
      // FIXME: 'Sh' isn't displayed correctly, although the font should support it.
      font-family: 'Noto Serif Display', serif;
      font-size: 4em;
    }
  }

  .navbar {
    grid-row: 2;
    padding: 1rem;

    display: flex;
    gap: 1rem;
  }

  .main {
    grid-row: 3;
    padding: 1rem;

    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }

  .footer {
    grid-column: 1 / span 3;
    padding: 20px;

    display: flex;
    justify-content: center;

    background-color: #f1f1f1;
  }
</style>
