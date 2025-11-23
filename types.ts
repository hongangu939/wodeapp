export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  GENERATOR = 'GENERATOR',
  GALLERY = 'GALLERY',
  DETAILS = 'DETAILS'
}

export enum MaterialType {
  ALUMINUM_BRUSHED = '拉丝铝合金',
  ALUMINUM_ANODIZED_BLACK = '黑色阳极氧化铝',
  POLYCARBONATE_DURABLE = '高强度聚碳酸酯',
  COMPOSITE_RUGGED = '带橡胶缓冲的军工复合材料',
  WHITE_GLOSS_PLASTIC = '高光白色消费级塑料'
}

export enum BoosterType {
  HOME_OFFICE = '家用/办公桌面型',
  VEHICLE_RV = '车载/房车移动型',
  INDUSTRIAL_ENTERPRISE = '工业级机架/壁挂式',
  OUTDOOR_POLE = '户外抱杆式中继器'
}

export enum DesignStyle {
  MINIMALIST = '极简主义 (类 Apple 风格)',
  INDUSTRIAL_HEAVY = '重工业风 (外露散热片)',
  CYBERPUNK = '赛博朋克未来科技感',
  TACTICAL = '战术军工风格',
  SLEEK_MODERN = '现代流线型消费电子风'
}

export interface TechnicalSpecs {
  dimensions: string;
  coolingSolution: string;
  ipRating: string; // Ingress Protection
  materialComposition: string;
  connectorType: string;
  estimatedWeight: string;
  marketingTagline: string;
}

export interface DesignResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  promptUsed: string;
  params: {
    type: BoosterType;
    material: MaterialType;
    style: DesignStyle;
  };
  specs: TechnicalSpecs;
}