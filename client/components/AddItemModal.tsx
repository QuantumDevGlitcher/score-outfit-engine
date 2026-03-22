import { useState } from "react";
import { X, Upload, Plus, Check, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { cn } from "@/lib/utils";
import type { Garment } from "@/components/GarmentCard";
import { useToast } from "@/hooks/use-toast";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFromPhoto: (garments: Garment[]) => void;
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
    name: "New Item",
    category: "Top",
    primaryColor: "#1e40af",
    secondaryColor: "#ffffff",
    material: "Cotton",
    seasons: ["Spring", "Summer"],
    formality: "Casual",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedItems, setDetectedItems] = useState<any[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [analysisResult, setAnalysisResult] = useState<{
    outfit_embedding?: number[];
    s_style?: number;
    s_rel?: number;
  } | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<"like" | "dislike" | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Trigger ML Analysis
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("/api/wardrobe/add", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setDetectedItems(data.items);
          setSelectedIndices(data.items.map((_: any, i: number) => i));
          setAnalysisResult({
            outfit_embedding: data.outfit_embedding,
            s_style: data.s_style,
            s_rel: data.s_rel,
          });
          setFeedbackGiven(null);
          
          if (data.items.length > 0) {
            const first = data.items[0];
            setFormData({
              name: first.core_info.name,
              category: first.core_info.category,
              primaryColor: first.core_info.primary_color,
              secondaryColor: first.core_info.secondary_color,
              material: first.attributes.material,
              seasons: first.attributes.seasons,
              formality: first.core_info.formality,
            });
          }
        }
      } catch (err) {
        console.error("Analysis failed:", err);
      } finally {
        setIsAnalyzing(false);
      }
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

  const handleSaveFromPhoto = async () => {
    if (detectedItems.length === 0) return;
    
    const selectedItems = detectedItems.filter((_, i) => selectedIndices.includes(i));
    if (selectedItems.length === 0) return;

    try {
      const response = await fetch("/api/wardrobe/bulk-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedItems }),
      });

      if (response.ok) {
        const { items: savedItems } = await response.json();
        const newGarments: Garment[] = (savedItems || []).map((item: any) => ({
          id: item._id,
          name: item.core_info.name,
          image: item.image_url,
          category: item.core_info.category,
          primaryColor: item.core_info.primary_color,
          secondaryColor: item.core_info.secondary_color,
          material: item.attributes.material,
          seasons: item.attributes.seasons,
          formality: item.core_info.formality,
          formality_score: item.ml_features?.formality_score,
          weather_warmth: item.ml_features?.weather_warmth,
          dominant_colors: item.ml_features?.dominant_colors,
          confidence: item.ml_features?.confidence,
        }));
        
        onAddFromPhoto(newGarments);
        resetModal();
      }
    } catch (err) {
      console.error("Bulk save failed:", err);
    }
  };

  const handleFeedback = async (liked: boolean) => {
    if (!analysisResult?.outfit_embedding) return;
    
    setIsSubmittingFeedback(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "wardrobe_upload_" + Date.now(),
          outfit_embedding: analysisResult.outfit_embedding,
          liked,
          s_style: analysisResult.s_style || 0.5,
          s_rel: analysisResult.s_rel || 0.5,
        }),
      });
      
      if (response.ok) {
        setFeedbackGiven(liked ? "like" : "dislike");
        toast({
          title: liked ? "Preference Saved!" : "Dislike Noted",
          description: "Your personal aesthetic has been updated based on this outfit.",
        });
      }
    } catch (err) {
      console.error("Feedback failed:", err);
      toast({
        title: "Feedback Failed",
        description: "Failed to update your style preferences.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
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
              <div className="px-6 py-8 space-y-6 animate-in fade-in duration-300 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      Confirm Detected Garments
                    </h3>
                    <span className="text-xs text-muted-foreground bg-slate-800 px-2 py-1 rounded-full">
                      {selectedIndices.length} of {detectedItems.length} selected
                    </span>
                  </div>

                  {detectedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-background/30 rounded-2xl border border-dashed border-slate-700/50">
                      <AlertCircle className="w-10 h-10 text-slate-500 mb-3" />
                      <p className="text-sm text-slate-400">No garments detected</p>
                      <button 
                        onClick={() => setStep("details")}
                        className="mt-4 text-xs text-emerald-400 hover:underline"
                      >
                        Go back and try another image
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {detectedItems.map((item, idx) => {
                        const isSelected = selectedIndices.includes(idx);
                        const confidencePercent = Math.round((item.ml_features?.confidence || 0) * 100);
                        
                        return (
                          <div 
                            key={idx}
                            onClick={() => {
                              setSelectedIndices(prev => 
                                isSelected 
                                  ? prev.filter(i => i !== idx) 
                                  : [...prev, idx]
                              );
                            }}
                            className={cn(
                              "group relative rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer",
                              isSelected 
                                ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]" 
                                : "border-slate-700/50 bg-background/30 hover:border-slate-600"
                            )}
                          >
                            {/* Checkbox Overlay */}
                            <div className={cn(
                              "absolute top-2 right-2 z-10 w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200",
                              isSelected 
                                ? "bg-emerald-500 border-emerald-500 text-white" 
                                : "bg-black/20 border-white/30 text-transparent"
                            )}>
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </div>

                            {/* Confidence Badge */}
                            <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">
                              {confidencePercent}%
                            </div>

                            <div className="aspect-square overflow-hidden bg-slate-900">
                              <img 
                                src={item.image_url} 
                                alt={item.core_info.name}
                                className={cn(
                                  "w-full h-full object-cover transition-transform duration-500",
                                  isSelected ? "scale-105" : "group-hover:scale-105"
                                )}
                              />
                            </div>

                            <div className="p-3">
                              <p className="text-[11px] font-bold text-foreground truncate uppercase tracking-tight">
                                {item.core_info.category}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {item.core_info.name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Select the items you want to add to your wardrobe. You can edit individual details later.
                </p>

                {analysisResult?.outfit_embedding && (
                  <div className="mt-6 p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex flex-col items-center gap-4">
                    <h4 className="text-sm font-semibold text-foreground">Like this outfit?</h4>
                    <p className="text-xs text-muted-foreground text-center">
                      Explicitly liking or disliking this outfit helps SCORE learn your personal aesthetic.
                    </p>
                    <div className="flex gap-4">
                      <button
                        disabled={isSubmittingFeedback || feedbackGiven !== null}
                        onClick={() => handleFeedback(true)}
                        className={cn(
                          "flex items-center gap-2 px-6 py-2 rounded-full border transition-all duration-200",
                          feedbackGiven === "like"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : "bg-background border-slate-700/50 text-muted-foreground hover:border-emerald-500 hover:text-emerald-400"
                        )}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Love it</span>
                      </button>
                      <button
                        disabled={isSubmittingFeedback || feedbackGiven !== null}
                        onClick={() => handleFeedback(false)}
                        className={cn(
                          "flex items-center gap-2 px-6 py-2 rounded-full border transition-all duration-200",
                          feedbackGiven === "dislike"
                            ? "bg-rose-500/20 border-rose-500 text-rose-400"
                            : "bg-background border-slate-700/50 text-muted-foreground hover:border-rose-500 hover:text-rose-400"
                        )}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm font-medium">Not me</span>
                      </button>
                    </div>
                  </div>
                )}
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
                disabled={selectedIndices.length === 0}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                {selectedIndices.length === 0 
                  ? "Select items to add" 
                  : `Add ${selectedIndices.length} ${selectedIndices.length === 1 ? 'Garment' : 'Garments'}`
                }
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
