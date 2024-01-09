package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v2"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/tidwall/gjson"
)

type Config struct {
	Server struct {
		Port string `yaml:"port"`
		Host string `yaml:"host"`
	} `yaml:"server"`
	SMSC []struct {
		Hostname string `yaml:"hostname"`
		IP       string `yaml:"ip"`
		PORT     string `yaml:"port"`
	} `yaml:"smsc"`
}

func readConfig() (*Config, error) {
	file, err := os.Open("rule-editor-server.yaml")

	if err != nil {
		return nil, err
	}
	defer file.Close()

	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	var config Config
	err = yaml.Unmarshal(bytes, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}

func main() {
	config, err := readConfig()
	if err != nil {
		log.Fatalf("Error reading config: %v", err)
	}

	r := mux.NewRouter()
	r.HandleFunc("/receive-validate", validate).Methods("POST")
	r.HandleFunc("/receive-ruleset", receiveRuleset).Methods("POST")
	r.HandleFunc("/get-ruleset", getRuleset).Methods("GET")

	handler := cors.Default().Handler(r)

	http.ListenAndServe(":"+config.Server.Port, handler)
}

func validate(w http.ResponseWriter, r *http.Request) {
	log.Println("Starting validation")

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println("Error reading request body:", err)
		httpError(w, "Error reading request body", err)
		return
	}

	if err := writeToFile(body); err != nil {
		log.Println("Error writing file:", err)
		httpError(w, "Error writing file", err)
		return
	}

	respBody, err := performValidation(body)
	if err != nil {
		log.Println("Error performing validation:", err)
		httpError(w, "Error performing validation", err)
		return
	}

	log.Println("Validation successful, response body:", respBody)
	fmt.Fprint(w, respBody)
}

func writeToFile(body []byte) error {
	name := gjson.Get(string(body), "ruleset.name").String()
	dir := "./validate"

	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.Mkdir(dir, 0755)
	}

	filePath := filepath.Join(dir, fmt.Sprintf("%s-v.json", name))
	log.Println("Writing to file:", filePath)
	return ioutil.WriteFile(filePath, body, 0644)
}

func performValidation(body []byte) (string, error) {
	log.Println("Performing validation")

	config, err := readConfig()
	if err != nil {
		log.Println("Error reading config:", err)
		return "", err
	}

	if len(config.SMSC) == 0 {
		log.Println("No SMSC configuration found")
		return "", errors.New("no SMSC configuration found")
	}

	validationURL := "http://" + config.SMSC[0].IP + ":" + config.SMSC[0].PORT + "/validate"
	log.Println("Validation URL:", validationURL)

	req, err := http.NewRequest("POST", validationURL, bytes.NewBuffer(body))
	if err != nil {
		log.Println("Error creating request:", err)
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error making request:", err)
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Println("Error in response from external API, status code:", resp.StatusCode)
		return "", errors.New("error in response from external API")
	}

	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println("Error reading response body:", err)
		return "", err
	}

	return string(respBody), nil
}

func httpError(w http.ResponseWriter, message string, err error) {
	log.Println("Sending HTTP error:", message, err)
	http.Error(w, fmt.Sprintf("%s: %v", message, err), http.StatusInternalServerError)
}
func receiveRuleset(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body",
			http.StatusInternalServerError)
		return
	}

	name := gjson.Get(string(body), "name").String()

	dir := "./rulesets"
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.Mkdir(dir, 0755)
	}

	filePath := filepath.Join(dir, fmt.Sprintf("%s.json", name))
	err = ioutil.WriteFile(filePath, body, 0644)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error writing file %s", filePath),
			http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, `{"message": "ruleset received and written to file %s"}`, filePath)
}

func getRuleset(w http.ResponseWriter, r *http.Request) {
	dir := "./rulesets"
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		http.Error(w, "Error reading directory",
			http.StatusInternalServerError)
		return
	}

	var results []map[string]interface{}
	for _, file := range files {
		if filepath.Ext(file.Name()) == ".json" {
			content, err := ioutil.ReadFile(filepath.Join(dir, file.Name()))
			if err != nil {
				http.Error(w, fmt.Sprintf("Error reading file %s", file.Name()),
					http.StatusInternalServerError)
				return
			}

			var result map[string]interface{}
			if err := json.Unmarshal(content, &result); err != nil {
				http.Error(w, fmt.Sprintf("Error parsing JSON in file %s", file.Name()),
					http.StatusInternalServerError)
				return
			}

			results = append(results, result)
		}
	}

	jsonResults, err := json.Marshal(results)
	if err != nil {
		http.Error(w, "Error converting results to JSON",
			http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResults)
}
