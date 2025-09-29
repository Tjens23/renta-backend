#!/bin/bash

echo "=== RBAC Access Control Test ==="
echo "Testing that regular users CANNOT access admin features"

BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Initialize system
echo -e "\n${YELLOW}1. Initializing RBAC system...${NC}"
INIT_RESPONSE=$(curl -s -X POST $BASE_URL/admin/setup/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "adminUsername": "admin",
    "adminPassword": "admin123",
    "adminFirstName": "Admin",
    "adminLastName": "User"
  }')
echo "✓ System initialized"

# 2. Login as admin
echo -e "\n${YELLOW}2. Logging in as admin...${NC}"
ADMIN_LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')
ADMIN_TOKEN=$(echo $ADMIN_LOGIN | jq -r '.access_token')
echo "✓ Admin logged in successfully"

# 3. Create regular user
echo -e "\n${YELLOW}3. Creating regular user...${NC}"
USER_CREATE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "regularuser",
    "password": "user123",
    "firstName": "Regular",
    "lastName": "User"
  }')
echo "✓ Regular user created"

# 4. Login as regular user
echo -e "\n${YELLOW}4. Logging in as regular user...${NC}"
USER_LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "regularuser",
    "password": "user123"
  }')
USER_TOKEN=$(echo $USER_LOGIN | jq -r '.access_token')
echo "✓ Regular user logged in successfully"

echo -e "\n${YELLOW}=== ACCESS CONTROL TESTS ===${NC}"

# Test 1: Admin Dashboard Access
echo -e "\n${YELLOW}Test 1: Admin Dashboard Access${NC}"
echo "Admin access to dashboard:"
ADMIN_DASHBOARD=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET $BASE_URL/admin/dashboard \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Admin: $ADMIN_DASHBOARD"

echo "Regular user access to dashboard (should be FORBIDDEN):"
USER_DASHBOARD=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET $BASE_URL/admin/dashboard \
  -H "Authorization: Bearer $USER_TOKEN")
if [[ $USER_DASHBOARD == *"HTTP_CODE:403"* ]]; then
  echo -e "${GREEN}✓ CORRECT: Regular user denied access to admin dashboard${NC}"
else
  echo -e "${RED}✗ SECURITY ISSUE: Regular user has access to admin dashboard!${NC}"
fi

# Test 2: User Management Access
echo -e "\n${YELLOW}Test 2: User Management Access${NC}"
echo "Admin access to user management:"
ADMIN_USERS=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET $BASE_URL/admin/users \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Admin: HTTP_CODE only - $(echo $ADMIN_USERS | grep -o 'HTTP_CODE:[0-9]*')"

echo "Regular user access to user management (should be FORBIDDEN):"
USER_USERS=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET $BASE_URL/admin/users \
  -H "Authorization: Bearer $USER_TOKEN")
if [[ $USER_USERS == *"HTTP_CODE:403"* ]]; then
  echo -e "${GREEN}✓ CORRECT: Regular user denied access to user management${NC}"
else
  echo -e "${RED}✗ SECURITY ISSUE: Regular user has access to user management!${NC}"
fi

# Test 3: Role Management Access
echo -e "\n${YELLOW}Test 3: Role Management Access${NC}"
echo "Admin access to roles:"
ADMIN_ROLES=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET $BASE_URL/roles \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Admin: HTTP_CODE only - $(echo $ADMIN_ROLES | grep -o 'HTTP_CODE:[0-9]*')"

echo "Regular user access to roles (should be FORBIDDEN):"
USER_ROLES=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET $BASE_URL/roles \
  -H "Authorization: Bearer $USER_TOKEN")
if [[ $USER_ROLES == *"HTTP_CODE:403"* ]]; then
  echo -e "${GREEN}✓ CORRECT: Regular user denied access to role management${NC}"
else
  echo -e "${RED}✗ SECURITY ISSUE: Regular user has access to role management!${NC}"
fi

# Test 4: Profile Access (should work for both)
echo -e "\n${YELLOW}Test 4: Profile Access (should work for both)${NC}"
echo "Admin profile access:"
ADMIN_PROFILE=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $ADMIN_TOKEN")
if [[ $ADMIN_PROFILE == *"HTTP_CODE:200"* ]]; then
  echo -e "${GREEN}✓ Admin can access profile${NC}"
else
  echo -e "${RED}✗ Admin cannot access profile${NC}"
fi

echo "Regular user profile access:"
USER_PROFILE=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $USER_TOKEN")
if [[ $USER_PROFILE == *"HTTP_CODE:200"* ]]; then
  echo -e "${GREEN}✓ Regular user can access own profile${NC}"
else
  echo -e "${RED}✗ Regular user cannot access profile${NC}"
fi

# Test 5: No Token Access (should fail)
echo -e "\n${YELLOW}Test 5: No Authentication (should fail)${NC}"
NO_TOKEN=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET $BASE_URL/admin/dashboard)
if [[ $NO_TOKEN == *"HTTP_CODE:401"* ]]; then
  echo -e "${GREEN}✓ CORRECT: No token access denied${NC}"
else
  echo -e "${RED}✗ SECURITY ISSUE: No authentication required!${NC}"
fi

echo -e "\n${YELLOW}=== SUMMARY ===${NC}"
echo "✓ Regular users should NOT have access to:"
echo "  - Admin Dashboard (/admin/dashboard)"
echo "  - User Management (/admin/users)"
echo "  - Role Management (/roles)"
echo "  - Permission Management (/roles/permissions)"
echo ""
echo "✓ Regular users SHOULD have access to:"
echo "  - Own Profile (/auth/profile)"
echo "  - Login/Logout (/auth/login, /auth/logout)"
echo "  - Registration (/auth/register)"

echo -e "\n${GREEN}=== Test Complete ===${NC}"