package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

func main() {
	// Define and parse the command-line parameter
	status := flag.String("status", "s", "The status to return ('s' for success, 'f' for failure)")
	flag.Parse()

	log.Println("Status parameter:", *status)

	http.HandleFunc("/validate", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received a request")

		if r.Method != http.MethodPost {
			log.Println("Invalid request method")
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		// Change the response based on the command-line parameter
		if *status == "s" {
			log.Println("Returning success response")
			fmt.Fprint(w, `{
				"success": true,
				"data": {
					"message": "Matched Rule-3: coyote."
				}
			}`)
		} else if *status == "f" {
			log.Println("Returning failure response")
			fmt.Fprint(w, `{
				"success": false,
				"data": {
					"message": "No match."
				}
			}`)
		}
	})

	log.Println("Starting server on port 8030")
	err := http.ListenAndServe(":8030", nil)
	if err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
