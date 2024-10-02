# Backend Intern Assignment

## Overview
This project implements a backend system composed of three microservices: User Service, Product Service, and Order Service. A GraphQL Gateway provides a unified API for client interactions.

## Microservices
1. **User Service**: Manages user registration, authentication, and profile management.
2. **Product Service**: Handles product creation, updates, and inventory management.
3. **Order Service**: Processes order creation and management.

## Setup Instructions

### Prerequisites
- Docker
- Docker Compose

### Clone the repository
```bash
git clone <https://github.com/arnav0K/backendproject>
cd backend-intern-assignment
```

### Run All Services
To start all services, use the following command:
```bash
docker-compose up --build
```

### Access the GraphQL API
Once the services are running, you can access the GraphQL API at:
- [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Detailed README Files

### User Service
- **About**: User registration, authentication, and profile management.
- **Responsibilities**:
  - Register users and manage authentication (JWT).
  - Emit and listen to events related to user actions (e.g., "User Registered").
- **Events**:
  - "User Registered": Emitted when a new user is registered.
  - "User Profile Updated": Emitted when a user's profile is updated.
- **Queue/Stream Communication**:
  - Listens for other services' events for state consistency.

### Product Service
- **About**: Product management, inventory updates.
- **Responsibilities**:
  - Handle product creation, updates, and deletions.
  - Manage inventory levels.
  - Emit and listen to events for state updates (e.g., "Product Created", "Inventory Updated").
- **Events**:
  - "Product Created": Emitted when a new product is added.
  - "Inventory Updated": Emitted when product inventory is updated.
- **Queue/Stream Communication**:
  - Listens for "Order Placed" events to update inventory.

### Order Service
- **About**: Order management and processing.
- **Responsibilities**:
  - Handle order creation and retrieval.
  - Emit and listen to events related to order processing (e.g., "Order Placed").
- **Events**:
  - "Order Placed": Emitted when an order is successfully placed.
  - "Order Shipped": Emitted when an order is shipped.
- **Queue/Stream Communication**:
  - Listens for "Product Created" and "User Registered" to maintain consistency.

### GraphQL Gateway
- **About**: Expose a unified GraphQL API to the client, fetching and aggregating data from all three microservices.
- **Responsibilities**:
  - Handle client queries for users, products, and orders.
  - Aggregate data from the microservices using REST endpoints or direct communication with the microservices.
  
## Docker Configuration
The project includes a `docker-compose.yml` file that orchestrates all microservices, including MongoDB and RabbitMQ. This configuration ensures that all services run seamlessly in Docker containers.

### Docker Compose File
You can find the Docker configurations in the `docker-compose.yml` file located at the root of the project.

## Postman Collection
A Postman collection has been created to test the API endpoints. You can find the collection file in the root directory:
- [Postman Collection](./Postman_Collection.json)

## GraphQL Playground Queries
You can use the following example queries in the GraphQL Playground to interact with the API:

### Example Queries
- **Get All Users**
```graphql
query {
  users {
    _id
    username
    email
  }
}
```

**Register User**
```graphql
mutation {
  registerUser(input: {
    username: "newUser",
    email: "user@example.com",
    password: "securePassword"
  }) {
    token
    message
  }
}
```

## License
This project is licensed under the MIT License.
```

