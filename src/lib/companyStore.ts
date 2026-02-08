// Company data store utilities for persistent storage
import { companies as initialCompanies } from "@/lib/data";

export const getPersistedCompanies = () => {
  if (typeof window === "undefined") return initialCompanies;

  try {
    const savedCompanies = localStorage.getItem("research-platform-companies");
    if (savedCompanies) {
      const parsed = JSON.parse(savedCompanies);
      // Merge user-added companies with initial companies
      const mergedCompanies = [
        ...parsed,
        ...initialCompanies.filter(
          (ic: any) => !parsed.some((pc: any) => pc.id === ic.id),
        ),
      ];
      return mergedCompanies;
    }
  } catch (error) {
    console.error("Failed to load companies from localStorage:", error);
  }

  return initialCompanies;
};

export const saveUserCompanies = (allCompanies: typeof initialCompanies) => {
  if (typeof window === "undefined") return;

  try {
    // Only save user-added companies (ones not in initialCompanies)
    const userAddedCompanies = allCompanies.filter(
      (c) => !initialCompanies.some((ic) => ic.id === c.id),
    );
    localStorage.setItem(
      "research-platform-companies",
      JSON.stringify(userAddedCompanies),
    );
  } catch (error) {
    console.error("Failed to save companies to localStorage:", error);
  }
};
