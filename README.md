# 🏙️ JagaKota

A **secure and robust backend API** for managing user-submitted reports with image uploads. Built using **Node.js**, **Express**, **Cloudinary**, and featuring **JWT authentication**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%234479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---

## 🚀 Features

- 🔐 **JWT Authentication** – Secure endpoints for user login and registration.
- 🖼️ **Image Uploads** – Upload and store images directly to Cloudinary.
- 📍 **Geographic Data** – Retrieve Indonesian provinces and regencies.
- ✅ **Validation** – Joi-based request validation.
- 📚 **Swagger Docs** – Real-time interactive API documentation.
- 🧱 **Clean Architecture** – Scalable and maintainable project structure.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: Prisma ORM
- **Authentication**: JSON Web Token (`jsonwebtoken`)
- **Image Hosting**: Cloudinary
- **Validation**: Joi
- **File Handling**: Multer
- **Environment Management**: Dotenv

---

## ⚙️ Getting Started

### 1. Prerequisites

- Node.js (v14 or higher)
- npm
- [Cloudinary Account](https://cloudinary.com/users/register/free)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git

# Navigate into the project directory
cd your-repo-name

# Install dependencies
npm install
```

### 3. Environment Variables

Copy the example file and fill in your environment credentials:

```bash
cp .env.example .env
```

Update `.env`:

| Variable                | Description                      | Example                      |
| ----------------------- | -------------------------------- | ---------------------------- |
| `PORT`                  | Port for the server              | `5000`                       |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name       | `your_cloud_name`            |
| `CLOUDINARY_API_KEY`    | Cloudinary API key               | `123456789012345`            |
| `CLOUDINARY_API_SECRET` | Cloudinary secret key            | `your_secret_key_here`       |
| `JWT_SECRET`            | Secret string to sign JWT tokens | `this_is_a_super_secret_key` |

### 4. Run the Server

```bash
npm start
```

The API should now be running at:  
**http://localhost:5000**

---

## 📫 API Endpoints

> Base URL: `/api`

### 🔐 Authentication

#### `POST /api/user/register`

Register a new user.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "status": "success",
  "data": "User registered successfully.",
  "message": "User Registration Successful"
}
```

---

#### `POST /api/user/login`

Authenticate and receive a JWT token.

**Request Body:**

```json
{
  "identifier": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "token": "your_jwt_token_here"
  },
  "message": "User Login Successful"
}
```

---

### 📝 Reports

#### `POST /api/report/add` _(Protected)_

Create a new report with photo.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Form Data (multipart/form-data):**

| Field         | Type   | Required | Description          |
| ------------- | ------ | -------- | -------------------- |
| `photo`       | File   | Yes      | Report image         |
| `title`       | String | Yes      | Report title         |
| `description` | String | Yes      | Detailed description |
| `latitude`    | Number | Yes      | Latitude coordinate  |
| `longitude`   | Number | Yes      | Longitude coordinate |
| `address`     | String | Yes      | Street address       |

**Response:**

```json
{
  "status": "success",
  "data": {
    "report_id": 587,
    "title": "Pothole on Main St",
    "description": "A very large pothole is causing traffic issues.",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "address": "Jl. Jenderal Sudirman No.Kav. 52-53, Jakarta",
    "photoUrl": "https://res.cloudinary.com/your_cloud_name/image/upload/...jpg",
    "author_id": 123,
    "createdAt": "2025-07-23T06:30:00.000Z",
    "verificationStatus": "pending"
  },
  "message": "Report added successfully"
}
```

---

### 🌍 Geographic Data

#### `GET /api/provinces/getAll`

Get all provinces in Indonesia.

**Response:**

```json
{
  "status": "success",
  "data": [
    { "id": "11", "name": "ACEH" },
    { "id": "12", "name": "SUMATERA UTARA" }
  ],
  "message": "Provinces retrieved successfully"
}
```

---

#### `GET /api/regencies/getAll`

Get all regencies (kabupaten/kota).

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": "1101",
      "province_id": "11",
      "name": "KABUPATEN SIMEULUE",
      "province": {
        "name": "ACEH"
      }
    }
  ],
  "message": "Regencies retrieved successfully"
}
```

---

#### `POST /api/regencies/getByProvinceId/:id`

Get regencies by specific province ID.

**URL Param:** `id` – Province ID (e.g., `11`)

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": "1101",
      "province_id": "11",
      "name": "KABUPATEN SIMEULUE"
    },
    {
      "id": "1102",
      "province_id": "11",
      "name": "KABUPATEN ACEH SINGKIL"
    }
  ],
  "message": "Regencies retrieved successfully"
}
```

