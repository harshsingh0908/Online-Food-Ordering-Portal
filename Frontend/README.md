# Food Bite - Angular 17 Project

A modern food ordering application built with Angular 17, featuring standalone components, reactive forms, and a responsive design.

## 🚀 Features

- **Authentication System**: User registration, login, and session management
- **Menu Management**: Browse food items by category with filtering and search
- **Shopping Cart**: Add/remove items, adjust quantities, and view totals
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Route Protection**: Guarded routes for authenticated users
- **State Management**: Reactive services for cart and authentication

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/           # Home page with menu and cart
│   │   ├── login/          # Authentication forms
│   │   └── cart/           # Shopping cart view
│   ├── services/
│   │   ├── auth.service.ts # User authentication
│   │   └── cart.service.ts # Shopping cart management
│   ├── models/
│   │   └── menu-item.model.ts # Data interfaces
│   ├── guards/
│   │   └── auth.guard.ts   # Route protection
│   ├── app.component.ts    # Root component
│   ├── app.config.ts       # App configuration
│   └── app.routes.ts       # Routing configuration
├── assets/
│   └── images/             # Food images and icons
├── styles.scss             # Global styles and CSS variables
├── main.ts                 # Application bootstrap
└── index.html             # Main HTML template
```

## 🛠️ Technologies Used

- **Angular 17** - Latest version with standalone components
- **TypeScript** - Type-safe JavaScript
- **SCSS** - Advanced CSS with variables and mixins
- **RxJS** - Reactive programming for state management
- **Angular Router** - Client-side routing with guards

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-bite-angular
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🔧 Available Commands

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests

## 🎯 Key Components

### HomeComponent
- Displays food menu with categories
- Implements search and filtering
- Manages shopping cart interactions
- Features hero slider and responsive grid

### LoginComponent
- Dual form design (login/signup)
- Form validation and error handling
- Password visibility toggles
- Remember me functionality

### CartComponent
- Shopping cart management
- Quantity controls and item removal
- Order summary with totals
- Responsive cart layout

## 🔐 Authentication

The app uses localStorage for user management:
- User registration and login
- Session persistence
- Route protection with guards
- Remember me functionality

## 🛒 Cart System

- Add/remove items from menu
- Quantity adjustment controls
- Real-time total calculation
- Persistent cart state
- Checkout flow preparation

## 📱 Responsive Design

- Mobile-first approach
- CSS Grid and Flexbox layouts
- Breakpoint-based responsive design
- Touch-friendly interactions

## 🎨 Styling

- CSS custom properties (variables)
- Modern design system
- Consistent spacing and typography
- Smooth animations and transitions

## 🚦 Routing

- `/` - Home page (protected)
- `/login` - Authentication forms
- `/cart` - Shopping cart (protected)
- Route guards for authentication

## 🔒 Security Features

- Input validation and sanitization
- Route protection for authenticated users
- Secure password handling
- Session management

## 📈 Performance

- Lazy loading with standalone components
- Optimized bundle size
- Efficient change detection
- Minimal DOM manipulation

## 🧪 Testing

- Unit test configuration
- Jasmine and Karma setup
- Component testing utilities
- Service testing examples

## 🚀 Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder**
   - Upload to your hosting service
   - Configure for SPA routing
   - Set up environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- [ ] Payment integration
- [ ] Order tracking
- [ ] User profiles
- [ ] Admin dashboard
- [ ] Real-time notifications
- [ ] PWA capabilities
- [ ] Multi-language support
- [ ] Advanced search filters

---

**Built by Harsh using Angular 17**
