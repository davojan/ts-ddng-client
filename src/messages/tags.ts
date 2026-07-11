import { toBool } from '../utils'

export interface Tag {
  id: number
  userId: number
  familyId: number
  name: string
  isHidden: boolean
  isFamily: boolean
  sort: number
  parentId: number | null
}

export interface GetTagsParams {
  tagIds?: number[]
}

export interface CreateTagParams {
  name: string
  parentId?: number | null
  isHidden?: boolean
  isFamily?: boolean
  sort?: number
}

export interface UpdateTagParams {
  id: number
  name: string
  parentId?: number | null
  isHidden: boolean
  isFamily: boolean
  sort: number
}

export class TagValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TagValidationError'
  }
}

export class TagDeleteConflictError extends Error {
  constructor(
    readonly tagId: number,
    readonly originalError: unknown,
  ) {
    super(`Tag ${tagId} cannot be deleted because it has linked objects`)
    this.name = 'TagDeleteConflictError'
  }
}

export interface GetTagListSoapParams {
  idList?: string[]
}

export interface GetTagListSoapResult {
  getTagListReturn: GetTagListSoapResultItem[]
}

export interface GetTagListSoapResultItem {
  id: string
  user_id: string
  family_id: string
  name: string
  is_hidden: string
  is_family: string
  sort: string
  parent_id: string | null
}

export type SetTagListSoapList = SetTagListSoapListItem[]

export interface SetTagListSoapListItem {
  client_id?: number
  server_id?: number
  parent_id: number
  name: string
  is_hidden: boolean
  is_family: boolean
  sort: number
}

export interface SetTagListSoapResult {
  setTagListReturn: SetTagListSoapResultItem[]
}

export interface SetTagListSoapResultItem {
  client_id?: string
  server_id: string
  status: string
}

export const getTagsParamsToSoap = (params?: GetTagsParams): GetTagListSoapParams => ({
  idList: params?.tagIds?.map(String),
})

export const tagListFromSoap = (soap: GetTagListSoapResult): Tag[] =>
  soap.getTagListReturn
    .filter(x => x)
    .map(tag => ({
      id: +tag.id,
      userId: +tag.user_id,
      familyId: +tag.family_id,
      name: tag.name,
      isHidden: toBool(tag.is_hidden),
      isFamily: toBool(tag.is_family),
      sort: +tag.sort,
      parentId: tag.parent_id == null || +tag.parent_id <= 0 ? null : +tag.parent_id,
    }))

export function createTagParamsToSoap(params: CreateTagParams): SetTagListSoapListItem {
  return {
    client_id: ++clientIdCounter,
    parent_id: normalizeParentId(params.parentId),
    name: normalizeTagName(params.name),
    is_hidden: params.isHidden || false,
    is_family: params.isFamily || false,
    sort: params.sort || 0,
  }
}

export function updateTagParamsToSoap(params: UpdateTagParams): SetTagListSoapListItem {
  if (params.parentId === params.id) {
    throw new TagValidationError('Tag cannot be its own parent')
  }

  return {
    server_id: params.id,
    parent_id: normalizeParentId(params.parentId),
    name: normalizeTagName(params.name),
    is_hidden: params.isHidden,
    is_family: params.isFamily,
    sort: params.sort,
  }
}

export function isTagDeleteConflict(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('connected') || message.includes('linked') || message.includes('delete them first')
}

function normalizeTagName(name: string): string {
  const normalized = name.trim()

  if (!normalized) {
    throw new TagValidationError('Tag name is required')
  }

  return normalized
}

function normalizeParentId(parentId: number | null | undefined): number {
  return parentId == null ? -1 : parentId
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

let clientIdCounter = Date.now()
