"use client";

import { useState, type FormEvent } from "react";
import Button from "../ui/Button";
import FormField from "../ui/FormField";
import Input from "../ui/Input";

type SkillFormProps = {
  initialValues?: { name: string; category?: string | null };
  submitLabel?: string;
  onSubmit: (values: { name: string; category?: string }) => Promise<void>;
  onCancel?: () => void;
};

export default function SkillForm({
  initialValues = { name: "", category: "" },
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: SkillFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [category, setCategory] = useState(initialValues.category || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ name, category });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-danger text-sm">{error}</p>}

      <FormField label="Skill Name" htmlFor="skill-name" required>
        <Input
          id="skill-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Python"
        />
      </FormField>

      <FormField label="Category" htmlFor="skill-category" hint="Optional grouping for easier browsing.">
        <Input
          id="skill-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Programming Language"
        />
      </FormField>

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
