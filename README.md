FRONTEND -- MIDDLE-END -- BACKEND

- we need an intermediate layer between the client side and the microservice.
- Using this middle-end , when the client send request we will be able to make a decision that which micro-service should actually respond to the request.
- we can do message validation , response transformation and rate limiting.
- We try to prepare an API Gatewaythat act as this middleware.