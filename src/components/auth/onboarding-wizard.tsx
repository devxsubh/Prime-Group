"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setStepIndex,
  updateStep1,
  updateStep2,
  updateStep3,
  clearDraft,
  selectStepIndex,
  selectStep1,
  selectStep2,
  selectStep3,
} from "@/store/slices/profileDraftSlice";
import {
  ProfilePhotoUpload,
  getProfilePhotoFiles,
  clearProfilePhotoFiles,
} from "./profile-photo-upload";

const step1Schema = z.object({
  full_name: z.string().min(2, "Name is required"),
  gender: z.enum(["male", "female", "other"]),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  marital_status: z.string().optional(),
});

const step2Schema = z.object({
  country: z.string().min(2, "Country is required"),
  state: z.string().optional(),
  city: z.string().min(1, "City is required"),
  willing_to_relocate: z.string().optional(),
});

const step3Schema = z.object({
  age_min: z.coerce.number().min(18).max(100).optional(),
  age_max: z.coerce.number().min(18).max(100).optional(),
  additional_notes: z.string().max(500).optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

const STEPS = [
  { title: "Basic info", schema: step1Schema },
  { title: "Location", schema: step2Schema },
  { title: "Partner preferences", schema: step3Schema },
  { title: "Photos", schema: null },
];

const PHOTOS_STEP_INDEX = 3;

interface OnboardingWizardProps {
  userId: string;
  existingProfileId?: string;
}

export function OnboardingWizard({ userId, existingProfileId }: OnboardingWizardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxStepIndex = useAppSelector(selectStepIndex);
  const reduxStep1 = useAppSelector(selectStep1);
  const reduxStep2 = useAppSelector(selectStep2);
  const reduxStep3 = useAppSelector(selectStep3);

  const [step, setStep] = useState(reduxStepIndex);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDbError = (context: string, err: unknown) => {
    const e = err as { message?: string; code?: string; details?: string; hint?: string };
    const payload = {
      context,
      code: e?.code,
      message: e?.message,
      details: e?.details,
      hint: e?.hint,
    };
    console.error("[onboarding-db-error]", payload);
    return e?.message || "Something went wrong";
  };

  useEffect(() => {
    setStep(reduxStepIndex);
  }, [reduxStepIndex]);

  const currentSchema = step === PHOTOS_STEP_INDEX ? null : STEPS[step].schema;
  const form = useForm<Step1Data | Step2Data | Step3Data>({
    resolver: currentSchema ? zodResolver(currentSchema) : undefined,
    defaultValues: {
      full_name: reduxStep1.full_name ?? "",
      gender: reduxStep1.gender,
      date_of_birth: reduxStep1.date_of_birth ?? "",
      marital_status: reduxStep1.marital_status ?? "",
      country: reduxStep2.country ?? "India",
      state: reduxStep2.state ?? "",
      city: reduxStep2.city ?? "",
      willing_to_relocate: reduxStep2.willing_to_relocate ?? "",
      age_min: reduxStep3.age_min ?? 25,
      age_max: reduxStep3.age_max ?? 35,
      additional_notes: reduxStep3.additional_notes ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      full_name: reduxStep1.full_name ?? "",
      gender: reduxStep1.gender,
      date_of_birth: reduxStep1.date_of_birth ?? "",
      marital_status: reduxStep1.marital_status ?? "",
      country: reduxStep2.country ?? "India",
      state: reduxStep2.state ?? "",
      city: reduxStep2.city ?? "",
      willing_to_relocate: reduxStep2.willing_to_relocate ?? "",
      age_min: reduxStep3.age_min ?? 25,
      age_max: reduxStep3.age_max ?? 35,
      additional_notes: reduxStep3.additional_notes ?? "",
    });
  }, [reduxStep1, reduxStep2, reduxStep3, form]);

  const persistStepToRedux = (stepIndex: number, data: Step1Data | Step2Data | Step3Data) => {
    if (stepIndex === 0) dispatch(updateStep1(data as Step1Data));
    else if (stepIndex === 1) dispatch(updateStep2(data as Step2Data));
    else if (stepIndex === 2) dispatch(updateStep3(data as Step3Data));
  };

  const onSubmit = async (data: Step1Data | Step2Data | Step3Data) => {
    setError(null);
    setSaving(true);
    const supabase = createClient();

    try {
      const {
        data: { user: currentUser },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !currentUser) {
        console.error("[onboarding-auth-error]", {
          message: authErr?.message,
          code: authErr?.code,
          userIdProp: userId,
        });
        setError("Session expired. Please sign in again.");
        return;
      }
      const effectiveUserId = currentUser.id;

      if (step === PHOTOS_STEP_INDEX) {
        const uid = effectiveUserId;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", uid)
          .maybeSingle();
        if (!profile) throw new Error("Profile not found");

        const files = getProfilePhotoFiles();
        const bucket = "profile-photos";
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const ext = file.name.split(".").pop() || "jpg";
          const path = `${uid}/${profile.id}-${i}-${Date.now()}.${ext}`;
          const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, file, {
            cacheControl: "3600",
            upsert: false,
          });
          if (uploadErr) throw new Error(formatDbError("photo-upload", uploadErr));
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
          const { error: insertErr } = await supabase.from("profile_photos").insert({
            profile_id: profile.id,
            user_id: uid,
            photo_url: urlData.publicUrl,
            display_order: i,
            is_primary: i === 0,
            status: "pending",
          });
          if (insertErr) throw new Error(formatDbError("profile-photos-insert", insertErr));
        }
        clearProfilePhotoFiles();
        dispatch(clearDraft());
        router.refresh();
        router.push("/discover");
        return;
      }

      if (step === 0) {
        const d = data as Step1Data;
        dispatch(updateStep1(d));
        const payload = {
          user_id: effectiveUserId,
          full_name: d.full_name,
          gender: d.gender,
          date_of_birth: d.date_of_birth,
          marital_status: d.marital_status || null,
          profile_status: "pending",
          profile_completion_pct: 25,
        };
        if (existingProfileId) {
          const { error: e } = await supabase.from("profiles").update(payload).eq("id", existingProfileId);
          if (e) throw new Error(formatDbError("profile-update-step1", e));
        } else {
          const { error: e } = await supabase.from("profiles").upsert(payload, { onConflict: "user_id" });
          if (e) throw new Error(formatDbError("profile-upsert-step1", e));
        }
      } else if (step === 1) {
        const d = data as Step2Data;
        dispatch(updateStep2(d));
        const { data: profile, error: fetchErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", effectiveUserId)
          .maybeSingle();
        if (fetchErr) throw new Error(formatDbError("profile-fetch-step2", fetchErr));
        if (!profile?.id) {
          throw new Error("Profile not found for your account. Please complete Step 1 again.");
        }
        if (profile) {
          const { error: e } = await supabase
            .from("profiles")
            .update({
              country: d.country,
              state: d.state || null,
              city: d.city,
              willing_to_relocate: d.willing_to_relocate || null,
              profile_completion_pct: 50,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
          if (e) throw new Error(formatDbError("profile-update-step2", e));
        }
      } else if (step === 2) {
        const d = data as Step3Data;
        dispatch(updateStep3(d));
        const { data: profile, error: fetchErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", effectiveUserId)
          .maybeSingle();
        if (fetchErr) throw new Error(formatDbError("profile-fetch-step3", fetchErr));
        if (!profile?.id) {
          throw new Error("Profile not found for your account. Please complete Step 1 again.");
        }
        if (profile) {
          const { error: profileUpdateErr } = await supabase.from("profiles").update({
            profile_completion_pct: 75,
            updated_at: new Date().toISOString(),
          }).eq("id", profile.id);
          if (profileUpdateErr) throw new Error(formatDbError("profile-update-step3", profileUpdateErr));

          const { data: existingPref, error: prefFetchErr } = await supabase
            .from("partner_preferences")
            .select("id")
            .eq("profile_id", profile.id)
            .maybeSingle();
          if (prefFetchErr) throw new Error(formatDbError("partner-pref-fetch", prefFetchErr));
          const prefPayload = {
            profile_id: profile.id,
            user_id: effectiveUserId,
            age_min: d.age_min ?? null,
            age_max: d.age_max ?? null,
            additional_notes: d.additional_notes || null,
          };
          if (existingPref) {
            const { error: prefUpdateErr } = await supabase
              .from("partner_preferences")
              .update(prefPayload)
              .eq("id", existingPref.id);
            if (prefUpdateErr) throw new Error(formatDbError("partner-pref-update", prefUpdateErr));
          } else {
            const { error: prefInsertErr } = await supabase.from("partner_preferences").insert(prefPayload);
            if (prefInsertErr) throw new Error(formatDbError("partner-pref-insert", prefInsertErr));
          }
        }
      }

      if (step < PHOTOS_STEP_INDEX) {
        dispatch(setStepIndex(step + 1));
        setStep(step + 1);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("[onboarding-submit-error]", {
          step,
          message: err.message,
          userIdProp: userId,
        });
      } else {
        console.error("[onboarding-submit-error]", { step, err });
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step === PHOTOS_STEP_INDEX) {
      dispatch(setStepIndex(2));
      setStep(2);
      return;
    }
    const d = form.getValues();
    persistStepToRedux(step, d as Step1Data & Step2Data & Step3Data);
    dispatch(setStepIndex(step - 1));
    setStep(step - 1);
  };

  const handleFormSubmit = form.handleSubmit((d) => onSubmit(d as Step1Data | Step2Data | Step3Data));

  return (
    <div className="rounded-2xl border p-8 shadow-lg" style={{ borderColor: "var(--accent-gold)" }}>
      <h1 className="font-playfair-display text-2xl font-bold mb-2" style={{ color: "var(--primary-blue)" }}>
        Create your profile
      </h1>
      <p className="font-montserrat text-sm mb-6" style={{ color: "var(--primary-blue)" }}>
        Step {step + 1} of {STEPS.length}: {STEPS[step].title}
      </p>

      {step === PHOTOS_STEP_INDEX ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit({} as Step3Data);
          }}
          className="space-y-6"
        >
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          <ProfilePhotoUpload />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1"
              style={{ backgroundColor: "var(--primary-blue)" }}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Finish"}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name *</Label>
                <Input
                  id="full_name"
                  {...form.register("full_name")}
                  className="w-full"
                  placeholder="Your full name"
                />
                {form.formState.errors.full_name && (
                  <p className="text-sm text-red-500">{form.formState.errors.full_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select
                  onValueChange={(v) => form.setValue("gender", v as Step1Data["gender"])}
                  defaultValue={form.getValues("gender")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...form.register("date_of_birth")}
                  className="w-full"
                />
                {form.formState.errors.date_of_birth && (
                  <p className="text-sm text-red-500">{form.formState.errors.date_of_birth.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Marital status</Label>
                <Select
                  onValueChange={(v) => form.setValue("marital_status", v)}
                  defaultValue={form.getValues("marital_status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never_married">Never Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  {...form.register("country")}
                  className="w-full"
                  placeholder="e.g. India"
                />
                {form.formState.errors.country && (
                  <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...form.register("state")} className="w-full" placeholder="State" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...form.register("city")} className="w-full" placeholder="City" />
                {form.formState.errors.city && (
                  <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Willing to relocate?</Label>
                <Select
                  onValueChange={(v) => form.setValue("willing_to_relocate", v)}
                  defaultValue={form.getValues("willing_to_relocate")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="maybe">Maybe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age_min">Partner age (min)</Label>
                  <Input
                    id="age_min"
                    type="number"
                    min={18}
                    max={100}
                    {...form.register("age_min")}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age_max">Partner age (max)</Label>
                  <Input
                    id="age_max"
                    type="number"
                    min={18}
                    max={100}
                    {...form.register("age_max")}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additional_notes">Additional notes (optional)</Label>
                <textarea
                  id="additional_notes"
                  {...form.register("additional_notes")}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Anything else you'd like to add..."
                  maxLength={500}
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
            )}
            <Button
              type="submit"
              disabled={saving}
              className="flex-1"
              style={{ backgroundColor: "var(--primary-blue)" }}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                step < STEPS.length - 1 ? "Continue" : "Finish"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
