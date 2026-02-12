import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GovernmentScheme {
    id: SchemeId;
    name: string;
    description: string;
    eligibility: string;
}
export type SoilReportId = bigint;
export interface SoilReport {
    id: SoilReportId;
    ph: number;
    farmerId: FarmerId;
    owner: Principal;
    recommendations: string;
    nutrients: string;
}
export interface CropAdvisory {
    id: AdvisoryId;
    crop: string;
    season: string;
    guidance: string;
}
export interface ExpertQuery {
    id: QueryId;
    farmerId: FarmerId;
    question: string;
    owner: Principal;
    response?: string;
    attachment?: string;
}
export type AdvisoryId = bigint;
export type FarmerId = bigint;
export interface FarmerProfile {
    id: FarmerId;
    preferredLanguage: string;
    name: string;
    landSize: number;
    location: string;
}
export type PriceId = bigint;
export type QueryId = bigint;
export type SchemeId = bigint;
export interface UserProfile {
    preferredLanguage: string;
    name: string;
    landSize: number;
    location: string;
}
export interface MandiPrice {
    id: PriceId;
    crop: string;
    price: bigint;
    location: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCropAdvisory(crop: string, guidance: string, season: string): Promise<AdvisoryId>;
    addGovernmentScheme(name: string, description: string, eligibility: string): Promise<SchemeId>;
    addMandiPrice(crop: string, price: bigint, location: string): Promise<PriceId>;
    addSoilReport(ph: number, nutrients: string, recommendations: string): Promise<SoilReportId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCropAdvisory(id: AdvisoryId): Promise<void>;
    deleteGovernmentScheme(id: SchemeId): Promise<void>;
    deleteMandiPrice(id: PriceId): Promise<void>;
    getCallerUserProfile(): Promise<FarmerProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCropAdvisories(): Promise<Array<CropAdvisory>>;
    getCropAdvisory(id: AdvisoryId): Promise<CropAdvisory | null>;
    getExpertQueries(): Promise<Array<ExpertQuery>>;
    getExpertQuery(id: QueryId): Promise<ExpertQuery | null>;
    getGovernmentScheme(id: SchemeId): Promise<GovernmentScheme | null>;
    getGovernmentSchemes(): Promise<Array<GovernmentScheme>>;
    getMandiPrice(id: PriceId): Promise<MandiPrice | null>;
    getMandiPrices(): Promise<Array<MandiPrice>>;
    getMigrationResult(): Promise<boolean>;
    getSoilReport(id: SoilReportId): Promise<SoilReport | null>;
    getSoilReports(): Promise<Array<SoilReport>>;
    getUserProfile(user: Principal): Promise<FarmerProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    respondToExpertQuery(id: QueryId, response: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitExpertQuery(question: string, attachment: string | null): Promise<QueryId>;
    updateCropAdvisory(id: AdvisoryId, crop: string, guidance: string, season: string): Promise<void>;
    updateGovernmentScheme(id: SchemeId, name: string, description: string, eligibility: string): Promise<void>;
    updateMandiPrice(id: PriceId, crop: string, price: bigint, location: string): Promise<void>;
}
