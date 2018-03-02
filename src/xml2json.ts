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
      case 'SOAP-ENC:Array': return xmlArray2json(value.item)
      case 'ns2:Map': return xmlMap2json(value.item)
      case 'unknown':
        const result = {}
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            result[key] = xml2json(value[key])
          }
        }
        return result
      default: return value.$value
    }
  }
}

function xsiType(value: any): string {
  return value.attributes && value.attributes['xsi:type']
    ? value.attributes['xsi:type']
    : 'unknown'
}

function xmlArray2json(value: any[]): any[] {
  return Array.isArray(value)
    ? value.map(xml2json)
    : []
}

function xmlMap2json(value: any[]): {[key: string]: any} {
  const result: {[key: string]: any} = {}
  if (Array.isArray(value)) {
    for (const item of value) {
      const key = item.key.$value
      const val = item.value && item.value.$value
      result[key] = val
    }
  }
  return result
}
