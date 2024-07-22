import { Nullable, Optional } from "./supportTypes";

export type TUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  createdAt: number;
  updatedAt: number;
};

export type TWorkspace = {
  id: number;
  name: string;
  avatarFilename?: string;
  nextProjectColorId: number;
  createdAt: number;
  updatedAt: number;
};

export type TUserWorkspaceData = {
  workspaceId: number;
  userId: string;
  isOwner: boolean;
  isAdmin: boolean;
  canCreateProjects: boolean;
  isActive: boolean;
  firstDayOfWeek: number;
  currentTaskId: string | null;
  currentTimeEntryId: string | null;
};

export type TProject = {
  id: string;
  name: string;
  colorId: number;
  isBillable: boolean;
  isNotedRequired: boolean;
  isTagsRequired: boolean;
  budgetEndDate: Nullable<number>;
  budgetInterval: Nullable<number>;
  budgetStartDate: Nullable<number>;
  budgetType: Nullable<number>;
  budgetValue: Nullable<number>;
  isBudgetSet: boolean;
  members: TMember[];
  client: Optional<TCLient>;
};

export type TMember = {
  id: string;
  name: string;
  initials: string;
  isManager: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TCLient = {
  id: string;
  name: string;
};

export type TNode = {
  id: string;
  name: string;
  type: number;
  colorId?: number;
  order: number;
  confirmedDuration: number;
  projectId: string;
  parentId: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
};

export type TFolder = TNode;

export type TTask = TNode & {
  isCompleted: boolean;
  note: string;
};

export type TTimeEntry = {
  id: string;
  beginDate: Nullable<number>;
  endDate: Nullable<number>;
  isAutotracked: boolean;
  notes: Nullable<string>;
  confirmedDuration: Nullable<number>;
  confirmedRevenue: Nullable<number>;
  rateValue: Nullable<number>;
  isBillable: boolean;
  createdAt: number;
  updatedAt: number;
  projectId: string;
  userId: string;
  task: {
    id: string;
    name: string;
    colorId: Nullable<number>;
    parentName: Nullable<string>;
  };
  effectiveColor: number;
};
