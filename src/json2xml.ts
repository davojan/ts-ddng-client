import { Dictionary } from './types'

export function json2xml(value: any): string {
  if (value == null) {
    return ''
  }

  if (typeof value === 'object') {
    const result: string[] = []
    for (const key in value) {
      if (key === 'params') {
        result.push(xmlNode(key, params2xml(value[key]), { 'xsi:type': 'ns2:Map' }))
      } else if (value.hasOwnProperty(key)) {
        result.push(xmlNode(key, json2xml(value[key])))
      }
    }
    return result.join('')
  }

  return value
}

function params2xml(value: any): string {
  if (typeof value === 'object') {
    const result: string[] = []
    for (const key in value) {
      if (value.hasOwnProperty(key) && value[key] !== undefined) {
        result.push(xmlNode('item', xmlNode('key', key) + xmlNode('value', value[key])))
      }
    }
    return result.join('')
  }
  return ''
}

function xmlNode(nodeName: string, content: string, attributes?: Dictionary<string>): string {
  return `<${nodeName}${xmlAttributes(attributes)}>${content}</${nodeName}>`
}

function xmlAttributes(attributes?: Dictionary<string>): string {
  if (attributes) {
    const result: string[] = []
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        result.push(`${key}="${attributes[key]}"`)
      }
    }
    if (result.length) {
      return ' ' + result.join(' ')
    }
  }
  return ''
}
