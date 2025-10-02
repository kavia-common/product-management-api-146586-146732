# product-management-api-146586-146732

Products Backend (Express)
- Start: npm install && npm run dev
- Docs: http://localhost:3000/docs
- OpenAPI: http://localhost:3000/openapi.json

Products API
- GET    /products
- GET    /products/:id
- POST   /products      { name, price, quantity }
- PUT    /products/:id  { name, price, quantity }
- PATCH  /products/:id  { name?, price?, quantity? }
- DELETE /products/:id