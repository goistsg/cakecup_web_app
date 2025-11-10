// ==================== Auth ====================
export interface LoginDto {
  whatsapp: string
}

export interface VerifyOtpDto {
  whatsapp: string
  otp: string
}

export interface LoginResponse {
  user: User
  token: string
  message: string
}

// ==================== User ====================
export interface User {
  id: string
  name: string
  whatsapp: string
  email?: string
  role?: 'ADMIN' | 'USER'
  plan?: Plan
  companies?: Company[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserDto {
  name: string
  whatsapp: string
  email?: string
  role?: 'ADMIN' | 'USER'
  planId?: string
}

export interface UpdateUserDto {
  name?: string
  whatsapp?: string
  email?: string
  role?: 'ADMIN' | 'USER'
  planId?: string
}

export interface CreateUserConsumerDto {
  name: string
  whatsapp: string
  email?: string
  cpf?: string
}

// ==================== Company ====================
export interface Company {
  id: string
  name: string
  cnpj?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateCompanyDto {
  name: string
  cnpj?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface UpdateCompanyDto {
  name?: string
  cnpj?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  isActive?: boolean
}

// ==================== Product ====================
// Produto da API Store (público)
export interface StoreProduct {
  id: string
  name: string
  category: string // Nome da categoria (não ID)
  sku: string
  description: string
  imageUrls: string[]
  salePrice: number
  stock: number
  hasSample: boolean
  createdAt: string
  updatedAt: string
}

// Resposta da API Store Products
export interface StoreProductsResponse {
  data: StoreProduct[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Produto original (admin/autenticado)
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  sku?: string
  category?: Category
  categoryId?: string
  images?: ProductImage[]
  stock?: number
  isActive?: boolean
  companyId?: string
  company?: Company
  createdAt?: string
  updatedAt?: string
}

export interface ProductImage {
  id: string
  url: string
  isPrimary: boolean
  productId: string
}

export interface CreateProductDto {
  name: string
  description?: string
  price: number
  sku?: string
  categoryId?: string
  stock?: number
  isActive?: boolean
  companyId: string
}

export interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  sku?: string
  categoryId?: string
  stock?: number
  isActive?: boolean
}

// ==================== Category ====================
export interface Category {
  id: string
  name: string
  description?: string
  isActive?: boolean
  companyId?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCategoryDto {
  name: string
  description?: string
  companyId: string
}

export interface UpdateCategoryDto {
  name?: string
  description?: string
  isActive?: boolean
}

// ==================== Cart ====================
export interface Cart {
  id: string
  clientId: string
  items: CartItem[]
  total: number
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  product: Product
  quantity: number
  variant?: string
  price: number
  subtotal: number
}

export interface AddToCartDto {
  productId: string
  quantity: number
  variant?: string
}

export interface UpdateCartItemDto {
  quantity: number
}

// ==================== Order ====================
export interface Order {
  id: string
  clientId: string
  client?: Client
  companyId: string
  company?: Company
  status: OrderStatus
  items: OrderItem[]
  total: number
  deliveryAddress?: Address
  deliveryFee?: number
  paymentMethod?: PaymentMethod
  payment?: Payment
  notes?: string
  createdAt: string
  updatedAt: string
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  quantity: number
  price: number
  subtotal: number
  variant?: string
}

export interface CreateOrderDto {
  clientId: string
  companyId: string
  items: Array<{
    productId: string
    quantity: number
    variant?: string
  }>
  deliveryAddressId?: string
  paymentMethod: PaymentMethod
  notes?: string
}

export interface UpdateOrderDto {
  status?: OrderStatus
  deliveryAddressId?: string
  notes?: string
}

// ==================== Client ====================
export interface Client {
  id: string
  name: string
  whatsapp: string
  email?: string
  cpf?: string
  birthDate?: string
  addresses?: Address[]
  orders?: Order[]
  companyId: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateClientDto {
  name: string
  whatsapp: string
  email?: string
  cpf?: string
  birthDate?: string
  companyId: string
}

export interface UpdateClientDto {
  name?: string
  whatsapp?: string
  email?: string
  cpf?: string
  birthDate?: string
}

// ==================== Address ====================
export interface Address {
  id: string
  name?: string
  street: string
  number?: string
  complement?: string
  district?: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  isPrimary?: boolean
  clientId: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateAddressDto {
  name?: string
  street: string
  number?: string
  complement?: string
  district?: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  isPrimary?: boolean
  clientId: string
}

export interface UpdateAddressDto {
  name?: string
  street?: string
  number?: string
  complement?: string
  district?: string
  city?: string
  state?: string
  zipCode?: string
  latitude?: number
  longitude?: number
  isPrimary?: boolean
}

// ==================== Payment ====================
export interface Payment {
  id: string
  orderId: string
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  qrCode?: string
  pixPayload?: string
  createdAt: string
  updatedAt: string
}

export enum PaymentMethod {
  CASH = 'CASH',
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BILL = 'BILL'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface CreatePaymentDto {
  orderId: string
  method: PaymentMethod
  qrCode?: string
  pixPayload?: string
}

export interface UpdatePaymentDto {
  status?: PaymentStatus
  qrCode?: string
  pixPayload?: string
}

// ==================== Raffle ====================
export interface Raffle {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  drawDate: string
  maxEntries?: number
  isActive: boolean
  prize?: string
  prizeValue?: number
  companyId: string
  entries?: RaffleEntry[]
  createdAt?: string
  updatedAt?: string
}

export interface RaffleEntry {
  id: string
  raffleId: string
  clientId: string
  client?: Client
  ticketNumber: string
  createdAt: string
}

export interface CreateRaffleDto {
  title: string
  description?: string
  startDate: string
  endDate: string
  drawDate: string
  maxEntries?: number
  isActive?: boolean
  prize?: string
  prizeValue?: number
  companyId: string
}

export interface UpdateRaffleDto {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  drawDate?: string
  maxEntries?: number
  isActive?: boolean
}

export interface CreateRaffleEntryDto {
  clientId: string
}

// ==================== Plan ====================
export interface Plan {
  id: string
  name: string
  description?: string
  price: number
  features?: Record<string, any>
  isInternal?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreatePlanDto {
  name: string
  description?: string
  price: number
  features?: Record<string, any>
  isInternal?: boolean
}

export interface UpdatePlanDto {
  name?: string
  description?: string
}

// ==================== Product Favorite ====================
export interface ProductFavorite {
  id: string
  clientId: string
  productId: string
  product: Product
  createdAt: string
}

export interface ProductFavoriteDto {
  productId: string
}

// ==================== Test Feedback ====================
export interface TestSession {
  id: string
  testerName: string
  whatsapp?: string
  context?: Record<string, any>
  createdAt: string
  feedbacks?: UserFeedback[]
}

export interface UserFeedback {
  id: string
  sessionId?: string
  testerName: string
  whatsapp?: string
  screen?: string
  worked?: boolean
  description?: string
  improvementSuggestion?: string
  untestedReason?: string
  userId?: string
  createdAt: string
}

export interface CreateTestSessionDto {
  testerName: string
  whatsapp?: string
  context?: Record<string, any>
}

export interface CreateUserFeedbackDto {
  sessionId?: string
  testerName: string
  whatsapp?: string
  screen?: string
  worked?: boolean
  description?: string
  improvementSuggestion?: string
  untestedReason?: string
  userId?: string
}

// ==================== API Response ====================
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

