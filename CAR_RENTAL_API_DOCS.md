# Car Rental API Documentation

## Overview

This API provides comprehensive car rental functionality including car management, owner management, filtering, and search capabilities.

## Car Endpoints

### Get All Cars

```http
GET /cars
Query Parameters:
- location?: string (partial match)
- carType?: "Micro Car" | "Medium" | "SUV" | "Mini Bus" | "Truck" | "Van"
- fuelType?: "Electric" | "Petrol" | "Diesel" | "Hybrid"
- transmission?: "Automatic" | "Manual"
- minSeats?: number
- maxSeats?: number
- minPrice?: number
- maxPrice?: number
- isAvailable?: boolean
```

### Get Car by ID

```http
GET /cars/:id
```

### Search Cars

```http
GET /cars/search?q=searchTerm
```

### Get Cars by Owner

```http
GET /cars/owner/:ownerId
```

### Create Car

```http
POST /cars
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "pricePerKm": 0.50,
  "location": "New York, NY",
  "imageUrl": "https://example.com/car.jpg",
  "carType": "Medium",
  "fuelType": "Hybrid",
  "transmission": "Automatic",
  "seats": 5,
  "ownerId": 1,
  "isAvailable": true
}
```

### Update Car

```http
PATCH /cars/:id
Content-Type: application/json

{
  "pricePerKm": 0.45,
  "location": "Brooklyn, NY",
  "isAvailable": false
}
```

### Update Car Availability

```http
PATCH /cars/:id/availability
Content-Type: application/json

{
  "isAvailable": false
}
```

### Delete Car

```http
DELETE /cars/:id
```

## Car Owner Endpoints

### Get All Car Owners

```http
GET /car-owners
```

### Get Top Rated Owners

```http
GET /car-owners/top-rated?limit=10
```

### Get Car Owner by ID

```http
GET /car-owners/:id
```

### Create Car Owner

```http
POST /car-owners
Content-Type: application/json

{
  "name": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "rating": 4.5,
  "numberOfReviews": 25
}
```

### Update Car Owner

```http
PATCH /car-owners/:id
Content-Type: application/json

{
  "name": "John Smith",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

### Update Owner Rating

```http
PATCH /car-owners/:id/rating
Content-Type: application/json

{
  "rating": 5
}
```

### Delete Car Owner

```http
DELETE /car-owners/:id
```

## Example Usage

### Frontend Integration Examples

#### Fetch All Available Cars

```javascript
const fetchAvailableCars = async () => {
  const response = await fetch('/cars?isAvailable=true');
  const cars = await response.json();
  return cars;
};
```

#### Filter Cars by Location and Type

```javascript
const filterCars = async (location, carType) => {
  const params = new URLSearchParams({
    location,
    carType,
    isAvailable: 'true',
  });

  const response = await fetch(`/cars?${params}`);
  const cars = await response.json();
  return cars;
};
```

#### Search Cars

```javascript
const searchCars = async (searchTerm) => {
  const response = await fetch(
    `/cars/search?q=${encodeURIComponent(searchTerm)}`,
  );
  const cars = await response.json();
  return cars;
};
```

#### Create New Car Listing

```javascript
const createCar = async (carData) => {
  const response = await fetch('/cars', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carData),
  });

  if (!response.ok) {
    throw new Error('Failed to create car');
  }

  return response.json();
};
```

## Sample Data

### Sample Car Object

```json
{
  "id": 1,
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "pricePerKm": 0.5,
  "location": "New York, NY",
  "imageUrl": "https://example.com/toyota-camry.jpg",
  "carType": "Medium",
  "fuelType": "Hybrid",
  "transmission": "Automatic",
  "seats": 5,
  "isAvailable": true,
  "owner": {
    "id": 1,
    "name": "John Doe",
    "avatarUrl": "https://example.com/john-avatar.jpg",
    "rating": 4.8,
    "numberOfReviews": 127
  },
  "createdAt": "2025-09-29T10:00:00Z",
  "updatedAt": "2025-09-29T10:00:00Z"
}
```

### Sample Car Owner Object

```json
{
  "id": 1,
  "name": "John Doe",
  "avatarUrl": "https://example.com/john-avatar.jpg",
  "rating": 4.8,
  "numberOfReviews": 127,
  "cars": [
    {
      "id": 1,
      "make": "Toyota",
      "model": "Camry",
      "year": 2023,
      "pricePerKm": 0.5,
      "location": "New York, NY"
    }
  ],
  "createdAt": "2025-09-29T10:00:00Z",
  "updatedAt": "2025-09-29T10:00:00Z"
}
```

## Error Responses

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Car with ID 123 not found",
  "error": "Not Found"
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": [
    "year must not be less than 1900",
    "pricePerKm must not be less than 0"
  ],
  "error": "Bad Request"
}
```

## Database Schema

### Car Table

- id (Primary Key)
- make (String)
- model (String)
- year (Number)
- pricePerKm (Decimal)
- location (String)
- imageUrl (String, nullable)
- carType (Enum)
- fuelType (Enum)
- transmission (Enum)
- seats (Number)
- isAvailable (Boolean, default: true)
- ownerId (Foreign Key to CarOwner)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### CarOwner Table

- id (Primary Key)
- name (String)
- avatarUrl (String, nullable)
- rating (Decimal, 0-5)
- numberOfReviews (Number)
- createdAt (Timestamp)
- updatedAt (Timestamp)

The API matches your frontend interface exactly and provides all the functionality needed for a car rental platform!
