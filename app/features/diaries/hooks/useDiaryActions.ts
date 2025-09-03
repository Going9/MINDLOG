import { useCallback } from "react";

export function useDiaryActions() {
  const handleEdit = useCallback((id: number) => {
    console.log("Edit entry:", id);
    // TODO: Navigate to edit page
  }, []);

  const handleDelete = useCallback((id: number) => {
    console.log("Delete entry:", id);
    // TODO: Show confirmation and delete
  }, []);

  const handleView = useCallback((id: number) => {
    console.log("View entry:", id);
    // TODO: Navigate to view page
  }, []);

  return {
    handleEdit,
    handleDelete,
    handleView,
  };
}