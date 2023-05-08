<script lang="ts">
    import {onMount} from "svelte";
    import {byteArrayToUtf8, utf8ToByteArray} from "$lib/bytearray";

    export let exportValue;
    let formValue: string;

    $: {
        if (formValue != undefined) {
            try {
                exportValue = utf8ToByteArray(formValue)
            } catch (_) {
            }
        }
    }

    onMount(() => {
        try {
            formValue = byteArrayToUtf8(exportValue)
        } catch (e) {
            formValue = '';
        }
    })
</script>

<label>
    UTF-8
    <input type="text" bind:value={formValue}>
</label>