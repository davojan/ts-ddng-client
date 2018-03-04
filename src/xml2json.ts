import { Dictionary } from './types'

/**
 * Converts JSON-represented XML data returned by SOAP request into idiomatic JSON
 */
export function xml2json(value: any): any {
  if (value == null) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(xml2json)
  }

  if (typeof value === 'object') {
    switch (xsiType(value)) {
      case 'Array':
        return xmlArray2json(value.item)
      case 'Map':
        return xmlMap2json(value.item)
      case 'unknown':
        const result = {}
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            result[key] = xml2json(value[key])
          }
        }
        return result
      default:
        return value.$value
    }
  }
}

const attributesKey = '$attributes'

function xsiType(value: any): string {
  return value[attributesKey] && value[attributesKey].$xsiType
    ? value[attributesKey].$xsiType.type
    : 'unknown'
}

function xmlArray2json(value: any[]): any[] {
  return Array.isArray(value) ? value.map(xml2json) : []
}

function xmlMap2json(value: any[]): Dictionary<any> {
  const result: Dictionary<any> = {}
  if (Array.isArray(value)) {
    for (const item of value) {
      const key = item.key.$value
      const val = item.value && item.value.$value
      result[key] = val
    }
  }
  return result
}
