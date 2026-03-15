import { useState } from "react";
import { X, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { cn } from "@/lib/utils";
import type { Garment } from "@/components/GarmentCard";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFromPhoto: (garment: Garment) => void;
  onAddManual: (garment: Garment) => void;
}

const CATEGORIES = ["Top", "Bottom", "Dress", "Jacket", "Shoes", "Accessory"];
const MATERIALS = [
  "Cotton",
  "Wool",
  "Silk",
  "Linen",
  "Polyester",
  "Denim",
  "Leather",
  "Suede",
];
const FORMALITY_OPTIONS = ["Casual", "Business", "Formal"];

type Step = "method" | "details" | "confirm";
type AddMethod = "photo" | "manual" | null;

interface StepIndicatorProps {
  currentStep: Step;
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps: { id: Step; label: string; number: number }[] = [
    { id: "method", label: "Method", number: 1 },
    { id: "details", label: "Details", number: 2 },
    { id: "confirm", label: "Confirm", number: 3 },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-background/30">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200",
                currentStep === step.id
                  ? "bg-emerald-500 text-white scale-110"
                  : steps.findIndex((s) => s.id === currentStep) > idx
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-background border border-slate-700/50 text-muted-foreground"
              )}
            >
              {step.number}
            </div>
            <span
              className={cn(
                "text-xs font-medium mt-2",
                currentStep === step.id
                  ? "text-emerald-400"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>

          {idx < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-1 mx-2 transition-colors duration-200",
                steps.findIndex((s) => s.id === currentStep) > idx
                  ? "bg-emerald-500/20"
                  : "bg-slate-700/30"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function AddItemModal({
  isOpen,
  onClose,
  onAddFromPhoto,
  onAddManual,
}: AddItemModalProps) {
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<AddMethod>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    name: "Casual Blue Shirt",
    category: "Top",
    primaryColor: "#1e40af",
    secondaryColor: "#ffffff",
    material: "Cotton",
    seasons: ["Spring", "Summer"],
    formality: "Casual",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMethodSelect = (selectedMethod: AddMethod) => {
    setMethod(selectedMethod);
    if (selectedMethod === "manual") {
      const emptyGarment: Garment = {
        id: Date.now().toString(),
        name: "",
        image:
          "https://images.unsplash.com/photo-1506629082847-11d82e885e46?w=400&h=400&fit=crop",
        category: "Top",
        primaryColor: "#ffffff",
        material: "Cotton",
        seasons: [],
        formality: "Casual",
      };
      onAddManual(emptyGarment);
      resetModal();
    } else {
      setStep("details");
    }
  };

  const handleSaveFromPhoto = () => {
    if (!uploadedImage) return;
    const newGarment: Garment = {
      id: Date.now().toString(),
      image: uploadedImage,
      ...formData,
    };
    onAddFromPhoto(newGarment);
    resetModal();
  };

  const handleNext = () => {
    if (step === "method" && method === "photo" && uploadedImage) {
      setStep("details");
    } else if (step === "details" && uploadedImage) {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "details") {
      setStep("method");
      setUploadedImage(null);
      setImageLoaded(false);
      setImageError(false);
    } else if (step === "confirm") {
      setStep("details");
    }
  };

  const resetModal = () => {
    setStep("method");
    setMethod(null);
    setUploadedImage(null);
    setImageLoaded(false);
    setImageError(false);
    setFormData({
      name: "Casual Blue Shirt",
      category: "Top",
      primaryColor: "#1e40af",
      secondaryColor: "#ffffff",
      material: "Cotton",
      seasons: ["Spring", "Summer"],
      formality: "Casual",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        onClick={resetModal}
      >
        {/* Modal - Full screen on mobile, max-w-2xl on desktop */}
        <div
          className="bg-card border border-slate-700/50 rounded-[20px] md:rounded-[20px] shadow-2xl w-full h-[100vh] md:h-auto md:max-w-2xl md:max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-slate-700/50 px-6 py-4 flex items-center justify-between bg-background/20">
            <h2 className="text-2xl font-bold text-foreground">Add Item</h2>
            <button
              onClick={resetModal}
              className="p-1 rounded-lg hover:bg-background text-muted-foreground hover:text-emerald-400 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={step} />

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {step === "method" ? (
              // Step 1: Method Selection
              <div className="px-6 py-12 flex flex-col gap-4 animate-in fade-in duration-300">
                <p className="text-muted-foreground text-center mb-6 text-sm">
                  Choose how you'd like to add a new garment to your wardrobe
                </p>

                {/* Photo Upload Option */}
                <button
                  onClick={() => handleMethodSelect("photo")}
                  className={cn(
                    "p-6 rounded-[16px] border-2 transition-all duration-200 flex flex-col items-start gap-3",
                    method === "photo"
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-slate-700/50 hover:border-emerald-500/30 hover:bg-background/50"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Upload size={20} className="text-emerald-400" />
                  </div>
                  <div className="text-left w-full">
                    <h3 className="font-bold text-foreground">Add from Photo</h3>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Upload a photo and edit the auto-detected details
                    </p>
                  </div>
                  {method === "photo" && (
                    <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full" />
                  )}
                </button>

                {/* Manual Entry Option */}
                <button
                  onClick={() => handleMethodSelect("manual")}
                  className={cn(
                    "p-6 rounded-[16px] border-2 transition-all duration-200 flex flex-col items-start gap-3",
                    method === "manual"
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-slate-700/50 hover:border-emerald-500/30 hover:bg-background/50"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Plus size={20} className="text-emerald-400" />
                  </div>
                  <div className="text-left w-full">
                    <h3 className="font-bold text-foreground">Add Manually</h3>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Fill in all the details yourself for complete control
                    </p>
                  </div>
                  {method === "manual" && (
                    <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full" />
                  )}
                </button>
              </div>
            ) : step === "details" ? (
              // Step 2: Upload & Edit Details
              <div className="px-6 py-8 space-y-6 animate-in fade-in duration-300">
                {/* Upload Area */}
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-slate-700/50 rounded-[16px] p-8 text-center hover:border-emerald-500/50 hover:bg-background/30 transition-colors duration-200">
                    <label className="cursor-pointer flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Upload size={24} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          Upload garment photo
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative rounded-[16px] overflow-hidden bg-background aspect-square">
                      {imageError ? (
                        <ImagePlaceholder
                          showUploadButton={false}
                          className="h-full"
                        />
                      ) : (
                        <>
                          {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                              <div className="animate-pulse">
                                <div className="w-10 h-10 bg-slate-700 rounded-lg" />
                              </div>
                            </div>
                          )}
                          <img
                            src={uploadedImage}
                            alt="Uploaded"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => {
                              setImageLoaded(true);
                              setImageError(true);
                            }}
                            className={cn(
                              "w-full h-full object-cover",
                              !imageLoaded && "opacity-0"
                            )}
                          />
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const input = document.querySelector(
                          'input[type="file"]'
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                      className="w-full px-4 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm font-medium text-foreground hover:border-emerald-500/50 transition-colors duration-200"
                    >
                      Change Image
                    </button>
                  </div>
                )}

                {uploadedImage && (
                  <>
                    {/* Editable Fields */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Garment Details
                      </h3>

                      {/* Name */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors duration-200"
                        />
                      </div>

                      {/* Category & Formality */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-2">
                            Category
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors duration-200"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-2">
                            Formality
                          </label>
                          <select
                            value={formData.formality}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                formality: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors duration-200"
                          >
                            {FORMALITY_OPTIONS.map((form) => (
                              <option key={form} value={form}>
                                {form}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Material */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-2">
                          Material
                        </label>
                        <select
                          value={formData.material}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              material: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors duration-200"
                        >
                          {MATERIALS.map((mat) => (
                            <option key={mat} value={mat}>
                              {mat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Step 3: Confirm
              <div className="px-6 py-8 space-y-6 animate-in fade-in duration-300">
                <div className="rounded-[16px] border border-slate-700/50 bg-background/30 p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Review Details
                  </h3>

                  {/* Image Preview */}
                  {uploadedImage && (
                    <div className="relative rounded-[12px] overflow-hidden bg-background aspect-square">
                      <img
                        src={uploadedImage}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Name</span>
                      <span className="text-sm font-medium text-foreground">
                        {formData.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        Category
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {formData.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        Material
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {formData.material}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        Formality
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {formData.formality}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  You can edit more details after saving
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-700/50 px-6 py-4 bg-background/20 flex gap-3">
            {step !== "method" && (
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-slate-700/50 text-foreground font-medium hover:bg-background/80 transition-colors duration-200"
              >
                Back
              </button>
            )}

            {step === "method" && (
              <button
                onClick={resetModal}
                className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-slate-700/50 text-foreground font-medium hover:bg-background/80 transition-colors duration-200"
              >
                Cancel
              </button>
            )}

            {step === "details" && uploadedImage && (
              <Button
                onClick={handleNext}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Next: Review
              </Button>
            )}

            {step === "confirm" && (
              <Button
                onClick={handleSaveFromPhoto}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Save Garment
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
