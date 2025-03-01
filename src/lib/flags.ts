import { ComponentType } from 'react';

export type CountryCode = string;

const flagComponents: Partial<Record<CountryCode, ComponentType>> = {};

export async function loadFlag(code: CountryCode): Promise<ComponentType> {
  if (!flagComponents[code]) {
    const importedFlag = await import(`flag-icons/flags/4x3/${code}.svg`);
    flagComponents[code] = importedFlag.default;
  }
  return flagComponents[code]!;
}