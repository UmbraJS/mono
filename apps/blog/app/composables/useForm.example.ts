// Example usage of useForm and useValidatedForm hooks
import { z } from "zod";
import { useForm, useValidatedForm } from "./useForm";

// Example 1: Basic form without validation
export function basicFormExample() {
  const form = useForm({
    name: "",
    email: "",
    tags: [] as string[]
  });

  // Update fields
  form.setForm({ name: "John" });

  // Check state
  console.log(form.isDirty.value); // true
  console.log(form.dirtyValues.value); // { name: "John" }

  // After successful save
  form.commit(); // Makes current data the new baseline
}

// Example 2: Form with Zod validation
export function validatedFormExample() {
  // Define your Zod schema
  const userSchema = z.object({
    name: z.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z.string()
      .email("Invalid email format")
      .min(1, "Email is required"),
    age: z.number()
      .min(18, "Must be at least 18 years old")
      .max(120, "Age must be realistic"),
    tags: z.array(z.string()).default([]),
    preferences: z.object({
      newsletter: z.boolean().default(false),
      theme: z.enum(["light", "dark"]).default("light")
    })
  });

  // Create validated form
  const form = useValidatedForm({
    name: "",
    email: "",
    age: 0,
    tags: [],
    preferences: {
      newsletter: false,
      theme: "light" as const
    }
  }, {
    schema: userSchema,
    validationMode: "onChange" // Validate on every change
  });

  // Update with validation
  form.setForm({ name: "A" }); // Will show validation error

  // Check validation state
  console.log(form.isValid.value); // false
  console.log(form.errors.value); // { name: ["Name must be at least 2 characters"] }

  // Manual validation
  const result = form.validate();
  if (result.success) {
    // Submit form with result.data (fully typed and validated)
    console.log("Valid data:", result.data);
  } else {
    console.log("Validation errors:", result.fieldErrors);
  }

  // Validate specific field
  const nameErrors = form.validateField("name");
  if (nameErrors) {
    console.log("Name validation errors:", nameErrors);
  }

  return form;
}

// Example 3: Form submission with validation
export async function formSubmissionExample() {
  const schema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    published: z.boolean().default(false)
  });

  const form = useValidatedForm({
    title: "",
    content: "",
    published: false
  }, {
    schema,
    validationMode: "onSubmit" // Only validate when explicitly called
  });

  async function handleSubmit() {
    // Validate before submission
    const validation = form.validate();

    if (!validation.success) {
      console.error("Form validation failed:", validation.fieldErrors);
      return;
    }

    try {
      // Submit with validated data
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data) // Fully typed and validated
      });

      if (response.ok) {
        // On successful submit, commit the current state
        form.commit();
        form.clearErrors();
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  }

  return { form, handleSubmit };
}

// Example 4: Vue component usage
export function vueComponentExample() {
  const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters")
  });

  const form = useValidatedForm({
    username: "",
    password: ""
  }, {
    schema,
    validationMode: "onChange"
  });

  // In your template, you can use:
  // - form.data.value.username for v-model
  // - form.errors.value.username for displaying errors
  // - form.isValid.value to disable submit button
  // - form.isDirty.value to show unsaved changes indicator

  return form;
}
