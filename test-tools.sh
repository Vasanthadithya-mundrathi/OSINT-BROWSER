#!/bin/bash

# Base URL
BASE_URL="http://localhost:5173"

# Test AI Assistant
echo "Testing AI Assistant..."
curl -X POST "$BASE_URL/api/ai-assistant" \
  -H "Content-Type: application/json" \
  -d '{"text": "Test input for analysis"}'

echo -e "\n\nTesting Data Analysis..."
curl -X POST "$BASE_URL/api/data-analysis" \
  -H "Content-Type: application/json" \
  -d '{"data": "Sample data for analysis"}'

echo -e "\n\nTesting File Scanner..."
curl -X POST "$BASE_URL/api/file-scanner" \
  -H "Content-Type: application/json" \
  -d '{"filename": "test.txt", "content": "Test file content"}'

echo -e "\n\nTesting Hash Checker..."
curl -X POST "$BASE_URL/api/hash-checker" \
  -H "Content-Type: application/json" \
  -d '{"hash": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", "type": "sha256"}'
