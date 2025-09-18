# Spring Boot Backend for Angular Food App

This backend provides a REST API for menu items, designed to work with the Angular frontend in this workspace.

## Prerequisites
- Java 21 (or update `pom.xml` to use Java 17 if needed)
- Maven
- MySQL (running on localhost:3306 by default)

## Setup
1. **Configure Database Credentials:**
   - Edit `src/main/resources/application.properties`:
     - `spring.datasource.username` (default: `root`)
     - `spring.datasource.password` (default: `password`)
     - Or set environment variables `DB_USERNAME` and `DB_PASSWORD`.
2. **Start MySQL:**
   - Create a database named `springapp` (or change in properties).
   - The app will auto-create tables and insert demo data from `schema.sql` and `data.sql`.
3. **Run the Backend:**
   - In the `backend/demo` folder:
     ```sh
     mvn spring-boot:run
     ```
   - Or use VSCode launch task (see `.vscode/launch.json`).

## API Endpoints
- `GET    /api/menu-items`           — List menu items (supports `page`, `size`, `sort`)
- `GET    /api/menu-items/{id}`      — Get menu item by ID
- `POST   /api/menu-items`           — Create menu item
- `PUT    /api/menu-items/{id}`      — Update menu item
- `DELETE /api/menu-items/{id}`      — Delete menu item

### Example Angular Service
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuItemService {
  private apiUrl = 'http://localhost:8080/api/menu-items';

  constructor(private http: HttpClient) {}

  getMenuItems(params?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params });
  }
  getMenuItem(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createMenuItem(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  updateMenuItem(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  deleteMenuItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
```

### CORS
- CORS is enabled for `http://localhost:4200` in the controller with `@CrossOrigin`.

## Docker
- See `Dockerfile` and `docker-compose.yml` for containerized setup.

## Adding Security
- To add authentication, uncomment and configure Spring Security in `pom.xml` and add a security config class. (See comments in code.)

## Troubleshooting
- If validation errors occur, ensure `spring-boot-starter-validation` is present in `pom.xml`.
- For JDBC access, use `JdbcConnectionUtil.getConnection()`.

---

**For questions, see code comments in each class.**
