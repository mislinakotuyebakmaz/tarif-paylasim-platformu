// Auth Types
export interface LoginDto {
  kullaniciAdiVeyaEmail: string;
  sifre: string;
}

export interface RegisterDto {
  kullaniciAdi: string;
  email: string;
  sifre: string;
  adSoyad: string;
}

export interface UserDto {
  id: number;
  kullaniciAdi: string;
  email: string;
  adSoyad: string;
  kayitTarihi: string;
  tarifSayisi: number;
}

export interface LoginResponseDto {
  token: string;
  tokenExpiration: string;
  user: UserDto;
}

// Recipe Types
export interface RecipeCreateDto {
  baslik: string;
  aciklama: string;
  hazirlanis: string;
  malzemeler: string;
  kategoriId: number;
  hazirlikSuresi?: number;
  pisirmeSuresi?: number;
  porsiyon?: string;
  zorlukDerecesi?: string;
  resimUrl?: string;
}

export interface RecipeUpdateDto {
  baslik?: string;
  aciklama?: string;
  hazirlanis?: string;
  malzemeler?: string;
  kategoriId?: number;
  hazirlikSuresi?: number;
  pisirmeSuresi?: number;
  porsiyon?: string;
  zorlukDerecesi?: string;
  resimUrl?: string;
}

export interface RecipeDto {
  id: number;
  baslik: string;
  aciklama: string;
  hazirlanis: string;
  malzemeler: string;
  kategoriId: number;
  kategoriAdi?: string;
  kullaniciId: number;
  kullaniciAdi?: string;
  hazirlikSuresi?: number;
  pisirmeSuresi?: number;
  porsiyon?: string;
  zorlukDerecesi?: string;
  resimUrl?: string;
  olusturmaTarihi: string;
  guncellemeTarihi?: string;
  yorumSayisi?: number;
  ortalamaPuan?: number;
  aktifMi: boolean;
}

// Category Types
export interface CategoryDto {
  id: number;
  ad: string;
  aciklama?: string;
  tarifSayisi?: number;
  aktifMi: boolean;
}

// Comment Types
export interface CommentDto {
  id: number;
  yorum: string;
  yorumTarihi: string;
  kullaniciId: number;
  kullaniciAdi?: string;
  tarifId: number;
}

// Rating Types
export interface RatingDto {
  id: number;
  puan: number;
  kullaniciId: number;
  tarifId: number;
  olusturmaTarihi: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
