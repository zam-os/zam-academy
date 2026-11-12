import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import {
  discountChainView,
  bruttoNettoTaraView,
  kalkulationSchemaView,
  percentDiagrams8View,
  promilleScaleView,
  squareRootAreaView,
} from "./views-prozent-wurzeln";
import {
  circlePiPartsView,
  circleArcView,
  compositePerimeterView,
  cylinderNetView,
  circleAreaSectorsView,
  annulusSectorView,
  compositeCircleAreaView,
  cylinderVolumeView,
  hollowCylinderView,
} from "./views-kreis-zylinder";
import {
  chanceWheelView,
  termDistributiveView,
  balanceScaleQView,
  funcCompareView,
  linearSlopeTriangleView,
} from "./views-zufall-algebra";

const VIEWS: Record<LabKind, LabView> = {
  "discount-chain": discountChainView,
  "brutto-netto-tara": bruttoNettoTaraView,
  "kalkulation-schema": kalkulationSchemaView,
  "percent-diagrams-8": percentDiagrams8View,
  "promille-scale": promilleScaleView,
  "square-root-area": squareRootAreaView,
  "circle-pi-parts": circlePiPartsView,
  "circle-arc": circleArcView,
  "composite-perimeter": compositePerimeterView,
  "cylinder-net": cylinderNetView,
  "circle-area-sectors": circleAreaSectorsView,
  "annulus-sector": annulusSectorView,
  "composite-circle-area": compositeCircleAreaView,
  "cylinder-volume": cylinderVolumeView,
  "hollow-cylinder": hollowCylinderView,
  "chance-wheel": chanceWheelView,
  "term-distributive": termDistributiveView,
  "balance-scale-q": balanceScaleQView,
  "func-compare": funcCompareView,
  "linear-slope-triangle": linearSlopeTriangleView,
};

export function labView(kind: LabKind): LabView {
  return VIEWS[kind];
}
