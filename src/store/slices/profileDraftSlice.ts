import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Step1Data {
  full_name: string;
  gender: "male" | "female" | "other";
  date_of_birth: string;
  marital_status: string;
}

export interface Step2Data {
  country: string;
  state: string;
  city: string;
  willing_to_relocate: string;
}

export interface Step3Data {
  age_min: number;
  age_max: number;
  additional_notes: string;
}

/** Serializable photo entry for Redux (actual File kept in component ref for upload) */
export interface ProfilePhotoItem {
  id: string;
  previewUrl: string;
  compressedSize?: number;
}

export interface ProfileDraftState {
  stepIndex: number;
  step1: Partial<Step1Data>;
  step2: Partial<Step2Data>;
  step3: Partial<Step3Data>;
  photos: ProfilePhotoItem[];
}

const initialState: ProfileDraftState = {
  stepIndex: 0,
  step1: {},
  step2: {},
  step3: {},
  photos: [],
};

const MAX_PHOTOS = 5;

const profileDraftSlice = createSlice({
  name: "profileDraft",
  initialState,
  reducers: {
    setStepIndex(state, action: PayloadAction<number>) {
      state.stepIndex = Math.max(0, Math.min(action.payload, 3));
    },
    updateStep1(state, action: PayloadAction<Partial<Step1Data>>) {
      state.step1 = { ...state.step1, ...action.payload };
    },
    updateStep2(state, action: PayloadAction<Partial<Step2Data>>) {
      state.step2 = { ...state.step2, ...action.payload };
    },
    updateStep3(state, action: PayloadAction<Partial<Step3Data>>) {
      state.step3 = { ...state.step3, ...action.payload };
    },
    addPhoto(state, action: PayloadAction<Omit<ProfilePhotoItem, "compressedSize"> & { compressedSize?: number }>) {
      if (state.photos.length >= MAX_PHOTOS) return;
      state.photos.push({
        id: action.payload.id,
        previewUrl: action.payload.previewUrl,
        compressedSize: action.payload.compressedSize,
      });
    },
    removePhoto(state, action: PayloadAction<string>) {
      state.photos = state.photos.filter((p) => p.id !== action.payload);
    },
    setPhotos(state, action: PayloadAction<ProfilePhotoItem[]>) {
      state.photos = action.payload.slice(0, MAX_PHOTOS);
    },
    clearDraft() {
      return initialState;
    },
    loadDraft(state, action: PayloadAction<Partial<ProfileDraftState>>) {
      return { ...initialState, ...state, ...action.payload };
    },
  },
});

export const {
  setStepIndex,
  updateStep1,
  updateStep2,
  updateStep3,
  addPhoto,
  removePhoto,
  setPhotos,
  clearDraft,
  loadDraft,
} = profileDraftSlice.actions;

export const selectStepIndex = (state: { profileDraft: ProfileDraftState }) =>
  state.profileDraft.stepIndex;
export const selectStep1 = (state: { profileDraft: ProfileDraftState }) =>
  state.profileDraft.step1;
export const selectStep2 = (state: { profileDraft: ProfileDraftState }) =>
  state.profileDraft.step2;
export const selectStep3 = (state: { profileDraft: ProfileDraftState }) =>
  state.profileDraft.step3;
export const selectPhotos = (state: { profileDraft: ProfileDraftState }) =>
  state.profileDraft.photos;
export const selectCanAddPhoto = (state: { profileDraft: ProfileDraftState }) =>
  state.profileDraft.photos.length < MAX_PHOTOS;

export default profileDraftSlice.reducer;
