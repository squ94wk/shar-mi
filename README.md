# Sharmi
A simple browser utility to:

- share passwords using QR codes
- split passwords using shamir

## Idea

Let's say you have a secret that wouldn't be recoverable when lost, but you couldn't memorize, e.g. master password.

This app allows you to split the secret in multiple shares and distribute them e.g. printed as QR codes.
The shares themselves are considered secrets, but only a certain number of them together allow to reconstruct the original secret.

## About

This app was created using **Svelte Kit** and **WASM** as an experiment how easy it is to create something using **ChatGPT** in a somewhat unfamiliar domain.
