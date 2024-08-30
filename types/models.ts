import { Nullable, Optional } from './supportTypes'

export type TUser = {
  id: string
  name: string
  email: string
  initials: string
  createdAt: number
  updatedAt: number
}

export type TUserWorkspaceData = {
  workspaceId: number
  userId: string
  isOwner: boolean
  isAdmin: boolean
  canCreateProjects: boolean
  isActive: boolean
  firstDayOfWeek: number
  currentTaskId: string | null
  currentTimeEntryId: string | null
}

export type TCLient = {
  id: string
  name: string
}

export type TFolder = Node

export type TTask = Node & {
  isCompleted: boolean
  note: string
}

export type TTimeEntry = {
  id: string
  beginDate: Nullable<number>
  endDate: Nullable<number>
  isAutotracked: boolean
  notes: Nullable<string>
  confirmedDuration: Nullable<number>
  confirmedRevenue: Nullable<number>
  rateValue: Nullable<number>
  isBillable: boolean
  createdAt: number
  updatedAt: number
  projectId: string
  userId: string
  task: {
    id: string
    name: string
    colorId: Nullable<number>
    parentName: Nullable<string>
  }
  effectiveColor: number
}
