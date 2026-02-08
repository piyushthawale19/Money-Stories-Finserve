// Document data store utilities for persistent storage
import { recentDocuments as initialDocuments } from "@/lib/data";

export const getPersistedDocuments = () => {
  if (typeof window === "undefined") return initialDocuments;

  try {
    const savedDocuments = localStorage.getItem("research-platform-documents");
    if (savedDocuments) {
      const parsed = JSON.parse(savedDocuments);
      // Merge user-uploaded documents with initial documents
      const mergedDocuments = [
        ...parsed,
        ...initialDocuments.filter(
          (id: any) => !parsed.some((pd: any) => pd.id === id.id),
        ),
      ];
      return mergedDocuments;
    }
  } catch (error) {
    console.error("Failed to load documents from localStorage:", error);
  }

  return initialDocuments;
};

export const saveUserDocuments = (allDocuments: typeof initialDocuments) => {
  if (typeof window === "undefined") return;

  try {
    // Only save user-uploaded documents (ones not in initialDocuments)
    const userUploadedDocuments = allDocuments.filter(
      (d) => !initialDocuments.some((id) => id.id === d.id),
    );
    localStorage.setItem(
      "research-platform-documents",
      JSON.stringify(userUploadedDocuments),
    );
  } catch (error) {
    console.error("Failed to save documents to localStorage:", error);
  }
};
