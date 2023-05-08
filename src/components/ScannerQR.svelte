<script>
    import { onMount, onDestroy, getContext } from 'svelte';

    import jsQR from "jsqr";

    let canvas;
    let ctx;
    let video;

    let mayCheck = true;
    const checkInterval = setInterval(() => {
        mayCheck = true;
    }, 50);

    const setCode = getContext('setCode');

    onMount(() => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.onloadedmetadata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
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
                    // drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                    // drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                    // drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                    // drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                    // outputMessage.hidden = true;
                    // outputData.parentElement.hidden = false;
                    // outputData.innerText = code.data;

                    setCode(code.data);
                    console.log(code.data);
                } else {
                    // outputMessage.hidden = false;
                    // outputData.parentElement.hidden = true;
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
