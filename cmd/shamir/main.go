package main

import (
	"github.com/hashicorp/vault/shamir"
	"syscall/js"
)

func Split(_ js.Value, args []js.Value) any {
	input := make([]byte, args[0].Get("byteLength").Int())
	js.CopyBytesToGo(input, args[0])
	n := args[1].Int()
	k := args[2].Int()

	split, err := shamir.Split(input, n, k)
	if err != nil {
		return err
	}

	result := make([]any, len(split))

	for i := 0; i < len(split); i++ {
		result[i] = uint8ArrayFrom(split[i])
	}

	return result
}

func Combine(_ js.Value, args []js.Value) any {
	parts := make([][]byte, len(args))
	for i := 0; i < len(args); i++ {
		parts[i] = make([]byte, args[i].Get("byteLength").Int())
		js.CopyBytesToGo(parts[i], args[i])
	}

	secret, err := shamir.Combine(parts)
	if err != nil {
		return err
	}

	return uint8ArrayFrom(secret)
}

func uint8ArrayFrom(v []byte) js.Value {
	out := js.Global().Get("Uint8Array").New(len(v))
	js.CopyBytesToJS(out, v)
	return out
}

func main() {
	js.Global().Set("shamirSplit", js.FuncOf(Split))
	js.Global().Set("shamirCombine", js.FuncOf(Combine))

	<-make(chan bool)
}
