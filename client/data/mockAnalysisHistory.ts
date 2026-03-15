import { AnalysisHistoryItem } from "@/components/AnalysisDetailsDrawer";

export const MOCK_ANALYSIS_HISTORY: AnalysisHistoryItem[] = [
  {
    id: "1",
    date: "2024-01-20T09:30:00",
    context: "Work Meeting",
    styleIntent: "balanced",
    inputMode: "manual",
    garments: [
      {
        id: "g1",
        name: "Navy Blazer",
        category: "Top",
      },
      {
        id: "g2",
        name: "Charcoal Trousers",
        category: "Bottom",
      },
      {
        id: "g3",
        name: "Oxford Shoes",
        category: "Shoes",
      },
    ],
    topRecommendation: {
      id: "rec1",
      name: "Professional Contrast",
      score: 89,
      explanation:
        "Neutral tones and structured styling align well with the selected work context.",
      breakdown: {
        overall_score: 89,
        breakdown: [
          { label: "Color Harmony", value: 82 },
          { label: "Context Fit", value: 94 },
          { label: "Style Alignment", value: 87 },
          { label: "Material Compatibility", value: 76 },
        ],
        explanation:
          "The dark navy and charcoal combination provides professional sophistication. The Oxford shoes add formality while maintaining comfort. This combination is ideal for business meetings and corporate environments.",
      },
    },
    alternatives: [
      {
        id: "rec2",
        name: "Monochrome Minimalism",
        score: 84,
        explanation:
          "Clean lines and coordinated colors create a sophisticated appearance.",
        breakdown: {
          overall_score: 84,
          breakdown: [
            { label: "Color Harmony", value: 88 },
            { label: "Context Fit", value: 88 },
            { label: "Style Alignment", value: 82 },
            { label: "Material Compatibility", value: 76 },
          ],
          explanation:
            "A more conservative approach using neutral tones throughout. Works well for formal meetings and presentations.",
        },
      },
      {
        id: "rec3",
        name: "Business Casual",
        score: 78,
        explanation:
          "Balanced formality with approachable styling for team environments.",
        breakdown: {
          overall_score: 78,
          breakdown: [
            { label: "Color Harmony", value: 76 },
            { label: "Context Fit", value: 82 },
            { label: "Style Alignment", value: 78 },
            { label: "Material Compatibility", value: 72 },
          ],
          explanation:
            "A slightly more relaxed option that still maintains professional standards. Good for casual Fridays or team meetings.",
        },
      },
    ],
    feedback: "approved",
  },
  {
    id: "2",
    date: "2024-01-18T14:15:00",
    context: "Casual Brunch",
    styleIntent: "balanced",
    inputMode: "photo",
    garments: [
      {
        id: "g4",
        name: "Cream Sweater",
        category: "Top",
      },
      {
        id: "g5",
        name: "Light Denim",
        category: "Bottom",
      },
      {
        id: "g6",
        name: "White Sneakers",
        category: "Shoes",
      },
    ],
    topRecommendation: {
      id: "rec4",
      name: "Relaxed Elegance",
      score: 84,
      explanation:
        "Comfortable fit with refined styling creates a perfect brunch aesthetic.",
      breakdown: {
        overall_score: 84,
        breakdown: [
          { label: "Color Harmony", value: 88 },
          { label: "Context Fit", value: 82 },
          { label: "Style Alignment", value: 85 },
          { label: "Material Compatibility", value: 81 },
        ],
        explanation:
          "Light neutrals and soft textures work perfectly for a casual social setting. The combination is approachable yet polished.",
      },
    },
    alternatives: [
      {
        id: "rec5",
        name: "Effortless Chic",
        score: 79,
        explanation: "Minimalist approach with timeless appeal.",
        breakdown: {
          overall_score: 79,
          breakdown: [
            { label: "Color Harmony", value: 85 },
            { label: "Context Fit", value: 78 },
            { label: "Style Alignment", value: 80 },
            { label: "Material Compatibility", value: 73 },
          ],
          explanation: "A more neutral palette for those who prefer classic simplicity.",
        },
      },
    ],
    feedback: null,
  },
  {
    id: "3",
    date: "2024-01-15T19:45:00",
    context: "Evening Party",
    styleIntent: "bold",
    inputMode: "manual",
    garments: [
      {
        id: "g7",
        name: "Black Silk Top",
        category: "Top",
      },
      {
        id: "g8",
        name: "Evening Trousers",
        category: "Bottom",
      },
      {
        id: "g9",
        name: "Heeled Shoes",
        category: "Shoes",
      },
    ],
    topRecommendation: {
      id: "rec6",
      name: "Monochrome Minimalism",
      score: 92,
      explanation:
        "Elegant black palette creates timeless sophistication for evening events.",
      breakdown: {
        overall_score: 92,
        breakdown: [
          { label: "Color Harmony", value: 95 },
          { label: "Context Fit", value: 91 },
          { label: "Style Alignment", value: 92 },
          { label: "Material Compatibility", value: 88 },
        ],
        explanation:
          "Black tie elegance achieved through cohesive styling. Silk and structured fabrics elevate the look for formal evening occasions.",
      },
    },
    alternatives: [
      {
        id: "rec7",
        name: "Dramatic Contrast",
        score: 85,
        explanation: "Bold styling with statement pieces.",
        breakdown: {
          overall_score: 85,
          breakdown: [
            { label: "Color Harmony", value: 82 },
            { label: "Context Fit", value: 87 },
            { label: "Style Alignment", value: 86 },
            { label: "Material Compatibility", value: 84 },
          ],
          explanation:
            "For those seeking more visual impact while maintaining sophistication.",
        },
      },
    ],
    feedback: "approved",
  },
  {
    id: "4",
    date: "2024-01-12T10:00:00",
    context: "Beach Day",
    styleIntent: "conservative",
    inputMode: "photo",
    garments: [
      {
        id: "g10",
        name: "Linen Shirt",
        category: "Top",
      },
      {
        id: "g11",
        name: "Shorts",
        category: "Bottom",
      },
      {
        id: "g12",
        name: "Sandals",
        category: "Shoes",
      },
    ],
    topRecommendation: {
      id: "rec8",
      name: "Relaxed Elegance",
      score: 78,
      explanation:
        "Comfortable, breathable fabrics perfect for warm weather and casual beach settings.",
      breakdown: {
        overall_score: 78,
        breakdown: [
          { label: "Color Harmony", value: 76 },
          { label: "Context Fit", value: 82 },
          { label: "Style Alignment", value: 76 },
          { label: "Material Compatibility", value: 76 },
        ],
        explanation:
          "Linen and natural fibers provide comfort in warm weather while maintaining a polished casual look.",
      },
    },
    alternatives: [
      {
        id: "rec9",
        name: "Casual Comfort",
        score: 72,
        explanation: "Maximum comfort for relaxed beach vibes.",
        breakdown: {
          overall_score: 72,
          breakdown: [
            { label: "Color Harmony", value: 70 },
            { label: "Context Fit", value: 75 },
            { label: "Style Alignment", value: 72 },
            { label: "Material Compatibility", value: 70 },
          ],
          explanation: "Prioritizes comfort over formal styling for laid-back beach days.",
        },
      },
    ],
    feedback: null,
  },
  {
    id: "5",
    date: "2024-01-10T18:30:00",
    context: "Date Night",
    styleIntent: "bold",
    inputMode: "manual",
    garments: [
      {
        id: "g13",
        name: "Burgundy Blouse",
        category: "Top",
      },
      {
        id: "g14",
        name: "Black Pants",
        category: "Bottom",
      },
      {
        id: "g15",
        name: "Ankle Boots",
        category: "Shoes",
      },
    ],
    topRecommendation: {
      id: "rec10",
      name: "Monochrome Minimalism",
      score: 95,
      explanation:
        "Sophisticated color blocking with rich burgundy accent creates romantic elegance.",
      breakdown: {
        overall_score: 95,
        breakdown: [
          { label: "Color Harmony", value: 96 },
          { label: "Context Fit", value: 95 },
          { label: "Style Alignment", value: 94 },
          { label: "Material Compatibility", value: 94 },
        ],
        explanation:
          "The burgundy-black combination is timeless and flattering. This outfit projects confidence and sophistication ideal for romantic occasions.",
      },
    },
    alternatives: [
      {
        id: "rec11",
        name: "Elegant Contrast",
        score: 88,
        explanation: "Classic styling with modern appeal.",
        breakdown: {
          overall_score: 88,
          breakdown: [
            { label: "Color Harmony", value: 90 },
            { label: "Context Fit", value: 87 },
            { label: "Style Alignment", value: 88 },
            { label: "Material Compatibility", value: 86 },
          ],
          explanation: "Alternative styling approach while maintaining elegance.",
        },
      },
    ],
    feedback: "approved",
  },
];
