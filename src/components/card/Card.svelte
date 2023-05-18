<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {byteArrayToUtf8} from "$lib/bytearray.js";
  import EditDialog from "../edit/Dialog.svelte";

  export let value: Uint8Array;
  let edit = false;

  const dispatch = createEventDispatcher();

  function remove() {
    dispatch('remove');
  }

  function toggleEdit() {
    edit = !edit;
  }

  function save(event: { detail: { value: Uint8Array } }) {
    value = event.detail.value;
    edit = false;
  }
</script>

<div class="card">
    {#if edit}
        <EditDialog initialValue="{value}" on:save={save} on:cancel={toggleEdit}/>
    {/if}
    <span class="remove-button" on:click={remove}>X</span>
    <span class="edit-button" on:click={toggleEdit}>Edit</span>
    Card
    {byteArrayToUtf8(value)}
    <!--    <div class="option-group">-->
    <!--        <label>-->
    <!--            <input-->
    <!--                    type="radio"-->
    <!--                    name="format"-->
    <!--                    value={Option.UTF8}-->
    <!--                    bind:checked={format}-->
    <!--                    on:change={changeFormat}-->
    <!--            />-->
    <!--            UTF-8-->
    <!--        </label>-->
    <!--        <label>-->
    <!--            <input-->
    <!--                    type="radio"-->
    <!--                    name="format"-->
    <!--                    value={Option.Base64}-->
    <!--                    bind:checked={format}-->
    <!--                    on:change={changeFormat}-->
    <!--            />-->
    <!--            Base64-->
    <!--        </label>-->
    <!--        <label>-->
    <!--            <input-->
    <!--                    type="radio"-->
    <!--                    name="format"-->
    <!--                    value={Option.QR}-->
    <!--                    bind:checked={format}-->
    <!--                    on:change={changeFormat}-->
    <!--            />-->
    <!--            QR-->
    <!--        </label>-->
    <!--    </div>-->
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
</style>
