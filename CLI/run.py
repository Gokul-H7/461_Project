#!/usr/bin/env python3

import sys
import time
import requests
import ndjson

# Define a function for calculating NetScore and other metrics
def calculate_metrics(url):
    metrics = {
        "URL": url,
        "NetScore": 0.0,
        "NetScore_Latency": 0.0,
        "RampUp": 0.0,
        "RampUp_Latency": 0.0,
        "Correctness": 0.0,
        "Correctness_Latency": 0.0,
        "BusFactor": 0.0,
        "BusFactor_Latency": 0.0,
        "ResponsiveMaintainer": 0.0,
        "ResponsiveMaintainer_Latency": 0.0,
        "License": 0.0,
        "License_Latency": 0.0
    }
    
    start_time = time.time()
    # Fetch and process the URL (this is just an example, adjust based on actual scoring logic)
    try:
        response = requests.get(url)
        if response.status_code == 200:
            # Calculate the various scores here. This is placeholder logic:
            metrics["RampUp"] = 0.8
            metrics["Correctness"] = 0.9
            metrics["BusFactor"] = 0.7
            metrics["ResponsiveMaintainer"] = 0.6
            metrics["License"] = 1.0
            
            # Calculate NetScore based on weights (adjust weights according to Sarah's priorities)
            weights = {"RampUp": 0.2, "Correctness": 0.3, "BusFactor": 0.2, "ResponsiveMaintainer": 0.2, "License": 0.1}
            metrics["NetScore"] = sum([metrics[key] * weights[key] for key in weights])
        else:
            raise Exception(f"Error fetching {url}")
    except Exception as e:
        print(f"Error processing URL: {e}", file=sys.stderr)
    
    # Record latencies
    end_time = time.time()
    latency = round(end_time - start_time, 3)
    metrics["NetScore_Latency"] = latency
    metrics["RampUp_Latency"] = latency  # Assuming all scores take the same time
    metrics["Correctness_Latency"] = latency
    metrics["BusFactor_Latency"] = latency
    metrics["ResponsiveMaintainer_Latency"] = latency
    metrics["License_Latency"] = latency
    
    return metrics

def process_urls(file_path):
    with open(file_path, 'r') as f:
        urls = f.read().splitlines()
    
    results = []
    for url in urls:
        metrics = calculate_metrics(url)
        results.append(metrics)
    
    # Output results in NDJSON format
    with open('output.ndjson', 'w') as f:
        writer = ndjson.writer(f)
        writer.writerows(results)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: ./run URL_FILE")
        sys.exit(1)
    
    url_file = sys.argv[1]
    process_urls(url_file)
    sys.exit(0)
