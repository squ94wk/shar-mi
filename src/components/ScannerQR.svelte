<script lang="ts">
  import {onMount, onDestroy, createEventDispatcher} from 'svelte';

  import jsQR from "jsqr";

  let canvas;
  let ctx;
  let video;

  let mayCheck = true;
  const checkInterval = setInterval(() => {
    mayCheck = true;
  }, 50);

  const dispatch = createEventDispatcher();

  function complete(value: Uint8Array) {
    if (value) {
      dispatch('scanComplete', {
        code: value,
      });
    } else {
      dispatch('scanComplete');
    }
  }

  onMount(() => {
    navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
      video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log(canvas);
        ctx = canvas.getContext('2d');
        requestAnimationFrame(draw);
      };
    });
  });

  function draw() {
    if (!video) {
      return;
    }
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (mayCheck) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth",
        });
        if (code) {
          complete(Uint8Array.from(code.binaryData));
        }
      }
    }
    requestAnimationFrame(draw);
  }

  onDestroy(() => {
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx = null;
    }
    if (video) {
      video.pause();
      video.srcObject = null;
      video = null;
    }
    clearInterval(checkInterval)
  });
</script>

<canvas bind:this={canvas}></canvas>
