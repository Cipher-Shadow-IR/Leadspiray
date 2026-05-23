export const PROVIDERS_PER_LEAD = 3;

export const MANDATORY_PROVIDER_IDS: Record<number, number[]> = {
  1: [1],
  2: [5],
  3: [1, 4]
};

export const FAIR_PROVIDER_POOLS: Record<number, number[]> = {
  1: [2, 3, 4],
  2: [6, 7, 8],
  3: [2, 3, 5, 6, 7, 8]
};

export function getMandatoryProviderIds(serviceId: number) {
  return MANDATORY_PROVIDER_IDS[serviceId] ?? [];
}

export function getFairProviderPool(serviceId: number) {
  return FAIR_PROVIDER_POOLS[serviceId] ?? [];
}
