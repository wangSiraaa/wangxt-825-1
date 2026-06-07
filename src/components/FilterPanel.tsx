import React, { useState } from "react";
import { FilterContext } from "../types";
import { Filter, ChevronDown, ChevronUp, X, MapPin, Tag, Lock, Unlock, Layers } from "lucide-react";

interface FilterPanelProps {
  filterContext: FilterContext;
  activeFilterCount: number;
  availableAreas: string[];
  availableTags: string[];
  onAreasChange: (areas: string[]) => void;
  onTagsChange: (tags: string[]) => void;
  onLockStatusChange: (lockStatus: "all" | "locked" | "unlocked") => void;
  onClearAll: () => void;
}
