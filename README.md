# Report API

A secure and robust backend API for creating user reports with photo uploads. Built with Node.js, Express, and Cloudinary, featuring JWT authentication, location-based services, and auto-generated interactive documentation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

-   **JWT Authentication**: Secure endpoints for user registration and login.
-   **Photo Uploads**: Direct-to-cloud image uploads handled by Cloudinary for reports.
-   **Geographic Data**: Endpoints to fetch Indonesian provinces and regencies.
-   **Validation**: Robust request validation using Joi.
-   **Interactive Documentation**: On-the-fly API docs generated with Swagger.
-   **Structured & Scalable**: Organized project structure for easy maintenance.

---

## Technology Stack

-   **Backend**: Node.js, Express.js
-   **Database**: Prisma ORM
-   **Image Handling**: Cloudinary
-   **Authentication**: JSON Web Token (`jsonwebtoken`)
-   **Validation**: Joi
-   **File Handling**: Multer
-   **Environment Variables**: Dotenv

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### 1. Prerequisites

-   Node.js (v14 or higher)
-   npm
-   A free [Cloudinary](https://cloudinary.com/users/register/free) account

### 2. Installation

Clone the repository and install the dependencies.

```bash
# Clone the repository
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)

# Navigate to the project directory
cd your-repo-name

# Install NPM packages
npm install
3. Environment VariablesCreate a .env file in the root of your project by copying the example file.cp .env.example .env
Now, open the .env file and fill in your specific credentials.VariableDescriptionExamplePORTThe port the server will run on.5000CLOUDINARY_CLOUD_NAMEYour cloud name from the Cloudinary dashboard.your_cloud_nameCLOUDINARY_API_KEYYour API Key from the Cloudinary dashboard.123456789012345CLOUDINARY_API_SECRETYour API Secret from the Cloudinary dashboard.aBcDeFgHiJkLmNoPqRsTuVwXyZ_12345JWT_SECRETA long, random string used to sign your tokens.this_is_a_very_long_and_secret_random_string4. Running the ServerStart the development server.npm start
The API will be running at http://localhost:5000.API EndpointsHere is a detailed breakdown of the available API endpoints. The base path /api is assumed.AuthenticationPOST /api/user/registerRegisters a new user in the system.Request Body: application/json{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
Success Response (200 OK):{
    "status": "success",
    "data": "User registered successfully.",
    "message": "User Registration Successful"
}
POST /api/user/loginAuthenticates a user using their email or username and returns a JWT token.Request Body: application/json{
  "identifier": "john.doe@example.com",
  "password": "password123"
}
Success Response (200 OK):{
    "status": "success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "User Login Successful"
}
ReportsPOST /api/report/addCreates a new report. This is a protected endpoint and requires a valid JWT. The request must be multipart/form-data.Headers:Authorization: Bearer <YOUR_JWT_TOKEN>Request Body: multipart/form-dataKeyTypeDescriptionphotoFileRequired. The image file for the report.titleStringRequired. The title of the report.descriptionStringRequired. A detailed description of the report.latitudeNumberRequired. The latitude of the report location.longitudeNumberRequired. The longitude of the report location.addressStringRequired. The street address of the report.Success Response (201 Created):{
    "status": "success",
    "data": {
        "report_id": 587,
        "title": "Pothole on Main St",
        "description": "A very large pothole is causing traffic issues.",
        "latitude": -6.2088,
        "longitude": 106.8456,
        "address": "Jl. Jenderal Sudirman No.Kav. 52-53, Jakarta",
        "photoUrl": "[https://res.cloudinary.com/your_cloud_name/image/upload/v16.../reports/....jpg](https://res.cloudinary.com/your_cloud_name/image/upload/v16.../reports/....jpg)",
        "author_id": 123,
        "createdAt": "2025-07-23T06:30:00.000Z",
        "verificationStatus": "pending"
    },
    "message": "Report added successfully"
}
Geographic DataGET /api/provinces/getAllRetrieves a list of all provinces in Indonesia.Success Response (200 OK):{
    "status": "success",
    "data": [
        {
            "id": "11",
            "name": "ACEH"
        },
        {
            "id": "12",
            "name": "SUMATERA UTARA"
        }
    ],
    "message": "Provinces retrieved successfully"
}
GET /api/regencies/getAllRetrieves a list of all regencies (kabupaten/kota) in Indonesia.Success Response (200 OK):{
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
POST /api/regencies/getByProvinceId/:idRetrieves a list of regencies for a specific province ID.URL Parameter:id: The ID of the province (e.g., 11 for Aceh).Success Response (200 OK):{
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
