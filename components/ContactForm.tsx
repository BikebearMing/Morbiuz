"use client";

import { FormEvent, useState } from "react";

type NameInput = {
  id: number;
  label: string | null;
  placeholder: string | null;
  isHidden: boolean | null;
};

type FieldNode = {
  type: string;
  databaseId: number;
  label?: string | null;
  isRequired?: boolean | null;
  placeholder?: string | null;
  inputs?: NameInput[] | null;
  choices?: { text: string; value: string }[] | null;
};

export type GfForm = {
  databaseId: number;
  title: string;
  submitButton?: { text: string | null } | null;
  formFields: { nodes: FieldNode[] };
};

type FieldValue = {
  id: number;
  value?: string;
  emailValues?: { value: string };
  nameValues?: {
    prefix?: string;
    first?: string;
    middle?: string;
    last?: string;
    suffix?: string;
  };
};

const NAME_INPUT_KEYS: Record<number, "prefix" | "first" | "middle" | "last" | "suffix"> = {
  2: "prefix",
  3: "first",
  4: "middle",
  6: "last",
  8: "suffix",
};

export default function ContactForm({ form }: { form: GfForm }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [confirmation, setConfirmation] = useState<string>("");
  const [globalError, setGlobalError] = useState<string>("");

  const setVal = (key: string, v: string) =>
    setValues((p) => ({ ...p, [key]: v }));

  function buildFieldValues(): FieldValue[] {
    return form.formFields.nodes.map((f) => {
      const id = f.databaseId;
      switch (f.type) {
        case "NAME": {
          const visibleInputs = (f.inputs || []).filter((i) => !i.isHidden);
          if (visibleInputs.length <= 1) {
            return { id, value: values[`f${id}`] || "" };
          }
          const nameValues: FieldValue["nameValues"] = {};
          visibleInputs.forEach((input) => {
            const suffix = Math.round((input.id - id) * 10);
            const key = NAME_INPUT_KEYS[suffix];
            if (key) nameValues[key] = values[`f${id}_${suffix}`] || "";
          });
          return { id, nameValues };
        }
        case "EMAIL":
          return { id, emailValues: { value: values[`f${id}`] || "" } };
        default:
          return { id, value: values[`f${id}`] || "" };
      }
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrors({});
    setGlobalError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.databaseId,
          fieldValues: buildFieldValues(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data?.errors)) {
          const map: Record<number, string> = {};
          data.errors.forEach((err: { id: number; message: string }) => {
            map[err.id] = err.message;
          });
          setErrors(map);
        } else {
          setGlobalError(data?.message || "Something went wrong. Try again.");
        }
        setStatus("error");
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      setConfirmation(data.confirmation || "Thanks — we'll be in touch.");
      setStatus("success");
      setValues({});
    } catch {
      setGlobalError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-success">
        <h3 className="h3">{confirmation}</h3>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      {form.formFields.nodes.map((f) => {
        const id = f.databaseId;
        const err = errors[id];

        if (f.type === "NAME") {
          const visibleInputs = (f.inputs || []).filter((i) => !i.isHidden);
          if (visibleInputs.length <= 1) {
            return (
              <div className="form-field" key={id}>
                {/* <label className="form-label" htmlFor={`f${id}`}>
                  {f.label}
                </label> */}
                <input
                  id={`f${id}`}
                  className="form-input"
                  type="text"
                  required={!!f.isRequired}
                  placeholder={f.placeholder || f.label || ""}
                  value={values[`f${id}`] || ""}
                  onChange={(e) => setVal(`f${id}`, e.target.value)}
                />
                {err && <span className="form-error">{err}</span>}
              </div>
            );
          }
          return (
            <div className="form-name-row" key={id}>
              {visibleInputs.map((input) => {
                const suffix = Math.round((input.id - id) * 10);
                const key = `f${id}_${suffix}`;
                return (
                  <div className="form-field" key={input.id}>
                    {/* <label className="form-label" htmlFor={key}>
                      {input.label || ""}
                    </label> */}
                    <input
                      id={key}
                      className="form-input"
                      type="text"
                      placeholder={input.placeholder || input.label || ""}
                      value={values[key] || ""}
                      onChange={(e) => setVal(key, e.target.value)}
                      required={!!f.isRequired && (suffix === 3 || suffix === 6)}
                    />
                  </div>
                );
              })}
              {err && <span className="form-error">{err}</span>}
            </div>
          );
        }

        if (f.type === "TEXTAREA") {
          return (
            <div className="form-field" key={id}>
              {/* <label className="form-label" htmlFor={`f${id}`}>
                {f.label}
              </label> */}
              <textarea
                id={`f${id}`}
                className="form-textarea"
                rows={6}
                required={!!f.isRequired}
                placeholder={f.placeholder || f.label || ""}
                value={values[`f${id}`] || ""}
                onChange={(e) => setVal(`f${id}`, e.target.value)}
              />
              {err && <span className="form-error">{err}</span>}
            </div>
          );
        }

        if (f.type === "SELECT") {
          return (
            <div className="form-field" key={id}>
              {/* <label className="form-label" htmlFor={`f${id}`}>
                {f.label}
              </label> */}
              <select
                id={`f${id}`}
                className="form-input"
                required={!!f.isRequired}
                value={values[`f${id}`] || ""}
                onChange={(e) => setVal(`f${id}`, e.target.value)}
              >
                <option value="">—</option>
                {(f.choices || []).map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.text}
                  </option>
                ))}
              </select>
              {err && <span className="form-error">{err}</span>}
            </div>
          );
        }

        const inputType =
          f.type === "EMAIL" ? "email" : f.type === "PHONE" ? "tel" : "text";
        return (
          <div className="form-field" key={id}>
            {/* <label className="form-label" htmlFor={`f${id}`}>
              {f.label}
            </label> */}
            <input
              id={`f${id}`}
              className="form-input"
              type={inputType}
              required={!!f.isRequired}
              placeholder={f.placeholder || f.label || ""}
              value={values[`f${id}`] || ""}
              onChange={(e) => setVal(`f${id}`, e.target.value)}
            />
            {err && <span className="form-error">{err}</span>}
          </div>
        );
      })}

      {globalError && <div className="form-error form-error-global">{globalError}</div>}

      <button
        type="submit"
        className="custom-button"
        disabled={status === "submitting"}
      >
        <span className="custom-button-label">
          {status === "submitting"
            ? "Sending…"
            : form.submitButton?.text || "Send"}
        </span>
      </button>
    </form>
  );
}
