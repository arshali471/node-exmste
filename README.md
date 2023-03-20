# EXMSTE API

## To start API
- create the environment file by copying the env.example to ".env"
- replace the values of .env file according to the environment
- npm install
- start application
    - npm run dev (Development mode)
    - npm start (Prod mode)

## To Generate ENCRYPTION KEYS
- "npm run generateEncryptionKeys"

## Socket Paths
'{base_url}/nixste' -> to connect NIXSTE with EXMSTE

## Socket Events
'connection',
'error',
'success',
'new_paper',
'student_registerations',
'disconnect',
'get_private_key',
'receive_private_key',

## Login

```http
POST /auth/login
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `username` | `string` | **Required**. username |
| `password` | `string` | **Required**. Password |

### Response


```javascript
{
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiM2U0YTdhMTEtZTZhZS00NmVkLTk5ZWItOGMzZWI1NjlmYmQyIiwiaWF0IjoxNjI5Mzc4NjkyLCJleHAiOjE2Mjk0NjUwOTJ9.IF0cTfYhmEU9EFR_U-XQ5hUypXOV-54j4SiSpH53Psk",
    "message": "Loign successful",
    "status": 200
}
```


## GET Student Registerations from EXMCLD

```http
GET /studentRegisteration/getFromEXMCLD
```

| Header | Description |
| :--- | :--- |
| `Authorization` | **Required**. Token received during login |


## GET Student Registerations by name / roll no / registeration no

```http
GET /studentRegisteration/getStudents?searchText=undefined
```

| Header | Description |
| :--- | :--- |
| `Authorization` | **Required**. Token received during login |

| Query | Description |
| :--- | :--- |
| `searchText` | **Required**. Name / roll no / registeration number |


## Create Bio Registeration Users

```http
POST /bioReg/createUsers
```

| Header | Description |
| :--- | :--- |
| `Authorization` | **Required**. Token received during login |


## GET Bio Registeration Users

```http
GET /bioReg/getCreatedUsers
```

| Header | Description |
| :--- | :--- |
| `Authorization` | **Required**. Token received during login |


## Reset password for bio registeration user

```http
PUT /bioReg/resetPassword/:id
```

| Header | Description |
| :--- | :--- |
| `Authorization` | **Required**. Token received during login |

| Param | Description |
| :--- | :--- |
| `id` | **Required**. id of user |



## Add Bio Reg users count

```http
PUT /bioReg/addBioRegUsersCount
```

| Header | Description |
| :--- | :--- |
| `Authorization` | **Required**. Token received during login |

## Bio Reg Login

```http
POST /bioReg/login
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `username` | `string` | **Required**. username |
| `password` | `string` | **Required**. Password |

### Response


```javascript
{
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMmM1OGNmODZkMjg3ZDU0ZjM2NmYwOSIsImlhdCI6MTYzMDI5NjQyMSwiZXhwIjoxNjMwMzgyODIxfQ.Mx5mw9bq_uuSF0Qg6OZmmn8HyYjAwgR4dIZeWpdDBFM"
    },
    "message": "Login successfull",
    "status": 200
}
```


## GET Student Registerations by name / roll no / registeration no

```http
GET /bioReg/getStudents?searchText=undefined
```

| Header | Description |
| :--- | :--- |
| `Authorization` | **Required**. Token received during BioReg login |

| Query | Description |
| :--- | :--- |
| `searchText` | **Required**. Name / roll no / registeration number |

