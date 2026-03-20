import { useQuery } from '@tanstack/react-query';
import { masterApi } from '@/lib/api/services';

export type SelectOption = { value: string; label: string };

export const cleanMasterId = (value: unknown) => String(value ?? '').trim();

export const useReligionOptions = () => {
  return useQuery({
    queryKey: ['master', 'religions'],
    queryFn: () => masterApi.getReligions(),
    select: (res: any) =>
      (res?.data || []).map((item: any) => ({
        value: cleanMasterId(item.id),
        label: String(item.name),
      })) as SelectOption[],
    staleTime: 30 * 60 * 1000,
  });
};

export const useRegionMaster = () => {
  return useQuery({
    queryKey: ['master', 'regions'],
    queryFn: async () => {
      const [provRes, regRes, distRes, villRes] = await Promise.all([
        masterApi.getProvinces({ page: 1, limit: 1000 }),
        masterApi.getRegencies({ page: 1, limit: 5000 }),
        masterApi.getDistricts({ page: 1, limit: 5000 }),
        masterApi.getVillages({ page: 1, limit: 5000 }),
      ]);

      return {
        provinces: provRes?.data || [],
        regencies: regRes?.data || [],
        districts: distRes?.data || [],
        villages: villRes?.data || [],
      };
    },
    staleTime: 30 * 60 * 1000,
  });
};

