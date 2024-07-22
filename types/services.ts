import { TTask, TUser, TUserWorkspaceData, TWorkspace } from "./models";
import { Maybe, Nullable } from "./supportTypes";

// Singin Service

export type SigninServiceInput = {
  email: string;
  password: string;
};

export type SigninServiceResult = {
  sessionId: string;
};

// Singup Service
export type SignupServiceInput = {
  name: string;
  email: string;
  password: string;
  workspaceName?: string;
};

export type SignupServiceResult = {
  sessionId: string;
};

// GeMe Service
export type GetMeServiceResult = {
  user: TUser;
  workspaces: TWorkspace[];
  currentWorkspace: TWorkspace;
  userWorkspaceData: TUserWorkspaceData;
};

export namespace GetProjectsService {
  export type ProjectItem = {
    id: string;
    name: string;
    colorId: number;
    clientName: Nullable<string>;
    members: {
      id: string;
      name: string;
      initials: string;
      // isTracking: boolean;
    }[];
    // confirmedDuration: number;
    // confirmedRevenue: number;
  };
}

export namespace GetProjectService {
  export type Member = {
    id: string;
    name: string;
    initials: string;
    isManager: boolean;
    createdAt: number;
    updatedAt: number;
  };
}

export namespace GetProjectMembersSearch {
  export type Member = {
    id: string;
    name: string;
    initials: string;
    isManager: boolean;
    createdAt: number;
    updatedAt: number;
    //add rate
  };
}

// Create Tasks
export type CreateTaskServiceInput = {
  name: string;
  colorId?: number;
  projectId: string;
  parentId: Nullable<string>;
  note?: string;
};

// Create Folder
export type CreateFolderServiceInput = {
  name: string;
  colorId?: number;
  projectId: string;
  parentId: Nullable<string>;
};
