import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { TextArea } from "../../../components/ui/TextArea";
import { Button } from "../../../components/ui/Button";
import { jdSchema } from "../schemas/jdSchemas";
import { useCreateJD } from "../hooks/useCreateJD";
import { useUpdateJD } from "../hooks/useUpdateJD";

export function JDFormModal({ isOpen, onClose, jdToEdit }) {
  const isEditing = !!jdToEdit;
  
  const { mutate: createJD, isPending: isCreating } = useCreateJD();
  const { mutate: updateJD, isPending: isUpdating } = useUpdateJD();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jdSchema),
    defaultValues: {
      title: "",
      company: "",
      content: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (jdToEdit) {
        reset({
          title: jdToEdit.title,
          company: jdToEdit.company,
          content: jdToEdit.content,
        });
      } else {
        reset({ title: "", company: "", content: "" });
      }
    }
  }, [isOpen, jdToEdit, reset]);

  const contentValue = watch("content") || "";
  const contentLength = contentValue.trim().length;
  const isContentValid = contentLength >= 250;

  const onSubmit = (data) => {
    if (isEditing) {
      const payload = {};

      if (data.title !== jdToEdit.title) payload.title = data.title;
      if (data.company !== jdToEdit.company) payload.company = data.company;
      if (data.content !== jdToEdit.content) payload.content = data.content;

      if (!Object.keys(payload).length) {
        onClose();
        return;
      }

      updateJD(
        { id: jdToEdit.id, data: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createJD(data, { onSuccess: () => onClose() });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isPending && onClose()}
      title={isEditing ? "Edit Job Description" : "Add Job Description"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none dark:text-zinc-300">
            Job Title
          </label>
          <Input placeholder="e.g. Senior Frontend Engineer" {...register("title")} />
          {errors.title && <p className="text-sm text-rose-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none dark:text-zinc-300">
            Company Name
          </label>
          <Input placeholder="e.g. Acme Corp" {...register("company")} />
          {errors.company && <p className="text-sm text-rose-500">{errors.company.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium leading-none dark:text-zinc-300">
              Job Description Content
            </label>
            <span className={`text-xs ${contentLength < 250 ? "text-rose-500" : "text-emerald-500"}`}>
              {contentLength} / 250 characters
            </span>
          </div>
          <TextArea 
            placeholder="Paste the full job description here..." 
            className="min-h-[200px]"
            {...register("content")} 
          />
          {errors.content && <p className="text-sm text-rose-500">{errors.content.message}</p>}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:justify-end dark:border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending} disabled={!isContentValid}>
            {isEditing ? "Save Changes" : "Save Job Description"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
