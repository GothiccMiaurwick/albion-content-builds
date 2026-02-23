export interface Category {
  id: string;
  label: string;
}

export interface AlbionItem {
  id: string;
  name: string;
  quality?: number; // 1-5
}

export interface Equipment {
  bag: AlbionItem | null;
  head: AlbionItem | null;
  cape: AlbionItem | null;
  weapon: AlbionItem | null;
  armor: AlbionItem | null;
  offhand: AlbionItem | null;
  potion: AlbionItem | null;
  shoes: AlbionItem | null;
  food: AlbionItem | null;
  mount: AlbionItem | null;
}

export interface BuildDetail {
  equipment: Equipment;
  partyRole: string;
  commonErrors: string[];
  timing: string;
  budget: string;
}

export interface RoleConfig {
  icon: string;
  color: string;
  description: string;
  builds: {
    [categoryId: string]: BuildDetail;
  };
}

export interface ContentData {
  categories: Category[];
  roles: {
    [roleName: string]: RoleConfig;
  };
}
