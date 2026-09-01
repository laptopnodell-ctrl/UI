A mobile-first food ordering frontend for Vino Tasty Hub, built around three core experiences:

Restaurant

Bakery

Tea & Beverages

The app allows customers to browse products, customize items, add to cart, manage addresses, make payments, track orders, view order history, and manage their profile.

Features

Authentication

Splash screen

Onboarding

Mobile login

OTP verification

Mock authentication flow

Food Discovery

Home screen

Search

Restaurant menu

Bakery menu

Tea & beverages menu

Categories and subcategories

Product details

Product customization

Favorites

Cart & Checkout

Add/remove items

Quantity updates

Add-ons and variants

Coupons

Address selection

Checkout summary

Delivery instructions

Payment method selection

Mock payment success/failure

Orders

Order confirmation

Live order tracking UI

Order status timeline

Delivery partner card

Order history

Order details

Reorder

Account

Profile

Saved addresses

Offers

Notifications

Help & Support

Settings

Design System

The UI follows the Vino Tasty Hub brand style:

Primary Orange: #F6A300

Main Background: #FFF7EC

Card Surface: #FFFDFC

Primary Text: #241A12

Secondary Text: #7D7065

Border: #EFE4D6

Design direction:

Light cream background

Warm white cards

Orange accents

Rounded corners

Soft shadows

Premium food photography

Compact mobile layout

No dark theme

Tech Stack

React

TypeScript

Vite

Tailwind CSS

React Router

Zustand

Lucide Icons

shadcn/ui

Framer Motion

localStorage for demo persistence

Project Structure

src/
  components/
    layout/
    common/
    food/
    cart/
    order/
    address/
    payment/
    offers/

  pages/
    HomePage.tsx
    SearchPage.tsx
    CategoriesPage.tsx
    CategoryPage.tsx
    ProductPage.tsx
    CartPage.tsx
    AddressesPage.tsx
    AddAddressPage.tsx
    CheckoutPage.tsx
    PaymentPage.tsx
    OrderSuccessPage.tsx
    TrackOrderPage.tsx
    OrdersPage.tsx
    OrderDetailsPage.tsx
    OffersPage.tsx
    FavoritesPage.tsx
    NotificationsPage.tsx
    ProfilePage.tsx
    LoginPage.tsx
    OtpPage.tsx

  store/
    cartStore.ts
    userStore.ts
    favoritesStore.ts
    orderStore.ts

  services/
    auth.ts
    products.ts
    cart.ts
    addresses.ts
    checkout.ts
    payments.ts
    orders.ts
    tracking.ts
    offers.ts

  data/
    mockProducts.ts
    mockOrders.ts
    mockOffers.ts

Main Routes

/splash
/onboarding
/login
/otp
/home
/search
/categories
/category/restaurant
/category/bakery
/category/tea
/product/:id
/cart
/addresses
/addresses/new
/checkout
/coupons
/payment
/payment-success
/payment-failed
/order-success/:id
/track-order/:id
/orders
/orders/:id
/favorites
/offers
/notifications
/profile
/help
/settings

Getting Started

1. Clone the project

git clone <your-repository-url>
cd vino-tasty-hub

2. Install dependencies

npm install

3. Start development server

npm run dev

4. Build for production

npm run build

5. Preview production build

npm run preview

Demo Authentication

For the frontend demo:

Enter any valid 10-digit mobile number

OTP: 1234

This is temporary and should be replaced with the real authentication API.

Mock Payment

The current frontend uses a mock payment flow.

Supported UI:

UPI

Credit/Debit Card

Net Banking

Cash on Delivery

The real production implementation can later connect to Razorpay or another payment provider.

Cart Persistence

Cart and selected frontend state can be persisted using localStorage so users do not lose their cart during refreshes in the demo build.

Future Backend Integration

The frontend is intended to connect later to:

NestJS backend

PostgreSQL

Redis

Razorpay

Firebase Cloud Messaging

WebSockets / Socket.IO

Google Maps or OpenStreetMap / MapLibre

Vino Tasty Hub management system

Keep API calls isolated in the services/ directory so mock data can be replaced without changing the UI components.

Real-Time Delivery Tracking

The planned production tracking architecture is:

Delivery Partner App
        ↓
Phone GPS
        ↓
NestJS WebSocket Server
        ↓
Redis
        ↓
Customer App
        ↓
MapLibre / OpenStreetMap

This allows real-time delivery tracking without requiring Google Maps API for the first version.

Order Statuses

Recommended order states:

ORDER_PLACED
ORDER_ACCEPTED
PREPARING
READY_FOR_PICKUP
PARTNER_ASSIGNED
PICKED_UP
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
REFUNDED

Customer Journey

SPLASH
↓
ONBOARDING
↓
LOGIN
↓
OTP
↓
HOME
↓
RESTAURANT / BAKERY / TEA
↓
PRODUCT DETAILS
↓
CUSTOMIZE
↓
ADD TO CART
↓
CART
↓
ADDRESS
↓
CHECKOUT
↓
PAYMENT
↓
ORDER CONFIRMED
↓
LIVE TRACKING
↓
DELIVERED
↓
ORDER HISTORY / REORDER

Important Development Rules

Keep the UI mobile-first.

Maintain the existing Vino visual style.

Do not introduce dark backgrounds.

Do not use blue or purple as primary brand colors.

Use reusable components.

Avoid duplicating business logic.

Keep mock data separate from components.

Keep all integrations behind service functions.

Ensure no console or TypeScript errors.

Test all primary customer flows before deployment.

License

Private project for Vino Tasty Hub.

Do not distribute or reuse brand assets without permission.
