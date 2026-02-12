import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { setCachedData, getCachedData, isOfflineError } from '../utils/offlineCache';
import type {
  CropAdvisory,
  MandiPrice,
  GovernmentScheme,
  SoilReport,
  ExpertQuery,
  FarmerProfile,
  UserProfile,
  AdvisoryId,
  PriceId,
  SchemeId,
  SoilReportId,
  QueryId,
} from '../backend';

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<FarmerProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Crop Advisory
export function useGetCropAdvisories() {
  const { actor, isFetching } = useActor();

  return useQuery<CropAdvisory[]>({
    queryKey: ['cropAdvisories'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const data = await actor.getCropAdvisories();
      setCachedData('cropAdvisories', data);
      return data;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCropAdvisory(id: AdvisoryId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<CropAdvisory | null>({
    queryKey: ['cropAdvisory', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getCropAdvisory(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddCropAdvisory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ crop, guidance, season }: { crop: string; guidance: string; season: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCropAdvisory(crop, guidance, season);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cropAdvisories'] });
    },
  });
}

export function useUpdateCropAdvisory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, crop, guidance, season }: { id: AdvisoryId; crop: string; guidance: string; season: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCropAdvisory(id, crop, guidance, season);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cropAdvisories'] });
    },
  });
}

export function useDeleteCropAdvisory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: AdvisoryId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCropAdvisory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cropAdvisories'] });
    },
  });
}

// Mandi Prices
export function useGetMandiPrices() {
  const { actor, isFetching } = useActor();

  return useQuery<MandiPrice[]>({
    queryKey: ['mandiPrices'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const data = await actor.getMandiPrices();
      setCachedData('mandiPrices', data);
      return data;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMandiPrice(id: PriceId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<MandiPrice | null>({
    queryKey: ['mandiPrice', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getMandiPrice(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddMandiPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ crop, price, location }: { crop: string; price: bigint; location: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMandiPrice(crop, price, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandiPrices'] });
    },
  });
}

export function useUpdateMandiPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, crop, price, location }: { id: PriceId; crop: string; price: bigint; location: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMandiPrice(id, crop, price, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandiPrices'] });
    },
  });
}

export function useDeleteMandiPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: PriceId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMandiPrice(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandiPrices'] });
    },
  });
}

// Government Schemes
export function useGetGovernmentSchemes() {
  const { actor, isFetching } = useActor();

  return useQuery<GovernmentScheme[]>({
    queryKey: ['governmentSchemes'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const data = await actor.getGovernmentSchemes();
      setCachedData('governmentSchemes', data);
      return data;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGovernmentScheme(id: SchemeId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<GovernmentScheme | null>({
    queryKey: ['governmentScheme', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getGovernmentScheme(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddGovernmentScheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, eligibility }: { name: string; description: string; eligibility: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGovernmentScheme(name, description, eligibility);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governmentSchemes'] });
    },
  });
}

export function useUpdateGovernmentScheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description, eligibility }: { id: SchemeId; name: string; description: string; eligibility: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGovernmentScheme(id, name, description, eligibility);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governmentSchemes'] });
    },
  });
}

export function useDeleteGovernmentScheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: SchemeId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGovernmentScheme(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governmentSchemes'] });
    },
  });
}

// Soil Reports
export function useGetSoilReports() {
  const { actor, isFetching } = useActor();

  return useQuery<SoilReport[]>({
    queryKey: ['soilReports'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSoilReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSoilReport(id: SoilReportId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<SoilReport | null>({
    queryKey: ['soilReport', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getSoilReport(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddSoilReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ph, nutrients, recommendations }: { ph: number; nutrients: string; recommendations: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSoilReport(ph, nutrients, recommendations);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soilReports'] });
    },
  });
}

// Expert Queries
export function useGetExpertQueries() {
  const { actor, isFetching } = useActor();

  return useQuery<ExpertQuery[]>({
    queryKey: ['expertQueries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getExpertQueries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetExpertQuery(id: QueryId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ExpertQuery | null>({
    queryKey: ['expertQuery', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getExpertQuery(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSubmitExpertQuery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ question, attachment }: { question: string; attachment: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitExpertQuery(question, attachment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertQueries'] });
    },
  });
}

export function useRespondToExpertQuery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, response }: { id: QueryId; response: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.respondToExpertQuery(id, response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertQueries'] });
    },
  });
}
