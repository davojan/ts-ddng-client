import { Dictionary } from './types'

/**
 * Converts plain-object params to the format that will be correctly represented in SOAP request
 */
export function mapToSoap(params: Dictionary<any> | undefined) {
  if (!params || Object.keys(params).length === 0) {
    return params
  }

  return {
    $attributes: { $xsiType: '{http://xml.apache.org/xml-soap}Map' },
    item: mapToParamItems(params),
  }
}

/**
 * Converts list of plain objects into format that will be correctly represented in SOAP request
 */
export function mapListToSoap(list: Array<Dictionary<any>> | undefined): any {
  if (!list || list.length === 0) {
    return list
  }

  const result = {
    $attributes: { $xsiType: '{http://schemas.xmlsoap.org/soap/encoding/}Array' },
    item: [] as any[],
  }

  for (const item of list) {
    result.item.push({
      $attributes: { $xsiType: '{http://xml.apache.org/xml-soap}Map' },
      item: mapToParamItems(item),
    })
  }

  return result
}

export function listToSoap(list: any[] | undefined): any {
  if (!list || list.length === 0) {
    return list
  }

  const result = {
    $attributes: { $xsiType: '{http://schemas.xmlsoap.org/soap/encoding/}Array' },
    item: list,
  }

  return result
}

interface ParamItem {
  key: string
  value: any
}

function mapToParamItems(map: Dictionary<any>): ParamItem[] {
  const result: ParamItem[] = []

  for (const key in map) {
    if (map.hasOwnProperty(key) && map[key] !== undefined) {
      result.push({ key, value: withXsdType(map[key]) })
    }
  }

  return result
}

function withXsdType(value: any) {
  const xsdType = getXsdType(value)
  if (xsdType) {
    return {
      $attributes: { $xsiType: `{http://www.w3.org/2001/XMLSchema}${xsdType}` },
      $value: value,
    }
  } else if (Array.isArray(value)) {
    return listToSoap(value)
  } else {
    return value
  }
}

function getXsdType(value: any): string | null {
  if (typeof value === 'boolean') {
    return 'boolean'
  }
  return null
}
