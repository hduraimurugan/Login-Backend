
---

# Authentication API Documentation

This API provides routes for user authentication, including sign-up, login, logout, email verification, password reset, and session management.

## Base URL
All requests are to be made to:
```
https://login-backend-2aaw.onrender.com/api/auth
```

### 1. **User Signup**

**Endpoint:** `/signup`  
**Method:** `POST`  
**Description:** Registers a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "yourPassword123"
}
```

**Response:**
- **201 Created**
```json
{
  "message": "User signed up successfully",
  "user": {
    "id": "uniqueUserId",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

### 2. **User Login**

**Endpoint:** `/login`  
**Method:** `POST`  
**Description:** Logs in a registered user and returns an authentication token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "yourPassword123"
}
```

**Response:**
- **200 OK**
```json
{
  "message": "Login successful",
  "token": "jwtTokenString"
}
```

### 3. **User Logout**

**Endpoint:** `/logout`  
**Method:** `POST`  
**Description:** Logs out the user by invalidating the token.

**Headers:**
- `Authorization: Bearer jwtTokenString`

**Response:**
- **200 OK**
```json
{
  "message": "Logout successful"
}
```

### 4. **Verify Email**

**Endpoint:** `/verify-email`  
**Method:** `POST`  
**Description:** Verifies the user's email address.

**Request Body:**
```json
{
  "code": "verificationCode"
}
```

**Response:**
- **200 OK**
```json
{
  "message": "Email verified successfully"
}
```

### 5. **Forgot Password**

**Endpoint:** `/forgot-password`  
**Method:** `POST`  
**Description:** Sends a password reset email to the user.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
- **200 OK**
```json
{
  "message": "Password reset link sent to your email"
}
```

### 6. **Reset Password**

**Endpoint:** `/reset-password/:token`  
**Method:** `POST`  
**Description:** Resets the user’s password.

**Request Body:**
```json
{
  "password": "newPassword123"
}
```

**Response:**
- **200 OK**
```json
{
  "message": "Password reset successfully"
}
```

### 7. **Check Authentication**

**Endpoint:** `/check-auth`  
**Method:** `GET`  
**Description:** Verifies if the user is authenticated based on the token provided.

**Headers:**
- `Authorization: Bearer jwtTokenString`

**Response:**
- **200 OK**
```json
{
  "authenticated": true,
  "user": {
    "id": "uniqueUserId",
    "email": "john.doe@example.com"
  }
}
```

---

This documentation outlines how to use the endpoints in your authentication API effectively. Be sure to replace placeholder data with actual tokens, user information, or other specific details as needed.
