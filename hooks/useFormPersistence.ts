"use client";

import { useEffect, useRef } from "react";
import { UseFormReturn, Path, PathValue } from "react-hook-form";

interface UseFormPersistenceOptions<TFieldValues extends Record<string, any>> {
    formId: string;
    formMethods: UseFormReturn<TFieldValues>;
    persistFields: (keyof TFieldValues)[];
}

export const useFormPersistence = <
    TFieldValues extends Record<string, any>
>({
    formId,
    formMethods,
    persistFields,
}: UseFormPersistenceOptions<TFieldValues>) => {
    const { watch, setValue } = formMethods;
    const hasRestored = useRef(false);

    const storageKey = `form_persistence_${formId}`;

    // ✅ RESTORE ONLY ONCE (on mount)
    useEffect(() => {
        if (hasRestored.current) return;

        const savedData = localStorage.getItem(storageKey);
        if (!savedData) return;

        try {
            const parsedData = JSON.parse(savedData) as Partial<TFieldValues>;

            persistFields.forEach((field) => {
                const value = parsedData[field];
                if (value !== undefined) {
                    setValue(
                        field as Path<TFieldValues>,
                        value as PathValue<TFieldValues, Path<TFieldValues>>,
                        { shouldDirty: false, shouldValidate: false }
                    );
                }
            });

            hasRestored.current = true;
        } catch (error) {
            console.error("Form persistence restore failed:", error);
        }
    }, [persistFields, setValue, storageKey]);

    useEffect(() => {
        const subscription = watch((values) => {
            const dataToPersist = persistFields.reduce(
                (acc, field) => {
                    acc[field] = (values as any)[field];
                    return acc;
                },
                {} as Partial<TFieldValues>
            );

            localStorage.setItem(storageKey, JSON.stringify(dataToPersist));
        });

        return () => subscription.unsubscribe();
    }, [persistFields, storageKey, watch]);
};
