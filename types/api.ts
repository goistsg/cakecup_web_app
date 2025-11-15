// ==================== Auth ====================
export interface LoginDto {
  email: string
  password: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  newPassword: string
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
  companies?: UserCompany[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserDto {
  name: string
  whatsapp: string
  email: string
  password: string
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
  companyId: string
  email?: string
  cpf?: string
}

// ==================== Company ====================
export interface Company {
  id: string
  name: string
  identifier?: string
  cnpj?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  isActive?: boolean
  isPrivate?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Segment {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface UserCompany {
  id: string
  userId: string
  companyId: string
  segmentId: string
  role: 'COMPANY_ADMIN' | 'COMPANY_USER'
  createdAt: string
  company: Company
  segment: Segment
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
  costPrice?: number
  salePrice?: number
  lastPrice?: number
  sku?: string
  category?: Category | string
  categoryId?: string
  images?: ProductImage[]
  imageUrls?: string[]
  ingredients?: string[]
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
  price?: number
  costPrice?: number
  salePrice?: number
  lastPrice?: number
  sku?: string
  category?: string
  categoryId?: string
  imageUrls?: string[]
  ingredients?: string[]
  stock?: number
  isActive?: boolean
  companyId: string
}

export interface UpdateProductDto {
  name?: string
  description?: string
  costPrice?: number
  salePrice?: number
  lastPrice?: number
  category?: string
  imageUrls?: string[]
  ingredients?: string[]
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
  userId: string
  sessionId?: string | null
  companyId: string
  cep?: string | null
  deliveryMethod?: string | null
  deliveryFee?: number | null
  estimatedDays?: number | null
  couponCode?: string | null
  discountValue?: number | null
  totalAmount?: number | null
  expiresAt?: string | null
  items: CartItem[]
  user?: User
  company?: Company
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  product: CartProduct
  quantity: number
  variant?: string
  price: number
  createdAt?: string
  updatedAt?: string
}

// Produto retornado dentro do carrinho
export interface CartProduct {
  id: string
  name: string
  category: string
  sku: string
  description: string
  imageUrls: string[]
  recommendations: string[]
  usageNotes?: string | null
  costPrice: number
  lastPrice: number
  salePrice: number
  stock: number
  hasSample: boolean
  sampleQuantity?: number | null
  createdAt: string
  updatedAt: string
  companyId: string
  userId: string
}

// ==================== Favorites ====================
export interface Favorite {
  id: string
  userId: string
  productId: string
  product?: StoreProduct
  createdAt: string
  updatedAt: string
}

export interface AddFavoriteDto {
  productId: string
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
  OPEN = 'OPEN',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
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

// ==================== Product Reviews ====================
export interface ProductReview {
  id: string
  productId: string
  orderId?: string
  userId: string
  rating: number
  title: string
  comment: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
  }
}

export interface CreateReviewDto {
  productId: string
  orderId?: string
  rating: number
  title: string
  comment: string
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
  createdAt?: string
}

export interface FeedbackSessionResult {
  sessionId: string
  testerName: string
  whatsapp: string
  context: {
    browser: string
    version: string
  }
  feedbacks: UserFeedback[]
  createdAt: string
  updatedAt: string
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

