<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {byteArrayToUtf8, utf8ToByteArray} from "$lib/bytearray";

  export let exportValue;
  let formValue: string;
  let editable = false;
  let inputField;
  const dispatch = createEventDispatcher();

  function edit() {
    editable = true;
    formValue = byteArrayToUtf8(exportValue);
    inputField.focus();
  }

  function submit() {
    dispatch('updateValue', {
      value: utf8ToByteArray(formValue),
    });
    editable = false;
  }
</script>

<div>
    <form class:editable={editable} on:submit={submit} on:focusout={submit}>
        <input type="text" bind:this={inputField} on:focusin={edit} bind:value={formValue}>
    </form>
    {#if !editable}
        <span on:click={edit}>
            {#if exportValue.length > 0}
                {byteArrayToUtf8(exportValue)}
            {:else}
                edit
            {/if}
        </span>
    {/if}
</div>

<style>
    form:not(.editable) {
        transform: scaleY(0%);
        max-height: 0;
    }
</style>