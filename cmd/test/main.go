package main

import (
	"fmt"
	"github.com/hashicorp/vault/shamir"
	"log"
)

func main() {
	bytes := []byte("some")

	split, err := shamir.Split(bytes, 5, 3)
	if err != nil {
		log.Fatal(err)
	}

	secret, err := shamir.Combine(split)
	if err != nil {
		log.Fatal(err)
	}

	if string(secret) != "some" {
		log.Fatal(fmt.Sprintf("%s != some", string(secret)))
	}
}
