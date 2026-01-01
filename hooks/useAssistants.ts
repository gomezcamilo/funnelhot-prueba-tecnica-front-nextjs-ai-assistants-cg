'use client';

import { useCallback, useEffect } from 'react';
import { Assistant, TrainingConfig } from '@/types/assistant';
import { useLocalStorage } from './useLocalStorage';
import { initialAssistants } from '@/data/initialData';

const STORAGE_KEY = 'ai-assistants';

export function useAssistants() {
  const [assistants, setAssistants, isLoaded] = useLocalStorage<Assistant[]>(STORAGE_KEY, []);

  useEffect(() => {
    if (isLoaded && assistants.length === 0) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setAssistants(initialAssistants);
      }
    }
  }, [isLoaded, assistants.length, setAssistants]);

  const createAssistant = useCallback(
    (assistantData: Omit<Assistant, 'id'>) => {
      const newAssistant: Assistant = {
        ...assistantData,
        id: `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      setAssistants((prev) => [...prev, newAssistant]);
      return newAssistant;
    },
    [setAssistants]
  );

  const updateAssistant = useCallback(
    (id: string, updates: Partial<Assistant>) => {
      setAssistants((prev) =>
        prev.map((assistant) =>
          assistant.id === id ? { ...assistant, ...updates } : assistant
        )
      );
    },
    [setAssistants]
  );

  const deleteAssistant = useCallback(
    (id: string) => {
      setAssistants((prev) => prev.filter((assistant) => assistant.id !== id));
    },
    [setAssistants]
  );

  const getAssistantById = useCallback(
    (id: string): Assistant | undefined => {
      return assistants.find((assistant) => assistant.id === id);
    },
    [assistants]
  );

  const updateRules = useCallback(
    (id: string, rules: string) => {
      updateAssistant(id, { rules });
    },
    [updateAssistant]
  );

  const updateTrainingConfig = useCallback(
    (id: string, trainingConfig: TrainingConfig) => {
      updateAssistant(id, { trainingConfig });
    },
    [updateAssistant]
  );

  return {
    assistants,
    isLoaded,
    createAssistant,
    updateAssistant,
    deleteAssistant,
    getAssistantById,
    updateRules,
    updateTrainingConfig,
  };
}
