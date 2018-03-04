import { Dictionary } from './types'

interface ParamItem {
  key: string
  value: any
}

/**
 * Converts plain-object params to the format that will be correctly represented in SOAP request
 */
export function paramsToSoap(params: Dictionary<any> | undefined) {
  if (!params || Object.keys(params).length === 0) {
    return params
  }

  const result = {
    $attributes: { $xsiType: '{http://xml.apache.org/xml-soap}Map' },
    item: [] as ParamItem[],
  }

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      result.item.push({ key, value: withXsdType(params[key]) })
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
