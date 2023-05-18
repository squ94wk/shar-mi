wasm: src/public/wasm/shamir.wasm src/public/wasm/wasm_exec.js

src/public/wasm/wasm_exec.js:
	cp $(shell go env GOROOT)/misc/wasm/wasm_exec.js $@

src/public/wasm/shamir.wasm: cmd/shamir/main.go
	GOARCH=wasm GOOS=js go build -o $@ $<
