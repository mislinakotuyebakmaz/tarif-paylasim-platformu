// src/types/index.ts - SON VE KESİN HALİ

interface LoginDto {
  kullaniciAdiVeyaEmail: string;
  sifre: string;
}
interface RegisterDto {
  kullaniciAdi: string;
  email: string;
  sifre: string;
  adSoyad: string;
}
interface UserDto {
  id: number;
  kullaniciAdi: string;
  email: string;
  adSoyad: string;
  kayitTarihi: string;
  tarifSayisi: number;
}
interface LoginResponseDto {
  token: string;
  tokenExpiration: string;
  user: UserDto;
}
interface RecipeCreateDto {
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
interface RecipeUpdateDto {
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
interface RecipeDto {
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
interface CategoryDto {
  id: number;
  ad: string;
  aciklama?: string;
  tarifSayisi?: number;
  aktifMi: boolean;
}
interface CommentDto {
  id: number;
  yorum: string;
  yorumTarihi: string;
  kullaniciId: number;
  kullaniciAdi?: string;
  tarifId: number;
}
interface RatingDto {
  id: number;
  puan: number;
  kullaniciId: number;
  tarifId: number;
  olusturmaTarihi: string;
}
interface Favorite { // Bu da eksik kalmasın
    id: number;
    kullaniciId: number;
    tarifId: number;
}

// Şimdi tüm bu tipleri tek bir yerden, 'type-only' olarak export ediyoruz.
export type {
  LoginDto,
  RegisterDto,
  UserDto,
  LoginResponseDto,
  RecipeCreateDto,
  RecipeUpdateDto,
  RecipeDto,
  CategoryDto,
  CommentDto,
  RatingDto,
  Favorite, // Eklendi
    // Eklendi
};