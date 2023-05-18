<script lang="ts">
  import '../public/wasm/wasm_exec';

  import {writable} from "svelte/store";
  import EditDialog from "../components/EditDialog.svelte";
  import {byteArrayToUtf8} from "$lib/bytearray";

  import wasmInit from '../public/wasm/shamir.wasm?init';
  import {onMount} from "svelte";

  import {getShamir} from "$lib/shamir";
  import type {Shamir} from "$lib/shamir";

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

  interface Card {
    id: number;
    value: Uint8Array;
  }

  let cards: Card[];
  const cardStore = writable<Card[]>([]);
  cardStore.subscribe(c => {
    cards = c;
  })

  function addCard() {
    cardStore.update(cards => [
      ...cards,
      {
        id: nextID(),
        value: new Uint8Array([]),
      } as Card,
    ]);
  }

  function removeCard(id) {
    cardStore.update(c => c.filter(card => card.id !== id));
  }

  let idCounter = 0;

  function nextID() {
    return idCounter++;
  }

  let editCardID = null;

  function openEditCardDialog(id: number) {
    if (editCardID) {
      closeEditCardDialog()
    }
    editCardID = id;
  }

  function closeEditCardDialog() {
    editCardID = null;
  }

  function saveEditCardDialog(event: { detail: { value: Uint8Array } }) {
    cardStore.update(c => c.map(c => {
      if (c.id === editCardID) {
        c.value = event.detail.value;
      }
      return c;
    }))
    closeEditCardDialog();
  }

  function shamirSplit(id: number) {
    let value = cards.find(c => c.id === id)?.value;
    if (!value) {
      return
    }

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

<div>
    <button on:click={shamirCombine}>Combine</button>
    {#if editCardID != null}
        <EditDialog initialValue="{cards.find(c => c.id === editCardID).value}" on:save={saveEditCardDialog}
                    on:cancel={closeEditCardDialog}/>
    {/if}
    {#each cards as card}
        <div class="card">
            <span class="remove-button" on:click={() => removeCard(card.id)}>X</span>
            <span class="edit-button" on:click={() => openEditCardDialog(card.id)}>Edit</span>
            Card {card.id}
            {byteArrayToUtf8(card.value)}
            <button on:click={() => shamirSplit(card.id)}>Split</button>
        </div>
    {/each}

    <div class="add-button" on:click={addCard}>Add</div>
</div>

<style>
    .card {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
        position: relative;
    }

    .remove-button {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        font-weight: bold;
    }

    .edit-button {
        position: absolute;
        top: 5px;
        right: 50px;
        cursor: pointer;
        font-weight: bold;
    }

    .add-button {
        margin-top: 10px;
        cursor: pointer;
    }
</style>
