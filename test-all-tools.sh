#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local payload=$2
    local description=$3
    
    echo -e "\n${GREEN}Testing $description...${NC}"
    echo "Endpoint: $endpoint"
    echo "Payload: $payload"
    
    response=$(curl -s -X POST "$BASE_URL$endpoint" \
        -H "Content-Type: application/json" \
        -d "$payload")
    
    echo "Response:"
    echo $response | jq '.' 2>/dev/null || echo $response
    echo "----------------------------------------"
}

# 1. Test WHOIS Lookup
test_endpoint "/whois" \
    '{"domain": "example.com"}' \
    "WHOIS Lookup"

# 2. Test DNS Lookup
test_endpoint "/dns" \
    '{"domain": "example.com", "recordType": "A"}' \
    "DNS Lookup"

# 3. Test Subdomain Scanner
test_endpoint "/subdomain-scanner" \
    '{"domain": "example.com"}' \
    "Subdomain Scanner"

# 4. Test IP Tool
test_endpoint "/ip-tool" \
    '{"ip": "8.8.8.8"}' \
    "IP Tool"

# 5. Test Shadow Personas
test_endpoint "/shadow-personas" \
    '{"username": "johndoe", "platforms": ["twitter", "github", "linkedin"]}' \
    "Shadow Personas"

# 6. Test Dark Web Scanner
test_endpoint "/dark-web" \
    '{"query": "test@example.com", "scanType": "email"}' \
    "Dark Web Scanner"

# 7. Test AI Assistant
test_endpoint "/ai-assistant" \
    '{"text": "Analyze this IP address: 8.8.8.8"}' \
    "AI Assistant"

# 8. Test Data Analysis
test_endpoint "/data-analysis" \
    '{"data": "Sample data for analysis", "analysisType": "pattern"}' \
    "Data Analysis"

# 9. Test File Scanner
test_endpoint "/file-scanner" \
    '{"filename": "test.txt", "content": "Test file content"}' \
    "File Scanner"

# 10. Test Hash Checker
test_endpoint "/hash-checker" \
    '{"hash": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", "type": "sha256"}' \
    "Hash Checker"
